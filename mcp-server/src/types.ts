/**
 * @gawain-ai/mcp-server — Type definitions
 * Copyright (c) 2026 no geass inc. — MIT License
 */

export type Language = "ja" | "en" | "zh" | "ko";
export type LanguageOrAuto = Language | "auto";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface GenerateVideoInput {
  title: string;
  description?: string;
  image_url: string;
  price?: string;
  currency?: string;
  language?: LanguageOrAuto;
}

export interface GenerateVideoResult {
  jobId: string;
  status: JobStatus;
  language: Language;
  estimatedMinutes: number;
}

export interface CheckJobStatusInput {
  job_id: string;
}

export interface CheckJobStatusResult {
  jobId: string;
  status: JobStatus;
  progress?: number;
  language?: string;
  videoUrl?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface GawainApiJobResponse {
  jobId: string;
  status: string;
  createdAt: string;
}

export interface GawainApiStatusResponse {
  jobId: string;
  status: string;
  progress?: number;
  previewUrl?: string;
  downloadUrl?: string;
  error?: {
    code: string;
    message: string;
  };
}
