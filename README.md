# bttn

**One bookmarklet. Your full AI conversation on the clipboard as clean Markdown.**  
No extensions. No accounts. No bullshit.

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
| **Claude.ai**     | All human + Claude turns                              |
| **Google AI Studio** | Initial prompt (Monaco) + all turns (thoughts stripped) |
| **ChatGPT**       | All human + assistant turns (o1 reasoning stripped)   |
| **Grok**          | All human + Grok turns (thinking blocks stripped)     |
| **Any other site** | Best-effort: common message selectors, falls back to full page text |

Platform is detected automatically. No configuration needed.

---

## The Bookmarklet (paste this as the URL)
```

javascript:(async()=>{const SEP="\n\n---\n\n";const h=location.hostname;let out="";function nodeToMd(el){let t="";el.childNodes.forEach(n=>{if(n.nodeType===3){t+=n.textContent;return;}if(n.nodeType!==1)return;const tag=n.tagName;if(n.closest('[data-testid="thought-block"],.thoughts-container,.model-thoughts,.thinking-container,.o1-thinking,[class*="thought"]'))return;if(tag==="BR"){t+="\n";return;}if(tag==="A"){t+=" "+nodeToMd(n).trim()+" ";return;}if(tag==="PRE"){const code=n.querySelector("code");const lang=(code?.className||"").match(/language-(\w+)/)?.[1]||"";t+="\n```"+lang+"\n"+(code||n).innerText.trim()+"\n```\n";return;}if(tag==="CODE"&&n.parentElement?.tagName!=="PRE"){t+="`"+n.innerText+"`";return;}if(tag==="STRONG"||tag==="B"){t+="**"+nodeToMd(n)+"**";return;}if(tag==="EM"||tag==="I"){t+="*"+nodeToMd(n)+"*";return;}if(["H1","H2","H3","H4"].includes(tag)){const lvl="#".repeat(parseInt(tag[1]));t+="\n"+lvl+" "+nodeToMd(n).trim()+"\n";return;}if(tag==="LI"){t+="\n- "+nodeToMd(n).trim();return;}if(tag==="UL"||tag==="OL"){t+="\n"+nodeToMd(n)+"\n";return;}if(["P","DIV","TR","SECTION"].includes(tag)){const inner=nodeToMd(n).trim();if(inner)t+="\n"+inner+"\n";return;}t+=nodeToMd(n);});return t;}function clean(txt){return txt.replace(/\n{3,}/g,"\n\n").replace(/\s{2,}/g," ").trim();}function isGhost(txt){return /^\s*(Human|Model|Assistant|User|Claude|Grok)?\s*\d*:?\d*\s*(AM|PM)?\s*$/i.test(txt.trim());}function extract(el){const cl=el.cloneNode(true);cl.querySelectorAll('.thinking-container,.thoughts-container,.model-thoughts,[class*="thought"],[class*="expand"],.mat-expansion-panel,[data-testid="thought-block"],[data-testid*="thinking"]').forEach(e=>e.remove());return clean(nodeToMd(cl));}const platformHandlers={claude:{match:()=>h.includes("claude.ai"),run:()=>{document.querySelectorAll('[data-test-render-count]').forEach(t=>{const u=t.querySelector('[data-testid="user-message"]');const a=t.querySelector('.font-claude-response,[data-testid="assistant-message"]');if(u){const txt=extract(u);if(txt&&!isGhost(txt))out+="**Human**\n\n"+txt+SEP;}if(a){const txt=extract(a);if(txt&&!isGhost(txt))out+="**Claude**\n\n"+txt+SEP;}});}},aistudio:{match:()=>h.includes("aistudio.google"),run:async()=>{const sc=document.querySelector('[data-autoscroll-container]')||document.documentElement;const sv=sc.scrollTop;sc.scrollTop=0;await new Promise(r=>setTimeout(r,500));const mc=document.querySelector('ms-prompt-editor .view-lines');if(mc){const t=mc.innerText.trim();if(t)out+="**Initial Prompt**\n\n"+t+SEP;}sc.scrollTop=sv;document.querySelectorAll('ms-chat-turn').forEach(t=>{const isUser=!!t.querySelector('.user-prompt-container');const tc=t.querySelector('.turn-content');if(tc){let txt=extract(tc).replace(/^(Human|Model)\s+\d+:\d+\s*(AM|PM)?\s*\n?/i,'').trim();if(txt&&!isGhost(txt))out+=`**${isUser?'Human':'Model'}**\n\n${txt}${SEP}`;}});}},chatgpt:{match:()=>h.includes("chatgpt.com")||h.includes("chat.openai"),run:()=>{document.querySelectorAll('div[data-message-author-role]').forEach(m=>{const role=m.getAttribute('data-message-author-role');const txt=extract(m);if(txt&&!isGhost(txt))out+=`**${role==='user'?'Human':'Assistant'}**\n\n${txt}${SEP}`;});}},grok:{match:()=>h.includes("grok.com")||h.includes("x.com"),run:()=>{document.querySelectorAll('[data-testid="user-message"],[data-testid="assistant-message"]').forEach(m=>{const isUser=m.getAttribute('data-testid')==='user-message';const txt=extract(m);if(txt&&!isGhost(txt))out+=`**${isUser?'Human':'Grok'}**\n\n${txt}${SEP}`;});}}};let handled=false;for(const[,handler]of Object.entries(platformHandlers)){if(handler.match()){await handler.run();handled=true;break;}}if(!handled){const msgs=document.querySelectorAll('[data-message-author-role],[data-testid*="message"],[data-testid*="turn"],.prose,.markdown,article[role="article"],div[role="article"],.chat-message,.message,.conversation-turn');if(msgs.length>0){msgs.forEach(m=>{const role=m.getAttribute('data-message-author-role')||m.getAttribute('data-testid')||'';const txt=extract(m);if(txt&&!isGhost(txt)){const label=role.includes('user')||role.includes('human')?'Human':(role.includes('assistant')||role.includes('model')||role.includes('claude')||role.includes('grok'))?'Assistant':'Message';out+=`**${label}**\n\n${txt}${SEP}`;}})}else{out=clean(document.body.innerText);}}out=out.replace(/---\s*$/,'').trim();const t=document.title;if(out){await navigator.clipboard.writeText(out);document.title="✓ Copied";}else{document.title="Nothing to copy";}setTimeout(()=>document.title=t,1500);})();
```

---

## Source

```javascript
(async () => {
  const SEP = "\n\n---\n\n";
  const h = location.hostname;
  let out = "";

  function nodeToMd(el) {
    let t = "";
    el.childNodes.forEach(n => {
      if (n.nodeType === 3) { t += n.textContent; return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (n.closest('[data-testid="thought-block"],.thoughts-container,.model-thoughts,.thinking-container,.o1-thinking,[class*="thought"]')) return;
      if (tag === "BR") { t += "\n"; return; }
      if (tag === "A") { t += " " + nodeToMd(n).trim() + " "; return; }
      if (tag === "PRE") {
        const code = n.querySelector("code");
        const lang = (code?.className || "").match(/language-(\w+)/)?.[1] || "";
        t += "\n```" + lang + "\n" + (code || n).innerText.trim() + "\n```\n";
        return;
      }
      if (tag === "CODE" && n.parentElement?.tagName !== "PRE") { t += "`" + n.innerText + "`"; return; }
      if (tag === "STRONG" || tag === "B") { t += "**" + nodeToMd(n) + "**"; return; }
      if (tag === "EM" || tag === "I") { t += "*" + nodeToMd(n) + "*"; return; }
      if (["H1", "H2", "H3", "H4"].includes(tag)) {
        const lvl = "#".repeat(parseInt(tag[1]));
        t += "\n" + lvl + " " + nodeToMd(n).trim() + "\n";
        return;
      }
      if (tag === "LI") { t += "\n- " + nodeToMd(n).trim(); return; }
      if (tag === "UL" || tag === "OL") { t += "\n" + nodeToMd(n) + "\n"; return; }
      if (["P", "DIV", "TR", "SECTION"].includes(tag)) {
        const inner = nodeToMd(n).trim();
        if (inner) t += "\n" + inner + "\n";
        return;
      }
      t += nodeToMd(n);
    });
    return t;
  }

  function clean(txt) {
    return txt.replace(/\n{3,}/g, "\n\n").replace(/\s{2,}/g, " ").trim();
  }

  function isGhost(txt) {
    return /^\s*(Human|Model|Assistant|User|Claude|Grok)?\s*\d*:?\d*\s*(AM|PM)?\s*$/i.test(txt.trim());
  }

  function extract(el) {
    const cl = el.cloneNode(true);
    cl.querySelectorAll('.thinking-container,.thoughts-container,.model-thoughts,[class*="thought"],[class*="expand"],.mat-expansion-panel,[data-testid="thought-block"],[data-testid*="thinking"]')
      .forEach(e => e.remove());
    return clean(nodeToMd(cl));
  }

  const platformHandlers = {
    claude: {
      match: () => h.includes("claude.ai"),
      run: () => {
        document.querySelectorAll('[data-test-render-count]').forEach(t => {
          const u = t.querySelector('[data-testid="user-message"]');
          const a = t.querySelector('.font-claude-response,[data-testid="assistant-message"]');
          if (u) { const txt = extract(u); if (txt && !isGhost(txt)) out += "**Human**\n\n" + txt + SEP; }
          if (a) { const txt = extract(a); if (txt && !isGhost(txt)) out += "**Claude**\n\n" + txt + SEP; }
        });
      }
    },
    aistudio: {
      match: () => h.includes("aistudio.google"),
      run: async () => {
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
            let txt = extract(tc).replace(/^(Human|Model)\s+\d+:\d+\s*(AM|PM)?\s*\n?/i, '').trim();
            if (txt && !isGhost(txt)) out += `**${isUser ? 'Human' : 'Model'}**\n\n${txt}${SEP}`;
          }
        });
      }
    },
    chatgpt: {
      match: () => h.includes("chatgpt.com") || h.includes("chat.openai"),
      run: () => {
        document.querySelectorAll('div[data-message-author-role]').forEach(m => {
          const role = m.getAttribute('data-message-author-role');
          const txt = extract(m);
          if (txt && !isGhost(txt)) out += `**${role === 'user' ? 'Human' : 'Assistant'}**\n\n${txt}${SEP}`;
        });
      }
    },
    grok: {
      match: () => h.includes("grok.com") || h.includes("x.com"),
      run: () => {
        document.querySelectorAll('[data-testid="user-message"],[data-testid="assistant-message"]').forEach(m => {
          const isUser = m.getAttribute('data-testid') === 'user-message';
          const txt = extract(m);
          if (txt && !isGhost(txt)) out += `**${isUser ? 'Human' : 'Grok'}**\n\n${txt}${SEP}`;
        });
      }
    }
  };

  let handled = false;
  for (const [, handler] of Object.entries(platformHandlers)) {
    if (handler.match()) {
      await handler.run();
      handled = true;
      break;
    }
  }

  if (!handled) {
    const msgs = document.querySelectorAll('[data-message-author-role],[data-testid*="message"],[data-testid*="turn"],.prose,.markdown,article[role="article"],div[role="article"],.chat-message,.message,.conversation-turn');
    if (msgs.length > 0) {
      msgs.forEach(m => {
        const role = m.getAttribute('data-message-author-role') || m.getAttribute('data-testid') || '';
        const txt = extract(m);
        if (txt && !isGhost(txt)) {
          const label = role.includes('user') || role.includes('human') ? 'Human'
            : (role.includes('assistant') || role.includes('model') || role.includes('claude') || role.includes('grok')) ? 'Assistant'
            : 'Message';
          out += `**${label}**\n\n${txt}${SEP}`;
        }
      });
    } else {
      out = clean(document.body.innerText);
    }
  }

  out = out.replace(/---\s*$/, '').trim();
  const t = document.title;
  if (out) {
    await navigator.clipboard.writeText(out);
    document.title = "✓ Copied";
  } else {
    document.title = "Nothing to copy";
  }
  setTimeout(() => document.title = t, 1500);
})();
```

---

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
- **Privacy:** Runs entirely in your browser. Nothing is sent anywhere.
- **Selector drift:** AI platforms change their markup constantly. If it breaks, open an issue.

---

## Changelog

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
