import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSend = vi.fn();

vi.mock("@aws-sdk/client-s3", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@aws-sdk/client-s3")>();
  return {
    ...actual,
    S3Client: vi.fn(() => ({ send: mockSend })),
  };
});

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(() =>
    Promise.resolve("https://mock-presigned-url.example/"),
  ),
}));

import {
  listBuckets,
  listObjects,
  getObject,
  putObject,
  deleteObject,
  presignedUrl,
  bucketInfo,
} from "../src/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

beforeEach(() => {
  mockSend.mockReset();
  vi.mocked(getSignedUrl).mockResolvedValue(
    "https://mock-presigned-url.example/",
  );
});

describe("listBuckets", () => {
  it("returns list of buckets", async () => {
    mockSend.mockResolvedValueOnce({
      Buckets: [
        { Name: "bucket-a", CreationDate: new Date("2024-01-01") },
        { Name: "bucket-b", CreationDate: new Date("2024-02-01") },
      ],
    });
    const buckets = await listBuckets();
    expect(buckets).toHaveLength(2);
    expect(buckets[0]?.name).toBe("bucket-a");
    expect(buckets[1]?.name).toBe("bucket-b");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("returns empty array when no buckets", async () => {
    mockSend.mockResolvedValueOnce({ Buckets: [] });
    const buckets = await listBuckets();
    expect(buckets).toEqual([]);
  });
});

describe("listObjects", () => {
  it("returns objects and common prefixes", async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [
        { Key: "file1.txt", Size: 100, LastModified: new Date("2024-01-01") },
        { Key: "file2.txt", Size: 200 },
      ],
      CommonPrefixes: [{ Prefix: "uploads/" }],
    });
    const items = await listObjects("my-bucket", "prefix/", 50);
    expect(items).toHaveLength(3);
    expect(items[0]).toEqual({ key: "uploads/", isPrefix: true });
    expect(items[1]).toMatchObject({
      key: "file1.txt",
      size: 100,
      isPrefix: false,
    });
    expect(items[2]).toMatchObject({ key: "file2.txt", size: 200 });
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          Bucket: "my-bucket",
          Prefix: "prefix/",
          MaxKeys: 50,
        }),
      }),
    );
  });

  it("calls without prefix when not provided", async () => {
    mockSend.mockResolvedValueOnce({ Contents: [], CommonPrefixes: [] });
    await listObjects("my-bucket");
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          Bucket: "my-bucket",
          MaxKeys: 100,
        }),
      }),
    );
  });
});

describe("getObject", () => {
  it("returns object content as string", async () => {
    const stream = (async function* () {
      yield new TextEncoder().encode("hello world");
    })();
    mockSend.mockResolvedValueOnce({ Body: stream });
    const content = await getObject("my-bucket", "path/to/file.txt");
    expect(content).toBe("hello world");
  });

  it("throws when body is missing", async () => {
    mockSend.mockResolvedValueOnce({});
    await expect(getObject("my-bucket", "key")).rejects.toThrow("no body");
  });
});

describe("putObject", () => {
  it("uploads content successfully", async () => {
    mockSend.mockResolvedValueOnce({});
    await putObject("my-bucket", "notes.txt", "Hello S3!");
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          Bucket: "my-bucket",
          Key: "notes.txt",
          ContentType: "text/plain",
        }),
      }),
    );
    const body = mockSend.mock.calls[0]?.[0]?.input?.Body;
    expect(Buffer.isBuffer(body)).toBe(true);
    expect(body?.toString()).toBe("Hello S3!");
  });

  it("uses custom contentType when provided", async () => {
    mockSend.mockResolvedValueOnce({});
    await putObject("my-bucket", "data.json", '{"a":1}', "application/json");
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          ContentType: "application/json",
        }),
      }),
    );
  });
});

describe("deleteObject", () => {
  it("deletes object successfully", async () => {
    mockSend.mockResolvedValueOnce({});
    await deleteObject("my-bucket", "old-file.txt");
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { Bucket: "my-bucket", Key: "old-file.txt" },
      }),
    );
  });
});

describe("presignedUrl", () => {
  it("returns presigned URL with default expiry", async () => {
    const url = await presignedUrl("my-bucket", "private/file.pdf");
    expect(url).toBe("https://mock-presigned-url.example/");
    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      { expiresIn: 3600 },
    );
  });

  it("passes custom expiresIn to getSignedUrl", async () => {
    await presignedUrl("my-bucket", "key", 7200);
    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      { expiresIn: 7200 },
    );
  });
});

describe("bucketInfo", () => {
  it("returns exists true when bucket is accessible", async () => {
    mockSend.mockResolvedValueOnce({});
    const info = await bucketInfo("my-bucket");
    expect(info).toEqual({
      name: "my-bucket",
      exists: true,
      region: "us-east-1",
    });
  });

  it("returns exists false when HeadBucket fails", async () => {
    mockSend.mockRejectedValueOnce(new Error("Not Found"));
    const info = await bucketInfo("nonexistent-bucket");
    expect(info).toEqual({ name: "nonexistent-bucket", exists: false });
  });
});
