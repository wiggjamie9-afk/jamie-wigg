# Node.js Setup Guide

This guide walks through installing Node.js using **nvm** (Node Version Manager).

## Install nvm

Download and run the nvm install script:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

## Load nvm in the current shell

In lieu of restarting the shell, source nvm into your current session:

```bash
\. "$HOME/.nvm/nvm.sh"
```

## Install Node.js

Download and install Node.js (this guide uses version 24):

```bash
nvm install 24
```

## Verify the installation

Check the Node.js version:

```bash
node -v   # Should print "v24.15.0".
```

Check the npm version:

```bash
npm -v    # Should print "11.12.1".
```

## Common nvm commands

```bash
nvm ls                # List installed Node.js versions
nvm ls-remote         # List all available Node.js versions
nvm use 24            # Switch to Node.js 24 in the current shell
nvm alias default 24  # Set Node.js 24 as the default for new shells
nvm uninstall 24      # Remove a specific Node.js version
```

## Troubleshooting

- **`nvm: command not found`** — Re-run `\. "$HOME/.nvm/nvm.sh"` or open a new terminal so your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) loads nvm automatically.
- **Permission errors during `npm install -g`** — Avoid `sudo`; nvm installs Node.js into your home directory so global packages don't need elevated privileges.
- **Wrong Node.js version after restart** — Set a default with `nvm alias default <version>`.

## References

- nvm: https://github.com/nvm-sh/nvm
- Node.js: https://nodejs.org/
