"use client";

import { useEffect, useRef } from "react";
import Editor, { loader, type Monaco } from "@monaco-editor/react";

/* ══════════════════════════════════════════════════════════════
   CYBER-HACKER MONACO THEME
   Absolute-black void + Matrix green syntax spectrum
   ══════════════════════════════════════════════════════════════ */

/** Called once before any editor mounts — registers the theme globally. */
function registerMatrixTheme(monaco: Monaco) {
  monaco.editor.defineTheme("matrix-theme", {
    base: "vs-dark",
    inherit: false, // full override — nothing from vs-dark bleeds through
    rules: [
      // ── Base (variables, identifiers, plain text) ──
      { token: "", foreground: "00FF41", background: "000000" },

      // ── Keywords: def, return, for, in, etc. ──
      { token: "keyword", foreground: "008F11", fontStyle: "bold" },
      { token: "keyword.control", foreground: "008F11", fontStyle: "bold" },
      { token: "keyword.operator", foreground: "00cec9" },

      // ── Built-in functions: print, len, range, type, isinstance … ──
      // Monaco surfaces these as `support.function` or `entity.name.function`
      { token: "support.function", foreground: "00FFFF", fontStyle: "bold" },
      { token: "entity.name.function", foreground: "00FFFF" },
      { token: "support.function.builtin", foreground: "00FFFF", fontStyle: "bold" },

      // ── Function/method calls (generic) ──
      { token: "entity.name.tag", foreground: "00FFFF" },

      // Strings: Pale Yellow
      { token: "string", foreground: "FFFF99" },
      { token: "string.escape", foreground: "e17055" },
      { token: "string.template", foreground: "FFFF99" },

      // Comments: Dim Green
      { token: "comment", foreground: "005522", fontStyle: "italic" },
      { token: "comment.line", foreground: "005522", fontStyle: "italic" },
      { token: "comment.block", foreground: "005522", fontStyle: "italic" },

      // ── Numbers ──
      { token: "number", foreground: "74b9ff" },
      { token: "number.float", foreground: "74b9ff" },
      { token: "number.hex", foreground: "a29bfe" },

      // ── Operators ( + - * / = == != < > and or not ) ──
      { token: "operator", foreground: "55efc4" },
      { token: "delimiter", foreground: "00c896" },

      // ── Constants: True, False, None ──
      { token: "constant.language", foreground: "fd79a8" },
      { token: "constant", foreground: "fd79a8" },

      // ── Types / class names ──
      { token: "entity.name.class", foreground: "ffeaa7" },
      { token: "entity.name.type", foreground: "ffeaa7" },
      { token: "support.type", foreground: "ffeaa7" },

      // ── Decorators (@) ──
      { token: "meta.decorator", foreground: "a29bfe" },

      // ── Import paths ──
      { token: "entity.name.module", foreground: "81ecec" },

      // ── Parameters ──
      { token: "variable.parameter", foreground: "b2bec3" },

      // ── Punctuation / brackets ──
      { token: "delimiter.bracket", foreground: "22c55e" },
      { token: "delimiter.parenthesis", foreground: "22c55e" },
    ],
    colors: {
      // ── Editor chrome ──
      "editor.background": "#000000",
      "editor.foreground": "#00FF41",
      "editorLineNumber.foreground": "#1a4a28",
      "editorLineNumber.activeForeground": "#22c55e",
      "editor.lineHighlightBackground": "#0a1a0a",
      "editor.lineHighlightBorder": "#0d2d0d",

      // ── Selection ──
      "editor.selectionBackground": "#00b89440",
      "editor.inactiveSelectionBackground": "#00b89420",
      "editor.selectionHighlightBackground": "#00b89420",

      // ── Cursor ──
      "editorCursor.foreground": "#00FF41",
      "editorCursor.background": "#000000",

      // ── Indentation guides ──
      "editorIndentGuide.background": "#0d2d10",
      "editorIndentGuide.activeBackground": "#1a5c35",

      // ── Active line number column ──
      "editorGutter.background": "#000000",

      // ── Bracket match ──
      "editorBracketMatch.background": "#00b89430",
      "editorBracketMatch.border": "#00FF41",

      // ── Suggestions / autocomplete ──
      "editorSuggestWidget.background": "#050f05",
      "editorSuggestWidget.border": "#1a5c35",
      "editorSuggestWidget.foreground": "#00FF41",
      "editorSuggestWidget.selectedBackground": "#0a2d0a",
      "editorSuggestWidget.highlightForeground": "#00FFFF",

      // ── Minimap ──
      "minimap.background": "#000000",
      "minimapGutter.addedBackground": "#22c55e",

      // ── Scrollbar ──
      "scrollbarSlider.background": "#1a5c3540",
      "scrollbarSlider.hoverBackground": "#22c55e40",
      "scrollbarSlider.activeBackground": "#22c55e60",

      // ── Find widget ──
      "editorWidget.background": "#050f05",
      "editorWidget.border": "#1a5c35",
      "editorWidget.foreground": "#00FF41",

      // ── Fold / error markers ──
      "editorError.foreground": "#ff4757",
      "editorWarning.foreground": "#ffa502",
      "editorInfo.foreground": "#00FFFF",

      // ── Current word highlight ──
      "editor.wordHighlightBackground": "#00b89420",
      "editor.wordHighlightStrongBackground": "#00b89430",

      // ── Overflow/ruler ──
      "editorRuler.foreground": "#0d2d10",
      "editorOverviewRuler.border": "#000000",
      "editorOverviewRuler.background": "#000000",
    },
  });
}

/* ── Pre-load config (run once) ── */
let themeRegistered = false;

loader.init().then((monaco) => {
  if (!themeRegistered) {
    registerMatrixTheme(monaco);
    themeRegistered = true;
  }
});

/* ══════════════════════════════════════════════════════════════
   DEFAULT DEMO SNIPPET
   Shows every highlight category so users can see the theme
   immediately when they land on a new step.
   ══════════════════════════════════════════════════════════════ */
const DEMO_SNIPPET = `# Cyber-Hacker Python Editor — ready for neural input
# Paste or edit your solution below

import torch
import torch.nn.functional as F
import math


def scaled_dot_product_attention(q, k, v, mask=None):
    """
    Computes Scaled Dot-Product Attention.
    Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V
    """
    d_k = q.size(-1)

    # Step 1: compute raw attention scores
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)

    # Step 2: mask padding positions (optional)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))

    # Step 3: normalise with softmax
    weights = F.softmax(scores, dim=-1)

    # Step 4: weighted sum of values
    output = torch.matmul(weights, v)
    return output, weights


if __name__ == "__main__":
    batch, heads, seq_len, d_k = 2, 8, 10, 64
    Q = torch.randn(batch, heads, seq_len, d_k)
    K = torch.randn(batch, heads, seq_len, d_k)
    V = torch.randn(batch, heads, seq_len, d_k)

    out, attn_weights = scaled_dot_product_attention(Q, K, V)
    print(f"Output shape : {out.shape}")
    print(f"Weights shape: {attn_weights.shape}")
`;

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */
type CyberEditorProps = {
  /** Initial code content — falls back to DEMO_SNIPPET */
  value: string;
  onChange: (value: string) => void;
  /** File extension for Monaco language detection */
  language?: string;
};

export default function CyberEditor({
  value,
  onChange,
  language = "python",
}: CyberEditorProps) {
  const monacoRef = useRef<Monaco | null>(null);

  function handleMount(_editor: any, monaco: Monaco) {
    monacoRef.current = monaco;
    // Ensure theme is set after mount (in case init() raced)
    if (!themeRegistered) {
      registerMatrixTheme(monaco);
      themeRegistered = true;
    }
    monaco.editor.setTheme("matrix-theme");
  }

  return (
    <Editor
      height="100%"
      language={language}
      value={value || DEMO_SNIPPET}
      theme="matrix-theme"
      onMount={handleMount}
      onChange={(v) => onChange(v ?? "")}
      options={{
        // ── Typography ──
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontSize: 13,
        lineHeight: 22,
        fontLigatures: true,
        letterSpacing: 0.3,

        // ── Layout ──
        padding: { top: 20, bottom: 20 },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        renderLineHighlight: "line",

        // ── Line numbers ──
        lineNumbers: "on",
        lineNumbersMinChars: 3,

        // ── Minimap ──
        minimap: { enabled: true, side: "right", renderCharacters: false },

        // ── Guides ──
        guides: {
          indentation: true,
          bracketPairs: true,
        },

        // ── Brackets ──
        matchBrackets: "always",
        bracketPairColorization: { enabled: false }, // use our custom colours

        // ── Scroll ──
        smoothScrolling: true,
        cursorBlinking: "phase",
        cursorSmoothCaretAnimation: "on",

        // ── Misc ──
        tabSize: 4,
        insertSpaces: true,
        formatOnPaste: false,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
          useShadows: false,
        },

        // ── Accessibility ──
        accessibilitySupport: "off",
      }}
      loading={
        <div className="flex h-full items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-3">
            <div className="h-px w-32 animate-pulse bg-green-500" />
            <p className="terminal-label animate-pulse">// loading editor...</p>
          </div>
        </div>
      }
    />
  );
}
