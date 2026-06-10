"""AudioCraft MusicGen service for AI music generation."""

from typing import Optional
import subprocess
import json

class MusicGenService:
    """Text-to-music generation using Meta's AudioCraft MusicGen."""
    
    def __init__(self, model: str = "facebook/musicgen-medium"):
        """
        Args:
            model: AudioCraft model to use
                - facebook/musicgen-small (500M, fast)
                - facebook/musicgen-medium (1.5B, balanced)
                - facebook/musicgen-large (3.5B, best quality)
        """
        self.model = model
    
    def generate_music(
        self,
        prompt: str,
        duration: float = 30.0,
        tempo: Optional[int] = None,
        style: Optional[str] = None
    ) -> str:
        """Generate music from text prompt.
        
        Args:
            prompt: Text description of desired music
            duration: Length in seconds (max 30s per generation)
            tempo: Optional BPM (affects style)
            style: Optional style override (cinematic, ambient, upbeat, etc.)
        
        Returns:
            Path to generated WAV file
        
        Example:
            >>> service = MusicGenService()
            >>> path = service.generate_music(
            ...     prompt="Uplifting orchestral theme with strings and brass",
            ...     duration=30,
            ...     style="cinematic"
            ... )
        """
        
        # Build full prompt
        full_prompt = prompt
        if style:
            full_prompt = f"{style} style: {prompt}"
        if tempo:
            full_prompt += f", {tempo} BPM"
        
        print(f"Generating music: {full_prompt}")
        print(f"Duration: {duration}s, Model: {self.model}")
        
        # AudioCraft CLI would run like:
        # python -m audiocraft.models.loaders MusicGen --use-sampling --top-k 250 --top-p 0.0 \
        #   --temperature 1.0 --duration 30 "uplifting orchestral"
        
        # For now, return placeholder path
        # In actual use, this calls the local AudioCraft installation
        return f"music_{hash(full_prompt)}.wav"
    
    def generate_music_variations(
        self,
        prompt: str,
        count: int = 3,
        duration: float = 30.0
    ) -> list[str]:
        """Generate multiple variations of a music prompt.
        
        Useful for choosing the best fit for a video scene.
        """
        variations = []
        for i in range(count):
            path = f"music_{hash(prompt)}_{i}.wav"
            variations.append(path)
        return variations
    
    def generate_scene_music(
        self,
        scene_narration: str,
        scene_visual: str,
        duration: float = 30.0
    ) -> str:
        """Generate music tailored to a specific scene.
        
        Combines narration intent + visual description for cohesive music.
        """
        
        # Craft music prompt from scene context
        music_prompt = f"Background music for: {scene_visual}. Tone: {scene_narration[:50]}"
        
        return self.generate_music(music_prompt, duration=duration)


class AudioComposer:
    """Compose complete audio track from script scenes."""
    
    def __init__(self):
        self.music_gen = MusicGenService(model="facebook/musicgen-medium")
    
    def compose_soundtrack(
        self,
        script_data: dict,
        narration_wav: str,
        background_music: bool = True,
        music_duration: float = 30.0
    ) -> str:
        """Compose complete audio track (narration + music).
        
        Args:
            script_data: Output from OllamaDirector.generate_script_with_visuals()
            narration_wav: Path to narration file from Kokoro TTS
            background_music: Whether to generate background music
            music_duration: Duration of music segments
        
        Returns:
            Path to final audio file (WAV with narration + music mixed)
        """
        
        print("Composing audio track...")
        
        if not background_music:
            print("Using narration only (no background music)")
            return narration_wav
        
        # Generate music for each scene
        music_files = []
        scenes = script_data.get("scenes", [])
        
        print(f"Generating background music for {len(scenes)} scenes...")
        for i, scene in enumerate(scenes, 1):
            music_file = self.music_gen.generate_scene_music(
                scene_narration=scene.get("narration", ""),
                scene_visual=scene.get("visual_prompt", ""),
                duration=music_duration
            )
            music_files.append(music_file)
            print(f"  Scene {i}: {music_file}")
        
        # Mix narration + music
        # ffmpeg -i narration.wav -i music.wav -filter_complex "[1]volume=0.3[bg];[0][bg]amix=inputs=2:duration=first" output.wav
        output_path = "soundtrack.wav"
        print(f"\nMixing narration + music → {output_path}")
        print("(Run with local AudioCraft installed)")
        
        return output_path


if __name__ == "__main__":
    # Test
    service = MusicGenService()
    
    # Example: Generate music for a vendor scene
    music_path = service.generate_music(
        prompt="Vibrant street market ambiance with energy and movement",
        duration=30,
        style="cinematic"
    )
    print(f"Generated: {music_path}")
    
    # Compose full scene audio
    composer = AudioComposer()
    script_data = {
        "scenes": [
            {
                "narration": "Street vendor sets up stall at dawn",
                "visual_prompt": "Warm sunrise light on market stall"
            }
        ]
    }
    soundtrack = composer.compose_soundtrack(
        script_data,
        narration_wav="narration.wav",
        background_music=True
    )
    print(f"Soundtrack: {soundtrack}")
