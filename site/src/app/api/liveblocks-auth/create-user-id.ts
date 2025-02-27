import crypto from "node:crypto";

export function createUserId(ip = "0.0.0.0", salt = "") {
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("base64")
    .slice(0, 5);
}
