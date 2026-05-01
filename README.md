# bttn

**One bookmarklet. Your AI conversation on your clipboard. No extensions, no accounts, no bullshit.**

Works on Claude.ai, Google AI Studio, and ChatGPT. Output is clean Markdown.

---

## The problem

Every AI company is a friction company. You had a conversation. The text is yours. Getting it out cleanly — properly formatted, full transcript, one click — should be trivial. It isn't. So here's the button they refused to build.

---

## Install (10 seconds)

1. Show your bookmarks bar: `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)
2. Right-click the bar → Add page / Add bookmark
3. Name it whatever — `bttn`, `COPY CHAT`, `⎘`
4. Open the [`bookmarklet`](https://github.com/edgeof8/bttn/blob/main/bookmarklet) file, copy the entire contents
5. Paste it into the URL field of the bookmark
6. Save

The bookmark is now a button. Click it on any supported page and your full conversation is on your clipboard.

---

## Supported platforms

| Platform | What it captures |
|---|---|
| **Claude.ai** | All human and Claude turns in order |
| **Google AI Studio** | Initial prompt (Monaco editor) + all conversation turns, model thoughts stripped |
| **ChatGPT** | All human and assistant turns, o1 reasoning blocks stripped |

Platform is detected automatically from the URL — no configuration needed.

---

## Output format

Valid Markdown, ready to paste into Obsidian, Notion, VS Code, or anywhere else.

```markdown
**Human**

Your message here

---

**Claude**

The response here, with **bold**, `code`, and

```python
# code blocks preserved with language tags
```

---
```

Headers, lists, bold, italic, inline code, and fenced code blocks are all reconstructed from the page HTML.

---

## Notes

**AI Studio — long chats:** Scroll to the top once (`Ctrl+Home`) before clicking. AI Studio uses a virtual renderer that only keeps visible content in the DOM. Scrolling to the top forces it to render the initial prompt.

**Feedback:** The browser tab title flashes `✓ Copied` for 1.5 seconds on success. No alert box.

**No install, no permissions, no server:** The bookmarklet runs entirely in your browser on the page you're already on. Nothing is sent anywhere. It reads the DOM, writes to your clipboard, and stops.

**Selector drift:** AI platforms update their markup regularly. If the bookmarklet stops working, open an issue and the selectors will be fixed.

---

## How it works

Each platform uses a different DOM structure. The script detects the hostname and routes to the appropriate parser:

**Claude.ai** — `[data-testid="user-message"]` for human turns, `.font-claude-response` for AI responses, iterated via `[data-test-render-count]` turn wrappers.

**Google AI Studio** — `ms-chat-turn` elements; role detected by presence of `.user-prompt-container`; text extracted from `.turn-content` after cloning and removing thoughts expander nodes; Monaco editor initial prompt captured via `ms-prompt-editor .view-lines` after a programmatic scroll-to-top with a 500ms render wait.

**ChatGPT** — `div[data-message-author-role]` elements; `[data-testid="thought-block"]` nodes removed before extraction; block-level newlines reconstructed by walking the DOM tree rather than relying on `innerText`.

All platforms share the same `nodeToMd()` HTML-to-Markdown converter, handling `<pre>`, `<code>`, `<strong>`, `<em>`, `<a>`, `<h1>`–`<h4>`, `<ul>`, `<ol>`, `<li>`, `<p>`, `<div>`, and `<br>`.

---

## Changelog

**v0.4** — `<a>` tag fix (link text no longer collapses into surrounding words); ghost timestamp-only turns filtered more aggressively

**v0.3** — Full Markdown output engine (`nodeToMd`); language-aware fenced code blocks; bold, italic, headers, lists preserved; ChatGPT o1 thought blocks stripped; tab title flash replaces alert

**v0.2** — Single universal bookmarklet with hostname detection; AI Studio scroll-to-top fix for Monaco virtualization; thoughts expander stripped

**v0.1** — Initial release

---

## License

Do whatever you want with it.
