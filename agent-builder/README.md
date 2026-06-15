# Visual Agent Builder

A Next.js-based visual interface for configuring and managing AI agents. Configure models, select tools, define system prompts, and export agent configurations.

## Features

- **Model Selection**: Choose from Claude Haiku, Sonnet, and Opus with detailed descriptions
- **Tool Configuration**: Select from 10+ categorized tools (Search, Code, Data, Communication, Utility)
- **Prompt Editor**: Write custom system prompts for your agent
- **Temperature Control**: Adjust creativity vs. determinism with a slider
- **Visual Capabilities Display**: See a real-time preview of your agent's configuration
- **Configuration Status**: Check if your agent is ready to deploy
- **Export**: Download agent configuration as JSON

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **React 19** - Modern React features

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the agent builder.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
agent-builder/
├── app/
│   ├── page.tsx          # Main page with header and layout
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── AgentForm.tsx           # Main form component
│   ├── ModelSelector.tsx       # Model selection component
│   ├── ToolSelector.tsx        # Tool selection component
│   └── CapabilitiesDisplay.tsx # Visual capabilities display
├── package.json
└── tsconfig.json
```

## Components

### AgentForm
Main component that orchestrates the entire agent builder interface. Manages agent configuration state and provides form inputs.

### ModelSelector
Displays available Claude models with descriptions and performance tiers. Users can select their preferred model.

### ToolSelector
Grid of available tools organized by category (Information, Development, Analytics, Communication, Utility). Multi-select interface.

### CapabilitiesDisplay
Real-time visual representation of the configured agent, showing:
- Agent name and selected model
- Current temperature setting
- Selected tools
- System prompt preview
- Configuration status checklist

## Agent Configuration

An agent configuration includes:

```typescript
{
  name: string;              // Agent name
  description: string;        // Agent description
  model: string;             // Selected Claude model ID
  tools: string[];           // Array of selected tool IDs
  systemPrompt: string;      // System prompt text
  temperature: number;       // 0-2 range (0=deterministic, 2=creative)
}
```

## Export

Click "Export Agent Config" to download the configuration as a JSON file, ready to be used with Claude API or other agent frameworks.
