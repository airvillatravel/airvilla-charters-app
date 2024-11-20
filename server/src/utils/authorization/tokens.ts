// src/utils/tokens.ts
import crypto from "crypto";
import { promisify } from "util";
import { JsonWebTokenError } from "jsonwebtoken";

const randomBytesAsync = promisify(crypto.randomBytes);

interface TokenOptions {
  length?: number; // Length of the token in bytes
  encoding?: BufferEncoding; // Encoding type for the token
  prefix?: string; // Optional prefix for the token
}

/**
 * Generates a cryptographically secure invitation token
 * @param options Configuration options for token generation
 * @returns Promise<string> The generated invitation token
 * @throws Error if token generation fails
 */
export async function generateInviteToken(
  options: TokenOptions = {}
): Promise<string> {
  const {
    length = 32, // 32 bytes = 256 bits of entropy
    encoding = "base64url", // URL-safe Base64 encoding
    prefix = "inv_", // Prefix to identify token type
  } = options;

  try {
    // Generate cryptographically secure random bytes
    const buffer = await randomBytesAsync(length);

    // Convert to specified encoding
    const token = buffer.toString(encoding);

    // Add prefix and remove any padding characters
    const finalToken = `${prefix}${token.replace(/=+$/, "")}`;

    // Verify token meets minimum entropy requirements
    if (buffer.length < 32) {
      throw new Error(
        "Generated token does not meet minimum entropy requirements"
      );
    }

    return finalToken;
  } catch (error) {
    const errorInstance = error as Error;
    if (error instanceof JsonWebTokenError) {
      // Handle specific JsonWebTokenError
      throw new Error(
        `Failed to generate invitation token: Invalid JWT payload: ${error.message}`
      );
    } else {
      // Handle other potential errors
      throw new Error(
        `Failed to generate invitation token: ${errorInstance.message}`
      );
    }
  }
}

/**
 * Validates an invitation token format
 * @param token Token to validate
 * @returns boolean indicating if token format is valid
 */
export function validateInviteToken(token: string): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }

  // Check token format: prefix + base64url string
  const tokenRegex = /^inv_[A-Za-z0-9_-]+$/;
  if (!tokenRegex.test(token)) {
    return false;
  }

  // Check minimum length (prefix + minimum 32 bytes encoded)
  const minLength = "inv_".length + 43; // base64url encoding of 32 bytes
  if (token.length < minLength) {
    return false;
  }

  return true;
}

/**
 * Safely compares two tokens in constant time
 * @param tokenA First token to compare
 * @param tokenB Second token to compare
 * @returns boolean indicating if tokens match
 */
export function compareTokens(tokenA: string, tokenB: string): boolean {
  if (!tokenA || !tokenB || tokenA.length !== tokenB.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(tokenA), Buffer.from(tokenB));
}

export default {
  generateInviteToken,
  validateInviteToken,
  compareTokens,
};
