// mobile-app/src/api/sentryExampleApi.ts

import { Request, Response } from 'express'; // 型定義用（必要に応じて調整）
import express from 'express'; // expressモジュールをインポート

const app = express();

app.use(express.json());

export default function handler(req: Request, res: Response) {
  try {
    throw new Error("Sentry Example API Route Error");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
