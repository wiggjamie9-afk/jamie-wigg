#!/usr/bin/env python3
"""
PDF Analyzer API - FastAPI application for analyzing PDFs with Claude AI
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import PyPDF2
from anthropic import Anthropic

# Load environment variables
load_dotenv()

app = FastAPI(
    title="PDF Analyzer API",
    description="Analyze PDF documents with AI-powered insights",
    version="1.0.0"
)

# Initialize Anthropic client
client = Anthropic()

# Models
class AnalysisRequest(BaseModel):
    query: str
    analysis_type: Optional[str] = "general"  # general, summary, extraction, questions

class AnalysisResponse(BaseModel):
    status: str
    analysis: str
    pages_analyzed: int
    tokens_used: Optional[int] = None

class ConversationMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ConversationRequest(BaseModel):
    pdf_text: str
    messages: list[ConversationMessage]
    analysis_type: Optional[str] = "general"

def extract_text_from_pdf(file_content: bytes) -> tuple[str, int]:
    """Extract text from PDF file content."""
    try:
        pdf_reader = PyPDF2.PdfReader(open("/tmp/temp_pdf.pdf", "rb"))
        text = ""
        page_count = len(pdf_reader.pages)

        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"

        return text, page_count
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF extraction error: {str(e)}")

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> tuple[str, int]:
    """Extract text from PDF bytes."""
    try:
        import io
        pdf_file = io.BytesIO(pdf_bytes)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        page_count = len(pdf_reader.pages)

        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"

        return text, page_count
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF extraction error: {str(e)}")

@app.get("/")
async def root():
    """API health check."""
    return {
        "status": "healthy",
        "service": "PDF Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "POST /analyze",
            "chat": "POST /chat",
            "health": "GET /"
        }
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_pdf(
    file: UploadFile = File(...),
    query: str = "Provide a comprehensive analysis of this document",
    analysis_type: str = "general"
):
    """
    Analyze a PDF document with Claude AI.

    Supported analysis types:
    - general: Comprehensive analysis
    - summary: Executive summary
    - extraction: Extract key information
    - questions: Generate Q&A
    """

    try:
        # Read PDF content
        pdf_bytes = await file.read()
        pdf_text, page_count = extract_text_from_pdf_bytes(pdf_bytes)

        if not pdf_text.strip():
            raise HTTPException(status_code=400, detail="PDF appears to be empty or unreadable")

        # Limit text length for API
        max_chars = 100000
        if len(pdf_text) > max_chars:
            pdf_text = pdf_text[:max_chars]

        # Prepare prompt based on analysis type
        prompts = {
            "general": f"Analyze this PDF document and provide insights on:\n1. Main topics\n2. Key findings\n3. Important details\n\nDocument:\n{pdf_text}\n\nQuery: {query}",
            "summary": f"Provide a concise executive summary of this PDF:\n\n{pdf_text}",
            "extraction": f"Extract and organize the key information from this PDF:\n\n{pdf_text}",
            "questions": f"Generate 5-10 important questions and answers based on this PDF:\n\n{pdf_text}"
        }

        prompt = prompts.get(analysis_type, prompts["general"])

        # Call Claude API
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        analysis = response.content[0].text

        return AnalysisResponse(
            status="success",
            analysis=analysis,
            pages_analyzed=page_count,
            tokens_used=response.usage.input_tokens + response.usage.output_tokens
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.post("/chat")
async def chat_with_pdf(
    file: UploadFile = File(...),
    messages: list[dict] = []
):
    """
    Have a conversation about a PDF document.

    Example:
    {
      "file": <PDF file>,
      "messages": [
        {"role": "user", "content": "What is the main topic?"}
      ]
    }
    """

    try:
        # Read PDF content
        pdf_bytes = await file.read()
        pdf_text, page_count = extract_text_from_pdf_bytes(pdf_bytes)

        if not pdf_text.strip():
            raise HTTPException(status_code=400, detail="PDF appears to be empty or unreadable")

        # Limit text length
        max_chars = 100000
        if len(pdf_text) > max_chars:
            pdf_text = pdf_text[:max_chars]

        # Build conversation history
        conversation_messages = [
            {
                "role": "user",
                "content": f"Here is a PDF document I want to discuss:\n\n{pdf_text}\n\nPlease help me understand and analyze it."
            },
            {
                "role": "assistant",
                "content": f"I've reviewed the {page_count}-page document. I'm ready to help you analyze and discuss it. What would you like to know?"
            }
        ]

        # Add user messages
        if messages:
            for msg in messages:
                conversation_messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })

        # Call Claude API
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=conversation_messages
        )

        return JSONResponse({
            "status": "success",
            "response": response.content[0].text,
            "pages_analyzed": page_count,
            "tokens_used": response.usage.input_tokens + response.usage.output_tokens
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.post("/extract")
async def extract_pdf_text(file: UploadFile = File(...)):
    """Extract raw text from PDF without AI analysis."""

    try:
        pdf_bytes = await file.read()
        pdf_text, page_count = extract_text_from_pdf_bytes(pdf_bytes)

        return JSONResponse({
            "status": "success",
            "text": pdf_text,
            "pages": page_count,
            "characters": len(pdf_text)
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
