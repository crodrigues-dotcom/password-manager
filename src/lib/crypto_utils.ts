/* eslint-disable @typescript-eslint/no-unused-vars */
import crypto from "crypto";

export function encryptData(data: string, password: string) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha512");

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");

  return { encryptedData, salt, iv };
}

export function decryptData(
  data: string,
  password: string,
  salt: Buffer,
  iv: Buffer
) {
  // Derive a key using PBKDF2
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha512");

  // Create an AES decipher object with the derived key and IV
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decryptedData = decipher.update(data, "hex", "utf8");
  decryptedData += decipher.final("utf8");

  return decryptedData;
}
