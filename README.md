<div align="center">
  
# 📌 StickItUP!

**Premium sticky notes for any website. Beautiful, persistent, and highly customizable.**

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/najah-pktr/StickItUp/pulls)
[![PRs Welcome](https://img.shields.io/badge/Dev-najahpktr-red.svg)](https://instagram.com/najah_pktr)

*Leave thoughts, reminders, and ideas exactly where you need them — on the page itself.*

</div>

---

## ✨ What is StickItUP!?

Browser bookmarks and notes apps all live *somewhere else*. StickItUP! lets you pin your thoughts directly onto the page they belong to — a comment on a GitHub PR, a shopping reminder on Amazon, a study note on Wikipedia, a client brief on a design mockup.

No accounts. No servers. No tracking. Everything stays in your browser.

---

## 🎯 Features

- **🎨 12 beautiful themes** — frosted-glass solids + gradients (Sunset Pink, Ice Blue, Warm Peach, Green Apple, and more)
- **✍️ 5 curated fonts** — Outfit, Caveat (handwritten), Playfair Display, Fira Code, Pacifico
- **🖱️ Drag, resize, pin, collapse** notes anywhere on any page
- **🎚️ Per-note styling** — font, size, bold/italic/underline, alignment
- **🔍 Notes directory** — search, preview, teleport to, or delete any note
- **📥 Export / Import JSON** — full backup and restore
- **🔄 Real-time sync** across all open tabs
- **🌙 Dark mode**
- **🔒 100% local storage** — no servers, no accounts, no analytics

---

## 🚀 Installation
### Option 1 — Download from Releases (Easiest)

1. Go to the [**Releases page**](https://github.com/najah-pktr/StickItUp/releases/latest)
2. Download the latest **`.zip`** file under *Assets*
3. **Extract** the zip to a folder on your computer
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable **Developer mode** (toggle in the top-right corner)
6. Click **Load unpacked** and select the extracted folder
7. Pin **StickItUP!** to your toolbar and start leaving notes 🎉


### Option 2 — Developer Mode

1. **Clone the repo**
   ```bash
   git clone https://github.com/najah-pktr/StickItUp.git
   cd StickItUp
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the `StickItUp` folder
5. Pin **StickItUP!** to your toolbar and start leaving notes 🎉

---

## 📖 Usage

### Adding a Note
1. Navigate to any webpage
2. Click the **StickItUP!** toolbar icon
3. Hit **Add Sticky Note ✨**
4. Start typing — saved automatically

### Customizing a Note
- **🎨 Palette** — change background
- **✍️ Pen** — font, size, weight, alignment
- **📌 Pin** — lock the note in place
- **➖ Collapse** — shrink to a slim bar
- **🗑️ Trash** — delete the note

### Managing All Notes
Open the popup → **📂 My Notes** tab. Search, teleport (🚀), or delete (🗑️) any note.

### Backup & Restore
**⚙️ Settings** tab → **📥 Export JSON** to back up, **📤 Import JSON** to restore.

### URL Matching
- **Exact match** (default) — note appears only on the exact URL
- **Domain match** — note appears on every page of the same website

---

## 🧱 Tech Stack

- Manifest V3
- Vanilla JS, HTML, CSS — no framework, no build step
- `chrome.storage.local` for persistence
- Google Fonts (Outfit, Caveat, Playfair Display, Fira Code, Pacifico)

---

## 🤝 Contributing

Contributions are welcome and appreciated.

1. Fork the project
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Bug Reports & Feature Requests

Open an [issue](https://github.com/najah-pktr/StickItUp/issues) and include:
- Browser & version
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if possible

---

## 📜 License

Distributed under the **Mozilla Public License 2.0**. See [`LICENSE`](LICENSE) for the full text.

---

<div align="center">

**⭐ If StickItUP! made your browsing better, consider giving it a star — it helps others find it!**

Made with ❤️ by [Najah](https://github.com/najah-pktr)

</div>
