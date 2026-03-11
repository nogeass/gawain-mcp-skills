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
  version: "0.1.0",
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

// --- Start ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
