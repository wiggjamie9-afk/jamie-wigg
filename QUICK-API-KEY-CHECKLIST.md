# Quick API Key Setup Checklist

Complete these steps in order to get OpenManus running with your Anthropic Claude API key.

## 🚀 30-Second Setup

- [ ] Go to https://console.anthropic.com/account/keys
- [ ] Click "Create Key"
- [ ] Name it (e.g., "OpenManus")
- [ ] Copy the key starting with `sk-ant-`
- [ ] Edit `openmanus/config/config.toml`
- [ ] Replace `YOUR_API_KEY` with your actual key
- [ ] Save the file
- [ ] Run: `cd openmanus && source venv/bin/activate && python main.py`

## ✅ Pre-Flight Checks

### Account Setup
- [ ] Have an Anthropic account (sign up at console.anthropic.com)
- [ ] Payment method is added
- [ ] Account has no API key restrictions

### API Key
- [ ] API key copied (format: `sk-ant-...`)
- [ ] Key is in "active" status
- [ ] Key has not expired

### OpenManus Config
- [ ] `openmanus/config/config.toml` exists
- [ ] API key inserted in correct location
- [ ] File saved without syntax errors
- [ ] File permissions allow read (not locked)

### Virtual Environment
- [ ] Python 3.11+ installed
- [ ] Virtual environment activated: `source openmanus/venv/bin/activate`
- [ ] Dependencies installed (201 packages)

## 🧪 Test Connection

Run this to verify everything works:

```bash
cd openmanus
source venv/bin/activate

# Test 1: Config loads
python -c "from app.config import config; print('✓ Config OK')"

# Test 2: LLM connects
python -c "from app.llm import LLM; llm = LLM(config.llm_settings); print('✓ LLM OK')"

# Test 3: Interactive mode
python main.py
```

## 🔧 Common Fixes

| Problem | Solution |
|---------|----------|
| "API key not found" | Check `api_key` line in config.toml has correct key |
| "Invalid API key" | Verify key starts with `sk-ant-` and is complete (no spaces) |
| "Config file error" | Run: `python -m tomli openmanus/config/config.toml` |
| "Module not found" | Run: `source venv/bin/activate` (activate venv) |
| "Authentication failed" | Check key is "active" in console.anthropic.com |

## 📚 More Info

- **Full Guide:** See `ANTHROPIC-API-KEY-SETUP.md`
- **OpenManus Quick Start:** See `openmanus/QUICKSTART.md`
- **Setup Guide:** See `OPENMANUS-SETUP.md`

## 🎯 Next Steps After Setup

1. **Test in interactive mode:**
   ```bash
   python main.py
   ```

2. **Run a workflow:**
   ```bash
   python run_flow.py examples/example_flow.yaml
   ```

3. **Start MCP server:**
   ```bash
   python run_mcp.py
   ```

4. **Check API usage:**
   Visit https://console.anthropic.com/account/usage

---

**Status:** Ready to configure!  
**Last Updated:** 2026-06-14
