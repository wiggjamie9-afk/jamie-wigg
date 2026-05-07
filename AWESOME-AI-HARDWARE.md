# Awesome AI Hardware

AI accelerators, edge inference devices, compilers, runtimes, benchmarks, and research for building and evaluating machine-learning systems.

## Contents

- [Hardware Platforms](#hardware-platforms)
- [Edge and Embedded Hardware](#edge-and-embedded-hardware)
- [Silicon and Product Families](#silicon-and-product-families)
- [Compilers and Runtimes](#compilers-and-runtimes)
- [Benchmarking and Profiling](#benchmarking-and-profiling)
- [Open-Source Deployment Projects](#open-source-deployment-projects)
- [Mobile and AI PC Inference](#mobile-and-ai-pc-inference)
- [Research Papers](#research-papers)
- [Books and Courses](#books-and-courses)
- [Community](#community)

## Hardware Platforms

- **NVIDIA CUDA** — Parallel programming platform for NVIDIA GPUs and accelerators.
- **AMD ROCm** — Open GPU compute stack for AMD accelerators.
- **Intel oneAPI** — Cross-architecture programming model for CPUs, GPUs, FPGAs, and accelerators.
- **Google TPU** — Tensor Processing Units for training and serving large machine-learning workloads.
- **Cerebras WSE** — Wafer-scale accelerator architecture for dense neural network compute.
- **Groq LPU** — Inference processor architecture designed around deterministic token generation.
- **Tenstorrent** — RISC-V based AI processor company with open software tools and developer boards.
- **SambaNova** — Reconfigurable dataflow systems for enterprise AI training and inference.
- **Etched Sohu** — Transformer-focused inference ASIC for high-throughput language model serving.

## Edge and Embedded Hardware

- **NVIDIA Jetson** — Edge AI modules for robotics, vision systems, industrial automation, and local inference.
- **Qualcomm AI Engine Direct SDK** — Low-level access to Qualcomm Hexagon, CPU, and GPU inference paths.
- **Hailo-8** — M.2 and mini-PCIe accelerator family for low-power computer vision inference.
- **Google Coral** — Edge TPU modules and boards for quantized TensorFlow Lite workloads.
- **Luxonis OAK-D** — Depth camera with on-device neural inference through the DepthAI stack.
- **Kneron KL720** — Low-power neural processing unit for USB modules and embedded vision products.
- **Raspberry Pi AI Kit** — Raspberry Pi 5 M.2 accelerator kit built around the Hailo inference processor.
- **AMD Versal AI Edge** — Adaptive SoC family combining programmable logic, CPU cores, and AI Engines.
- **STMicroelectronics STM32N6** — Microcontroller series with an integrated neural acceleration block for edge AI.
- **Espressif ESP32-P4** — Application processor for vision, display, and AI-enabled embedded products.

## Silicon and Product Families

- **Apple Core ML** — Model deployment framework for Apple Neural Engine, GPU, and CPU execution.
- **Qualcomm Snapdragon X Series** — Laptop-class Arm processors with integrated Hexagon NPU acceleration.
- **Intel Core Ultra** — AI PC processor family with integrated Intel AI Boost NPU blocks.
- **AMD Ryzen AI** — Consumer processor family with XDNA neural processing units.
- **MediaTek NeuroPilot** — Mobile AI platform for Dimensity and related MediaTek SoCs.
- **Samsung Exynos** — Mobile processor family with integrated neural processing units.
- **Arm Ethos-U** — MicroNPU IP for Cortex-M and Cortex-A edge inference designs.
- **Synaptics Astra** — Edge AI processor platform for vision, audio, and multimodal embedded systems.
- **SiMa.ai MLSoC** — Machine-learning SoC platform aimed at industrial edge deployment.
- **Axelera Metis** — Edge AI platform built around the Metis accelerator architecture.

## Compilers and Runtimes

- **XLA** — Accelerated Linear Algebra compiler for TensorFlow, JAX, and other ML frameworks.
- **MLIR** — Multi-Level Intermediate Representation for reusable compiler infrastructure.
- **Triton** — Python-like language and compiler for writing custom GPU kernels.
- **Apache TVM** — Open deep-learning compiler stack for CPUs, GPUs, and accelerators.
- **IREE** — Intermediate Representation Execution Environment for deploying ML programs.
- **NVIDIA TensorRT** — Inference optimizer and runtime for NVIDIA GPUs and Jetson modules.
- **ONNX Runtime** — Cross-platform inference runtime with provider backends for multiple accelerators.
- **OpenVINO** — Intel toolkit for optimizing and deploying inference on CPUs, GPUs, and NPUs.
- **Vitis AI** — Compiler, runtime, and model zoo for AMD adaptive SoCs and Alveo cards.
- **HailoRT** — Runtime and driver stack for Hailo AI accelerators.
- **LiteRT** — Google runtime for on-device inference across mobile and embedded targets.
- **ExecuTorch** — PyTorch runtime for deploying models to phones, wearables, and embedded devices.

## Benchmarking and Profiling

- **MLPerf** — Industry-standard benchmark suites for training, inference, storage, and edge ML systems.
- **AI-Benchmark** — Deep-learning benchmark suite for mobile, desktop, and accelerator comparisons.
- **Geekbench AI** — Cross-platform inference score browser with CPU, GPU, and NPU results.
- **LLMPerf** — Benchmark harness for large language model serving throughput and latency.
- **NVIDIA Nsight Systems** — System-wide performance analysis tool for CPU, GPU, and operating-system timelines.
- **NVIDIA Nsight Compute** — Interactive CUDA kernel profiler for occupancy, memory, and instruction analysis.
- **PyTorch Profiler** — Built-in profiler for PyTorch model execution and operator-level timing.
- **Perfetto** — Production-grade tracing and profiling platform for systems performance analysis.

## Open-Source Deployment Projects

- **Jetson Containers** — Containerized CUDA, PyTorch, ROS, and ML stacks for NVIDIA Jetson development.
- **Jetson Inference** — End-to-end classification, detection, pose, and segmentation examples for Jetson modules.
- **DeepStream Python Apps** — Python bindings and examples for multi-camera DeepStream pipelines.
- **Isaac ROS Common** — Docker and build infrastructure for NVIDIA Isaac ROS acceleration packages.
- **Hailo Model Zoo** — Pretrained models, compilation scripts, and deployment flows for Hailo accelerators.
- **Hailo Raspberry Pi 5 Examples** — Reference pipelines for Raspberry Pi 5 systems using Hailo AI modules.
- **Edge TPU** — Userspace runtime, tests, and examples for Google Coral Edge TPU devices.
- **RKNN Model Zoo** — Deployment examples and model zoo for Rockchip NPU boards.
- **Texas Instruments TIDL Tools** — Model conversion and deployment tools for TI deep-learning accelerators.
- **OpenVINO Notebooks** — Practical notebooks for model conversion, optimization, and inference on Intel hardware.
- **Qualcomm Linux Sample Apps** — Detection and classification examples for Qualcomm Linux evaluation kits.
- **Qualcomm Intelligent Development Kit** — Android samples using the Qualcomm AI Engine and QNN stack.
- **Ryzen AI Software** — AMD examples and deployment tools for XDNA and XDNA 2 NPUs.
- **OpenVINO Toolkit** — Open-source runtime, model optimizer, and samples for Intel inference deployment.
- **LeRobot** — Robot learning library for imitation learning and reinforcement learning on local hardware.
- **MLCommons Tiny** — TinyML benchmark suite for keyword spotting, image classification, and anomaly detection.
- **TensorFlow Lite Micro** — Microcontroller inference runtime with optimized kernels for embedded targets.
- **Edge Impulse Standalone Inferencing** — Portable C++ inference examples generated from Edge Impulse projects.
- **ESP-WHO** — Face detection, recognition, and camera AI examples for ESP32 devices.
- **ESP-DL** — Quantization and inference library for deploying neural networks on Espressif chips.
- **OpenMV** — MicroPython machine-vision firmware and examples for camera microcontroller boards.
- **MaixPy** — MicroPython AI framework for Sipeed K210, K230, and related RISC-V boards.
- **Openpilot** — Open-source driver assistance stack running production workloads on automotive AI hardware.
- **Autoware** — ROS 2 autonomous driving stack used for research and industrial vehicle development.
- **Apollo** — Autonomous driving platform with perception, planning, simulation, and deployment examples.

## Mobile and AI PC Inference

- **ncnn** — Mobile neural network inference framework optimized for Arm CPUs and Vulkan GPUs.
- **MNN** — Lightweight mobile inference engine used in Alibaba production applications.
- **Tencent TNN** — Cross-platform inference framework for Android, iOS, and embedded deployments.
- **Xiaomi MACE** — Mobile AI compute engine for heterogeneous CPU, GPU, DSP, and NPU execution.
- **llama.cpp** — Portable C and C++ inference engine for quantized language models.
- **MLX** — Array framework for Apple silicon with unified-memory model execution.
- **Core ML Tools** — Conversion and compression tools for packaging models into Core ML format.
- **MediaPipe** — Cross-platform graph framework for on-device vision, audio, and multimodal pipelines.
- **Transformers.js** — Browser and server-side transformer inference through WebAssembly and WebGPU.
- **Candle** — Minimal Rust ML framework for small binaries and local inference applications.
- **Ollama** — Local language model runner for CPU and GPU backends.
- **LocalAI** — Self-hosted OpenAI-compatible API server for local text, audio, and vision models.
- **Open WebUI** — Local-first chat and retrieval interface commonly paired with Ollama.

## Research Papers

- **In-Datacenter Performance Analysis of a Tensor Processing Unit** — Original Google TPU paper describing datacenter inference acceleration.
- **A Domain-Specific Supercomputer for Training Deep Neural Networks** — Google TPU v3 system paper covering large-scale training infrastructure.
- **Cerebras CS-2 and Weight Streaming** — Wafer-scale architecture and execution model for neural network training.
- **Roofline Model** — Visual performance model for reasoning about compute and memory bottlenecks.
- **FlashAttention** — IO-aware attention algorithm for faster and more memory-efficient transformers.
- **FlashAttention-2** — Improved attention parallelism and work partitioning for GPUs.
- **Ansor** — Auto-scheduling approach for generating high-performance tensor programs.
- **Triton Paper** — Intermediate language and compiler for tiled neural network computations.
- **MLIR Paper** — Compiler infrastructure for domain-specific computation.
- **Stream-K** — Work-centric parallel decomposition for dense matrix multiplication.
- **Efficiently Scaling Transformer Inference** — Analysis of inference scaling and hardware utilization for transformer models.
- **LLM.int8()** — 8-bit matrix multiplication method for large language model inference.

## Books and Courses

- **Dive into Deep Learning** — Open textbook with runnable notebooks for modern deep-learning workloads.
- **Efficient Deep Learning** — Practical techniques for efficient model training and inference.
- **GPU Puzzles** — Puzzle-based introduction to GPU programming concepts.
- **CUDA MODE** — Community lecture series on CUDA, GPU kernels, and accelerator programming.
- **Triton Tutorials** — Hands-on examples for writing custom kernels with Triton.
- **TVM Tutorial** — End-to-end introduction to model compilation with Apache TVM.
- **TPU Research Cloud** — Program for researchers and learners to access Google TPU resources.

## Community

- **CUDA MODE Discord** — Community for GPU kernel programming, profiling, and performance engineering.
- **NVIDIA Developer Forums** — Official forum for CUDA development and troubleshooting.
- **MLCommons** — Engineering consortium for ML benchmarks, datasets, and best practices.
- **r/MachineLearning** — Research community covering ML systems, models, and hardware trends.
- **SemiAnalysis** — Technical analysis of AI chips, datacenter systems, and semiconductor supply chains.
- **tinyML Foundation** — Community for ultra-low-power machine learning on embedded devices.

## Contributing

Contributions welcome! Read the contribution guidelines first.
