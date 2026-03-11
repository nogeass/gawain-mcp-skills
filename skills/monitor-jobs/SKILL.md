---
name: monitor-jobs
description: Monitor the progress of a Gawain AI video generation job. Compatible with /loop for periodic checking.
argument-hint: "[job_id]"
---

# Job Monitor Skill

Check the status of a video generation job.

## Processing

1. Parse the job ID from arguments
2. If no job ID provided, ask the user for it
3. Call the `check_job_status` MCP tool
4. Display results based on status:

### Status: pending / processing
- Show current progress percentage
- Suggest checking again in 30 seconds or using `/loop 30s /monitor-jobs [job_id]`

### Status: completed
- Display the video URL
- Congratulate the user

### Status: failed
- Show the error code and message
- Suggest retrying with `/generate-video`
