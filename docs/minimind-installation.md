# MiniMind — Step-by-Step Installation & Training Guide

MiniMind is a minimal, from-scratch LLM training project ([jingyaogong/minimind](https://github.com/jingyaogong/minimind)).
This guide covers cloning the repo, setting up the environment, downloading datasets, and running the
full pre-train → SFT → inference pipeline.

> **Note:** the upstream repo evolves quickly — script names, folder layout, and CLI flags may differ
> between versions. If a command below doesn't match your checkout, check the repo's README for the
> current equivalents.

## Step 1 — Clone the Repository

Pull the main repository to your local machine to get the raw Python source code.

```bash
git clone https://github.com/jingyaogong/minimind.git
cd minimind
```

## Step 2 — Set Up the Python Environment

Use a virtual environment or Conda to manage dependencies cleanly and avoid conflicts with other AI projects.

```bash
conda create -n minimind python=3.10 -y
conda activate minimind
pip install -r requirements.txt
```

## Step 3 — Download the Datasets

MiniMind provides pre-cleaned datasets for all stages (pre-training, SFT, DPO). Run the provided
script or manually download them into the `./data` folder.

```bash
python download_data.py
```

*Note: If the script is unavailable, download the required `.jsonl` files directly from the linked
Hugging Face dataset repository into your data folder.*

## Step 4 — Pre-train the Base Model

Start the foundational pre-training phase. This teaches the model basic language structure from the
raw text data.

```bash
python train_pretrain.py \
  --data_path ./data/pretrain_data.jsonl \
  --model_config ./config/minimind-3.yaml \
  --epochs 2 \
  --batch_size 32 \
  --learning_rate 5e-4
```

## Step 5 — Supervised Fine-Tuning (SFT) & Inference

Once pre-training is complete, fine-tune the model to follow instructions and act as a helpful
chatbot. After training, you can launch the interactive chat interface.

```bash
python train_sft.py \
  --pretrained_model ./checkpoints/pretrain/best.pt \
  --data_path ./data/sft_data.jsonl \
  --epochs 3

python inference.py --model_path ./checkpoints/sft/best.pt
```

## Common Errors and Fixes

| Error | Meaning | Fix |
|---|---|---|
| `CUDA Out of Memory (OOM)` | Your GPU lacks the VRAM to handle the requested batch size or context window during training. | Lower the `batch_size` parameter in your training script, or enable gradient accumulation in the configuration. |
| `RuntimeError: Expected all tensors to be on the same device` | PyTorch failed to properly move your model weights or input data from the CPU to the GPU. | Ensure you have a compatible CUDA toolkit installed (`print(torch.cuda.is_available())` should return `True`) and check that your environment isn't forcing a CPU fallback. |
| `FileNotFoundError: ./data/*.jsonl` | The training script cannot find the required datasets in the specified directory. | Ensure you have successfully run the download script or manually placed the `.jsonl` files inside the `minimind/data/` folder before launching training. |
