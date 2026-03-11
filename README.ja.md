<h1 align="center">Gawain MCP Skills</h1>

<p align="center">
  <strong>Claude Code から AI 商品動画を生成</strong><br>
  <a href="https://gawain.nogeass.com">Gawain AI</a> の MCP サーバー + Claude Code スキル
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gawain-ai/mcp-server"><img src="https://img.shields.io/npm/v/@gawain-ai/mcp-server.svg" alt="npm"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/languages-ja%20%7C%20en%20%7C%20zh%20%7C%20ko-brightgreen.svg" alt="4 languages">
</p>

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README.zh.md">中文</a> |
  <a href="./README.ko.md">한국어</a>
</p>

---

## 概要

Gawain MCP Skills は、[Gawain AI](https://gawain.nogeass.com) の動画生成機能を Claude Code から直接利用できる MCP サーバーです。商品名と画像URLを渡すだけで、AIがプロモーション動画を自動生成します。

**4言語自動検出** — 日本語・英語・中国語・韓国語に対応。商品テキストから言語を自動判定します。

## クイックスタート

```bash
claude mcp add gawain -- npx @gawain-ai/mcp-server
```

API キー（任意）を設定する場合:

```bash
claude mcp add gawain -e GAWAIN_API_KEY=gawain_live_xxx -- npx @gawain-ai/mcp-server
```

> API キーなしでも Free Tier で利用可能です。

## 使い方

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

### 翻訳付き動画

日本語の商品情報から英語の動画を生成することも可能です:

```
ユーザー: 夕張メロンの英語版動画を作って
Claude:  language="en" で生成します。LLMが日本語から英語へ翻訳してスクリプトを作成します。
```

## 生成例（コピー&ペースト）

### 日本語 — 食品

```
商品名: 夕張メロン 特秀品
画像: https://cdn.gawain.nogeass.com/melon/1_gawain_generated.png
価格: 8980
説明: 北海道夕張産の最高級メロン。糖度15度以上、とろける果肉。贈答用にも最適。
言語: ja
```

### 英語 — 家電

```
商品名: ZenBreeze Pro Air Purifier
画像: https://cdn.gawain.nogeass.com/shoes/1_gawain_generated.png
価格: 299
説明: Ultra-quiet HEPA air purifier with smart sensor. Covers up to 500 sq ft. Perfect for allergies and pet owners.
言語: en
```

### 中国語 — 越境EC（日本語商品 → 中国語動画）

```
商品名: 京都宇治抹茶 最高級品
画像: https://cdn.gawain.nogeass.com/wine/1_gawain_generated.png
価格: 3200
説明: 京都府宇治産の石臼挽き抹茶。茶道にも使える最高級品。豊かな旨味と鮮やかな緑色。
言語: zh
```

### 韓国語 — K-Beauty

```
商品名: 유바리 멜론 콜라겐 마스크팩
画像: https://cdn.gawain.nogeass.com/bag/1_gawain_generated.png
価格: 25000
説明: 유바리 멜론 추출물과 콜라겐이 풍부한 프리미엄 마스크팩. 피부에 수분과 탄력을 선사합니다.
言語: ko
```

## MCP ツール

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

### `check_job_status` パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|:---:|------|
| `job_id` | string | ✅ | `generate_video` で返された jobId |

## Claude Code スキル

| スキル | 説明 |
|--------|------|
| `/generate-video` | 対話的に動画を生成（ヒアリング→生成→完成通知） |
| `/monitor-jobs` | ジョブの進捗を監視（`/loop` 連携可） |

## `.mcp.json` での設定

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

## アーキテクチャ

```
ユーザー → Claude Code → MCP Server (このパッケージ)
                              ↓
                         Gawain API → SQS → GPU Server → 動画
                              ↓
                         Claude Code ← CDN URL
```

## 言語検出

| テキスト | 検出結果 |
|---------|----------|
| 夕張メロン 特秀品 | `ja`（ひらがな/カタカナ） |
| Yubari King Melon | `en`（ラテン文字） |
| 夕张甜瓜 特秀品 | `zh`（CJK漢字のみ） |
| 유바리 멜론 프리미엄 | `ko`（ハングル） |

## 環境変数

| 変数 | 必須 | 説明 |
|------|:---:|------|
| `GAWAIN_API_KEY` | いいえ | プレミアム機能用 API キー（`gawain_live_...`） |
| `GAWAIN_API_BASE` | いいえ | API ベースURL（デフォルト: `https://gawain.nogeass.com`） |

> **`.env` ファイルは使用しません** — `claude mcp add -e` または `.mcp.json` の env フィールドで設定してください。CI/CD では GitHub Secrets を使用します。

## 開発

```bash
cd mcp-server
npm install
npm run build
npm start
```

## コントリビュート

Issue や Pull Request は [GitHub](https://github.com/nogeass/gawain-mcp-skills) で受け付けています。

## 運営

[**ノーギアス株式会社**](https://nogeass.com/ja) (no geass inc.) が開発・運営しています。

## ライセンス

[MIT](./LICENSE) — Copyright (c) 2026 no geass inc.
