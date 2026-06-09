# ReBench - Execute and Document Benchmarks Reproducibly

## Overview

ReBench is a tool for running, documenting, and tracking benchmark experiments. It's used to monitor performance of language implementations, applications, and programs.

**Core Purpose:** Enable reproducible benchmark execution with complete documentation, interruptible/resumable runs, and statistical reliability.

## Key Features

### 1. **YAML Configuration Format**
Define all benchmark parameters in version-controlled configuration:
- Which executables to run
- Benchmark parameters and input sizes
- Number of iterations for statistical reliability
- Variable values
- Experiment combinations

### 2. **Interruptible & Resumable**
- Pause long-running experiments anytime
- Resume later without re-running completed tests
- Data file records all runs incrementally
- Critical for multi-day benchmarking

### 3. **Multi-Level Complexity Support**
- **Simple:** Single executable, single suite
- **Complex:** Multiple executables, variable inputs, cross-platform comparisons
- Flexible execution model for any scenario

### 4. **Data Recording**
- All benchmark results recorded in structured data file
- Format supports statistical analysis (R, Python, etc.)
- Integration with ReBenchDB for continuous monitoring
- Machine-readable for downstream processing

### 5. **Extensibility**
- Custom gauge adapters for parsing benchmark output
- Support for custom harnesses and output formats
- Add new benchmark formats without core changes

### 6. **ReBench Denoise**
Optional Linux system configuration to reduce benchmark variability:
- CPU frequency management
- Task scheduling optimization
- Cpuset-based core reservation
- Graceful degradation if features unavailable
- Requires: `sudo` rights, `cpuset` package
- Tested on: Ubuntu, Rocky Linux
- Inspired by Krun (but simpler, fewer dependencies)

## Installation

### Via pip
```bash
pip install rebench
```

### For Denoise (Linux only)
```bash
# Install dependencies
sudo apt install cpuset

# Configure sudo access
# ReBench will suggest parameters and allow:
# - rebench-denoise via sudo without password
# - SETENV environment variable permission
```

### Development Setup
```bash
git clone https://github.com/smarr/rebench.git
cd rebench
pip install --editable .
python -m pytest        # Run tests
python -m pylint rebench  # Lint code
```

## Basic Usage

### Minimal Configuration File

Create `test.conf`:
```yaml
# Default experiment if none specified
default_experiment: all
default_data_file: 'example.data'

# Define benchmark suites
benchmark_suites:
    ExampleSuite:
        gauge_adapter: RebenchLog
        command: Harness %(benchmark)s %(input)s %(variable)s
        input_sizes: [2, 10]
        variable_values:
            - val1
        benchmarks:
            - Bench1
            - Bench2

# Define executables
executors:
    MyBin1:
        path: bin
        executable: test-vm1.py %(cores)s
        cores: [1]
    MyBin2:
        path: bin
        executable: test-vm2.py

# Combine suites + executables
experiments:
    Example:
        suites:
          - ExampleSuite
        executions:
            - MyBin1
            - MyBin2
```

### Run Benchmark
```bash
rebench test.conf
```

### Continue Interrupted Run
```bash
rebench test.conf  # Resumes from last checkpoint
```

## Configuration Details

### Benchmark Suites
```yaml
benchmark_suites:
    SuiteName:
        gauge_adapter: RebenchLog          # Output parser
        command: ./bench %(benchmark)s     # Execution template
        input_sizes: [1, 10, 100]          # Parameterization
        variable_values:
            - var1
            - var2
        benchmarks:
            - BenchmarkA
            - BenchmarkB
```

**Variables:** `%(benchmark)s`, `%(input)s`, `%(variable)s`, `%(cores)s` substituted at runtime.

### Executors
```yaml
executors:
    ExecutableName:
        path: ./bin                        # Lookup directory
        executable: program %(cores)s      # Program with params
        cores: [1, 2, 4]                   # Multi-core variants
        env:                               # Environment variables
            VAR: value
```

### Experiments
Combines one or more suites with one or more executors:
```yaml
experiments:
    ComparisonName:
        suites:
            - Suite1
            - Suite2
        executions:
            - Executor1
            - Executor2
```

## Output & Analysis

### Data File Format
- Machine-readable format (supports R, Python, pandas analysis)
- Incremental recording (resume-safe)
- Includes: timestamp, executor, benchmark, input, iteration, value, unit

### Analysis Tools
ReBench provides minimal statistics but integrates with:
- **R scripts** for statistical analysis
- **ReBenchDB** for continuous performance tracking
- **Python/pandas** for custom analysis
- **Custom visualization tools**

### Example Data File
```
# timestamp, run_id, executable, benchmark, suite, input, iteration, time_ms
2025-02-03T10:15:22, run_1, MyBin1, Bench1, ExampleSuite, 2, 1, 145.3
2025-02-03T10:15:23, run_1, MyBin1, Bench1, ExampleSuite, 2, 2, 146.1
...
```

## Advanced Usage

### Multi-Executor Comparison
Compare performance across different implementations:
```yaml
executors:
    JVM:
        path: ./bin
        executable: java -jar bench.jar
    Python:
        path: ./bin
        executable: python bench.py
    NodeJS:
        path: ./bin
        executable: node bench.js

experiments:
    CrossLanguage:
        suites: [Suite1, Suite2]
        executions: [JVM, Python, NodeJS]  # Compare all three
```

### Statistical Reliability
Control iterations for confidence:
```yaml
benchmark_suites:
    CriticalSuite:
        gauge_adapter: RebenchLog
        command: ./bench %(benchmark)s
        iterations: 50  # More iterations = more reliable
        benchmarks:
            - CriticalBench
```

### Resumable Long Experiments
```bash
# Day 1: Start
rebench bench.conf

# Experiment interrupted? No problem.
# Day 2: Resume (picks up where it left off)
rebench bench.conf
```

Data file continues recording from last iteration.

## Integration with ReBenchDB

For continuous performance monitoring:
```yaml
benchmark_suites:
    MonitoredSuite:
        gauge_adapter: RebenchLog
        reporting_on: true                 # Enable reporting
        ...

experiments:
    Continuous:
        suites: [MonitoredSuite]
        executions: [Executor1]
        reporting:
            rebenchdb:
                url: https://rebenchdb.example.com
                project: MyProject
                branch: main
```

Results automatically pushed to ReBenchDB for tracking.

## Use Cases

### 1. **Language Implementation Benchmarking**
Compare Ruby, Python, JS implementations across test suites. Track performance regression over commits.

### 2. **Compiler Optimization Testing**
Run same benchmark across different compiler flags/versions. Measure impact of optimizations.

### 3. **Multi-Version Comparison**
Benchmark app across v1.0, v1.1, v2.0. Identify performance cliffs.

### 4. **System Baseline Establishment**
Capture reference performance on target hardware. Use for regression detection.

### 5. **Long-Running Stability Tests**
Interrupt/resume as needed. Collect 1000s of iterations for statistical reliability.

## What ReBench Does NOT Do

- ❌ Provide advanced statistical analysis (use R, Python)
- ❌ Generate charts/visualizations (feed data to your tools)
- ❌ Profile code (use dedicated profilers)
- ❌ Handle hardware-level tuning (use separate tools like Krun)
- ❌ Optimize for minimal variance (basic denoise only)

## Academic References

ReBench is cited in 15+ peer-reviewed papers on performance optimization:
- Transient Typechecks are (Almost) Free (Roberts et al. 2019)
- Cross-Language Compiler Benchmarking (S. Marr et al. 2016)
- Meta-tracing makes a fast Racket (C. F. Bolz et al. 2014)
- And 12+ more on language VMs, JIT compilation, parallelism

If using for research, cite:
```bibtex
@misc{ReBench:2025,
  author = {Marr, Stefan},
  doi = {10.5281/zenodo.1311762},
  month = {February},
  note = {Version 1.3},
  publisher = {GitHub},
  title = {ReBench: Execute and Document Benchmarks Reproducibly},
  year = 2025
}
```

## Resources

- **Official Documentation:** https://rebench.readthedocs.io/
- **GitHub:** https://github.com/smarr/rebench
- **ReBenchDB:** https://rebenchdb.io/ (continuous monitoring)
- **Krun:** https://krun.github.io/ (advanced variance reduction)

---

## Integration with Your YouTube Shorts Pipeline

ReBench could help benchmark:
- **Thumbnail rendering performance** (compare different ML models)
- **Script generation speed** (Claude API batching vs sequential)
- **Video encoding** (FFmpeg parameter optimization)
- **TTS generation** (Kokoro vs ElevenLabs latency)
- **Analytics processing** (weekly metric pulls, correlation analysis)

Example:
```yaml
benchmark_suites:
    VideoRenderSuite:
        command: ./render.py %(video_size)s %(codec)s
        input_sizes: [480p, 720p, 1080p]
        variable_values:
            - h264
            - vp9
        benchmarks:
            - adhd_video_1
            - adhd_video_2
```

---

**Useful for:** Performance tracking, regression detection, optimization validation, reproducible experiments.

**Not needed for:** One-off performance checks, simple timing measurements.
