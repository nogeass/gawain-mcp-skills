/**
 * @gawain-ai/mcp-server — Language auto-detection
 * Copyright (c) 2026 no geass inc. — MIT License
 *
 * Detects language from product text using Unicode character ranges.
 * Supports: Japanese (ja), English (en), Chinese (zh), Korean (ko)
 *
 * Priority: Hiragana/Katakana → Hangul → CJK → English (default)
 */

import type { Language } from "./types.js";

export function detectLanguage(text: string): Language {
  const total = text.length;
  if (total === 0) return "ja";

  const hiragana = text.match(/[\u3040-\u309f]/g)?.length ?? 0;
  const katakana = text.match(/[\u30a0-\u30ff]/g)?.length ?? 0;
  const hangul = text.match(/[\uac00-\ud7af]/g)?.length ?? 0;
  const cjk = text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;

  // Hiragana / Katakana present → Japanese
  if ((hiragana + katakana) / total > 0.1) return "ja";

  // Hangul present → Korean
  if (hangul / total > 0.1) return "ko";

  // CJK ideographs only (no kana) → Chinese
  if (cjk / total > 0.3) return "zh";

  // Default → English
  return "en";
}
