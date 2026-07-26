import crypto from "node:crypto";

const algorithm = "aes-256-gcm";

function getTokenEncryptionKey() {
  const value = process.env.OAUTH_TOKEN_ENCRYPTION_KEY;

  if (!value) {
    throw new Error("Missing required environment variable: OAUTH_TOKEN_ENCRYPTION_KEY");
  }

  const key = /^[a-f0-9]{64}$/i.test(value)
    ? Buffer.from(value, "hex")
    : Buffer.from(value, "base64");

  if (key.length !== 32) {
    throw new Error("OAUTH_TOKEN_ENCRYPTION_KEY must be 32 bytes as hex or base64");
  }

  return key;
}

export function encryptToken(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getTokenEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptToken(value: string) {
  const [version, iv, authTag, encrypted] = value.split(".");

  if (version !== "v1" || !iv || !authTag || !encrypted) {
    throw new Error("Invalid encrypted token format");
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    getTokenEncryptionKey(),
    Buffer.from(iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
