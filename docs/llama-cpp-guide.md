# llama.cpp — Installation & Usage Guide

Reference guide for [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp): LLM inference with
minimal setup and state-of-the-art performance on a wide range of hardware — locally and in the cloud.

> **Note:** llama.cpp moves fast — flags, tool names, and hosted-tooling links change between builds.
> If a command below doesn't match your build, check the upstream README and `docs/` for the current
> equivalents.

## Recent Highlights

- **Hugging Face cache migration** — models downloaded with `-hf` are now stored in the standard
  Hugging Face cache directory, enabling sharing with other HF tools.
- Guide: using the new WebUI of llama.cpp
- Guide: running gpt-oss with llama.cpp
- Support for the **gpt-oss** model with native MXFP4 format (collaboration with NVIDIA)
- **Multimodal support** arrived in `llama-server` ([#12898](https://github.com/ggml-org/llama.cpp/pull/12898))
- VS Code extension for FIM completions: <https://github.com/ggml-org/llama.vscode>
- Vim/Neovim plugin for FIM completions: <https://github.com/ggml-org/llama.vim>
- Hugging Face Inference Endpoints support GGUF out of the box
  ([discussion #9669](https://github.com/ggml-org/llama.cpp/discussions/9669))
- Hugging Face GGUF editor ([discussion #9268](https://github.com/ggml-org/llama.cpp/discussions/9268))
- **WebGPU support** is now available in the browser

## Quick Start

Several ways to install llama.cpp:

- Install using **brew, nix, winget, or conda-forge**
- Run with **Docker** — see the Docker documentation
- Download **pre-built binaries** from the releases page
- **Build from source** by cloning the repository — see the build guide

Once installed, you'll need a model to work with — see
[Obtaining and quantizing models](#obtaining-and-quantizing-models).

```bash
# Use a local model file
llama-cli -m my_model.gguf

# Or download and run a model directly from Hugging Face
llama-cli -hf ggml-org/gemma-3-1b-it-GGUF

# Launch OpenAI-compatible API server
llama-server -hf ggml-org/gemma-3-1b-it-GGUF
```

## Description

The main goal of llama.cpp is to enable LLM inference with minimal setup and state-of-the-art
performance on a wide range of hardware:

- Plain C/C++ implementation without any dependencies
- Apple silicon is a first-class citizen — optimized via ARM NEON, Accelerate and Metal frameworks
- AVX, AVX2, AVX512 and AMX support for x86 architectures
- RVV, ZVFH, ZFH, ZICBOP and ZIHINTPAUSE support for RISC-V architectures
- 1.5-bit through 8-bit integer quantization for faster inference and reduced memory use
- Custom CUDA kernels for NVIDIA GPUs (AMD GPUs via HIP, Moore Threads GPUs via MUSA)
- Vulkan and SYCL backend support
- CPU+GPU hybrid inference to partially accelerate models larger than total VRAM capacity

The llama.cpp project is the main playground for developing new features for the ggml library.

## Supported Backends

| Backend | Target devices |
|---|---|
| Metal | Apple Silicon |
| BLAS | All |
| BLIS | All |
| SYCL | Intel GPU |
| OpenVINO *(in progress)* | Intel CPUs, GPUs, and NPUs |
| MUSA | Moore Threads GPU |
| CUDA | Nvidia GPU |
| HIP | AMD GPU |
| ZenDNN | AMD CPU |
| Vulkan | GPU |
| CANN | Ascend NPU |
| OpenCL | Adreno GPU |
| IBM zDNN | IBM Z & LinuxONE |
| WebGPU | All |
| RPC | All |
| Hexagon *(in progress)* | Snapdragon |
| VirtGPU | VirtGPU APIR |

## Obtaining and Quantizing Models

The Hugging Face platform hosts many LLMs compatible with llama.cpp. You can either manually
download a GGUF file or use any llama.cpp-compatible model directly via:

```bash
llama-cli -hf <user>/<model>[:quant]
# e.g.
llama-cli -hf ggml-org/gemma-3-1b-it-GGUF
```

By default the CLI downloads from Hugging Face; switch endpoints with the `MODEL_ENDPOINT`
environment variable (must point to a Hugging Face-compatible API endpoint).

llama.cpp requires models in the **GGUF** file format. Models in other formats can be converted
using the `convert_*.py` scripts in the repo.

Hugging Face online tooling:

- **GGUF-my-repo** space — convert to GGUF and quantize weights to smaller sizes
- **GGUF-my-LoRA** space — convert LoRA adapters to GGUF
  ([discussion #10123](https://github.com/ggml-org/llama.cpp/discussions/10123))
- **GGUF-editor** space — edit GGUF metadata in the browser
  ([discussion #9268](https://github.com/ggml-org/llama.cpp/discussions/9268))
- **Inference Endpoints** — host llama.cpp in the cloud
  ([discussion #9669](https://github.com/ggml-org/llama.cpp/discussions/9669))

## Core Tools

### llama-cli

CLI tool for accessing and experimenting with most of llama.cpp's functionality. Models with a
built-in chat template automatically activate conversation mode; enable it manually with `-cnv`
and `--chat-template NAME` if needed.

```bash
llama-cli -m model.gguf

# > hi, who are you?
# Hi there! I'm your helpful assistant! ...
```

### llama-server

Lightweight, OpenAI API-compatible HTTP server for serving LLMs.

```bash
llama-server -m model.gguf --port 8080

# Web UI:                  http://localhost:8080
# Chat completion endpoint: http://localhost:8080/v1/chat/completions
```

Also supports multi-user parallel decoding, speculative decoding, embedding models, reranking
models, and grammar-constrained outputs.

### llama-perplexity

Measure perplexity (and other quality metrics) of a model over a given text.

```bash
llama-perplexity -m model.gguf -f file.txt

# [1]15.2701,[2]5.4007,[3]5.3073, ...
# Final estimate: PPL = 5.4007 +/- 0.67339
```

### llama-bench

Benchmark inference performance for various parameters.

```bash
llama-bench -m model.gguf

# | model           |       size |  params | backend    | threads |  test |            t/s |
# | qwen2 1.5B Q4_0 | 885.97 MiB |  1.54 B | Metal,BLAS |      16 | pp512 | 5765.41 ± 20.55 |
# | qwen2 1.5B Q4_0 | 885.97 MiB |  1.54 B | Metal,BLAS |      16 | tg128 |   197.71 ± 0.81 |
```

### llama-simple

A minimal example for implementing apps with llama.cpp — useful for developers.

## XCFramework (iOS / macOS / visionOS / tvOS)

Precompiled library for Swift projects — no source build required:

```swift
// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "MyLlamaPackage",
    targets: [
        .executableTarget(
            name: "MyLlamaPackage",
            dependencies: ["LlamaFramework"]),
        .binaryTarget(
            name: "LlamaFramework",
            url: "https://github.com/ggml-org/llama.cpp/releases/download/b5046/llama-b5046-xcframework.zip",
            checksum: "c19be78b5f00d8d29a25da41042cb7afa094cbf6280a225abe614b03b20029ab"
        )
    ]
)
```

Change the URL and checksum to pin a different build.

## Bash Completion

```bash
build/bin/llama-cli --completion-bash > ~/.llama-completion.bash
source ~/.llama-completion.bash

# Load automatically:
echo "source ~/.llama-completion.bash" >> ~/.bashrc
```

## Contributing

- Contributors can open PRs; collaborators are invited based on contributions
- Maintainers can push to branches and merge PRs into `master`
- See *good first issues* for tasks suitable for first contributions
- Read `CONTRIBUTING.md` and the "Inference at the edge" write-up

## Further Documentation

- Upstream docs: cli, completion, server, GBNF grammars
- Development: how to build, running on Docker, build on Android, multi-GPU usage,
  performance troubleshooting, GGML tips & tricks

### Background Reading

For model generation quality questions, see the seminal papers:

- **LLaMA:** *Introducing LLaMA* · *LLaMA: Open and Efficient Foundation Language Models*
- **GPT-3:** *Language Models are Few-Shot Learners*
- **GPT-3.5 / InstructGPT / ChatGPT:** *Aligning language models to follow instructions* ·
  *Training language models to follow instructions with human feedback*

## Key Dependencies

| Library | Purpose | License |
|---|---|---|
| yhirose/cpp-httplib | Single-header HTTP server (`llama-server`) | MIT |
| stb-image | Single-header image decoder (multimodal) | Public domain |
| nlohmann/json | Single-header JSON library | MIT |
| miniaudio.h | Single-header audio decoder (multimodal) | Public domain |
| subprocess.h | Single-header process launching for C/C++ | Public domain |
