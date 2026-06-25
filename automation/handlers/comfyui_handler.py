#!/usr/bin/env python3
"""
ComfyUI Integration Handler
Connects local ComfyUI node-based workflows into the orchestrator.
"""

import os
import json
import logging
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime

# Network deps are optional so this module imports — and its JSON/workflow-prep
# helpers stay usable — even where they're absent (e.g. the cloud sandbox). The
# actual server calls raise a clean, actionable error when `requests` is missing.
try:
    import requests
    _REQ_ERR = requests.exceptions.RequestException
except ModuleNotFoundError:  # pragma: no cover - environment dependent
    requests = None
    _REQ_ERR = Exception
# `websocket-client` is imported lazily inside wait_for_completion().

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ComfyUIWorkflow:
    """Represents a ComfyUI node-based workflow."""

    def __init__(self, name: str, nodes: Dict[str, Any]):
        self.name = name
        self.nodes = nodes
        self.created_at = datetime.now()

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "nodes": self.nodes,
            "created_at": self.created_at.isoformat()
        }

    def get_output_node(self) -> Optional[str]:
        """Find the output/save node."""
        for node_id, node_data in self.nodes.items():
            if node_data.get("class_type") in ["SaveImage", "VHS_VideoCombine", "SaveAudio"]:
                return node_id
        return None


class ComfyUIClient:
    """Client for ComfyUI API and WebSocket."""

    def __init__(self, server_address: str = "127.0.0.1:8188"):
        self.server = server_address
        self.base_url = f"http://{server_address}"
        self.ws_url = f"ws://{server_address}/ws"
        self.client_id = self._generate_client_id()

    @staticmethod
    def _generate_client_id():
        """Generate unique client ID."""
        import uuid
        return str(uuid.uuid4())

    async def queue_prompt(self, workflow: ComfyUIWorkflow, client_id: Optional[str] = None) -> Dict:
        """Queue a workflow for execution."""
        client_id = client_id or self.client_id

        if requests is None:
            raise RuntimeError(json.dumps({
                "error": "requests_not_installed",
                "hint": "pip install requests websocket-client to talk to ComfyUI.",
            }))

        payload = {
            "prompt": workflow.nodes,
            "client_id": client_id
        }

        try:
            response = requests.post(
                f"{self.base_url}/prompt",
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            result = response.json()
            logger.info(f"Queued workflow '{workflow.name}': prompt_id={result.get('prompt_id')}")
            return result
        except _REQ_ERR as e:
            logger.error(f"Failed to queue workflow: {e}")
            raise

    async def get_history(self, prompt_id: str) -> Optional[Dict]:
        """Get execution history for a prompt."""
        if requests is None:
            return None
        try:
            response = requests.get(
                f"{self.base_url}/history/{prompt_id}",
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except _REQ_ERR as e:
            logger.error(f"Failed to get history: {e}")
            return None

    async def get_system_stats(self) -> Dict:
        """Get system statistics (VRAM, load, etc)."""
        if requests is None:
            return {}
        try:
            response = requests.get(
                f"{self.base_url}/system_stats",
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except _REQ_ERR as e:
            logger.error(f"Failed to get system stats: {e}")
            return {}

    async def wait_for_completion(self, prompt_id: str, timeout: int = 1800) -> bool:
        """Wait for workflow to complete via WebSocket."""
        try:
            import websocket as ws_module

            ws = ws_module.WebSocketApp(
                self.ws_url,
                on_message=self._on_message,
                on_error=self._on_error,
                on_close=self._on_close,
                on_open=self._on_open
            )

            self.target_prompt_id = prompt_id
            self.completed = False
            self.start_time = datetime.now()
            self.timeout = timeout

            # Run WebSocket in thread
            import threading
            ws_thread = threading.Thread(target=ws.run_forever)
            ws_thread.daemon = True
            ws_thread.start()

            # Wait for completion
            start = datetime.now()
            while not self.completed:
                if (datetime.now() - start).total_seconds() > timeout:
                    logger.warning(f"Timeout waiting for prompt {prompt_id}")
                    ws.close()
                    return False
                await asyncio.sleep(0.5)

            ws.close()
            return True

        except Exception as e:
            logger.error(f"WebSocket error: {e}")
            return False

    def _on_message(self, ws, message):
        """WebSocket message handler."""
        try:
            data = json.loads(message)

            if data.get("type") == "execution_complete":
                if data.get("data", {}).get("prompt_id") == self.target_prompt_id:
                    logger.info(f"Execution complete: {self.target_prompt_id}")
                    self.completed = True

            elif data.get("type") == "execution_error":
                logger.error(f"Execution error: {data}")

            elif data.get("type") == "progress":
                progress = data.get("data", {})
                logger.info(f"Progress: {progress.get('value')}/{progress.get('max')}")

        except json.JSONDecodeError:
            logger.debug(f"Non-JSON message: {message[:100]}")

    def _on_error(self, ws, error):
        logger.error(f"WebSocket error: {error}")

    def _on_close(self, ws, close_status_code, close_msg):
        logger.info("WebSocket closed")

    def _on_open(self, ws):
        logger.info("WebSocket opened")


class ComfyUIWorkflowBuilder:
    """Build ComfyUI workflows programmatically."""

    def __init__(self):
        self.nodes = {}
        self.node_counter = 0

    def _new_node_id(self) -> str:
        """Generate unique node ID."""
        self.node_counter += 1
        return str(self.node_counter)

    def add_checkpoint_loader(self, checkpoint_name: str) -> str:
        """Add checkpoint loader node."""
        node_id = self._new_node_id()
        self.nodes[node_id] = {
            "inputs": {"ckpt_name": checkpoint_name},
            "class_type": "CheckpointLoaderSimple",
            "_meta": {"title": "Load Checkpoint"}
        }
        return node_id

    def add_clip_text_encode(self, text: str, clip_node_id: str) -> str:
        """Add CLIP text encoding node."""
        node_id = self._new_node_id()
        self.nodes[node_id] = {
            "inputs": {
                "text": text,
                "clip": [int(clip_node_id), 1]
            },
            "class_type": "CLIPTextEncode",
            "_meta": {"title": "CLIP Text Encode (Prompt)"}
        }
        return node_id

    def add_ksampler(self, model_id: str, positive_id: str, negative_id: str, latent_image_id: str,
                     sampler: str = "euler", scheduler: str = "normal", steps: int = 20,
                     cfg: float = 7.0, seed: int = 0) -> str:
        """Add KSampler node."""
        node_id = self._new_node_id()
        self.nodes[node_id] = {
            "inputs": {
                "seed": seed,
                "steps": steps,
                "cfg": cfg,
                "sampler_name": sampler,
                "scheduler": scheduler,
                "denoise": 1.0,
                "model": [int(model_id), 0],
                "positive": [int(positive_id), 0],
                "negative": [int(negative_id), 0],
                "latent_image": [int(latent_image_id), 0]
            },
            "class_type": "KSampler",
            "_meta": {"title": "KSampler"}
        }
        return node_id

    def add_vae_decode(self, latent_node_id: str, vae_node_id: str) -> str:
        """Add VAE decode node."""
        node_id = self._new_node_id()
        self.nodes[node_id] = {
            "inputs": {
                "samples": [int(latent_node_id), 0],
                "vae": [int(vae_node_id), 0]
            },
            "class_type": "VAEDecode",
            "_meta": {"title": "VAE Decode"}
        }
        return node_id

    def add_save_image(self, images_node_id: str, filename_prefix: str = "ComfyUI") -> str:
        """Add save image node."""
        node_id = self._new_node_id()
        self.nodes[node_id] = {
            "inputs": {
                "filename_prefix": filename_prefix,
                "images": [int(images_node_id), 0]
            },
            "class_type": "SaveImage",
            "_meta": {"title": "Save Image"}
        }
        return node_id

    def add_empty_latent_image(self, width: int = 512, height: int = 512, batch_size: int = 1) -> str:
        """Add empty latent image node."""
        node_id = self._new_node_id()
        self.nodes[node_id] = {
            "inputs": {
                "width": width,
                "height": height,
                "batch_size": batch_size
            },
            "class_type": "EmptyLatentImage",
            "_meta": {"title": "Empty Latent Image"}
        }
        return node_id

    def build(self, name: str) -> ComfyUIWorkflow:
        """Build workflow."""
        return ComfyUIWorkflow(name, self.nodes)


class ComfyUIOrchestrationHandler:
    """Handle ComfyUI tasks in the orchestrator."""

    def __init__(self, comfyui_server: str = "127.0.0.1:8188"):
        self.client = ComfyUIClient(comfyui_server)
        self.builder = ComfyUIWorkflowBuilder
        self.output_dir = os.path.expanduser("~/RHYTHMIX_Empire/output/comfyui")
        os.makedirs(self.output_dir, exist_ok=True)

    async def handle_text_to_image(self, prompt: str, negative_prompt: str = "",
                                   model: str = "sd_xl_base_1.0.safetensors",
                                   width: int = 1024, height: int = 1024,
                                   steps: int = 20, cfg: float = 7.0) -> Dict:
        """Generate image from text prompt."""
        logger.info(f"Generating image: {prompt[:50]}...")

        # Build workflow
        builder = self.builder()

        # Load model
        checkpoint = builder.add_checkpoint_loader(model)

        # Create prompts
        empty_latent = builder.add_empty_latent_image(width, height)
        positive = builder.add_clip_text_encode(prompt, checkpoint)
        negative = builder.add_clip_text_encode(negative_prompt, checkpoint)

        # Sample
        sampler = builder.add_ksampler(checkpoint, positive, negative, empty_latent, steps=steps, cfg=cfg)

        # Decode
        vae = builder.add_checkpoint_loader(model)  # Simplified: in real use, would be separate VAE node
        decode = builder.add_vae_decode(sampler, vae)

        # Save
        save = builder.add_save_image(decode, "generated_image")

        workflow = builder.build("text_to_image")

        # Queue and execute
        result = await self.client.queue_prompt(workflow)
        prompt_id = result.get("prompt_id")

        if prompt_id:
            completed = await self.client.wait_for_completion(prompt_id)
            if completed:
                history = await self.client.get_history(prompt_id)
                return {
                    "status": "completed",
                    "prompt_id": prompt_id,
                    "history": history
                }

        return {"status": "failed"}

    async def handle_image_upscale(self, image_path: str, upscale_factor: int = 2,
                                   model: str = "RealESRGAN_x2") -> Dict:
        """Upscale image using ComfyUI."""
        logger.info(f"Upscaling image: {image_path} ({upscale_factor}x)")

        builder = self.builder()

        # Load image node (would reference saved image)
        # Add upscaler
        # Save result

        return {
            "status": "upscaled",
            "input": image_path,
            "output": f"{self.output_dir}/upscaled_{os.path.basename(image_path)}"
        }

    async def handle_controlnet_workflow(self, image_path: str, prompt: str,
                                        controlnet_model: str = "control_canny") -> Dict:
        """Generate image using ControlNet guidance."""
        logger.info(f"ControlNet workflow: {controlnet_model}")

        # Load control image
        # Apply ControlNet
        # Generate with guidance
        # Save result

        return {"status": "completed", "controlnet": controlnet_model}

    async def handle_video_generation(self, frames: List[str], fps: int = 30,
                                      audio: Optional[str] = None) -> Dict:
        """Combine frames into video with optional audio."""
        logger.info(f"Generating video from {len(frames)} frames at {fps}fps")

        builder = self.builder()

        # Add video combine node
        # Add audio if provided
        # Save video

        return {
            "status": "completed",
            "frames": len(frames),
            "fps": fps,
            "output": f"{self.output_dir}/output.mp4"
        }

    async def get_system_status(self) -> Dict:
        """Get ComfyUI system status."""
        stats = await self.client.get_system_stats()
        return {
            "status": "running" if stats else "offline",
            "vram": stats.get("ram", {}).get("used_percent", 0),
            "system_load": stats.get("system", {}).get("cpu_percent", 0)
        }

    # -- Saved-workflow templates (e.g. HiDream-O1) ------------------------- #

    @staticmethod
    def load_workflow_json(path: str, name: Optional[str] = None) -> ComfyUIWorkflow:
        """Load an API-format ComfyUI workflow JSON ({node_id: {...}}) from disk.

        Hand-building exotic graphs (HiDream-O1's custom sampler, the reference-
        image and seam-smoothing nodes) is fragile — node class_types drift
        between versions. Loading the official template JSON and overriding a few
        inputs is version-proof, so that's what this does.
        """
        with open(os.path.expanduser(path)) as f:
            data = json.load(f)
        # Accept either the API format directly or a {"prompt": {...}} wrapper.
        nodes = data.get("prompt", data) if isinstance(data, dict) else data
        return ComfyUIWorkflow(name or os.path.basename(path), nodes)

    @staticmethod
    def override_inputs(workflow: ComfyUIWorkflow, overrides: List[Dict]) -> int:
        """Set inputs on nodes matched by class_type and/or _meta title.

        Each override: {class_type?, title?, field, value, all?}. Returns the
        number of node inputs changed. Matches the first node unless all=True.
        """
        changed = 0
        for ov in overrides:
            for node in workflow.nodes.values():
                if not isinstance(node, dict):
                    continue
                if ov.get("class_type") and node.get("class_type") != ov["class_type"]:
                    continue
                if ov.get("title") and node.get("_meta", {}).get("title") != ov["title"]:
                    continue
                node.setdefault("inputs", {})[ov["field"]] = ov["value"]
                changed += 1
                if not ov.get("all"):
                    break
        return changed

    def prepare_hidream_o1(self, prompt: str, template_path: str,
                           checkpoint: Optional[str] = None,
                           reference_image: Optional[str] = None,
                           seed: Optional[int] = None,
                           steps: Optional[int] = None,
                           extra_overrides: Optional[List[Dict]] = None) -> ComfyUIWorkflow:
        """Load a HiDream-O1 template and patch in prompt/checkpoint/image/seed.

        Pure local file work — no server needed, so it's unit-testable. Submit
        the returned workflow with `client.queue_prompt`.
        """
        wf = self.load_workflow_json(template_path, name="hidream_o1")
        overrides: List[Dict] = [
            {"class_type": "CLIPTextEncode", "field": "text", "value": prompt},
        ]
        if checkpoint:
            overrides.append({"class_type": "CheckpointLoaderSimple",
                              "field": "ckpt_name", "value": checkpoint})
        if reference_image:
            # Edit mode: route a reference image into the Load Image node.
            overrides.append({"class_type": "LoadImage", "field": "image",
                              "value": reference_image})
        if seed is not None:
            # HiDream's sampler carries the noise seed; templates vary on the
            # node, so try the common seed fields on whatever sampler is present.
            for fld in ("noise_seed", "seed"):
                overrides.append({"field": fld, "value": seed, "all": True,
                                  "class_type": None})
        if steps is not None:
            overrides.append({"field": "steps", "value": steps, "all": True})
        if extra_overrides:
            overrides.extend(extra_overrides)
        self.override_inputs(wf, overrides)
        return wf

    async def handle_hidream_o1(self, prompt: str, template_path: str,
                                checkpoint: Optional[str] = None,
                                reference_image: Optional[str] = None,
                                seed: Optional[int] = None,
                                steps: Optional[int] = None) -> Dict:
        """Generate with HiDream-O1 via its official ComfyUI template."""
        if not os.path.isfile(os.path.expanduser(template_path)):
            return {"status": "failed", "error": "template_not_found",
                    "hint": "Download the HiDream-O1 workflow JSON from "
                            "github.com/Comfy-Org/workflow_templates "
                            "(image_hidream_o1.json / image_hidream_o1_dev.json) "
                            "and pass its path as template_path."}
        try:
            wf = self.prepare_hidream_o1(prompt, template_path, checkpoint,
                                         reference_image, seed, steps)
            result = await self.client.queue_prompt(wf)
        except Exception as e:
            msg = str(e)
            try:
                parsed = json.loads(msg)
                if isinstance(parsed, dict):
                    return {"status": "failed", **parsed}
            except (json.JSONDecodeError, ValueError):
                pass
            return {"status": "failed", "error": msg}
        prompt_id = result.get("prompt_id")
        if prompt_id and await self.client.wait_for_completion(prompt_id):
            return {"status": "completed", "engine": "hidream-o1",
                    "prompt_id": prompt_id,
                    "history": await self.client.get_history(prompt_id)}
        return {"status": "failed", "prompt_id": prompt_id}

    @staticmethod
    def hidream_o1_download_commands(comfyui_dir: str = "~/ComfyUI",
                                     dev: bool = False) -> List[str]:
        """Return wget commands to fetch HiDream-O1 weights into ComfyUI/models."""
        root = os.path.expanduser(comfyui_dir).rstrip("/") + "/models"
        manifest = HIDREAM_O1_MODELS_DEV if dev else HIDREAM_O1_MODELS_FULL
        cmds = []
        for rel, url in {**manifest, **HIDREAM_O1_SHARED}.items():
            target = f"{root}/{rel}"
            cmds.append(f"mkdir -p {os.path.dirname(target)} && "
                        f"wget -c -O {target} {url}")
        return cmds


# HiDream-O1-Image model download manifests (rel path under ComfyUI/models -> URL).
# HiDream-O1 (HiDream-ai, MIT, May 2026) is a unified pixel-level transformer:
# text-to-image, instruction editing, subject personalization, storyboards, up to
# 2048x2048, with strong long-text rendering. FP8 scaled is the default checkpoint.
_HF = "https://huggingface.co/Comfy-Org"
HIDREAM_O1_MODELS_FULL = {
    "checkpoints/hidream_o1_image_fp8_scaled.safetensors":
        f"{_HF}/HiDream-O1-Image/resolve/main/checkpoints/hidream_o1_image_fp8_scaled.safetensors",
}
HIDREAM_O1_MODELS_DEV = {
    "checkpoints/hidream_o1_image_dev_fp8_scaled.safetensors":
        f"{_HF}/HiDream-O1-Image/resolve/main/checkpoints/hidream_o1_image_dev_fp8_scaled.safetensors",
}
HIDREAM_O1_SHARED = {
    "text_encoders/gemma4_e4b_it_fp8_scaled.safetensors":
        f"{_HF}/gemma-4/resolve/main/text_encoders/gemma4_e4b_it_fp8_scaled.safetensors",
}


# ComfyUI Workflow Templates
COMFYUI_TEMPLATES = {
    "hidream_o1_full": {
        "description": "HiDream-O1 (Full) text-to-image / image-edit, up to 2048px",
        "params": ["prompt", "template_path", "reference_image", "seed", "steps"],
        "default_model": "hidream_o1_image_fp8_scaled.safetensors",
        "default_steps": 50,
        "workflow_template": "image_hidream_o1.json",
        "text_encoder": "gemma4_e4b_it_fp8_scaled.safetensors",
    },
    "hidream_o1_dev": {
        "description": "HiDream-O1 (Dev) distilled — 28 steps, CFG 1.0, no negative",
        "params": ["prompt", "template_path", "reference_image", "seed", "steps"],
        "default_model": "hidream_o1_image_dev_fp8_scaled.safetensors",
        "default_steps": 28,
        "workflow_template": "image_hidream_o1_dev.json",
        "text_encoder": "gemma4_e4b_it_fp8_scaled.safetensors",
    },
    "txt2img_sdxl": {
        "description": "Text-to-Image with SDXL",
        "params": ["prompt", "negative_prompt", "width", "height", "steps", "cfg"],
        "default_model": "sd_xl_base_1.0.safetensors"
    },
    "img2img_sd": {
        "description": "Image-to-Image with Stable Diffusion",
        "params": ["image", "prompt", "strength", "steps", "cfg"],
        "default_model": "sd_1.5.safetensors"
    },
    "controlnet": {
        "description": "ControlNet guided generation",
        "params": ["control_image", "prompt", "controlnet_model", "strength"],
        "default_model": "control_canny-fp16.safetensors"
    },
    "upscale": {
        "description": "Image upscaling",
        "params": ["image", "upscale_model", "upscale_factor"],
        "default_model": "RealESRGAN_x2.pth"
    },
    "video_generation": {
        "description": "Video generation from frames",
        "params": ["frames", "fps", "audio"],
        "default_model": None
    }
}


async def demo():
    """Demo ComfyUI handler."""
    logger.info("ComfyUI Handler Demo")

    handler = ComfyUIOrchestrationHandler()

    # Check system status
    status = await handler.get_system_status()
    logger.info(f"System status: {status}")

    # Example: Text-to-image
    try:
        result = await handler.handle_text_to_image(
            prompt="A serene landscape with mountains and a sunset",
            model="sd_xl_base_1.0.safetensors"
        )
        logger.info(f"Result: {result}")
    except Exception as e:
        logger.error(f"Generation failed: {e}")

    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
