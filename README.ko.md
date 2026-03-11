<h1 align="center">Gawain MCP Skills</h1>

<p align="center">
  <strong>Claude Code에서 AI 상품 비디오 생성</strong><br>
  <a href="https://gawain.nogeass.com">Gawain AI</a>의 MCP 서버 + Claude Code 스킬
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gawain-ai/mcp-server"><img src="https://img.shields.io/npm/v/@gawain-ai/mcp-server.svg" alt="npm"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/languages-ja%20%7C%20en%20%7C%20zh%20%7C%20ko-brightgreen.svg" alt="4 languages">
</p>

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README.ja.md">日本語</a> |
  <a href="./README.zh.md">中文</a>
</p>

---

## 개요

Gawain MCP Skills는 [Gawain AI](https://gawain.nogeass.com)의 비디오 생성 기능을 Claude Code에서 직접 사용할 수 있는 MCP 서버입니다. 상품명과 이미지 URL만 제공하면 AI가 프로모션 비디오를 자동으로 생성합니다.

**4개 언어 자동 감지** — 일본어, 영어, 중국어, 한국어를 지원합니다. 상품 텍스트에서 언어를 자동으로 감지합니다.

## 빠른 시작

```bash
claude mcp add gawain -- npx @gawain-ai/mcp-server
```

API 키 설정 (선택사항):

```bash
claude mcp add gawain -e GAWAIN_API_KEY=gawain_live_xxx -- npx @gawain-ai/mcp-server
```

> API 키 없이도 Free Tier를 이용할 수 있습니다.

## 사용 방법

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

### 다국어 비디오

상품 텍스트와 다른 언어로 비디오를 생성할 수 있습니다:

```
사용자: 이 상품의 영어 버전 비디오를 만들어주세요
Claude: language="en"으로 생성합니다. LLM이 스크립트를 영어로 번역합니다.
```

## 예시 (복사하여 바로 사용)

### 한국어 — K-Beauty

```
상품명: 유바리 멜론 콜라겐 마스크팩
이미지: https://cdn.gawain.nogeass.com/public/samples/mask.png
가격: 25000
설명: 유바리 멜론 추출물과 콜라겐이 풍부한 프리미엄 마스크팩. 피부에 수분과 탄력을 선사합니다.
언어: ko
```

### 영어 — 가전제품

```
상품명: ZenBreeze Pro Air Purifier
이미지: https://cdn.gawain.nogeass.com/public/samples/purifier.png
가격: 299
설명: Ultra-quiet HEPA air purifier with smart sensor. Covers up to 500 sq ft. Perfect for allergies and pet owners.
언어: en
```

### 일본어 — 식품

```
상품명: 夕張メロン 特秀品
이미지: https://cdn.gawain.nogeass.com/public/samples/melon.png
가격: 8980
설명: 北海道夕張産の最高級メロン。糖度15度以上、とろける果肉。贈答用にも最適。
언어: ja
```

### 중국어 — 크로스보더 (일본 상품 → 중국어 비디오)

```
상품명: 京都宇治抹茶 最高級品
이미지: https://cdn.gawain.nogeass.com/public/samples/matcha.png
가격: 3200
설명: 京都府宇治産の石臼挽き抹茶。茶道にも使える最高級品。豊かな旨味と鮮やかな緑色。
언어: zh
```

## MCP 도구

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

### `check_job_status` 매개변수

| 매개변수 | 타입 | 필수 | 설명 |
|----------|------|:---:|------|
| `job_id` | string | ✅ | `generate_video`에서 반환된 jobId |

## Claude Code 스킬

| 스킬 | 설명 |
|------|------|
| `/generate-video` | 대화형으로 비디오 생성 (정보 수집→생성→완료 알림) |
| `/monitor-jobs` | 작업 진행 상황 모니터링 (`/loop`과 연동 가능) |

## `.mcp.json` 설정

프로젝트 루트에 `.mcp.json`을 추가하세요:

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

## 아키텍처

```
사용자 → Claude Code → MCP Server (이 패키지)
                            ↓
                       Gawain API → SQS → GPU Server → 비디오
                            ↓
                       Claude Code ← CDN URL
```

## 언어 감지

| 텍스트 | 감지 결과 |
|--------|----------|
| 夕張メロン 特秀品 | `ja` (히라가나/가타카나) |
| Yubari King Melon | `en` (라틴 문자) |
| 夕张甜瓜 特秀品 | `zh` (CJK 한자만) |
| 유바리 멜론 프리미엄 | `ko` (한글) |

## 환경 변수

| 변수 | 필수 | 설명 |
|------|:---:|------|
| `GAWAIN_API_KEY` | 아니오 | 프리미엄 기능용 API 키 (`gawain_live_...`) |
| `GAWAIN_API_BASE` | 아니오 | API 기본 URL (기본값: `https://gawain.nogeass.com`) |

> **`.env` 파일을 사용하지 않습니다** — `claude mcp add -e` 또는 `.mcp.json`의 env 필드를 사용하세요. CI/CD에서는 GitHub Secrets를 사용합니다.

## 개발

```bash
cd mcp-server
npm install
npm run build
npm start
```

## 기여

[GitHub](https://github.com/nogeass/gawain-mcp-skills)에서 Issue와 Pull Request를 환영합니다.

## 라이선스

[MIT](./LICENSE) — Copyright (c) 2026 no geass inc.
