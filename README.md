# bttn

**One bookmarklet. Your AI conversation on your clipboard. No extensions, no accounts, no bullshit.**

Works on Claude.ai, Google AI Studio, and ChatGPT.

---

## The problem

Every AI company is a friction company. You had a conversation. The text is yours. Getting it out cleanly — properly formatted, full transcript, one click — should be trivial. It isn't. So here's the button they refused to build.

---

## Install (10 seconds)

1. Show your bookmarks bar: `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)
2. Create a new bookmark (right-click the bar → Add page)
3. Name it whatever you want — `COPY CHAT`, `bttn`, `⎘`, your call
4. Open the [`bookmarklet`](https://github.com/edgeof8/bttn/blob/main/bookmarklet) file in this repo, copy the entire contents
5. Paste it into the URL field of the bookmark
6. Save

That's it. The bookmark is now a button.

---

## Use

Navigate to any supported AI chat. Click the bookmark. Your full conversation is on your clipboard, structured and clean.

Paste it anywhere — a doc, a note, another AI, whatever you need.

---

## Supported platforms

| Platform | What it captures |
|---|---|
| **Claude.ai** | All human and Claude turns in order |
| **Google AI Studio** | Initial prompt (Monaco editor) + all conversation turns, thoughts stripped |
| **ChatGPT** | All human and assistant turns in order |

The script detects which platform you're on automatically.

---

## Output format

```
=== Human ===
Your message here

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

=== Claude ===
The response here

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Notes

**AI Studio — long chats:** If your conversation is very long, scroll to the top once (`Ctrl+Home`) before clicking. AI Studio uses a virtual renderer that only keeps visible content in the DOM. Scrolling to the top forces it to load the initial prompt.

**No install, no permissions, no server:** The bookmarklet runs entirely in your browser on the page you're already on. Nothing is sent anywhere. It reads the DOM and writes to your clipboard, then stops.

**Selector drift:** AI platforms update their markup. If the bookmarklet stops working, open an issue and I'll fix the selectors.

---

## How it works

Each platform uses a different DOM structure, so the script detects the hostname and uses the appropriate selectors:

- **Claude.ai** — `[data-testid="user-message"]` for human turns, `.font-claude-response` for AI responses
- **AI Studio** — `ms-chat-turn` elements; role detected via presence of `.user-prompt-container`; `.turn-content` for text; thoughts expander nodes are cloned out before extraction; Monaco editor captured via `ms-prompt-editor .view-lines` after programmatic scroll-to-top
- **ChatGPT** — `div[data-message-author-role]` elements; block-level newlines reconstructed from the DOM tree rather than relying on `innerText`

---

## License

Do whatever you want with it.
