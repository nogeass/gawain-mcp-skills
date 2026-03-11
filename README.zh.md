<h1 align="center">Gawain MCP Skills</h1>

<p align="center">
  <strong>从 Claude Code 生成 AI 商品视频</strong><br>
  <a href="https://gawain.nogeass.com">Gawain AI</a> 的 MCP 服务器 + Claude Code 技能
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gawain-ai/mcp-server"><img src="https://img.shields.io/npm/v/@gawain-ai/mcp-server.svg" alt="npm"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/languages-ja%20%7C%20en%20%7C%20zh%20%7C%20ko-brightgreen.svg" alt="4 languages">
</p>

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README.ja.md">日本語</a> |
  <a href="./README.ko.md">한국어</a>
</p>

---

## 概述

Gawain MCP Skills 是一个 MCP 服务器，可以在 Claude Code 中直接使用 [Gawain AI](https://gawain.nogeass.com) 的视频生成功能。只需提供商品名称和图片URL，AI就能自动生成推广视频。

**4种语言自动检测** — 支持日语、英语、中文和韩语。根据商品文本自动识别语言。

## 快速开始

```bash
claude mcp add gawain -- npx @gawain-ai/mcp-server
```

设置 API 密钥（可选）：

```bash
claude mcp add gawain -e GAWAIN_API_KEY=gawain_live_xxx -- npx @gawain-ai/mcp-server
```

> 无需 API 密钥即可使用免费版。

## 使用方法

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

### 跨语言视频

可以用不同语言生成视频：

```
用户:   创建这个商品的英文版视频
Claude: 使用 language="en" 生成。LLM会将脚本翻译成英文。
```

## 示例（复制粘贴即可使用）

### 中文 — 跨境电商（日本商品 → 中文视频）

```
商品名: 京都宇治抹茶 最高級品
图片: https://cdn.gawain.nogeass.com/wine/1_gawain_generated.png
价格: 3200
描述: 京都府宇治产石磨抹茶。可用于茶道的最高级品。丰富的鲜味与鲜艳的绿色。
语言: zh
```

### 英文 — 家电

```
商品名: ZenBreeze Pro Air Purifier
图片: https://cdn.gawain.nogeass.com/shoes/1_gawain_generated.png
价格: 299
描述: Ultra-quiet HEPA air purifier with smart sensor. Covers up to 500 sq ft. Perfect for allergies and pet owners.
语言: en
```

### 日文 — 食品

```
商品名: 夕張メロン 特秀品
图片: https://cdn.gawain.nogeass.com/melon/1_gawain_generated.png
价格: 8980
描述: 北海道夕张产最高级甜瓜。糖度15度以上，入口即化。送礼佳品。
语言: ja
```

### 韩文 — K-Beauty

```
商品名: 유바리 멜론 콜라겐 마스크팩
图片: https://cdn.gawain.nogeass.com/bag/1_gawain_generated.png
价格: 25000
描述: 유바리 멜론 추출물과 콜라겐이 풍부한 프리미엄 마스크팩. 피부에 수분과 탄력을 선사합니다.
语言: ko
```

## MCP 工具

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

### `check_job_status` 参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|:---:|------|
| `job_id` | string | ✅ | `generate_video` 返回的 jobId |

## Claude Code 技能

| 技能 | 描述 |
|------|------|
| `/generate-video` | 交互式生成视频（信息收集→生成→完成通知） |
| `/monitor-jobs` | 监控任务进度（可与 `/loop` 配合使用） |

## `.mcp.json` 配置

在项目根目录添加 `.mcp.json`：

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

## 架构

```
用户 → Claude Code → MCP Server（本包）
                         ↓
                    Gawain API → SQS → GPU Server → 视频
                         ↓
                    Claude Code ← CDN URL
```

## 语言检测

| 文本 | 检测结果 |
|------|----------|
| 夕張メロン 特秀品 | `ja`（平假名/片假名） |
| Yubari King Melon | `en`（拉丁字母） |
| 夕张甜瓜 特秀品 | `zh`（仅CJK汉字） |
| 유바리 멜론 프리미엄 | `ko`（韩文） |

## 环境变量

| 变量 | 必填 | 描述 |
|------|:---:|------|
| `GAWAIN_API_KEY` | 否 | 高级功能的 API 密钥（`gawain_live_...`） |
| `GAWAIN_API_BASE` | 否 | API 基础URL（默认: `https://gawain.nogeass.com`） |

> **不使用 `.env` 文件** — 请使用 `claude mcp add -e` 或 `.mcp.json` 的 env 字段进行配置。CI/CD 请使用 GitHub Secrets。

## 开发

```bash
cd mcp-server
npm install
npm run build
npm start
```

## 贡献

欢迎在 [GitHub](https://github.com/nogeass/gawain-mcp-skills) 提交 Issue 和 Pull Request。

## 许可证

[MIT](./LICENSE) — Copyright (c) 2026 no geass inc.
