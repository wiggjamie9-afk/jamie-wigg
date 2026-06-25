"""
RHYTHMIX Empire Orchestrator Package

Autonomous AI-driven workflow automation system.
"""

__version__ = "0.1.0"
__author__ = "RHYTHMIX Team"

from automation.orchestrator import (
    RHYTHMIXOrchestrator,
    Task,
    TaskType,
    TaskPriority,
    TaskQueue,
    ClaudeDispatcher
)

from automation.voice_interface import (
    VoiceInterface,
    VoiceCommandProcessor
)

__all__ = [
    "RHYTHMIXOrchestrator",
    "Task",
    "TaskType",
    "TaskPriority",
    "TaskQueue",
    "ClaudeDispatcher",
    "VoiceInterface",
    "VoiceCommandProcessor"
]
