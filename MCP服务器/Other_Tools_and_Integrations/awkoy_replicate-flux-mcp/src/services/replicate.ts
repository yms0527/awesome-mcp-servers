import Replicate from "replicate";
import { CONFIG } from "../config/index.js";

export function getReplicateApiToken(): string {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    console.error(
      "Error: REPLICATE_API_TOKEN environment variable is required"
    );
    process.exit(1);
  }
  return token;
}

export const replicate = new Replicate({
  auth: getReplicateApiToken(),
});

export async function pollForCompletion(predictionId: string) {
  for (let i = 0; i < CONFIG.pollingAttempts; i++) {
    const latest = await replicate.predictions.get(predictionId);
    if (latest.status !== "starting" && latest.status !== "processing") {
      return latest;
    }
    await new Promise((resolve) => setTimeout(resolve, CONFIG.pollingInterval));
  }
  return null;
}
