import * as jose from "jose";
import { TokenPayload } from "../types/types.js";

const secret = new TextEncoder().encode(
  "GIo1kkI927PuvzXu7oBC5XzDdS2HIYRqan2zeEnx5CfJcih9UwfUyUbGUIyufztex"
);

const alg = "HS256";

export async function generateToken(data: TokenPayload): Promise<string> {
  try {
    return await new jose.SignJWT(data)
      .setProtectedHeader({ alg })
      .sign(secret);
  } catch (e) {
    console.error(e);
    throw new Error(`Token with data: ${data}, failed to generate`);
  }
}

export async function validateToken(token: string): Promise<TokenPayload> {
  const { payload } = await jose.jwtVerify(token, secret);
  if (!payload) {
    throw new Error(`Failed to verify token`);
  }
  return payload as TokenPayload;
}
