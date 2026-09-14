/**
 * AES-256-GCM encryption/decryption using the Web Crypto API.
 * Compatible with both Node.js (>=20) and Cloudflare Workers.
 *
 * Data format: base64(IV[12] + ciphertext + authTag[16])
 * Key derivation: PBKDF2 with SHA-256, 100_000 iterations.
 */

const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 100_000;

async function deriveKey(secret: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i] as number);
  }
  return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypt a plaintext string with AES-256-GCM.
 *
 * Output format: base64(salt[16] + iv[12] + ciphertext + authTag)
 *
 * @param data - The plaintext to encrypt
 * @param secret - The secret passphrase used for key derivation
 * @returns Base64-encoded encrypted payload
 */
export async function encrypt(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(secret, salt);

  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(data));

  // Combine salt + iv + ciphertext+tag into a single buffer
  const encryptedBytes = new Uint8Array(encrypted);
  const combined = new Uint8Array(SALT_LENGTH + IV_LENGTH + encryptedBytes.byteLength);
  combined.set(salt, 0);
  combined.set(iv, SALT_LENGTH);
  combined.set(encryptedBytes, SALT_LENGTH + IV_LENGTH);

  return toBase64(combined.buffer);
}

/**
 * Decrypt a base64-encoded AES-256-GCM payload.
 *
 * @param encrypted - The base64-encoded payload from encrypt()
 * @param secret - The same secret passphrase used during encryption
 * @returns The original plaintext
 * @throws Error if decryption fails (wrong key, tampered data)
 */
export async function decrypt(encrypted: string, secret: string): Promise<string> {
  const combined = fromBase64(encrypted);

  if (combined.byteLength < SALT_LENGTH + IV_LENGTH + 1) {
    throw new Error("Invalid encrypted data: payload too short");
  }

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(secret, salt);

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);

  return new TextDecoder().decode(decrypted);
}
