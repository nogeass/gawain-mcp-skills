<!-- G mark — no geass inc. -->
<pre align="center">
<code>
█████████      █████████████████████████████████
 █████████      ███████████████████████████████
  █████████      █████████████████████████████
   █████████      ███████████████████████████
    █████████
      ████████
       ████████
        ████████     ██████████████████████
         ████████      ███████████████████
          ████████      █████████████████
           ████████      ███████████████
            ████████           ████████
             ████████         ████████
              ████████       ████████
               █████████   █████████
                █████████ █████████
                 █████████████████
                  ███████████████
                    ████████████
                     ██████████
                      ████████
                       ██████
                        ████
                         ██
</code>
</pre>

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

---

[日本語](#日本語) | [English](#english) | [中文](#中文) | [한국어](#한국어)

---

## 日本語

### 概要

Gawain MCP Skills は、[Gawain AI](https://gawain.nogeass.com) の動画生成機能を Claude Code から直接利用できる MCP サーバーです。商品名と画像URLを渡すだけで、AIがプロモーション動画を自動生成します。

**4言語自動検出** — 日本語・英語・中国語・韓国語に対応。商品テキストから言語を自動判定します。

### クイックスタート

```bash
claude mcp add gawain -- npx @gawain-ai/mcp-server
```

API キー（任意）を設定する場合:

```bash
claude mcp add gawain -e GAWAIN_API_KEY=gawain_live_xxx -- npx @gawain-ai/mcp-server
```

> API キーなしでも Free Tier で利用可能です。

### 使い方

Claude Code で話しかけるだけ:

```
ユーザー: この商品の動画を作って
         タイトル: 夕張メロン 特秀品
         画像: https://example.com/melon.png
         価格: 8,980円

Claude:  言語を自動検出しました: 日本語 (ja)
         動画生成を開始しました (Job: ee036ba8-...)
         約10分で完成します。

         ... (自動でステータスチェック) ...

         動画が完成しました!
         https://cdn.gawain.nogeass.com/public/.../final.mp4
```

#### 翻訳付き動画

日本語の商品情報から英語の動画を生成することも可能です:

```
ユーザー: 夕張メロンの英語版動画を作って
Claude:  language="en" で生成します。LLMが日本語から英語へ翻訳してスクリプトを作成します。
```

### MCP ツール

| ツール | 説明 |
|--------|------|
| `generate_video` | 商品情報から動画生成ジョブを投入 |
| `check_job_status` | ジョブの進捗確認・完成URL取得 |

### `generate_video` パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|:---:|------|
| `title` | string | ✅ | 商品名（最大80文字） |
| `image_url` | string | ✅ | 商品画像URL（公開アクセス可能） |
| `description` | string | — | 商品説明（最大200文字） |
| `price` | string | — | 価格（例: `"8980"`） |
| `currency` | string | — | 通貨コード（デフォルト: `JPY`） |
| `language` | string | — | `auto` / `ja` / `en` / `zh` / `ko`（デフォルト: `auto`） |

### Claude Code スキル

| スキル | 説明 |
|--------|------|
| `/generate-video` | 対話的に動画を生成（ヒアリング→生成→完成通知） |
| `/monitor-jobs` | ジョブの進捗を監視（`/loop` 連携可） |

### `.mcp.json` での設定

プロジェクトルートに `.mcp.json` を追加:

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

---

## English

### Overview

Gawain MCP Skills is an MCP server that brings [Gawain AI](https://gawain.nogeass.com) video generation directly into Claude Code. Just provide a product name and image URL, and AI automatically generates a promotional video.

**Auto language detection** — Supports Japanese, English, Chinese, and Korean. Language is automatically detected from product text.

### Quick Start

```bash
claude mcp add gawain -- npx @gawain-ai/mcp-server
```

With an API key (optional):

```bash
claude mcp add gawain -e GAWAIN_API_KEY=gawain_live_xxx -- npx @gawain-ai/mcp-server
```

> Free Tier is available without an API key.

### Usage

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

#### Cross-language Videos

Generate videos in a different language from the product text:

```
User:   Create a Chinese version of this product video
Claude: Generating with language="zh". LLM will translate the script to Chinese.
```

### MCP Tools

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

### Claude Code Skills

| Skill | Description |
|-------|-------------|
| `/generate-video` | Interactively generate a video (gather info → generate → notify) |
| `/monitor-jobs` | Monitor job progress (works with `/loop`) |

### `.mcp.json` Configuration

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

---

## 中文

### 概述

Gawain MCP Skills 是一个 MCP 服务器，可以在 Claude Code 中直接使用 [Gawain AI](https://gawain.nogeass.com) 的视频生成功能。只需提供商品名称和图片URL，AI就能自动生成推广视频。

**4种语言自动检测** — 支持日语、英语、中文和韩语。根据商品文本自动识别语言。

### 快速开始

```bash
claude mcp add gawain -- npx @gawain-ai/mcp-server
```

设置 API 密钥（可选）：

```bash
claude mcp add gawain -e GAWAIN_API_KEY=gawain_live_xxx -- npx @gawain-ai/mcp-server
```

> 无需 API 密钥即可使用免费版。

### 使用方法

在 Claude Code 中直接对话：

```
用户:   为这个商品创建视频
        标题: 夕张甜瓜 特秀品
        图片: https://example.com/melon.png
        价格: ¥598

Claude: 自动检测语言: 中文 (zh)
        视频生成已开始 (Job: ee036ba8-...)
        预计完成时间: 约10分钟。

        ...（自动状态检查）...

        视频已完成!
        https://cdn.gawain.nogeass.com/public/.../final.mp4
```

### MCP 工具

| 工具 | 描述 |
|------|------|
| `generate_video` | 根据商品信息提交视频生成任务 |
| `check_job_status` | 查看任务进度并获取完成后的视频URL |

### `generate_video` 参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|:---:|------|
| `title` | string | ✅ | 商品名称（最多80个字符） |
| `image_url` | string | ✅ | 可公开访问的商品图片URL |
| `description` | string | — | 商品描述（最多200个字符） |
| `price` | string | — | 价格金额（例: `"598"`） |
| `currency` | string | — | 货币代码（默认: `JPY`） |
| `language` | string | — | `auto` / `ja` / `en` / `zh` / `ko`（默认: `auto`） |

### Claude Code 技能

| 技能 | 描述 |
|------|------|
| `/generate-video` | 交互式生成视频（信息收集→生成→完成通知） |
| `/monitor-jobs` | 监控任务进度（可与 `/loop` 配合使用） |

---

## 한국어

### 개요

Gawain MCP Skills는 [Gawain AI](https://gawain.nogeass.com)의 비디오 생성 기능을 Claude Code에서 직접 사용할 수 있는 MCP 서버입니다. 상품명과 이미지 URL만 제공하면 AI가 프로모션 비디오를 자동으로 생성합니다.

**4개 언어 자동 감지** — 일본어, 영어, 중국어, 한국어를 지원합니다. 상품 텍스트에서 언어를 자동으로 감지합니다.

### 빠른 시작

```bash
claude mcp add gawain -- npx @gawain-ai/mcp-server
```

API 키 설정 (선택사항):

```bash
claude mcp add gawain -e GAWAIN_API_KEY=gawain_live_xxx -- npx @gawain-ai/mcp-server
```

> API 키 없이도 Free Tier를 이용할 수 있습니다.

### 사용 방법

Claude Code에서 대화하기만 하면 됩니다:

```
사용자: 이 상품의 비디오를 만들어주세요
        제목: 유바리 멜론 프리미엄
        이미지: https://example.com/melon.png
        가격: ₩120,000

Claude: 자동 감지된 언어: 한국어 (ko)
        비디오 생성이 시작되었습니다 (Job: ee036ba8-...)
        예상 완료 시간: 약 10분

        ... (자동 상태 확인) ...

        비디오가 완성되었습니다!
        https://cdn.gawain.nogeass.com/public/.../final.mp4
```

### MCP 도구

| 도구 | 설명 |
|------|------|
| `generate_video` | 상품 정보로 비디오 생성 작업 제출 |
| `check_job_status` | 작업 진행 상황 확인 및 완성된 비디오 URL 가져오기 |

### `generate_video` 매개변수

| 매개변수 | 타입 | 필수 | 설명 |
|----------|------|:---:|------|
| `title` | string | ✅ | 상품명 (최대 80자) |
| `image_url` | string | ✅ | 공개 접근 가능한 상품 이미지 URL |
| `description` | string | — | 상품 설명 (최대 200자) |
| `price` | string | — | 가격 금액 (예: `"120000"`) |
| `currency` | string | — | 통화 코드 (기본값: `JPY`) |
| `language` | string | — | `auto` / `ja` / `en` / `zh` / `ko` (기본값: `auto`) |

### Claude Code 스킬

| 스킬 | 설명 |
|------|------|
| `/generate-video` | 대화형으로 비디오 생성 (정보 수집→생성→완료 알림) |
| `/monitor-jobs` | 작업 진행 상황 모니터링 (`/loop`과 연동 가능) |

---

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
