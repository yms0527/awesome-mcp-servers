import { server } from "../server/index.js";
import {
  ListResourcesCallback,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { replicate } from "../services/replicate.js";
import { urlToBase64 } from "../utils/image.js";
import { Prediction } from "replicate";
import { CONFIG } from "../config/index.js";

export const registerImageListResource = () => {
  const list: ListResourcesCallback = async () => {
    try {
      const predictions: Prediction[] = [];
      for await (const page of replicate.paginate(replicate.predictions.list)) {
        predictions.push(...page);
      }

      return {
        resources: predictions
          .filter(
            (prediction) =>
              prediction.output?.length &&
              prediction.model === CONFIG.imageModelId
          )
          .map((prediction) => ({
            uri: `images://${prediction.id}`,
            name: `Image ${prediction.id}`,
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
    "images",
    new ResourceTemplate("images://{id}", {
      list,
    }),
    async (uri, { id }) => {
      const prediction = await replicate.predictions.get(id as string);

      if (!prediction.output?.length) {
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

      const imageBase64 = await urlToBase64(prediction.output[0]);

      return {
        contents: [
          {
            name: "image",
            uri: uri.href,
            blob: imageBase64,
            mimeType: "image/png",
          },
        ],
      };
    }
  );
};
