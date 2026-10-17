<div align="center">

# StickItUP!

**Pin beautiful, persistent notes directly onto any webpage.**

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/najah-pktr/StickItUp/pulls)

*Local, private, and designed to stay out of your way.*
</div>

---

## Preview

<img width="1920" height="1032" alt="UI Preview" src="https://github.com/user-attachments/assets/d4c72f7b-7b67-4e22-83c2-f4a73447c6e4" />

---
## Features

- **Native Interface:** A clean, distraction-free UI that feels like a built-in browser tool.
- **Themes & Typography:** Choose from 6 pastel backgrounds and 4 curated fonts (Inter, Caveat, Lora, JetBrains Mono).
- **Drag & Pin:** Place notes anywhere. Resize them freely. Pin them in place so they never move by accident.
- **Notes Directory:** Search, preview, teleport to, or delete any note from the extension dashboard.
- **Export & Import:** Back up your notes as JSON. Restore anywhere. Merge across devices in one click.
- **100% Private:** Notes live entirely in your browser. No accounts, sync servers, or analytics.

## Installation

### Option 1 — Download from Releases (Easiest)

1. Go to the [**Releases page**](https://github.com/najah-pktr/StickItUp/releases/latest)
2. Download the latest **`.zip`** file under *Assets*
3. **Extract** the zip to a folder on your computer
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable **Developer mode** (toggle in the top-right corner)
6. Click **Load unpacked** and select the extracted folder
7. Pin **StickItUP!** to your toolbar and start leaving notes

### Option 2 — Clone from Source

1. **Clone the repo**
   ```bash
   git clone https://github.com/najah-pktr/StickItUp.git
   cd StickItUp
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the `StickItUp` folder

## Usage

### Adding a Note
1. Navigate to any webpage
2. Click the **StickItUP!** toolbar icon
3. Hit **New Note**
4. Start typing — saved automatically

### Customizing a Note
- **Palette icon** — change background color
- **Pen icon** — change font, size, weight, alignment
- **Pin icon** — lock the note in place
- **Collapse icon** — shrink to a slim bar
- **Trash icon** — delete the note

### Managing All Notes
Open the popup → **Notes** tab. Search, teleport to, or delete any note.

### Backup & Restore
**Settings** tab → **Export JSON** to back up, **Import JSON** to restore.

## Changelog

### v2.0.0 (Latest)
- **New UI:** Replaced emojis with crisp, scalable SVG icons.
- **Native Feel:** Refined typography, spacing, and hairline borders.
- **Themes:** Updated to a cleaner palette of pastel colors and dark mode compatibility.
- **Performance:** Code cleanup and optimized storage syncing.

### v1.1.0
- Added 12 theme presets.
- New Notes Directory tab with search.
- Export / Import JSON backups.
- Initial dark mode support.

### v1.0.0
- First public release.
- Create, drag, resize, and delete sticky notes.
- Local storage persistence.

---

## License

Distributed under the **Mozilla Public License 2.0**. See [`LICENSE`](LICENSE) for the full text.

<div align="center">
Made with care by <a href="https://github.com/najah-pktr">Najah</a>
</div>
