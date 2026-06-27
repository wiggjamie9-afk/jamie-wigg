---
name: zephyr-rtos
description: Zephyr Project — a scalable, secure real-time operating system (RTOS) for resource-constrained embedded devices (ARM Cortex-M/R/A, RISC-V, Xtensa, x86, ARC, SPARC, MIPS). Use ONLY for embedded/IoT firmware work: building firmware for microcontrollers, sensors, wearables, or wireless gateways with the `west` tool + Zephyr SDK. NOTE: off-topic for this RHYTHMIX workspace (web/mobile/video) — there is no embedded code here; this is a reference for if/when hardware work starts.
---

# Zephyr RTOS (embedded firmware)

Zephyr is a small-footprint, open-source RTOS (Apache-2.0) for resource-constrained devices —
from environmental sensors and LED wearables to smart watches and IoT gateways. Multi-arch:
ARM (Cortex-A/R/M), RISC-V, Xtensa, x86, ARC, SPARC, MIPS, with a large board catalog.

- Site: https://zephyrproject.org · Docs: https://docs.zephyrproject.org · Repo: https://github.com/zephyrproject-rtos/zephyr

## ⚠️ Relevance check — read first

This is **firmware tooling for physical hardware**. It does not apply to anything currently in
this repo (STARLIGHTMIX Studio, the marketing site, PWAs, HyperFrames video). It's only useful
if you pivot to building an **actual embedded/IoT device** (e.g. a hardware companion to a
RHYTHMIX product). It can't "run" in this sandbox in any meaningful sense — embedded builds
target a chip and are flashed to a board, then debugged over JTAG/SWD or an emulator (QEMU).

## Getting started (on a real dev machine)

Zephyr uses the **`west`** meta-tool + the **Zephyr SDK** toolchain.

```bash
# 1. host deps + west
pip install west
# 2. get the source tree (west manages multiple repos)
west init ~/zephyrproject && cd ~/zephyrproject && west update
west zephyr-export
pip install -r ~/zephyrproject/zephyr/scripts/requirements.txt
# 3. install the Zephyr SDK (toolchains for each arch) — see docs Getting Started
# 4. build a sample for a board, then flash
west build -b <board> samples/hello_world
west flash            # or: west build -t run   (QEMU targets)
```

Full setup (host packages per OS, SDK install): https://docs.zephyrproject.org/latest/develop/getting_started/

## Where you'd actually use it

- A custom hardware peripheral / sensor that talks to a phone or web app.
- Wearable / IoT gateway firmware.
- Anything on a microcontroller where you need an RTOS (threads, drivers, BLE, networking)
  rather than bare-metal.

If that's not on the roadmap, this skill is just a bookmark. For the AI-hardware curiosity
already noted in `AWESOME-AI-HARDWARE.md`, Zephyr is the firmware layer you'd reach for.

## License

Apache-2.0. Community support via Discord + mailing lists; security at vulnerabilities@zephyrproject.org.
