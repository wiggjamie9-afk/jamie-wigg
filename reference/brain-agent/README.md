# Brain — phased agent orchestrator (reference only)

`Brain.py` is the top-level orchestrator for a phased Telegram/AI agent. It boots
a set of services over a shared message bus (`JoBus`) in a fixed order:

1. **Heart** — Telegram bot
2. **Spine** — connection / session / child managers
3. **Telegram** — commands + alerts
4. **Routing** — message router to children
5. **AI** — model store, alert rules, tier manager, vision engine, OpenRouter chat
6. **Memory** — event logger, snapshot manager
7. **Resilience** — reconnect, health-check, fallback
8. **Shields** — watchdog

## ⚠️ Status: INCOMPLETE

Only `Brain.py` was provided. It imports ~25 modules across the packages
`brain/ bus/ children/ core/ network/ notifications/ sai/ telegram/ memory/
resilience/ shields/` — **none of which were supplied**. As given, this file
cannot run (every `from …` import would fail).

Kept here verbatim as a **reference / architecture snapshot**, not a runnable
project. To make it work you would need to implement each imported class with:

- a constructor matching the keyword args used here (`bus=…`, etc.),
- `start()` / `stop()` methods (the boot/shutdown loops call these),
- for `AraHealthChecker`: `set_services(list)`,
- for `AraFallbackHandler`: `set_restart_map(dict)`,
- for `MiniTelegramBot`: `send_message(str)`,
- a `Settings` object exposing `OPENROUTER_API_KEY`.

If you want, I can scaffold those modules as working stubs (no-op `start`/`stop`,
an in-memory `JoBus`, a logger) so `Brain().start()` runs end-to-end — just ask.
