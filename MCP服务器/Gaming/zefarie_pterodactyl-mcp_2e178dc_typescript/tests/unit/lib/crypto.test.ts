import { decrypt, encrypt } from "../../../src/lib/crypto.js";

describe("encrypt/decrypt round-trip", () => {
  it("should encrypt and decrypt a string successfully", async () => {
    const plaintext = "Hello, Pterodactyl!";
    const secret = "test-secret-key";

    const encrypted = await encrypt(plaintext, secret);
    const decrypted = await decrypt(encrypted, secret);

    expect(decrypted).toBe(plaintext);
  });

  it("should produce different ciphertext for same plaintext (random IV)", async () => {
    const plaintext = "Same input";
    const secret = "test-secret-key";

    const encrypted1 = await encrypt(plaintext, secret);
    const encrypted2 = await encrypt(plaintext, secret);

    expect(encrypted1).not.toBe(encrypted2);
  });

  it("should fail to decrypt with wrong secret", async () => {
    const plaintext = "Sensitive data";
    const encrypted = await encrypt(plaintext, "correct-secret");

    await expect(decrypt(encrypted, "wrong-secret")).rejects.toThrow();
  });

  it("should handle empty string", async () => {
    const secret = "test-key";
    const encrypted = await encrypt("", secret);
    const decrypted = await decrypt(encrypted, secret);

    expect(decrypted).toBe("");
  });

  it("should handle long plaintext", async () => {
    const plaintext = "x".repeat(10000);
    const secret = "test-key";

    const encrypted = await encrypt(plaintext, secret);
    const decrypted = await decrypt(encrypted, secret);

    expect(decrypted).toBe(plaintext);
  });

  it("should handle unicode characters", async () => {
    const plaintext = "Bonjour le monde! Serveur Minecraft";
    const secret = "test-key";

    const encrypted = await encrypt(plaintext, secret);
    const decrypted = await decrypt(encrypted, secret);

    expect(decrypted).toBe(plaintext);
  });

  it("should throw on invalid encrypted data (too short)", async () => {
    await expect(decrypt("AAAA", "secret")).rejects.toThrow("Invalid encrypted data");
  });

  it("should return base64-encoded string", async () => {
    const encrypted = await encrypt("test", "key");
    expect(typeof encrypted).toBe("string");
    expect(encrypted.length).toBeGreaterThan(0);
    // Base64 characters only
    expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+$/);
  });
});
