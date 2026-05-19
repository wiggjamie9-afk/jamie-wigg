# PhotoGIMP Install Guide

PhotoGIMP is a patch for GIMP that re-maps its UI, keyboard shortcuts, and tool layout to mimic Adobe Photoshop. It does **not** modify the GIMP binary — it only replaces files inside GIMP's user-config directory.

> **Caution:** PhotoGIMP does not have an official website. The only official source is the GitHub repository: <https://github.com/Diolinux/PhotoGIMP/>

---

## Windows

1. Install GIMP from the [official website](https://www.gimp.org/).
2. Open GIMP once, then close it — this creates the config folders that PhotoGIMP needs.
3. Download the latest release: [PhotoGIMP for Windows (.zip)](https://github.com/Diolinux/PhotoGIMP/releases).
4. Extract the contents of `PhotoGIMP.zip` to any folder (e.g., your Desktop).
5. Open the extracted folder and copy the `3.0` folder.
6. Press `Windows + R` to open the Run dialog.
7. Type `%APPDATA%\GIMP` and press Enter — this opens GIMP's settings folder.
8. Paste the `3.0` folder here.
9. When prompted about existing files, select **Replace the files in the destination**.
10. Open GIMP — you should see the new PhotoGIMP layout.

**Alternative: install via Chocolatey** — see the upstream README for the current package name and command.

---

## macOS

### Backup (optional)

If you want to keep your current GIMP settings, back them up first:

1. Open Finder.
2. Press `Cmd + Shift + G` and go to `~/Library/Application Support/GIMP`.
3. Copy the entire `GIMP` folder to a safe location (e.g., your Desktop).

### Install

1. Install GIMP from the [official website](https://www.gimp.org/).
2. Open GIMP once, then close it — this creates the config folders that PhotoGIMP needs.
3. Download the latest release: [PhotoGIMP for macOS (.zip)](https://github.com/Diolinux/PhotoGIMP/releases).
4. Extract the contents of `PhotoGIMP.zip` to any folder (e.g., your Desktop).
5. Open the extracted folder and copy the `3.0` folder.
6. Open Finder, press `Cmd + Shift + G` to open **Go to Folder**.
7. Type `~/Library/Application Support/GIMP` and press Enter.
8. If you see a `2.10` folder from a previous installation, delete it to avoid conflicts.
9. Paste the `3.0` folder inside the `GIMP` folder.
10. When prompted about existing files, select **Replace** or **Merge**.
11. Open GIMP — you should see the new PhotoGIMP layout.

---

## Linux

1. Install GIMP via your distro's package manager (or Flatpak).
2. Open GIMP once, then close it.
3. Download the latest [PhotoGIMP release](https://github.com/Diolinux/PhotoGIMP/releases) and extract it.
4. Copy the `3.0` folder into `~/.config/GIMP/` (replacing existing files when prompted).
5. Open GIMP — the PhotoGIMP layout should be active.

On Linux, the patch also installs:

- A custom `.desktop` file (app launcher with PhotoGIMP name and icon).
- A custom application icon in `~/.local/share/icons/`.

---

## What's Inside the Patch

PhotoGIMP replaces or adds the following files in GIMP's configuration directory:

| File / Folder  | What it does                                       |
| -------------- | -------------------------------------------------- |
| `shortcutsrc`  | Keyboard shortcuts mapped to match Photoshop       |
| `toolrc`       | Tool configuration and ordering                    |
| `sessionrc`    | Window layout and panel positions                  |
| `dockrc`       | Dock / panel configuration                         |
| `gimprc`       | General GIMP preferences (canvas, grid, etc.)     |
| `contextrc`    | Active tool / color context settings               |
| `splashes/`    | Custom PhotoGIMP splash screen                     |
| `theme.css`    | Minor UI theme adjustments                         |
| `templaterc`   | Pre-defined canvas templates                       |

---

## How to Uninstall

To remove PhotoGIMP and restore GIMP to its default state, delete GIMP's config folder and reopen GIMP — it will regenerate fresh defaults.

### Linux

```bash
rm -rf ~/.config/GIMP/3.0
```

Then open GIMP again — it will create a brand-new default configuration.

If you made a backup earlier, restore it instead:

```bash
cp -r ~/GIMP-3.0-backup ~/.config/GIMP/3.0
```

### Windows

1. Press `Windows + R`, type `%APPDATA%\GIMP` and press Enter.
2. Delete the `3.0` folder.
3. Open GIMP — it will recreate the default settings.

Or restore your backup by pasting the backed-up `3.0` folder back.

### macOS

1. Open Finder, press `Cmd + Shift + G`.
2. Go to `~/Library/Application Support/GIMP`.
3. Delete the `3.0` folder.
4. Open GIMP — it will recreate the default settings.

Or restore your backup by pasting the backed-up folder back.

---

## Troubleshooting / FAQ

- **PhotoGIMP didn't change anything — GIMP looks the same.** Make sure you opened GIMP at least once before applying the patch (so the config folder exists), and that you pasted the `3.0` folder into the correct config directory for your OS.
- **I get an error when opening GIMP after installing PhotoGIMP.** Delete the `3.0` folder (see Uninstall) and let GIMP regenerate defaults, then re-apply the patch from a fresh download.
- **Can I use PhotoGIMP with GIMP 2.10?** The current PhotoGIMP release targets GIMP 3.0. Older versions of PhotoGIMP exist for 2.10 — check the upstream releases page.
- **Will PhotoGIMP delete my custom brushes, fonts, or plug-ins?** No — those live in different subfolders. The patch only replaces the config files listed above.
- **Can I customize the shortcuts after installing PhotoGIMP?** Yes. Edit shortcuts inside GIMP normally — your changes are saved to `shortcutsrc`.
- **How do I update PhotoGIMP to a new version?** Download the new release and repeat the install steps, replacing the existing `3.0` folder.

---

## Credits

- The GIMP team — none of this would be possible without GIMP itself.
- [Diolinux](https://www.youtube.com/diolinux) and supporters who maintain the project.
- Splash screen and icons by Adriel Filipe Design.

## License

PhotoGIMP is licensed under the GNU General Public License v3.0.
