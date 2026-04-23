import { FileOutput } from "replicate";

export async function outputToBase64(output: FileOutput) {
  const blob = await output.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  return buffer.toString("base64");
}

export async function urlToSvg(url: string) {
  try {
    const data = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    const text = await data.text();

    return text;
  } catch (error) {
    throw new Error("Error fetching svg");
  }
}

export async function urlToBase64(url: string) {
  try {
    const data = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    const blob = await data.blob();

    let buffer = Buffer.from(await blob.arrayBuffer());
    return buffer.toString("base64");
  } catch (error) {
    throw new Error("Error fetching image");
  }
}
