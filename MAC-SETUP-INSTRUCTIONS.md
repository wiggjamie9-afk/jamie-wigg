# Mac Auto-Sync Setup — Installation Guide

## What This Does
When you turn on your Mac, this script will automatically:
1. ✅ Pull all latest code from git
2. ✅ Install npm dependencies
3. ✅ Verify all 52 apps are present
4. ✅ Check credentials (.env)
5. ✅ Get you ready to run the avatar proxy

## Option 1: Manual Run (Easiest)

```bash
# On your Mac, run once:
bash ~/jamie-wigg/setup-mac.sh

# Or if repo is in a different location:
bash /path/to/repo/setup-mac.sh
```

## Option 2: Automatic on Mac Startup

### Step 1: Edit the plist file
Open `com.jamiewigg.setup.plist` and change this line:
```xml
<string>/Users/jamiewigg/jamie-wigg/setup-mac.sh</string>
```
to your actual repo path (use `pwd` to find it).

Also change:
```xml
<string>com.jamiewigg.wellness-setup</string>
```
if you want a unique name.

### Step 2: Install the LaunchAgent
```bash
# Copy to Mac's startup folder
cp com.jamiewigg.setup.plist ~/Library/LaunchAgents/

# Load it
launchctl load ~/Library/LaunchAgents/com.jamiewigg.setup.plist
```

### Step 3: Check if it's running
```bash
# List active agents
launchctl list | grep wellness

# View logs
cat /tmp/wellness-setup.log
cat /tmp/wellness-setup-error.log
```

## Uninstall (if needed)
```bash
launchctl unload ~/Library/LaunchAgents/com.jamiewigg.setup.plist
rm ~/Library/LaunchAgents/com.jamiewigg.setup.plist
```

## After Setup Completes

Once the script runs successfully, start the avatar proxy:

```bash
cd ~/jamie-wigg  # (or your repo path)
node apps/avatar-proxy-local.mjs
```

You'll see:
```
Avatar Proxy Server
✨ Listening on http://localhost:3001
✓ Ready to generate avatars!
```

Keep this terminal open and test on your iPhone!

---

**Questions?** Check the logs or run the script manually to see what's happening.
