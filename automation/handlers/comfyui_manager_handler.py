#!/usr/bin/env python3
"""
ComfyUI-Manager Integration Handler
Programmatic management of ComfyUI custom nodes, models, and components.
"""

import os
import json
import logging
import asyncio
import subprocess
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class CustomNode:
    """Represents a ComfyUI custom node package."""

    name: str
    author: str
    description: str
    git_url: Optional[str] = None
    installed: bool = False
    enabled: bool = True
    version: Optional[str] = None


@dataclass
class Model:
    """Represents a model for ComfyUI."""

    name: str
    model_type: str  # checkpoint, lora, vae, controlnet, etc.
    path: str
    size_gb: float
    installed: bool = False
    url: Optional[str] = None


@dataclass
class Component:
    """Represents a reusable ComfyUI component."""

    name: str
    prefix: str
    category: str
    node_data: Dict[str, Any]
    version: str = "1.0"
    created_at: datetime = None

    def to_clipboard_format(self) -> Dict:
        """Convert to format suitable for clipboard sharing."""
        return {
            "kind": "ComfyUI Components",
            "timestamp": int(datetime.now().timestamp() * 1000),
            "components": {
                f"{self.prefix}::{self.name}": self.node_data
            },
            "version": self.version,
            "category": self.category
        }


class ComfyUIManagerClient:
    """Client for ComfyUI-Manager API and CLI operations."""

    def __init__(self, comfyui_path: str = "~/ComfyUI"):
        self.comfyui_path = os.path.expanduser(comfyui_path)
        self.manager_path = os.path.join(self.comfyui_path, "custom_nodes", "comfyui-manager")
        self.config_path = os.path.join(self.manager_path, "config.ini")
        self.custom_nodes_dir = os.path.join(self.comfyui_path, "custom_nodes")
        self.models_dir = os.path.join(self.comfyui_path, "models")

    async def is_manager_installed(self) -> bool:
        """Check if ComfyUI-Manager is installed."""
        return os.path.exists(self.manager_path)

    async def get_installed_nodes(self) -> List[CustomNode]:
        """Get list of installed custom nodes."""
        installed_nodes = []

        if not os.path.exists(self.custom_nodes_dir):
            return installed_nodes

        for node_dir in os.listdir(self.custom_nodes_dir):
            node_path = os.path.join(self.custom_nodes_dir, node_dir)

            if not os.path.isdir(node_path) or node_dir in ["__pycache__", "comfyui-manager"]:
                continue

            # Try to read node info
            pyproject_path = os.path.join(node_path, "pyproject.toml")
            node_list_path = os.path.join(node_path, "node_list.json")

            version = None
            if os.path.exists(pyproject_path):
                try:
                    import tomllib
                    with open(pyproject_path, "rb") as f:
                        data = tomllib.load(f)
                        version = data.get("project", {}).get("version")
                except:
                    pass

            installed_nodes.append(CustomNode(
                name=node_dir,
                author="Unknown",
                description="Custom node",
                installed=True,
                version=version
            ))

        return installed_nodes

    async def get_available_nodes(self) -> List[CustomNode]:
        """Get list of available nodes from registry."""
        # This would fetch from the ComfyUI registry
        # For now, return empty list
        # In production, would call registry API
        return []

    async def install_node(self, git_url: str) -> bool:
        """Install a custom node from Git URL."""
        logger.info(f"Installing custom node from: {git_url}")

        try:
            # Use cm-cli if available
            result = subprocess.run(
                ["cm-cli", "install-via-git-url", git_url],
                capture_output=True,
                timeout=300,
                text=True
            )

            if result.returncode == 0:
                logger.info(f"Successfully installed node")
                return True
            else:
                logger.error(f"Installation failed: {result.stderr}")
                return False
        except FileNotFoundError:
            logger.error("cm-cli not found. Install with: pip install comfy-cli")
            return False
        except Exception as e:
            logger.error(f"Installation error: {e}")
            return False

    async def uninstall_node(self, node_name: str) -> bool:
        """Uninstall a custom node."""
        logger.info(f"Uninstalling node: {node_name}")

        try:
            result = subprocess.run(
                ["cm-cli", "uninstall-custom-node", node_name],
                capture_output=True,
                timeout=60,
                text=True
            )

            if result.returncode == 0:
                logger.info(f"Successfully uninstalled node")
                return True
            else:
                logger.error(f"Uninstall failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"Uninstall error: {e}")
            return False

    async def enable_node(self, node_name: str) -> bool:
        """Enable a disabled custom node."""
        logger.info(f"Enabling node: {node_name}")
        node_path = os.path.join(self.custom_nodes_dir, node_name)

        if not os.path.exists(node_path):
            logger.error(f"Node not found: {node_path}")
            return False

        # Rename .disabled file if it exists
        disabled_path = f"{node_path}.disabled"
        if os.path.exists(disabled_path):
            try:
                os.rename(disabled_path, node_path)
                return True
            except Exception as e:
                logger.error(f"Enable failed: {e}")
                return False

        return True

    async def disable_node(self, node_name: str) -> bool:
        """Disable a custom node without uninstalling."""
        logger.info(f"Disabling node: {node_name}")
        node_path = os.path.join(self.custom_nodes_dir, node_name)

        if not os.path.exists(node_path):
            logger.error(f"Node not found: {node_path}")
            return False

        try:
            disabled_path = f"{node_path}.disabled"
            os.rename(node_path, disabled_path)
            return True
        except Exception as e:
            logger.error(f"Disable failed: {e}")
            return False

    async def install_model(self, model_url: str, model_type: str = "checkpoint") -> bool:
        """Download and install a model."""
        logger.info(f"Installing model from: {model_url}")

        try:
            result = subprocess.run(
                ["cm-cli", "install-model", "--url", model_url, "--type", model_type],
                capture_output=True,
                timeout=3600,  # 1 hour timeout for large models
                text=True
            )

            if result.returncode == 0:
                logger.info(f"Model installed successfully")
                return True
            else:
                logger.error(f"Model install failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"Model install error: {e}")
            return False

    async def get_installed_models(self) -> List[Model]:
        """Scan and list installed models."""
        models = []
        model_subdirs = {
            "checkpoint": "checkpoints",
            "lora": "loras",
            "vae": "vae",
            "controlnet": "controlnet",
            "embeddings": "embeddings",
            "upscale_models": "upscale_models"
        }

        for model_type, subdir in model_subdirs.items():
            model_path = os.path.join(self.models_dir, subdir)

            if not os.path.exists(model_path):
                continue

            for model_file in os.listdir(model_path):
                if model_file.startswith("."):
                    continue

                file_path = os.path.join(model_path, model_file)
                if os.path.isfile(file_path):
                    size_gb = os.path.getsize(file_path) / (1024**3)

                    models.append(Model(
                        name=model_file,
                        model_type=model_type,
                        path=file_path,
                        size_gb=round(size_gb, 2),
                        installed=True
                    ))

        return models

    async def create_snapshot(self, snapshot_name: str) -> bool:
        """Create installation snapshot."""
        logger.info(f"Creating snapshot: {snapshot_name}")

        try:
            result = subprocess.run(
                ["cm-cli", "save-snapshot", "--name", snapshot_name],
                capture_output=True,
                timeout=60,
                text=True
            )

            if result.returncode == 0:
                logger.info(f"Snapshot created successfully")
                return True
            else:
                logger.error(f"Snapshot creation failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"Snapshot error: {e}")
            return False

    async def restore_snapshot(self, snapshot_name: str) -> bool:
        """Restore installation from snapshot."""
        logger.info(f"Restoring snapshot: {snapshot_name}")

        try:
            result = subprocess.run(
                ["cm-cli", "restore-snapshot", "--name", snapshot_name],
                capture_output=True,
                timeout=600,
                text=True
            )

            if result.returncode == 0:
                logger.info(f"Snapshot restored successfully")
                return True
            else:
                logger.error(f"Restore failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"Restore error: {e}")
            return False

    async def list_snapshots(self) -> List[Dict[str, str]]:
        """List available snapshots."""
        try:
            result = subprocess.run(
                ["cm-cli", "list-snapshots"],
                capture_output=True,
                timeout=30,
                text=True
            )

            if result.returncode == 0:
                # Parse output
                snapshots = []
                for line in result.stdout.split("\n"):
                    if line.strip():
                        parts = line.split()
                        if len(parts) >= 2:
                            snapshots.append({
                                "name": parts[0],
                                "timestamp": parts[1] if len(parts) > 1 else "Unknown"
                            })
                return snapshots
            else:
                logger.error(f"List failed: {result.stderr}")
                return []
        except Exception as e:
            logger.error(f"List error: {e}")
            return []

    async def update_all(self) -> bool:
        """Update all installed custom nodes and ComfyUI."""
        logger.info("Updating all custom nodes...")

        try:
            result = subprocess.run(
                ["cm-cli", "update-all"],
                capture_output=True,
                timeout=1800,  # 30 min timeout
                text=True
            )

            if result.returncode == 0:
                logger.info("All updates completed successfully")
                return True
            else:
                logger.error(f"Update failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"Update error: {e}")
            return False

    async def fix_missing_nodes(self, workflow_json: Dict) -> bool:
        """Auto-install missing nodes referenced in a workflow."""
        logger.info("Installing missing nodes for workflow...")

        # Extract node class names from workflow
        missing_nodes = set()
        for node_id, node_data in workflow_json.get("nodes", {}).items():
            class_type = node_data.get("class_type")
            if class_type:
                missing_nodes.add(class_type)

        for node_class in missing_nodes:
            try:
                result = subprocess.run(
                    ["cm-cli", "install-missing-nodes", "--node-class", node_class],
                    capture_output=True,
                    timeout=300,
                    text=True
                )

                if result.returncode != 0:
                    logger.warning(f"Could not auto-install node: {node_class}")
            except Exception as e:
                logger.warning(f"Error installing node {node_class}: {e}")

        return True

    async def configure_security(self, level: str = "normal") -> bool:
        """Configure security level."""
        valid_levels = ["strong", "normal", "normal-", "weak"]

        if level not in valid_levels:
            logger.error(f"Invalid security level: {level}")
            return False

        logger.info(f"Configuring security level: {level}")

        try:
            if not os.path.exists(self.config_path):
                # Create config file
                config_content = f"[default]\nsecurity_level = {level}\n"
                os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
                with open(self.config_path, "w") as f:
                    f.write(config_content)
            else:
                # Update existing config
                with open(self.config_path, "r") as f:
                    content = f.read()

                if "security_level" in content:
                    import re
                    content = re.sub(r'security_level = \w+', f'security_level = {level}', content)
                else:
                    content += f"\nsecurity_level = {level}\n"

                with open(self.config_path, "w") as f:
                    f.write(content)

            return True
        except Exception as e:
            logger.error(f"Configuration error: {e}")
            return False


class ComfyUIManagerOrchestrationHandler:
    """Handle ComfyUI-Manager tasks in the orchestrator."""

    def __init__(self, comfyui_path: str = "~/ComfyUI"):
        self.client = ComfyUIManagerClient(comfyui_path)

    async def handle_node_installation(self, git_urls: List[str]) -> Dict:
        """Install multiple custom nodes."""
        logger.info(f"Installing {len(git_urls)} custom nodes...")

        results = {
            "installed": [],
            "failed": [],
            "status": "completed"
        }

        for git_url in git_urls:
            if await self.client.install_node(git_url):
                results["installed"].append(git_url)
            else:
                results["failed"].append(git_url)

        return results

    async def handle_model_installation(self, models: List[Dict]) -> Dict:
        """Install multiple models."""
        logger.info(f"Installing {len(models)} models...")

        results = {
            "installed": [],
            "failed": [],
            "status": "completed"
        }

        for model in models:
            url = model.get("url")
            model_type = model.get("type", "checkpoint")

            if await self.client.install_model(url, model_type):
                results["installed"].append(url)
            else:
                results["failed"].append(url)

        return results

    async def handle_workflow_preparation(self, workflow_json: Dict) -> Dict:
        """Prepare workflow by installing missing nodes and optimizing."""
        logger.info("Preparing workflow for execution...")

        # Install missing nodes
        await self.client.fix_missing_nodes(workflow_json)

        # Get installed nodes for verification
        installed_nodes = await self.client.get_installed_nodes()
        installed_names = {node.name for node in installed_nodes}

        # Check workflow requirements
        required_nodes = set()
        for node_id, node_data in workflow_json.get("nodes", {}).items():
            class_type = node_data.get("class_type")
            if class_type:
                required_nodes.add(class_type)

        missing = required_nodes - installed_names

        return {
            "status": "ready" if not missing else "incomplete",
            "required_nodes": list(required_nodes),
            "installed_nodes": list(installed_names),
            "missing_nodes": list(missing),
            "workflow_id": workflow_json.get("id", "unknown")
        }

    async def handle_backup_and_restore(self, action: str, snapshot_name: str = None) -> Dict:
        """Backup or restore ComfyUI installation."""
        logger.info(f"Backup/restore action: {action}")

        if action == "snapshot":
            snapshot_name = snapshot_name or f"snapshot-{int(datetime.now().timestamp())}"
            success = await self.client.create_snapshot(snapshot_name)
            return {
                "status": "completed" if success else "failed",
                "action": "snapshot",
                "snapshot_name": snapshot_name
            }

        elif action == "restore":
            if not snapshot_name:
                logger.error("Snapshot name required for restore")
                return {"status": "failed", "error": "No snapshot specified"}

            success = await self.client.restore_snapshot(snapshot_name)
            return {
                "status": "completed" if success else "failed",
                "action": "restore",
                "snapshot_name": snapshot_name
            }

        elif action == "list":
            snapshots = await self.client.list_snapshots()
            return {
                "status": "completed",
                "action": "list",
                "snapshots": snapshots
            }

        else:
            return {"status": "failed", "error": f"Unknown action: {action}"}

    async def handle_system_update(self) -> Dict:
        """Update all ComfyUI and custom nodes."""
        logger.info("Performing system update...")

        # Create backup before update
        backup_name = f"pre-update-{int(datetime.now().timestamp())}"
        await self.client.create_snapshot(backup_name)

        # Update all
        success = await self.client.update_all()

        return {
            "status": "completed" if success else "failed",
            "action": "update",
            "backup_snapshot": backup_name,
            "update_success": success
        }

    async def handle_system_status(self) -> Dict:
        """Get complete system status."""
        logger.info("Getting system status...")

        installed_nodes = await self.client.get_installed_nodes()
        installed_models = await self.client.get_installed_models()
        snapshots = await self.client.list_snapshots()

        total_model_size = sum(m.size_gb for m in installed_models)

        return {
            "status": "ready",
            "installed_nodes": {
                "count": len(installed_nodes),
                "nodes": [n.name for n in installed_nodes]
            },
            "installed_models": {
                "count": len(installed_models),
                "total_size_gb": round(total_model_size, 2),
                "by_type": {}
            },
            "snapshots": {
                "count": len(snapshots),
                "snapshots": snapshots
            },
            "manager_installed": await self.client.is_manager_installed()
        }


async def demo():
    """Demo ComfyUI-Manager handler."""
    logger.info("ComfyUI-Manager Handler Demo")

    handler = ComfyUIManagerOrchestrationHandler()

    # Get system status
    status = await handler.handle_system_status()
    logger.info(f"System status: {json.dumps(status, indent=2)}")

    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
