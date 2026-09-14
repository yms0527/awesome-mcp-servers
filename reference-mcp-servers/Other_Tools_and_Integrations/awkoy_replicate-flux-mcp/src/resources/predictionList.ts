import { server } from "../server/index.js";
import {
  ListResourcesCallback,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { replicate } from "../services/replicate.js";
import { Prediction } from "replicate";

export const registerPreditionListResource = () => {
  const list: ListResourcesCallback = async () => {
    try {
      const predictions: Prediction[] = [];
      for await (const page of replicate.paginate(replicate.predictions.list)) {
        predictions.push(...page);
      }

      return {
        resources: predictions.map((prediction) => ({
          uri: `predictions://${prediction.id}`,
          name: `Prediction ${prediction.id}`,
          mimeType: "application/json",
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
    "predictions",
    new ResourceTemplate("predictions://{id}", {
      list,
    }),
    async (uri, { id }) => {
      const prediction = await replicate.predictions.get(id as string);

      return {
        contents: [
          {
            name: "prediction",
            uri: uri.href,
            text: JSON.stringify(prediction),
            mimeType: "application/json",
          },
        ],
      };
    }
  );
};
