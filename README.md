# bttn

**One bookmarklet. Your full AI conversation on the clipboard as clean Markdown.**  

Works on **Claude.ai**, **Google AI Studio**, **ChatGPT**, and **Grok** — with a best-effort fallback for any other chatbot site.

---

## The Problem

Every AI company is a friction company.

You had a conversation. The text is yours.  
Getting it out cleanly — properly formatted, full transcript, one click — should be trivial.

It isn’t.  
So here’s the button they refused to build.

---

## Install (10 seconds)

**Easiest:** Go to [edgeof8.github.io/bttn](https://edgeof8.github.io/bttn) and drag the button to your bookmarks bar. Done.

**Manual:**

1. Show your bookmarks bar (`Ctrl+Shift+B` / `Cmd+Shift+B`)
2. Right-click the bar → **Add bookmark**
3. Name it `bttn` (or whatever you want)
4. Copy the minified code below
5. Paste it into the **URL** field and save

---

## How to Use

1. Go to any supported chat
2. Click the `bttn` bookmark
3. Your full conversation is now on the clipboard as clean Markdown

The browser tab title will flash `✓ Copied` for 1.5 seconds.

---

## Supported Platforms

| Platform          | What it captures                                      |
|-------------------|-------------------------------------------------------|
| **Claude.ai**     | All human + Claude turns; active Artifact (if sidebar open) |
| **Google AI Studio** | Initial prompt (Monaco) + all turns (thoughts stripped) |
| **ChatGPT**       | All human + assistant turns (reasoning stripped)   |
| **Grok**          | All human + Grok turns (thinking blocks stripped)     |
| **Any other site** | Best-effort: common message selectors, falls back to full page text |

Platform is detected automatically. No configuration needed.

---

## The Bookmarklet (paste this as the URL)

```
javascript:(function(){var s=document.createElement('script');s.src='https://edgeof8.github.io/bttn/bttn.js?v='+Date.now();document.body.appendChild(s);})();
```

This is a **remote loader**. The tiny snippet above stays fixed forever — all the real logic lives in [`bttn.js`](https://edgeof8.github.io/bttn/bttn.js) and is fetched fresh on every click. You'll always run the latest version without touching your bookmarks.

## Output Format

Valid Markdown ready for Obsidian, Notion, VS Code, or anywhere else.

**Human**

Your message here

---

**Claude**

The response here, with **bold**, `inline code`, and

```python
# code blocks preserved with language tags
```

---

## Notes

- **Google AI Studio (long chats):** Scroll to the top once (`Ctrl+Home`) before clicking. AI Studio uses virtual rendering — this forces the initial prompt into the DOM.
- **Feedback:** Tab title flashes `✓ Copied`. No annoying alerts.
- **Privacy:** The loader fetches `bttn.js` from GitHub Pages on each click, then runs entirely in your browser. Your conversation text is never sent anywhere.
- **Selector drift:** AI platforms change their markup constantly. If it breaks, open an issue.

---

## Changelog

- **v0.8** — Markdown table rendering (`TABLE` → `| col |` syntax, separator on `<th>` rows); content dedup via `Set` (safe against virtualized-list double-copies); `[text](url)` link format; button noise removal; Claude Artifact sidebar grab
- **v0.7** — Refactored to `platformHandlers` config object (one place to fix selector drift); more aggressive thought-stripping (`.o1-thinking`, `[data-testid*="thinking"]`); case-insensitive `isGhost`; `SECTION` in block elements; "Nothing to copy" feedback; fallback selectors expanded
- **v0.6** — Generic fallback: tries common chatbot selectors on any site, falls back to full page text
- **v0.5** — Grok support (`grok.com` / `x.com`); shared `extract()` function; `.thinking-container` stripping
- **v0.4** — `<a>` tag fix (no more collapsed links); aggressive ghost-turn filtering
- **v0.3** — Full Markdown engine (`nodeToMd`); language-aware code blocks; bold/italic/headers/lists; o1 thought stripping; tab title flash
- **v0.2** — Universal bookmarklet with hostname detection; AI Studio scroll-to-top fix
- **v0.1** — Initial release (born from pure frustration)

---

## License

Do whatever you want with it.
