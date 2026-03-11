<h1 align="center">Gawain MCP Skills</h1>

<p align="center">
  <strong>Generate AI product videos from Claude Code</strong><br>
  MCP server + Claude Code skills for <a href="https://gawain.nogeass.com">Gawain AI</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gawain-ai/mcp-server"><img src="https://img.shields.io/npm/v/@gawain-ai/mcp-server.svg" alt="npm"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/languages-ja%20%7C%20en%20%7C%20zh%20%7C%20ko-brightgreen.svg" alt="4 languages">
</p>

<p align="center">
  <a href="./README.ja.md">日本語</a> |
  <a href="./README.zh.md">中文</a> |
  <a href="./README.ko.md">한국어</a>
</p>

---

## Overview

Gawain MCP Skills is an MCP server that brings [Gawain AI](https://gawain.nogeass.com) video generation directly into Claude Code. Just provide a product name and image URL, and AI automatically generates a promotional video.

**Auto language detection** — Supports Japanese, English, Chinese, and Korean. Language is automatically detected from product text.

## Quick Start

```bash
claude mcp add gawain -- npx @gawain-ai/mcp-server
```

With an API key (optional):

```bash
claude mcp add gawain -e GAWAIN_API_KEY=gawain_live_xxx -- npx @gawain-ai/mcp-server
```

> Free Tier is available without an API key.

## Usage

Just talk to Claude Code:

```
User:   Create a video for this product
        Title: Yubari King Melon Premium
        Image: https://example.com/melon.png
        Price: $89.80

Claude: Auto-detected language: English (en)
        Video generation started (Job: ee036ba8-...)
        Estimated completion: ~10 minutes.

        ... (automatic status checks) ...

        Video is ready!
        https://cdn.gawain.nogeass.com/public/.../final.mp4
```

### Cross-language Videos

Generate videos in a different language from the product text:

```
User:   Create a Chinese version of this product video
Claude: Generating with language="zh". LLM will translate the script to Chinese.
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `generate_video` | Submit a video generation job from product info |
| `check_job_status` | Check job progress and get the completed video URL |

### `generate_video` Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `title` | string | ✅ | Product name (max 80 chars) |
| `image_url` | string | ✅ | Publicly accessible product image URL |
| `description` | string | — | Product description (max 200 chars) |
| `price` | string | — | Price amount (e.g. `"8980"`) |
| `currency` | string | — | Currency code (default: `JPY`) |
| `language` | string | — | `auto` / `ja` / `en` / `zh` / `ko` (default: `auto`) |

### `check_job_status` Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `job_id` | string | ✅ | The jobId returned by `generate_video` |

## Claude Code Skills

| Skill | Description |
|-------|-------------|
| `/generate-video` | Interactively generate a video (gather info → generate → notify) |
| `/monitor-jobs` | Monitor job progress (works with `/loop`) |

## `.mcp.json` Configuration

Add `.mcp.json` to your project root:

```json
{
  "mcpServers": {
    "gawain": {
      "type": "stdio",
      "command": "npx",
      "args": ["@gawain-ai/mcp-server"],
      "env": {
        "GAWAIN_API_KEY": ""
      }
    }
  }
}
```

## Architecture

```
User → Claude Code → MCP Server (this package)
                         ↓
                    Gawain API → SQS → GPU Server → Video
                         ↓
                    Claude Code ← CDN URL
```

## Language Detection

| Text | Detected |
|------|----------|
| 夕張メロン 特秀品 | `ja` (Hiragana/Katakana) |
| Yubari King Melon | `en` (Latin) |
| 夕张甜瓜 特秀品 | `zh` (CJK only) |
| 유바리 멜론 프리미엄 | `ko` (Hangul) |

## Environment Variables

| Variable | Required | Description |
|----------|:--------:|-------------|
| `GAWAIN_API_KEY` | No | API key for premium features (`gawain_live_...`) |
| `GAWAIN_API_BASE` | No | API base URL (default: `https://gawain.nogeass.com`) |

> **No `.env` files** — Use `claude mcp add -e` or `.mcp.json` env field for configuration. For CI/CD, use GitHub Secrets.

## Development

```bash
cd mcp-server
npm install
npm run build
npm start
```

## Contributing

Issues and pull requests are welcome at [GitHub](https://github.com/nogeass/gawain-mcp-skills).

## License

[MIT](./LICENSE) — Copyright (c) 2026 no geass inc.
