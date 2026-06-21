# GCP Resources MCP Server

This MCP server provides Claude with access to your Google Cloud Platform resources via the Model Context Protocol.

## Setup

### 1. Install Dependencies

```bash
cd .claude/mcp/gcp-resources
npm install
```

### 2. Authenticate with GCP

```bash
# Install Google Cloud SDK if needed
# https://cloud.google.com/sdk/docs/install

# Authenticate with Application Default Credentials
gcloud auth application-default login

# Set your default project
gcloud config set project YOUR-PROJECT-ID
```

### 3. Configure Environment Variable

Add to your `.env` file at the repo root:

```bash
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
```

Or set it in your shell before running Claude Code:

```bash
export GOOGLE_CLOUD_PROJECT=your-gcp-project-id
```

## Desktop Claude Access

This server is automatically registered in `.mcp.json` and enabled in `.claude/settings.json`.

When you run Claude Code on your desktop/laptop, the server will:
1. Start automatically via the MCP protocol
2. Use your local GCP credentials (from `gcloud auth application-default login`)
3. Expose these tools to Claude:
   - `list_projects` - List your GCP projects
   - `list_compute_instances` - List Compute Engine VMs
   - `list_storage_buckets` - List Cloud Storage buckets
   - `get_instance_details` - Get details about a specific VM
   - `get_bucket_details` - Get details about a specific bucket

## Usage in Claude Code

Once connected, you can ask Claude:

- "List my GCP projects"
- "Show me all compute instances in project X"
- "What storage buckets do I have?"
- "Get details about instance my-vm in us-central1-a"

## File Structure

```
.claude/mcp/gcp-resources/
├── server.mjs        # MCP server implementation
├── package.json      # Dependencies
└── README.md         # This file
```

## Dependencies

- `@modelcontextprotocol/sdk` - MCP protocol support
- `@google-cloud/resource-manager` - GCP resource manager client
- `@google-cloud/compute` - GCP Compute Engine client
- `@google-cloud/storage` - GCP Cloud Storage client

## Troubleshooting

### "GOOGLE_CLOUD_PROJECT environment variable not set"

Make sure you've set the environment variable:

```bash
export GOOGLE_CLOUD_PROJECT=your-project-id
```

### "Permission denied" errors

Ensure your GCP credentials have the necessary permissions:

```bash
# Check current credentials
gcloud auth list

# Set active account if needed
gcloud config set account your-email@example.com
```

### Server won't start

1. Check Node.js version (requires 18+):
   ```bash
   node --version
   ```

2. Verify dependencies are installed:
   ```bash
   cd .claude/mcp/gcp-resources && npm install
   ```

3. Check MCP configuration in `.mcp.json` is valid JSON

## Notes

- This server uses Application Default Credentials from `gcloud auth`
- It's read-only for most operations (compatible with desktop Claude)
- Requires active GCP project and appropriate IAM permissions
- The server runs in the background when Claude Code starts
