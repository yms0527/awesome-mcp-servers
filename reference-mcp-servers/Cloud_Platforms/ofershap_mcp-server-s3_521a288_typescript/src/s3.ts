import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const defaultRegion = process.env.AWS_REGION ?? "us-east-1";

function createClient(): S3Client {
  return new S3Client({ region: defaultRegion });
}

export interface BucketInfo {
  name: string;
  creationDate?: Date;
}

export interface ObjectInfo {
  key: string;
  size?: number;
  lastModified?: Date;
  isPrefix?: boolean;
}

export interface BucketDetails {
  name: string;
  exists: boolean;
  region?: string;
}

export async function listBuckets(): Promise<BucketInfo[]> {
  const client = createClient();
  const result = await client.send(new ListBucketsCommand({}));
  const buckets = result.Buckets ?? [];
  return buckets.map((b) => ({
    name: b.Name ?? "",
    creationDate: b.CreationDate,
  }));
}

export async function listObjects(
  bucket: string,
  prefix?: string,
  maxKeys = 100,
): Promise<ObjectInfo[]> {
  const client = createClient();
  const result = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
      Delimiter: "/",
    }),
  );
  const items: ObjectInfo[] = [];

  for (const cp of result.CommonPrefixes ?? []) {
    if (cp.Prefix) {
      items.push({ key: cp.Prefix, isPrefix: true });
    }
  }
  for (const obj of result.Contents ?? []) {
    if (obj.Key) {
      items.push({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
        isPrefix: false,
      });
    }
  }
  return items;
}

export async function getObject(bucket: string, key: string): Promise<string> {
  const client = createClient();
  const result = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
  const body = result.Body;
  if (!body) {
    throw new Error(`Object ${key} has no body`);
  }
  const chunks: Uint8Array[] = [];
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export async function putObject(
  bucket: string,
  key: string,
  content: string,
  contentType?: string,
): Promise<void> {
  const client = createClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(content, "utf-8"),
      ContentType: contentType ?? "text/plain",
    }),
  );
}

export async function deleteObject(bucket: string, key: string): Promise<void> {
  const client = createClient();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function presignedUrl(
  bucket: string,
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const client = createClient();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn });
}

export async function bucketInfo(bucket: string): Promise<BucketDetails> {
  const client = createClient();
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return {
      name: bucket,
      exists: true,
      region: defaultRegion,
    };
  } catch {
    return { name: bucket, exists: false };
  }
}
