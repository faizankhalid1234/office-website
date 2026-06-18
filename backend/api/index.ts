import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import { connectMongo } from "../src/lib/mongo.js";
import { createApp } from "../src/app.js";

let appHandler: ReturnType<typeof serverless> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectMongo();

    if (!appHandler) {
      appHandler = serverless(createApp());
    }

    return appHandler(req, res);
  } catch (error) {
    console.error("[api] Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
