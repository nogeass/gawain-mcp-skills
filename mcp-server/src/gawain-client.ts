/**
 * @gawain-ai/mcp-server — Gawain API client
 * Copyright (c) 2026 no geass inc. — MIT License
 */

import type {
  Language,
  GawainApiJobResponse,
  GawainApiStatusResponse,
} from "./types.js";

const DEFAULT_API_BASE = "https://gawain.nogeass.com";

interface CreateJobParams {
  title: string;
  description?: string;
  imageUrl: string;
  price?: string;
  currency?: string;
  language: Language;
}

export class GawainClient {
  private readonly apiBase: string;
  private readonly apiKey?: string;

  constructor() {
    this.apiBase = process.env.GAWAIN_API_BASE ?? DEFAULT_API_BASE;
    this.apiKey = process.env.GAWAIN_API_KEY || undefined;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      h["Authorization"] = `Bearer ${this.apiKey}`;
    }
    return h;
  }

  async createJob(params: CreateJobParams): Promise<GawainApiJobResponse> {
    const productId = crypto.randomUUID();

    const body = {
      installId: "mcp-server",
      product: {
        id: productId,
        title: params.title,
        description: params.description ?? "",
        images: [params.imageUrl],
        price: params.price
          ? { amount: params.price, currency: params.currency ?? "JPY" }
          : undefined,
        metadata: {
          source: "mcp",
          language: params.language,
        },
      },
    };

    const res = await fetch(`${this.apiBase}/api/v1/jobs`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(
        `Gawain API error ${res.status}: ${(err as Record<string, string>).message ?? res.statusText}`
      );
    }

    return (await res.json()) as GawainApiJobResponse;
  }

  async getJobStatus(jobId: string): Promise<GawainApiStatusResponse> {
    const res = await fetch(`${this.apiBase}/api/v1/jobs/${encodeURIComponent(jobId)}`, {
      method: "GET",
      headers: this.headers(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(
        `Gawain API error ${res.status}: ${(err as Record<string, string>).message ?? res.statusText}`
      );
    }

    return (await res.json()) as GawainApiStatusResponse;
  }
}
