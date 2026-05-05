(function() {
  const scripts = Array.from(document.querySelectorAll("script[data-kontaktio]"));
  if (!scripts.length) return;
  if (window.__KontaktioBooted) return;
  window.__KontaktioBooted = true;
  const safeJsonParse = (s, fallback) => {
    try {
      return JSON.parse(s);
    } catch {
      return fallback;
    }
  };
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v; else if (k === "style") node.setAttribute("style", v); else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v); else if (v !== null && v !== undefined) node.setAttribute(k, String(v));
    });
    children.forEach(c => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  };
  const ensureStyles = () => {
    if (document.getElementById("kontaktio-styles")) return;
    const style = document.createElement("style");
    style.id = "kontaktio-styles";
    style.innerHTML = `
      .kontaktio-launcher {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        z-index: 2147483000;
        box-shadow: 0 14px 40px rgba(139, 94, 60, 0.32), 0 4px 12px rgba(44, 31, 26, 0.18);
        transform: translateZ(0);
        transition: transform .25s cubic-bezier(.2,.7,.2,1), box-shadow .25s cubic-bezier(.2,.7,.2,1);
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .kontaktio-launcher:hover {
        transform: translateY(-3px) scale(1.04);
        box-shadow: 0 22px 60px rgba(139, 94, 60, 0.42), 0 6px 16px rgba(44, 31, 26, 0.22);
      }
      .kontaktio-launcher::after {
        content: "";
        position: absolute;
        inset: -6px;
        border-radius: 999px;
        border: 2px solid currentColor;
        opacity: 0;
        animation: kontaktioPing 2.6s cubic-bezier(.2,.7,.2,1) infinite;
        pointer-events: none;
      }
      @keyframes kontaktioPing {
        0%   { transform: scale(0.95); opacity: 0.55; }
        70%  { transform: scale(1.35); opacity: 0; }
        100% { transform: scale(1.35); opacity: 0; }
      }

      .kontaktio-widget {
        position: fixed;
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 2147483000;
        width: 380px;
        max-width: calc(100vw - 24px);
        max-height: min(640px, calc(100vh - 120px));
        box-shadow: 0 28px 80px rgba(44, 31, 26, 0.28), 0 8px 24px rgba(139, 94, 60, 0.18);
        transform: translateZ(0);
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        border: 1px solid rgba(201, 165, 123, 0.22);
      }

      .kontaktio-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 18px;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: .04em;
        text-transform: uppercase;
        background-image: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%);
      }

      .kontaktio-header-sub {
        margin-top: 4px;
        font-weight: 400;
        font-size: 12px;
        opacity: .82;
        text-transform: none;
        letter-spacing: 0;
      }

      .kontaktio-close {
        border: none;
        background: transparent;
        font-size: 22px;
        cursor: pointer;
        padding: 6px 10px;
        line-height: 1;
        opacity: .85;
        border-radius: 50%;
        transition: opacity .2s, background .2s;
      }
      .kontaktio-close:hover { opacity: 1; background: rgba(255,255,255,0.12); }

      .kontaktio-messages {
        flex: 1;
        overflow-y: auto;
        padding: 18px 16px 8px;
        scrollbar-width: thin;
        scrollbar-color: rgba(139,94,60,0.3) transparent;
      }
      .kontaktio-messages::-webkit-scrollbar { width: 6px; }
      .kontaktio-messages::-webkit-scrollbar-thumb { background: rgba(139,94,60,0.3); border-radius: 999px; }

      .kontaktio-row {
        display: flex;
        margin: 8px 0;
        animation: kontaktioFadeUp .35s cubic-bezier(.2,.7,.2,1) both;
      }
      @keyframes kontaktioFadeUp {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .kontaktio-row.user { justify-content: flex-end; }
      .kontaktio-row.bot  { justify-content: flex-start; }

      .kontaktio-bubble {
        max-width: 82%;
        padding: 11px 14px;
        white-space: pre-wrap;
        line-height: 1.45;
        font-size: 14px;
        box-shadow: 0 4px 14px rgba(44, 31, 26, 0.06);
      }

      .kontaktio-quick {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 4px 16px 14px;
      }

      .kontaktio-quick button {
        cursor: pointer;
        border: 1px solid rgba(201, 165, 123, 0.45);
        background: #FFFCF7;
        color: #2C1F1A;
        padding: 9px 14px;
        font-size: 12.5px;
        font-weight: 500;
        border-radius: 999px;
        line-height: 1.15;
        transition: background .2s, border-color .2s, transform .2s;
      }
      .kontaktio-quick button:hover {
        background: #F0E8DD;
        border-color: rgba(201, 165, 123, 0.85);
        transform: translateY(-1px);
      }

      .kontaktio-inputwrap {
        display: flex;
        gap: 8px;
        padding: 12px 14px calc(14px + env(safe-area-inset-bottom, 0px));
        border-top: 1px solid rgba(201, 165, 123, 0.22);
      }

      .kontaktio-input {
        flex: 1;
        border: 1px solid rgba(201, 165, 123, 0.4);
        border-radius: 999px;
        padding: 11px 16px;
        font-size: 14px;
        outline: none;
        font-family: inherit;
        transition: border-color .2s, box-shadow .2s;
      }
      .kontaktio-input:focus {
        border-color: rgba(139, 94, 60, 0.55);
        box-shadow: 0 0 0 3px rgba(201, 165, 123, 0.18);
      }

      .kontaktio-send {
        border: none;
        border-radius: 999px;
        padding: 10px 18px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13.5px;
        letter-spacing: .02em;
        font-family: inherit;
        transition: transform .2s, filter .2s;
      }
      .kontaktio-send:hover { transform: translateY(-1px); filter: brightness(1.05); }

      .kontaktio-muted {
        opacity: .75;
        font-size: 12px;
        padding: 10px 16px 0;
      }

      @media (max-width: 480px) {
        .kontaktio-widget {
          width: calc(100vw - 16px);
          max-height: min(78vh, calc(100vh - 90px));
        }
        .kontaktio-launcher { width: 56px !important; height: 56px !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        .kontaktio-launcher::after { animation: none; }
        .kontaktio-row { animation: none; }
      }
    `;
    document.head.appendChild(style);
  };
  const normalizeClient = cfg => {
    const company = cfg.company || {};
    const theme = cfg.theme || {};
    return {
      id: cfg.id,
      status: cfg.status || "active",
      statusMessage: cfg.statusMessage || cfg.status_message || "",
      company: {
        name: company.name || "Asystent",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        hours: company.hours || ""
      },
      theme: {
        headerBg: theme.headerBg || theme.buttonBg || "#2C1F1A",
        headerText: theme.headerText || "#FAF7F2",
        widgetBg: theme.widgetBg || "#FAF7F2",
        inputBg: theme.inputBg || "#FFFFFF",
        inputText: theme.inputText || "#2C1F1A",
        buttonBg: theme.buttonBg || "#C9A57B",
        buttonText: theme.buttonText || "#FFFFFF",
        botBubbleBg: theme.botBubbleBg || "#F0E8DD",
        botBubbleText: theme.botBubbleText || "#2C1F1A",
        userBubbleBg: theme.userBubbleBg || theme.buttonBg || "#C9A57B",
        userBubbleText: theme.userBubbleText || "#FFFFFF",
        radius: Number(theme.radius ?? 18),
        position: theme.position === "left" ? "left" : "right"
      },
      launcher_icon: cfg.launcher_icon || "💬",
      welcome_message: cfg.welcome_message || "",
      welcome_hint: cfg.welcome_hint || "",
      quick_replies: Array.isArray(cfg.quick_replies) ? cfg.quick_replies : [],
      auto_open_enabled: !!cfg.auto_open_enabled,
      auto_open_delay: Number(cfg.auto_open_delay ?? 15e3)
    };
  };
  const buildKeys = clientId => ({
    history: `kontaktio-history-${clientId}`,
    session: `kontaktio-session-${clientId}`,
    open: `kontaktio-open-${clientId}`,
    autoOpened: `kontaktio-autoopened-${clientId}`
  });
  ensureStyles();
  scripts.forEach((script, idx) => {
    const CLIENT_ID = script.getAttribute("data-client") || "demo";
    const BACKEND = script.getAttribute("data-backend") || "";
    const baseUrl = BACKEND.replace(/\/+$/, "");
    if (!baseUrl) {
      console.error("[Kontaktio] Missing data-backend on script tag");
      return;
    }
    const keys = buildKeys(CLIENT_ID);
    let cfg = null;
    let isOpen = false;
    let isSending = false;
    const loadSessionId = () => {
      try {
        return localStorage.getItem(keys.session);
      } catch {
        return null;
      }
    };
    const saveSessionId = sid => {
      try {
        localStorage.setItem(keys.session, sid);
      } catch {}
    };
    const loadOpenState = () => {
      try {
        return localStorage.getItem(keys.open) === "1";
      } catch {
        return false;
      }
    };
    const saveOpenState = open => {
      try {
        localStorage.setItem(keys.open, open ? "1" : "0");
      } catch {}
    };
    const loadHistory = () => {
      try {
        return safeJsonParse(localStorage.getItem(keys.history) || "[]", []);
      } catch {
        return [];
      }
    };
    const saveHistory = arr => {
      try {
        localStorage.setItem(keys.history, JSON.stringify(arr || []));
      } catch {}
    };
    const markAutoOpened = () => {
      try {
        localStorage.setItem(keys.autoOpened, "1");
      } catch {}
    };
    const wasAutoOpened = () => {
      try {
        return localStorage.getItem(keys.autoOpened) === "1";
      } catch {
        return false;
      }
    };
    const fetchConfig = async () => {
      const res = await fetch(`${baseUrl}/config/${encodeURIComponent(CLIENT_ID)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Config error ${res.status}: ${txt}`);
      }
      const data = await res.json();
      return normalizeClient(data);
    };
    const rootId = `kontaktio-root-${CLIENT_ID}-${idx}`;
    const launcherId = `kontaktio-launcher-${CLIENT_ID}-${idx}`;
    const widgetId = `kontaktio-widget-${CLIENT_ID}-${idx}`;
    const messagesId = `kontaktio-messages-${CLIENT_ID}-${idx}`;
    const inputId = `kontaktio-input-${CLIENT_ID}-${idx}`;
    const quickId = `kontaktio-quick-${CLIENT_ID}-${idx}`;
    const mutedId = `kontaktio-muted-${CLIENT_ID}-${idx}`;
    const getPos = () => {
      const offsetX = 20;
      const offsetY = 20;
      const pos = cfg?.theme?.position === "left" ? "left" : "right";
      return {
        pos: pos,
        offsetX: offsetX,
        offsetY: offsetY
      };
    };
    const scrollToBottom = () => {
      const wrap = document.getElementById(messagesId);
      if (!wrap) return;
      wrap.scrollTop = wrap.scrollHeight;
    };
    const pushMessage = (role, text, save = true) => {
      const wrap = document.getElementById(messagesId);
      if (!wrap) return;
      const row = el("div", {
        class: `kontaktio-row ${role}`
      }, [ el("div", {
        class: "kontaktio-bubble"
      }, [ String(text || "") ]) ]);
      const bubble = row.querySelector(".kontaktio-bubble");
      const r = Math.max(10, Number(cfg.theme.radius || 18));
      bubble.style.borderRadius = `${r}px`;
      bubble.style.background = role === "user" ? cfg.theme.userBubbleBg : cfg.theme.botBubbleBg;
      bubble.style.color = role === "user" ? cfg.theme.userBubbleText : cfg.theme.botBubbleText;
      wrap.appendChild(row);
      scrollToBottom();
      if (save) {
        const history = loadHistory();
        history.push({
          role: role,
          text: String(text || ""),
          ts: Date.now()
        });
        saveHistory(history);
      }
    };
    const setMuted = text => {
      const m = document.getElementById(mutedId);
      if (!m) return;
      m.textContent = text || "";
      m.style.display = text ? "block" : "none";
    };
    const renderQuickReplies = () => {
      const wrap = document.getElementById(quickId);
      if (!wrap) return;
      wrap.innerHTML = "";
      const items = (cfg.quick_replies || []).filter(Boolean).slice(0, 8);
      items.forEach(q => {
        const btn = el("button", {}, [ String(q) ]);
        btn.addEventListener("click", () => {
          const input = document.getElementById(inputId);
          if (input) input.value = String(q);
          sendMessage(String(q));
        });
        wrap.appendChild(btn);
      });
      wrap.style.display = items.length ? "flex" : "none";
    };
    const openWidget = () => {
      isOpen = true;
      saveOpenState(true);
      const widget = document.getElementById(widgetId);
      if (widget) widget.style.display = "flex";
      scrollToBottom();
      const input = document.getElementById(inputId);
      if (input) input.focus();
    };
    const closeWidget = () => {
      isOpen = false;
      saveOpenState(false);
      const widget = document.getElementById(widgetId);
      if (widget) widget.style.display = "none";
    };
    const toggleWidget = () => {
      if (isOpen) closeWidget(); else openWidget();
    };
    const sendMessage = async text => {
      const msg = String(text || "").trim();
      if (!msg) return;
      if (isSending) return;
      isSending = true;
      setMuted("");
      const input = document.getElementById(inputId);
      if (input) input.value = "";
      pushMessage("user", msg);
      const payload = {
        clientId: CLIENT_ID,
        message: msg,
        sessionId: loadSessionId()
      };
      try {
        const res = await fetch(`${baseUrl}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errMsg = data?.statusMessage || data?.error || "Wystąpił błąd. Spróbuj ponownie za chwilę.";
          pushMessage("bot", errMsg);
          return;
        }
        if (data.sessionId) saveSessionId(data.sessionId);
        const reply = data.reply || "-";
        pushMessage("bot", reply);
      } catch (e) {
        pushMessage("bot", "Brak połączenia. Spróbuj ponownie za chwilę.");
      } finally {
        isSending = false;
      }
    };
    const mount = async () => {
      const root = el("div", {
        id: rootId
      });
      document.body.appendChild(root);
      try {
        cfg = await fetchConfig();
      } catch (e) {
        console.error("[Kontaktio] Config load failed:", e);
        cfg = normalizeClient({
          id: CLIENT_ID,
          status: "unactive",
          statusMessage: "Asystent jest obecnie niedostępny.",
          company: {
            name: "Asystent"
          },
          theme: {}
        });
      }
      const {pos: pos, offsetX: offsetX, offsetY: offsetY} = getPos();
      const launcher = el("div", {
        id: launcherId,
        class: "kontaktio-launcher"
      }, [ el("div", {}, [ cfg.launcher_icon || "💬" ]) ]);
      launcher.style.width = "56px";
      launcher.style.height = "56px";
      launcher.style.borderRadius = "999px";
      launcher.style.background = cfg.theme.buttonBg;
      launcher.style.color = cfg.theme.buttonText;
      launcher.style.bottom = `${offsetY}px`;
      launcher.style[pos] = `${offsetX}px`;
      launcher.addEventListener("click", toggleWidget);
      const widget = el("div", {
        id: widgetId,
        class: "kontaktio-widget"
      }, []);
      widget.style.background = cfg.theme.widgetBg;
      widget.style.borderRadius = `${Math.max(12, Number(cfg.theme.radius || 18))}px`;
      widget.style.bottom = `${offsetY + 70}px`;
      widget.style[pos] = `${offsetX}px`;
      const closeBtn = el("button", {
        class: "kontaktio-close",
        type: "button"
      }, [ "×" ]);
      closeBtn.style.color = cfg.theme.headerText;
      closeBtn.addEventListener("click", closeWidget);
      const headerLeft = el("div", {}, [ el("div", {}, [ cfg.company.name || "Asystent" ]), cfg.welcome_hint ? el("div", {
        class: "kontaktio-header-sub"
      }, [ cfg.welcome_hint ]) : el("div") ]);
      const header = el("div", {
        class: "kontaktio-header"
      }, [ headerLeft, closeBtn ]);
      header.style.background = cfg.theme.headerBg;
      header.style.color = cfg.theme.headerText;
      const muted = el("div", {
        id: mutedId,
        class: "kontaktio-muted"
      }, [ "" ]);
      muted.style.display = "none";
      const messages = el("div", {
        id: messagesId,
        class: "kontaktio-messages"
      }, []);
      const quick = el("div", {
        id: quickId,
        class: "kontaktio-quick"
      }, []);
      const input = el("input", {
        id: inputId,
        class: "kontaktio-input",
        placeholder: "Napisz wiadomość...",
        type: "text"
      });
      input.style.background = cfg.theme.inputBg;
      input.style.color = cfg.theme.inputText;
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendMessage(input.value);
        }
      });
      const sendBtn = el("button", {
        class: "kontaktio-send",
        type: "button"
      }, [ "Wyślij" ]);
      sendBtn.style.background = cfg.theme.buttonBg;
      sendBtn.style.color = cfg.theme.buttonText;
      sendBtn.addEventListener("click", () => sendMessage(input.value));
      const inputWrap = el("div", {
        class: "kontaktio-inputwrap"
      }, [ input, sendBtn ]);
      inputWrap.style.background = cfg.theme.widgetBg;
      widget.appendChild(header);
      widget.appendChild(muted);
      widget.appendChild(messages);
      widget.appendChild(quick);
      widget.appendChild(inputWrap);
      root.appendChild(widget);
      root.appendChild(launcher);
      const history = loadHistory();
      history.forEach(m => {
        if (!m || !m.role) return;
        pushMessage(m.role === "user" ? "user" : "bot", m.text || "", false);
      });
      if (cfg.status !== "active") {
        const msg = cfg.statusMessage || "Asystent jest obecnie niedostępny. Skontaktuj się z firmą bezpośrednio.";
        if (!history.length) pushMessage("bot", msg);
        setMuted("Asystent jest wyłączony.");
      } else if (!history.length) {
        if (cfg.welcome_message) pushMessage("bot", cfg.welcome_message);
      }
      renderQuickReplies();
      isOpen = loadOpenState();
      if (isOpen) openWidget();
      if (cfg.status === "active" && cfg.auto_open_enabled && !wasAutoOpened() && !loadOpenState()) {
        setTimeout(() => {
          markAutoOpened();
          openWidget();
        }, Math.max(0, cfg.auto_open_delay || 0));
      }
    };
    mount();
  });
})();