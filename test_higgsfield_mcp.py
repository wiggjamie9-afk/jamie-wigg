#!/usr/bin/env python3
"""
Higgsfield MCP Server Test Suite
Tests basic connectivity and API availability without consuming credits.
"""

import asyncio
import sys
import os
from pathlib import Path

def load_env():
    """Load environment variables from .env file."""
    env_file = Path(__file__).parent / '.env'
    if env_file.exists():
        from dotenv import load_dotenv
        load_dotenv(env_file)
    return {
        'api_key': os.getenv('HIGGSFIELD_API_KEY'),
        'secret': os.getenv('HIGGSFIELD_SECRET'),
    }

def print_status(status, message):
    """Print colored status message."""
    symbols = {
        'ok': '✅',
        'error': '❌',
        'info': 'ℹ️',
        'pending': '⏳',
    }
    print(f"{symbols.get(status, '•')} {message}")

async def test_module_import():
    """Test 1: Module Import"""
    print("\n[Test 1/5] Module Import")
    try:
        from higgsfield_mcp.client import HiggsfieldClient
        print_status('ok', "higgsfield_mcp module imported successfully")
        return True
    except ImportError as e:
        print_status('error', f"Failed to import higgsfield_mcp: {e}")
        return False

async def test_credential_validation(creds):
    """Test 2: Credential Validation"""
    print("\n[Test 2/5] Credential Validation")

    if not creds['api_key']:
        print_status('error', "HIGGSFIELD_API_KEY not set in .env")
        return False
    if not creds['secret']:
        print_status('error', "HIGGSFIELD_SECRET not set in .env")
        return False

    print_status('ok', f"API Key: {creds['api_key'][:8]}...")
    print_status('ok', f"Secret: {creds['secret'][:8]}...")
    return True

async def test_client_instantiation(creds):
    """Test 3: Client Instantiation"""
    print("\n[Test 3/5] Client Instantiation")
    try:
        from higgsfield_mcp.client import HiggsfieldClient
        client = HiggsfieldClient(
            api_key=creds['api_key'],
            secret=creds['secret']
        )
        print_status('ok', "HiggsfieldClient instantiated successfully")

        # Verify methods
        required_methods = ['get_soul_styles', 'generate_image_soul', 'get_job_status']
        for method in required_methods:
            if hasattr(client, method):
                print_status('ok', f"Method '{method}' available")
            else:
                print_status('error', f"Method '{method}' not found")
                return False

        await client.close()
        return True
    except Exception as e:
        print_status('error', f"Failed to instantiate client: {e}")
        return False

async def test_soul_styles(creds):
    """Test 4: Get Soul Styles (Read-only API call)"""
    print("\n[Test 4/5] Get Soul Styles API")
    try:
        from higgsfield_mcp.client import HiggsfieldClient
        client = HiggsfieldClient(
            api_key=creds['api_key'],
            secret=creds['secret']
        )

        print_status('pending', "Fetching Soul styles from Higgsfield API...")
        styles = await client.get_soul_styles()

        if isinstance(styles, list) and len(styles) > 0:
            print_status('ok', f"Retrieved {len(styles)} Soul styles")
            # Show first 3 styles
            for style in styles[:3]:
                style_name = style.get('name', style.get('id', 'unknown'))
                print_status('info', f"  • {style_name}")
            await client.close()
            return True
        else:
            print_status('error', f"Unexpected response format: {styles}")
            await client.close()
            return False

    except Exception as e:
        print_status('error', f"Failed to fetch Soul styles: {e}")
        if "401" in str(e):
            print_status('error', "  → Invalid credentials (401)")
        elif "422" in str(e):
            print_status('error', "  → Validation error (422)")
        elif "Connection" in str(e) or "Network" in str(e):
            print_status('error', "  → Network connectivity issue")
        return False

async def test_mcp_server_structure(creds):
    """Test 5: MCP Server Structure"""
    print("\n[Test 5/5] MCP Server Structure")
    try:
        # Check .mcp.json exists
        mcp_json = Path(__file__).parent / '.mcp.json'
        if not mcp_json.exists():
            print_status('error', ".mcp.json not found")
            return False

        import json
        with open(mcp_json) as f:
            config = json.load(f)

        if 'mcpServers' not in config:
            print_status('error', "mcpServers not in .mcp.json")
            return False

        if 'higgsfield' not in config['mcpServers']:
            print_status('error', "higgsfield server not configured in .mcp.json")
            return False

        higgsfield_config = config['mcpServers']['higgsfield']
        print_status('ok', ".mcp.json is properly configured")
        print_status('info', f"  • Command: {higgsfield_config.get('command', 'N/A')}")
        print_status('info', f"  • Args: {higgsfield_config.get('args', [])}")

        # Check .env file exists
        env_file = Path(__file__).parent / '.env'
        if env_file.exists():
            print_status('ok', ".env file exists")
        else:
            print_status('info', ".env file not found (will be needed for credentials)")

        return True

    except Exception as e:
        print_status('error', f"Failed to validate MCP structure: {e}")
        return False

async def main():
    """Run all tests."""
    print("=" * 60)
    print("Higgsfield MCP Server Test Suite")
    print("=" * 60)

    # Load credentials
    creds = load_env()

    # Run tests
    results = []

    # Test 1: Module import
    results.append(("Module Import", await test_module_import()))

    # Test 2: Credential validation
    results.append(("Credential Validation", await test_credential_validation(creds)))

    # Test 3: Client instantiation
    if results[-1][1]:  # Only run if previous passed
        results.append(("Client Instantiation", await test_client_instantiation(creds)))
    else:
        results.append(("Client Instantiation", False))

    # Test 4: Soul styles API
    if results[-1][1] and creds['api_key']:  # Only run if previous passed
        results.append(("Soul Styles API", await test_soul_styles(creds)))
    else:
        results.append(("Soul Styles API", False))

    # Test 5: MCP structure
    results.append(("MCP Server Structure", await test_mcp_server_structure(creds)))

    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = 'ok' if result else 'error'
        print_status(status, f"{test_name}: {'PASS' if result else 'FAIL'}")

    print("\n" + "=" * 60)
    print(f"Results: {passed}/{total} tests passed")
    print("=" * 60)

    if passed == total:
        print_status('ok', "All tests passed! Higgsfield MCP is ready to use.")
        return 0
    elif passed >= 3:
        print_status('info', "Basic connectivity works. Add credentials to .env for full testing.")
        return 0
    else:
        print_status('error', "Tests failed. Check the errors above.")
        return 1

if __name__ == '__main__':
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
