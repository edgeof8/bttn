# PRD: bttn

**Copy any AI conversation to clean Markdown with one click.**

## Overview

`bttn` is the flagship Edge Toolkit tool. It detects the current AI chat platform and extracts the full conversation as structured Markdown, ready to paste into Obsidian, Notion, a document, or an AI tool for further processing.

## Target Users

- AI power users who want to save or share conversations
- Researchers and writers using AI as part of their workflow
- Developers feeding conversation context into other tools
- Anyone who wants a clean, portable record of a chat session

## Supported Platforms

| Platform | Detection | Notes |
|---|---|---|
| Claude (claude.ai) | `location.hostname.includes('claude.ai')` | Handles artifacts |
| Google AI Studio | `aistudio.google` | Scrolls to top first to capture full history |
| ChatGPT | `chatgpt.com` or `chat.openai` | Uses `data-message-author-role` |
| Grok | `grok.com` or `x.com` | Uses `data-testid` message markers |
| Generic fallback | Any other page | Queries common chat DOM patterns |

## Behavior

1. Detects the current platform by hostname
2. Queries platform-specific message containers
3. Strips thinking/reasoning blocks (Claude, o1-style thought blocks)
4. Converts each turn to Markdown using a recursive `nodeToMd()` walker
5. Deduplicates messages with a `seen` Set to handle re-renders
6. Labels turns `**Human**` / `**Claude**` / `**Assistant**` / `**Model**` etc.
7. Joins turns with `\n\n---\n\n` separators
8. Copies result to clipboard via `navigator.clipboard.writeText`
9. Flashes tab title: `✓ Copied` for 1.5 s
10. If nothing found: `Nothing to copy`

## Output Format

```markdown
**Human**

What is the difference between attention and self-attention?

---

**Claude**

Attention is a mechanism that allows a model to focus on relevant parts
of an input sequence when producing an output. Self-attention (also called
intra-attention) applies this within a single sequence...

---

**Human**

Can you give a code example?

---

**Claude**

Sure. Here's a minimal NumPy implementation:

```python
import numpy as np
...
```
```

## Markdown Conversion Rules

`nodeToMd()` handles:
- `<a>` → `[text](href)`
- `<pre><code>` → fenced code block with language detection
- `<code>` (inline) → backtick
- `<strong>`, `<b>` → `**bold**`
- `<em>`, `<i>` → `*italic*`
- `<h1>`–`<h4>` → `#` through `####`
- `<li>` → `- item`
- `<ul>`, `<ol>` → block with newlines
- `<table>` → pipe table with header separator row
- `<p>`, `<div>`, `<section>` → double-newline separated blocks
- `<br>` → newline

Thinking/reasoning blocks are stripped before conversion:
`.thinking-container, .thoughts-container, .model-thoughts, [class*="thought"], [data-testid="thought-block"], [data-testid*="thinking"]`

## Technical Constraints

- Zero external dependencies
- Async IIFE to support `await` for AI Studio scroll timing
- `navigator.clipboard` (no fallback needed — all target platforms are HTTPS)
- Tab title flash as feedback (avoids needing a toast injection on complex app pages)
- Ghost message filter: skips lines that are only role labels (e.g., "Human", "Model 2:41 PM")
- Target size: < 3 KB minified
