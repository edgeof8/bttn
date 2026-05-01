# bttn

**One bookmarklet. Your AI conversation on your clipboard. No extensions, no accounts, no bullshit.**

Works on Claude.ai, Google AI Studio, ChatGPT, and Grok. Output is clean Markdown.

---

## The problem

Every AI company is a friction company. You had a conversation. The text is yours. Getting it out cleanly — properly formatted, full transcript, one click — should be trivial. It isn't. So here's the button they refused to build.

---

## Install (10 seconds)

1. Show your bookmarks bar: `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)
2. Right-click the bar → Add page / Add bookmark
3. Name it whatever — `bttn`, `COPY CHAT`, `⎘`
4. Copy the minified bookmarklet code below
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
| **Grok** | All human and Grok turns, thinking blocks stripped |

Platform is detected automatically from the URL — no configuration needed.

---

## Bookmarklet (minified — paste this as the bookmark URL)

```
javascript:(async()=>{const SEP="\n\n---\n\n";const h=location.hostname;let out="";function nodeToMd(el){let t="";el.childNodes.forEach(n=>{if(n.nodeType===3){t+=n.textContent;return;}if(n.nodeType!==1)return;const tag=n.tagName;if(n.closest('[data-testid="thought-block"],.thoughts-container,.model-thoughts,.thinking-container'))return;if(tag==="BR"){t+="\n";return;}if(tag==="A"){t+=" "+nodeToMd(n).trim()+" ";return;}if(tag==="PRE"){const code=n.querySelector("code");const lang=(code?.className||"").match(/language-(\w+)/)?.[1]||"";t+="\n```"+lang+"\n"+(code||n).innerText.trim()+"\n```\n";return;}if(tag==="CODE"&&n.parentElement?.tagName!=="PRE"){t+="`"+n.innerText+"`";return;}if(tag==="STRONG"||tag==="B"){t+="**"+nodeToMd(n)+"**";return;}if(tag==="EM"||tag==="I"){t+="*"+nodeToMd(n)+"*";return;}if(["H1","H2","H3","H4"].includes(tag)){const lvl="#".repeat(parseInt(tag[1]));t+="\n"+lvl+" "+nodeToMd(n).trim()+"\n";return;}if(tag==="LI"){t+="\n- "+nodeToMd(n).trim();return;}if(tag==="UL"||tag==="OL"){t+="\n"+nodeToMd(n)+"\n";return;}if(["P","DIV","TR"].includes(tag)){const inner=nodeToMd(n).trim();if(inner)t+="\n"+inner+"\n";return;}t+=nodeToMd(n);});return t;}function clean(txt){return txt.replace(/\n{3,}/g,"\n\n").replace(/\s{2,}/g," ").trim();}function isGhost(txt){return /^\s*(Human|Model|Assistant|User)?\s*\d*:?\d*\s*(AM|PM)?\s*$/.test(txt.trim());}function extract(el){const cl=el.cloneNode(true);cl.querySelectorAll('.thinking-container,.thoughts-container,.model-thoughts,[class*="thought"],[class*="expand"],.mat-expansion-panel,[data-testid="thought-block"]').forEach(e=>e.remove());return clean(nodeToMd(cl));}if(h.includes("claude.ai")){document.querySelectorAll('[data-test-render-count]').forEach(t=>{const u=t.querySelector('[data-testid="user-message"]');const a=t.querySelector('.font-claude-response');if(u){const txt=extract(u);if(txt&&!isGhost(txt))out+="**Human**\n\n"+txt+SEP;}if(a){const txt=extract(a);if(txt&&!isGhost(txt))out+="**Claude**\n\n"+txt+SEP;}});}else if(h.includes("aistudio.google")){const sc=document.querySelector('[data-autoscroll-container]')||document.documentElement;const sv=sc.scrollTop;sc.scrollTop=0;await new Promise(r=>setTimeout(r,500));const mc=document.querySelector('ms-prompt-editor .view-lines');if(mc){const t=mc.innerText.trim();if(t)out+="**Initial Prompt**\n\n"+t+SEP;}sc.scrollTop=sv;document.querySelectorAll('ms-chat-turn').forEach(t=>{const isUser=!!t.querySelector('.user-prompt-container');const tc=t.querySelector('.turn-content');if(tc){const txt=extract(tc).replace(/^(Human|Model)\s+\d+:\d+\s*(AM|PM)?\s*\n?/,'').trim();if(txt&&!isGhost(txt))out+=`**${isUser?'Human':'Model'}**\n\n${txt}${SEP}`;}});}else if(h.includes("chatgpt.com")||h.includes("chat.openai")){document.querySelectorAll('div[data-message-author-role]').forEach(m=>{const role=m.getAttribute('data-message-author-role');const txt=extract(m);if(txt&&!isGhost(txt))out+=`**${role==='user'?'Human':'Assistant'}**\n\n${txt}${SEP}`;});}else if(h.includes("grok.com")||h.includes("x.com")){document.querySelectorAll('[data-testid="user-message"],[data-testid="assistant-message"]').forEach(m=>{const isUser=m.getAttribute('data-testid')==='user-message';const txt=extract(m);if(txt&&!isGhost(txt))out+=`**${isUser?'Human':'Grok'}**\n\n${txt}${SEP}`;});}out=out.replace(/---\s*$/,'').trim();if(out){await navigator.clipboard.writeText(out);const t=document.title;document.title="✓ Copied";setTimeout(()=>document.title=t,1500);}})();
```

---

## Full source (readable)

```javascript
javascript:(async () => {

  const SEP = "\n\n---\n\n";
  const h = location.hostname;
  let out = "";

  // HTML → Markdown converter
  function nodeToMd(el) {
    let t = "";
    el.childNodes.forEach(n => {
      if (n.nodeType === 3) { t += n.textContent; return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;

      // skip thought/reasoning blocks universally
      if (n.closest('[data-testid="thought-block"],.thoughts-container,.model-thoughts,.thinking-container')) return;

      if (tag === "BR")     { t += "\n"; return; }
      if (tag === "A")      { t += " " + nodeToMd(n).trim() + " "; return; }

      if (tag === "PRE") {
        const code = n.querySelector("code");
        const lang = (code?.className || "").match(/language-(\w+)/)?.[1] || "";
        t += "\n```" + lang + "\n" + (code || n).innerText.trim() + "\n```\n";
        return;
      }

      if (tag === "CODE" && n.parentElement?.tagName !== "PRE") {
        t += "`" + n.innerText + "`"; return;
      }

      if (tag === "STRONG" || tag === "B") { t += "**" + nodeToMd(n) + "**"; return; }
      if (tag === "EM"     || tag === "I") { t += "*"  + nodeToMd(n) + "*";  return; }

      if (["H1","H2","H3","H4"].includes(tag)) {
        const lvl = "#".repeat(parseInt(tag[1]));
        t += "\n" + lvl + " " + nodeToMd(n).trim() + "\n"; return;
      }

      if (tag === "LI") { t += "\n- " + nodeToMd(n).trim(); return; }
      if (tag === "UL" || tag === "OL") { t += "\n" + nodeToMd(n) + "\n"; return; }

      if (["P","DIV","TR"].includes(tag)) {
        const inner = nodeToMd(n).trim();
        if (inner) t += "\n" + inner + "\n";
        return;
      }

      t += nodeToMd(n);
    });
    return t;
  }

  // collapse excess whitespace
  function clean(txt) {
    return txt.replace(/\n{3,}/g, "\n\n").replace(/\s{2,}/g, " ").trim();
  }

  // filter out ghost turns that are just a timestamp with no content
  function isGhost(txt) {
    return /^\s*(Human|Model|Assistant|User)?\s*\d*:?\d*\s*(AM|PM)?\s*$/.test(txt.trim());
  }

  // clone element, strip thought blocks, convert to markdown
  function extract(el) {
    const cl = el.cloneNode(true);
    cl.querySelectorAll(
      '.thinking-container,.thoughts-container,.model-thoughts,[class*="thought"],[class*="expand"],.mat-expansion-panel,[data-testid="thought-block"]'
    ).forEach(e => e.remove());
    return clean(nodeToMd(cl));
  }

  // ── CLAUDE.AI ──────────────────────────────────────────────────────────────
  if (h.includes("claude.ai")) {
    document.querySelectorAll('[data-test-render-count]').forEach(t => {
      const u = t.querySelector('[data-testid="user-message"]');
      const a = t.querySelector('.font-claude-response');
      if (u) { const txt = extract(u); if (txt && !isGhost(txt)) out += "**Human**\n\n" + txt + SEP; }
      if (a) { const txt = extract(a); if (txt && !isGhost(txt)) out += "**Claude**\n\n" + txt + SEP; }
    });
  }

  // ── GOOGLE AI STUDIO ───────────────────────────────────────────────────────
  else if (h.includes("aistudio.google")) {
    // scroll to top so Monaco renders the initial prompt, then restore position
    const sc = document.querySelector('[data-autoscroll-container]') || document.documentElement;
    const sv = sc.scrollTop;
    sc.scrollTop = 0;
    await new Promise(r => setTimeout(r, 500));

    const mc = document.querySelector('ms-prompt-editor .view-lines');
    if (mc) { const t = mc.innerText.trim(); if (t) out += "**Initial Prompt**\n\n" + t + SEP; }
    sc.scrollTop = sv;

    document.querySelectorAll('ms-chat-turn').forEach(t => {
      const isUser = !!t.querySelector('.user-prompt-container');
      const tc = t.querySelector('.turn-content');
      if (tc) {
        const txt = extract(tc).replace(/^(Human|Model)\s+\d+:\d+\s*(AM|PM)?\s*\n?/, '').trim();
        if (txt && !isGhost(txt)) out += `**${isUser ? 'Human' : 'Model'}**\n\n${txt}${SEP}`;
      }
    });
  }

  // ── CHATGPT ────────────────────────────────────────────────────────────────
  else if (h.includes("chatgpt.com") || h.includes("chat.openai")) {
    document.querySelectorAll('div[data-message-author-role]').forEach(m => {
      const role = m.getAttribute('data-message-author-role');
      const txt = extract(m);
      if (txt && !isGhost(txt)) out += `**${role === 'user' ? 'Human' : 'Assistant'}**\n\n${txt}${SEP}`;
    });
  }

  // ── GROK ───────────────────────────────────────────────────────────────────
  else if (h.includes("grok.com") || h.includes("x.com")) {
    document.querySelectorAll('[data-testid="user-message"],[data-testid="assistant-message"]').forEach(m => {
      const isUser = m.getAttribute('data-testid') === 'user-message';
      const txt = extract(m);
      if (txt && !isGhost(txt)) out += `**${isUser ? 'Human' : 'Grok'}**\n\n${txt}${SEP}`;
    });
  }

  // ── COPY ───────────────────────────────────────────────────────────────────
  out = out.replace(/---\s*$/, '').trim();
  if (out) {
    await navigator.clipboard.writeText(out);
    const t = document.title;
    document.title = "✓ Copied";
    setTimeout(() => document.title = t, 1500);
  }

})();
```

---

## Output format

Valid Markdown, ready to paste into Obsidian, Notion, VS Code, or anywhere else.

```markdown
**Human**

Your message here

---

**Claude**

The response here, with **bold**, `inline code`, and

```python
# code blocks preserved with language tags
```

---
```

Headers, lists, bold, italic, inline code, and fenced code blocks are all reconstructed from the page HTML. Thought/reasoning blocks are stripped on all platforms.

---

## Notes

**AI Studio — long chats:** Scroll to the top once (`Ctrl+Home`) before clicking. AI Studio uses a virtual renderer that only keeps visible content in the DOM. Scrolling to the top forces it to render the initial prompt.

**Feedback:** The browser tab title flashes `✓ Copied` for 1.5 seconds on success. No alert box.

**No install, no permissions, no server:** The bookmarklet runs entirely in your browser on the page you're already on. Nothing is sent anywhere. It reads the DOM, writes to your clipboard, and stops.

**Selector drift:** AI platforms update their markup regularly. If the bookmarklet stops working, open an issue.

---

## Changelog

**v0.5** — Grok support (`grok.com` / `x.com`); `.thinking-container` stripped; shared `extract()` function across all platforms

**v0.4** — `<a>` tag fix (link text no longer collapses into surrounding words); ghost timestamp-only turns filtered more aggressively

**v0.3** — Full Markdown output engine (`nodeToMd`); language-aware fenced code blocks; bold, italic, headers, lists preserved; ChatGPT o1 thought blocks stripped; tab title flash replaces alert

**v0.2** — Single universal bookmarklet with hostname detection; AI Studio scroll-to-top fix for Monaco virtualization; thoughts expander stripped

**v0.1** — Initial release

---

## License

Do whatever you want with it.
