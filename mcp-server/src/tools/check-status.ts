/**
 * @gawain-ai/mcp-server — check_job_status tool
 * Copyright (c) 2026 no geass inc. — MIT License
 */

import { GawainClient } from "../gawain-client.js";
import type { CheckJobStatusInput, CheckJobStatusResult, JobStatus } from "../types.js";

const client = new GawainClient();

export const checkJobStatusToolDef = {
  name: "check_job_status",
  description:
    "Check the progress of a video generation job. " +
    "Returns status (pending/processing/completed/failed), progress percentage, " +
    "and video URL when completed.",
  inputSchema: {
    type: "object" as const,
    properties: {
      job_id: {
        type: "string",
        description: "The jobId returned by generate_video",
      },
    },
    required: ["job_id"],
  },
};

export async function handleCheckJobStatus(
  params: CheckJobStatusInput
): Promise<CheckJobStatusResult> {
  const res = await client.getJobStatus(params.job_id);

  const status = mapStatus(res.status);
  const videoUrl = res.downloadUrl ?? res.previewUrl;

  return {
    jobId: res.jobId,
    status,
    progress: res.progress,
    ...(videoUrl ? { videoUrl } : {}),
    ...(res.error ? { error: res.error } : {}),
  };
}

function mapStatus(raw: string): JobStatus {
  switch (raw) {
    case "pending":
      return "pending";
    case "processing":
    case "generating":
      return "processing";
    case "completed":
    case "complete":
      return "completed";
    case "failed":
    case "fail":
    case "fatal":
      return "failed";
    default:
      return "pending";
  }
}
