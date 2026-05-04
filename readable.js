/**
 * bttn — readable source
 * https://github.com/edgeof8/bttn
 *
 * Copies your full AI conversation to the clipboard as clean Markdown.
 * Runs as a browser bookmarklet — no extension, no accounts, no network calls.
 *
 * Supported: Claude.ai · ChatGPT · Google AI Studio · Grok
 * Fallback: best-effort on any other chatbot site
 */

(async () => {
  const SEP = "\n\n---\n\n";         // separator between conversation turns
  const h = location.hostname;
  let out = "";
  let seen = new Set();              // dedup guard: prevents double-copies from virtualized lists

  // Walks the DOM tree and returns Markdown-formatted text.
  // Handles: links, fenced code blocks (with language tag), inline code, bold, italic,
  //          headers, lists, tables, and generic block elements.
  // Skips: thought/thinking blocks — reasoning is stripped before export on all platforms.
  function nodeToMd(el) {
    let t = "";
    el.childNodes.forEach(n => {
      if (n.nodeType === 3) { t += n.textContent; return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;

      // Skip reasoning/thinking blocks
      if (n.closest('[data-testid="thought-block"],.thoughts-container,.model-thoughts,.thinking-container,.o1-thinking,[class*="thought"]')) return;

      if (tag === "BR") { t += "\n"; return; }
      if (tag === "A") { t += `[${nodeToMd(n).trim()}](${n.href}) `; return; }
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
      if (tag === "TABLE") {
        Array.from(n.querySelectorAll('tr')).forEach(row => {
          const cells = Array.from(row.querySelectorAll('th, td'))
            .map(c => nodeToMd(c).trim().replace(/\|/g, '\\|'));
          if (!cells.length) return;
          t += `\n| ${cells.join(' | ')} |`;
          if (row.querySelectorAll('th').length > 0)
            t += `\n| ${cells.map(() => '---').join(' | ')} |`;
        });
        t += '\n';
        return;
      }
      if (["P", "DIV", "SECTION"].includes(tag)) {
        const inner = nodeToMd(n).trim();
        if (inner) t += "\n" + inner + "\n";
        return;
      }
      t += nodeToMd(n);
    });
    return t;
  }

  // Collapses excess whitespace while preserving intentional line breaks
  function clean(txt) {
    return txt.replace(/\n{3,}/g, "\n\n").replace(/[^\S\n]{2,}/g, " ").trim();
  }

  // Detects "ghost" turns — DOM elements that render only a speaker label or
  // a timestamp (e.g. "Claude 12:34 PM"), which some platforms emit as separate nodes.
  function isGhost(txt) {
    return /^\s*(Human|Model|Assistant|User|Claude|Grok)?\s*\d*:?\d*\s*(AM|PM)?\s*$/i.test(txt.trim());
  }

  // Clones a turn element, strips noise (thoughts, expand buttons, UI buttons),
  // converts to Markdown, and deduplicates against previously seen turns.
  function extract(el) {
    const cl = el.cloneNode(true);   // clone so we can mutate without touching the live DOM
    cl.querySelectorAll('.thinking-container,.thoughts-container,.model-thoughts,[class*="thought"],[class*="expand"],.mat-expansion-panel,[data-testid="thought-block"],[data-testid*="thinking"],button')
      .forEach(e => e.remove());
    const txt = clean(nodeToMd(cl));
    if (seen.has(txt)) return "";    // skip duplicates (React virtual list double-renders)
    seen.add(txt);
    return txt;
  }

  // Per-platform extraction logic. Add a new entry here to support a new site.
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
        // Grab any open Artifact from the sidebar
        const art = document.querySelector('[data-testid="artifact-content"] code,[class*="artifact"] pre code');
        if (art) out += `\n\n### Artifact\n\n\`\`\`\n${art.innerText.trim()}\n\`\`\`\n`;
      }
    },
    aistudio: {
      match: () => h.includes("aistudio.google"),
      run: async () => {
        // AI Studio uses virtual rendering: scroll to top to force the initial prompt into the DOM
        const sc = document.querySelector('[data-autoscroll-container]') || document.documentElement;
        const sv = sc.scrollTop;
        sc.scrollTop = 0;
        await new Promise(r => setTimeout(r, 500));
        const mc = document.querySelector('ms-prompt-editor .view-lines');
        if (mc) { const t = mc.innerText.trim(); if (t) out += "**Initial Prompt**\n\n" + t + SEP; }
        sc.scrollTop = sv;   // restore scroll position
        document.querySelectorAll('ms-chat-turn').forEach(t => {
          const isUser = !!t.querySelector('.user-prompt-container');
          const tc = t.querySelector('.turn-content');
          if (tc) {
            let txt = extract(tc).replace(/^(Human|Model|User)\s+\d+:\d+\s*(AM|PM)?\s*\n?/i, '').trim();
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

  // Try each platform handler; fall through to generic if none match
  let handled = false;
  for (const [, handler] of Object.entries(platformHandlers)) {
    if (handler.match()) {
      await handler.run();
      handled = true;
      break;
    }
  }

  if (!handled) {
    // Generic fallback: try common chatbot message selectors, then full page text
    const msgs = document.querySelectorAll('[data-message-author-role],[data-testid*="message"],[data-testid*="turn"],.prose,.markdown,article[role="article"],div[role="article"],.chat-message,.message,.conversation-turn,[class*="message-content"]');
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
