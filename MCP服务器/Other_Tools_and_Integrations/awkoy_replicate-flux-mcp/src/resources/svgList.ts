import { server } from "../server/index.js";
import {
  ListResourcesCallback,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { replicate } from "../services/replicate.js";
import { urlToSvg } from "../utils/image.js";
import { Prediction } from "replicate";
import { CONFIG } from "../config/index.js";

export const registerSvgListResource = () => {
  const list: ListResourcesCallback = async () => {
    try {
      const predictions: Prediction[] = [];
      for await (const page of replicate.paginate(replicate.predictions.list)) {
        predictions.push(...page);
      }

      return {
        resources: predictions
          .filter((prediction) => prediction.model === CONFIG.svgModelId)
          .map((prediction) => ({
            uri: `svglist://${prediction.id}`,
            name: `SVG ${prediction.id}`,
            mimeType: "application/json",
            description: `Generated image by ${prediction.model} with id ${prediction.id}`,
          })),
        nextCursor: undefined,
      };
    } catch (error) {
      console.error("Error listing predictions:", error);
      return {
        resources: [],
        nextCursor: undefined,
      };
    }
  };

  server.resource(
    "svglist",
    new ResourceTemplate("svglist://{id}", {
      list,
    }),
    async (uri, { id }) => {
      const prediction = await replicate.predictions.get(id as string);

      if (!prediction.output) {
        return {
          contents: [
            {
              name: "Not Found!",
              uri: uri.href,
              text: `Data has been removed by Replicate automatically after an hour, by default. You have to save your own copies before it is removed.`,
              mimeType: "text/plain",
            },
          ],
        };
      }

      const svg = await urlToSvg(prediction.output);

      return {
        contents: [
          {
            name: "svglist",
            uri: uri.href,
            text: svg,
            mimeType: "image/svg+xml",
          },
        ],
      };
    }
  );
};
