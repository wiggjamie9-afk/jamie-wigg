"""Ollama LLM service for local script & visual prompt generation."""

from ollama import chat
from typing import Optional

class OllamaDirector:
    """LLM director for scene scripts + visual prompts using Ollama."""
    
    def __init__(self, model: str = "mistral", base_url: str = "http://localhost:11434"):
        """
        Args:
            model: Ollama model to use (mistral, gemma4, neural-chat, etc.)
            base_url: Ollama API endpoint
        """
        self.model = model
        self.base_url = base_url
    
    def generate_script_with_visuals(
        self,
        topic: str,
        scene_count: int = 4,
        tone: str = "cinematic",
        style: str = "modern"
    ) -> dict:
        """Generate script + visual prompts in one pass.
        
        Returns:
            {
                "script": "Narration text...",
                "scenes": [
                    {"narration": "...", "visual_prompt": "..."},
                    ...
                ]
            }
        """
        
        system_prompt = f"""You are a cinematic director and visual artist.
Generate a {tone} {scene_count}-scene video script about: {topic}

For each scene, provide:
1. A short narration line (1-2 sentences for voiceover)
2. A detailed visual prompt for AI image generation (describing composition, lighting, mood, camera angle)

Format as JSON:
{{
    "script": "Full narration combining all scene voiceovers",
    "scenes": [
        {{"narration": "...", "visual_prompt": "..."}},
        ...
    ]
}}"""
        
        user_prompt = f"""Topic: {topic}
Scenes: {scene_count}
Style: {style} cinematic
Tone: {tone}

Generate the complete script and visual prompts."""
        
        response = chat(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            stream=False
        )
        
        import json
        try:
            content = response.message.content
            # Extract JSON if wrapped in markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            return json.loads(content)
        except (json.JSONDecodeError, IndexError) as e:
            # Fallback: return raw response
            return {
                "script": response.message.content,
                "scenes": [{"narration": response.message.content, "visual_prompt": ""}]
            }
    
    def generate_visual_prompts(self, script_lines: list[str]) -> list[str]:
        """Convert narration lines to detailed visual prompts."""
        prompts = []
        
        for line in script_lines:
            response = chat(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": f"""Convert this narration into a detailed AI image generation prompt.
                    
Narration: "{line}"

Requirements:
- Cinematic composition
- Specific lighting (warm/cool, direction, intensity)
- Camera angle and depth
- Color palette
- Mood and atmosphere
- Art style (photorealistic, illustration, etc.)

Generate a single detailed prompt (2-3 sentences)."""
                }],
                stream=False
            )
            prompts.append(response.message.content)
        
        return prompts


# Test configuration
if __name__ == "__main__":
    director = OllamaDirector(model="mistral")
    
    # Example: Generate a 4-scene promo about street food vendors
    result = director.generate_script_with_visuals(
        topic="Street food vendor's daily hustle - challenges, rewards, community",
        scene_count=4,
        tone="inspiring",
        style="documentary"
    )
    
    print("Script:", result.get("script"))
    print("\nScenes:")
    for i, scene in enumerate(result.get("scenes", []), 1):
        print(f"\n  Scene {i}:")
        print(f"    Narration: {scene.get('narration')}")
        print(f"    Visual: {scene.get('visual_prompt')}")
