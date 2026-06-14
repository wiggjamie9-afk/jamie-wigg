# PDF Analyzer Web 📄

A beautiful Next.js frontend for the PDF Analyzer API. Upload, analyze, and chat with PDF documents using AI.

## Features

- ✨ **Beautiful UI** - Modern gradient design with dark theme
- 📄 **Multiple Analysis Types**
  - General analysis
  - Executive summary
  - Key information extraction
  - Q&A generation
- 💬 **Interactive Chat** - Ask questions about your PDF
- 📥 **Text Extraction** - Extract raw text from PDFs
- 📊 **Token Tracking** - Monitor API usage
- 🎯 **Responsive Design** - Works on all devices
- 🔗 **API Integration** - Seamless connection to PDF Analyzer API

## Quick Start

### Prerequisites

- Node.js 18+ (download from nodejs.org)
- PDF Analyzer API running locally or deployed

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local (optional - defaults to localhost:8000)
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

## Configuration

### Environment Variables

```bash
# .env.local or .env.production

# API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production example:
# NEXT_PUBLIC_API_URL=https://api.pdf-analyzer.com
```

**Note**: `NEXT_PUBLIC_` prefix makes variables available in the browser.

## Usage

### 1. Upload a PDF

Click the upload area or drag and drop a PDF file.

### 2. Choose Analysis Type

- **General Analysis** - Comprehensive review
- **Executive Summary** - Concise overview
- **Key Information** - Extract facts and figures
- **Q&A Generation** - Auto-generated questions

### 3. Get Results

Click "Analyze PDF" and wait for AI analysis.

### 4. Interactive Chat (Optional)

Ask follow-up questions in the chat tab to explore the PDF further.

### 5. Extract Text

Use the extract tab to get raw PDF text without AI analysis.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` = Your API URL

### Docker

```bash
# Build image
docker build -t pdf-analyzer-web .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://pdf-analyzer-api:8000 \
  pdf-analyzer-web
```

## File Structure

```
pdf-analyzer-web/
├── app/
│   ├── page.tsx           # Main application
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Tailwind styles
├── public/                # Static assets
├── .env.example           # Environment template
└── package.json           # Dependencies
```

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## CORS Configuration

If you get CORS errors, enable CORS in the PDF Analyzer API.

In `pdf-analyzer-api/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### API Connection Error

1. Check API is running: `curl http://localhost:8000/`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check CORS headers

### Build Issues

```bash
# Clear and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## License

MIT

---

**Made with ❤️ by Claude Code**

Get started: `npm install && npm run dev`
