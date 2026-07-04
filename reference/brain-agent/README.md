# Brain — phased agent orchestrator

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

## ✅ Status: RUNNABLE (stub services)

The original paste contained only `Brain.py`, which imported ~25 modules that
were **not supplied**. Those modules are now provided as **working stubs** so the
orchestrator boots and shuts down end-to-end:

```bash
cd reference/brain-agent
python3 main.py
```

Expected output: all 18 services log `start()`, `MiniTelegramBot` prints
`[telegram] Brain Online — all systems ready`, then all services `stop()` in
reverse order.

### What the stubs provide

- `bus/JoLogger.py` — stdout logger (`get_logger`)
- `bus/JoBus.py` — minimal in-memory pub/sub bus
- `bus/JoService.py` — shared `Service` base: stores kwargs as attributes,
  provides `start()`/`stop()` that log their transitions
- `brain/settings.py` — `Settings` reading env (`OPENROUTER_API_KEY`, …)
- One module per imported service (`children/`, `core/`, `network/`,
  `notifications/`, `sai/`, `telegram/`, `memory/`, `resilience/`, `shields/`),
  each a thin `Service` subclass
- Special methods wired to match `Brain.py`: `MiniTelegramBot.send_message`,
  `AraHealthChecker.set_services`, `AraFallbackHandler.set_restart_map`
- `main.py` — entry point

### Turning stubs into real services

Each stub accepts arbitrary keyword args and no-ops on `start()`/`stop()`. To
implement a real service, override those hooks (and add its own methods) — the
constructor signatures already match how `Brain.py` wires them together. The
services run synchronously here; a real deployment would give each its own
thread and use `JoBus.publish/subscribe` for cross-service messaging.
