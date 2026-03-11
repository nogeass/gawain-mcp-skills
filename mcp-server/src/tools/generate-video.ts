/**
 * @gawain-ai/mcp-server — generate_video tool
 * Copyright (c) 2026 no geass inc. — MIT License
 */

import { detectLanguage } from "../language.js";
import { GawainClient } from "../gawain-client.js";
import type { GenerateVideoInput, GenerateVideoResult, Language } from "../types.js";

const client = new GawainClient();

export const generateVideoToolDef = {
  name: "generate_video",
  description:
    "Generate an AI promotional video for a product. " +
    "Provide product title, image URL, and optionally description/price. " +
    "Language is auto-detected from product text by default (ja/en/zh/ko). " +
    "You can override with an explicit language code. Takes ~10 minutes to complete.",
  inputSchema: {
    type: "object" as const,
    properties: {
      title: {
        type: "string",
        description: "Product name (max 80 chars)",
      },
      description: {
        type: "string",
        description: "Product description (max 200 chars)",
      },
      image_url: {
        type: "string",
        description: "Publicly accessible product image URL",
      },
      price: {
        type: "string",
        description: "Price amount (e.g. '8980')",
      },
      currency: {
        type: "string",
        description: "Currency code (default: JPY)",
        default: "JPY",
      },
      language: {
        type: "string",
        enum: ["ja", "en", "zh", "ko", "auto"],
        default: "auto",
        description:
          "Video language. 'auto' detects from product text. " +
          "Explicit code generates video in that language (LLM translates if needed).",
      },
    },
    required: ["title", "image_url"],
  },
};

export async function handleGenerateVideo(
  params: GenerateVideoInput
): Promise<GenerateVideoResult> {
  const langInput = params.language ?? "auto";

  // Resolve language
  const lang: Language =
    langInput === "auto"
      ? detectLanguage(
          [params.title, params.description].filter(Boolean).join(" ")
        )
      : langInput;

  const job = await client.createJob({
    title: params.title,
    description: params.description,
    imageUrl: params.image_url,
    price: params.price,
    currency: params.currency,
    language: lang,
  });

  return {
    jobId: job.jobId,
    status: "pending",
    language: lang,
    estimatedMinutes: 10,
  };
}
