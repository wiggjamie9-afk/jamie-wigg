#!/usr/bin/env python3
"""
ask.py — Search-Extract-Summarize with local Ollama

Implements RAG: retrieve relevant chunks from web/local files, then ask an LLM to answer.
Supports hybrid search (vector embeddings + BM25 full-text).

Usage:
  python ask.py -e .env.ollama -c -q "What is Ollama?"
  python ask.py -e .env.ollama -i local -c -q "How does ask.py work?"
  python ask.py -e .env.ollama  # starts Gradio UI
"""

import os
import sys
import logging
from pathlib import Path
from typing import Optional
import click
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_env(env_file: Optional[str] = None):
    """Load environment variables from .env file."""
    if env_file:
        env_path = Path(env_file)
        if not env_path.is_absolute():
            env_path = Path(__file__).parent / env_path
        load_dotenv(env_path)
        logger.info(f"Loaded env from {env_path}")
    else:
        load_dotenv()


def get_ollama_client():
    """Initialize OpenAI client pointed at local Ollama."""
    try:
        from openai import OpenAI
    except ImportError:
        logger.error("openai package not installed. Run: pip install -r requirements.txt")
        sys.exit(1)

    base_url = os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
    api_key = os.getenv("LLM_API_KEY", "dummy-key")
    return OpenAI(base_url=base_url, api_key=api_key)


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100):
    """Split text into overlapping chunks."""
    chunks = []
    step = chunk_size - overlap
    for i in range(0, len(text), step):
        chunk = text[i : i + chunk_size]
        if chunk.strip():
            chunks.append(chunk)
    return chunks


def embed_text(text: str, client):
    """Get embedding vector from Ollama via OpenAI-compatible API."""
    try:
        response = client.embeddings.create(
            model=os.getenv("EMBEDDING_MODEL", "nomic-embed-text"),
            input=text,
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Embedding failed: {e}")
        return None


def ask_llm(query: str, context: str, client, model: Optional[str] = None) -> str:
    """Ask LLM with context."""
    model = model or os.getenv("DEFAULT_INFERENCE_MODEL", "gemma-2")

    system_prompt = (
        "You are a helpful assistant. Answer the user's question based on the provided context. "
        "Be concise and cite the sources if available."
    )

    user_prompt = f"""
Context:
{context}

Question: {query}

Please answer the question based on the context above.
"""

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"LLM request failed: {e}")
        return "Error: Could not generate response."


def search_local_files(query: str, data_dir: str = "data") -> list[str]:
    """Search local files in data directory by filename matching."""
    data_path = Path(data_dir)
    if not data_path.exists():
        logger.warning(f"Data directory not found: {data_dir}")
        return []

    results = []
    for file_path in data_path.rglob("*"):
        if file_path.is_file() and query.lower() in file_path.name.lower():
            results.append(str(file_path))
    return results


def process_local_file(file_path: str) -> str:
    """Extract text from local file (txt, md, pdf, etc.)."""
    path = Path(file_path)

    if path.suffix in [".txt", ".md"]:
        return path.read_text()
    elif path.suffix == ".pdf":
        try:
            from docling.document_converter import DocumentConverter
            converter = DocumentConverter()
            result = converter.convert(str(path))
            return result.document.export_to_markdown()
        except Exception as e:
            logger.error(f"PDF conversion failed: {e}")
            return ""
    else:
        logger.warning(f"Unsupported file type: {path.suffix}")
        return ""


@click.command()
@click.option("-q", "--query", help="Query to search")
@click.option(
    "-i",
    "--input-mode",
    type=click.Choice(["search", "local"]),
    default="search",
    help="Input mode: search (web) or local (files)",
)
@click.option(
    "-o",
    "--output-mode",
    type=click.Choice(["answer", "extract"]),
    default="answer",
    help="Output mode",
)
@click.option(
    "--inference-model-name", help="Model name for inference (overrides env)"
)
@click.option(
    "-c",
    "--run-cli",
    is_flag=True,
    help="Run as CLI instead of Gradio UI",
)
@click.option(
    "-e",
    "--env",
    help="Environment file to load (.env.ollama, etc.)",
)
@click.option(
    "-l",
    "--log-level",
    type=click.Choice(["DEBUG", "INFO", "WARNING", "ERROR"]),
    default="INFO",
)
def main(
    query: Optional[str],
    input_mode: str,
    output_mode: str,
    inference_model_name: Optional[str],
    run_cli: bool,
    env: Optional[str],
    log_level: str,
):
    """ask.py — Search-Extract-Summarize with local Ollama."""

    # Setup
    logging.getLogger().setLevel(log_level)
    load_env(env)

    if run_cli:
        if not query:
            click.echo("Error: --query required for CLI mode")
            sys.exit(1)

        client = get_ollama_client()

        # For now, simple local file search
        if input_mode == "local":
            files = search_local_files(query)
            if not files:
                click.echo(f"No files found matching: {query}")
                return

            # Extract text from first match
            file_path = files[0]
            click.echo(f"Processing: {file_path}")
            text = process_local_file(file_path)

            if not text:
                click.echo("Could not extract text from file")
                return

            # Ask LLM
            answer = ask_llm(query, text, client, inference_model_name)
            click.echo(f"\nAnswer:\n{answer}")
        else:
            click.echo("Web search mode requires integration with Google Search API")
            click.echo("For now, use local mode: python ask.py -i local -c -q 'your query'")
    else:
        # Gradio UI
        try:
            import gradio as gr
        except ImportError:
            logger.error("gradio not installed. Run: pip install -r requirements.txt")
            sys.exit(1)

        def process_query(query: str, input_mode: str) -> str:
            client = get_ollama_client()
            if input_mode == "local":
                files = search_local_files(query)
                if not files:
                    return f"No files found matching: {query}"
                text = process_local_file(files[0])
                if not text:
                    return "Could not extract text from file"
                return ask_llm(query, text, client)
            else:
                return "Web search requires Google API keys. Use local mode."

        with gr.Blocks(title="ask.py") as demo:
            gr.Markdown("# ask.py — Local Search & Summarize")
            gr.Markdown(
                "Search local files or web with Ollama LLM (gemma-2) + embeddings (nomic-embed-text)"
            )

            with gr.Row():
                query_input = gr.Textbox(
                    label="Query",
                    placeholder="Ask a question...",
                    lines=2,
                )
                mode_input = gr.Radio(
                    choices=["local", "search"],
                    value="local",
                    label="Mode",
                )

            submit_btn = gr.Button("Search", variant="primary")
            output = gr.Textbox(label="Answer", lines=5)

            submit_btn.click(
                process_query,
                inputs=[query_input, mode_input],
                outputs=output,
            )

        demo.launch(
            share=os.getenv("SHARE_GRADIO_UI", "false").lower() == "true",
            server_name="127.0.0.1",
        )


if __name__ == "__main__":
    main()
