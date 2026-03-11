---
name: generate-video
description: Interactively generate an AI product video with Gawain. Provide a product name and image URL to create a promotional video with auto language detection (ja/en/zh/ko).
argument-hint: "[product name] [image URL]"
---

# AI Video Generation Skill

Generate a product promotional video using Gawain AI.

## Step 1: Gather product information

- Parse the arguments for product name and image URL
- If the product name is missing, ask the user for it
- If the image URL is missing, ask the user for it
- Optionally ask for: price, description, preferred language
- Language defaults to `auto` (detected from product text)

## Step 2: Generate the video

- Call the `generate_video` MCP tool with the gathered information
- Display the detected/selected language to the user
- Show the Job ID and inform that it takes ~10 minutes

## Step 3: Monitor until completion

- Poll `check_job_status` every 30 seconds
- Show progress updates to the user
- On `completed`: display the video URL
- On `failed`: show the error and suggest retrying
- Limit polling to 20 minutes max, then suggest using `/monitor-jobs [job_id]`
