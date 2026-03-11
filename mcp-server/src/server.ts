#!/usr/bin/env node

/**
 * @gawain-ai/mcp-server
 * MCP server for Gawain AI video generation
 *
 * Copyright (c) 2026 no geass inc. — MIT License
 *
 *  █████████      █████████████████████████████████
 *   █████████      ███████████████████████████████
 *    █████████      █████████████████████████████
 *     █████████      ███████████████████████████
 *      █████████
 *        ████████
 *         ████████
 *          ████████     ██████████████████████
 *           ████████      ███████████████████
 *            ████████      █████████████████
 *             ████████      ███████████████
 *              ████████           ████████
 *               ████████         ████████
 *                ████████       ████████
 *                 █████████   █████████
 *                  █████████ █████████
 *                   █████████████████
 *                    ███████████████
 *                      ████████████
 *                       ██████████
 *                        ████████
 *                         ██████
 *                          ████
 *                           ██
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  generateVideoToolDef,
  handleGenerateVideo,
} from "./tools/generate-video.js";
import {
  checkJobStatusToolDef,
  handleCheckJobStatus,
} from "./tools/check-status.js";
import type { GenerateVideoInput, CheckJobStatusInput } from "./types.js";

const server = new McpServer({
  name: "gawain",
  version: "0.2.0",
});

// --- Tool: generate_video ---
server.tool(
  generateVideoToolDef.name,
  generateVideoToolDef.description,
  {
    title: z.string().max(80).describe("Product name (max 80 chars)"),
    description: z.string().max(200).optional().describe("Product description (max 200 chars)"),
    image_url: z.string().url().describe("Publicly accessible product image URL"),
    price: z.string().optional().describe("Price amount (e.g. '8980')"),
    currency: z.string().default("JPY").describe("Currency code (default: JPY)"),
    language: z
      .enum(["ja", "en", "zh", "ko", "auto"])
      .default("auto")
      .describe("Video language. 'auto' detects from product text."),
  },
  async (params) => {
    try {
      const result = await handleGenerateVideo(params as GenerateVideoInput);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Tool: check_job_status ---
server.tool(
  checkJobStatusToolDef.name,
  checkJobStatusToolDef.description,
  {
    job_id: z.string().describe("The jobId returned by generate_video"),
  },
  async (params) => {
    try {
      const result = await handleCheckJobStatus(params as CheckJobStatusInput);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Prompt: generate-video ---
server.prompt(
  "generate-video",
  "Interactively generate an AI product video with Gawain. Provide a product name and image URL to create a promotional video with auto language detection (ja/en/zh/ko).",
  {
    title: z.string().optional().describe("Product name"),
    image_url: z.string().optional().describe("Product image URL"),
  },
  (params) => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: [
            "# AI Video Generation",
            "",
            "Generate a product promotional video using Gawain AI.",
            "",
            params.title ? `Product: ${params.title}` : "",
            params.image_url ? `Image: ${params.image_url}` : "",
            "",
            "## Step 1: Gather product information",
            "- Confirm the product name and image URL (ask if missing)",
            "- Optionally ask for: price, description, preferred language",
            "- Language defaults to `auto` (detected from product text)",
            "",
            "## Step 2: Generate the video",
            "- Call the `generate_video` MCP tool with the gathered information",
            "- Display the detected/selected language to the user",
            "- Show the Job ID and inform that it takes ~10 minutes",
            "",
            "## Step 3: Monitor until completion",
            "- Poll `check_job_status` every 30 seconds",
            "- Show progress updates to the user",
            "- On `completed`: display the video URL",
            "- On `failed`: show the error and suggest retrying",
            "- Limit polling to 20 minutes max",
          ]
            .filter((l) => l !== "")
            .join("\n"),
        },
      },
    ],
  })
);

// --- Prompt: monitor-jobs ---
server.prompt(
  "monitor-jobs",
  "Monitor the progress of a Gawain AI video generation job.",
  {
    job_id: z.string().optional().describe("Job ID to monitor"),
  },
  (params) => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: [
            "# Job Monitor",
            "",
            params.job_id ? `Job ID: ${params.job_id}` : "Ask the user for the Job ID.",
            "",
            "1. Call the `check_job_status` MCP tool",
            "2. Display results based on status:",
            "   - pending/processing: show progress %, suggest checking again in 30s",
            "   - completed: display the video URL",
            "   - failed: show error, suggest retrying with generate_video",
          ].join("\n"),
        },
      },
    ],
  })
);

// --- Start ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
