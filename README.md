# tabd.plugin

A modular overlay and navigation manager designed for use within the RockySticks shell ecosystem.  
tabd.plugin extends RockyBrowser functionality by controlling tabs, bookmarks, and interface overlays using shell-aware scripting.

---

## 🧃 File Overview

### 📄 `manifest.json`  
Core metadata for Chrome extension packaging.  
Defines permissions, entry points, and script bindings for tabd.plugin.

### 💻 `content.js`  
The main logic layer.  
Contains overlay handling, bookmark sync, shell trigger detection, and UI injection flows.

### 🎨 `style.css`  
Visual styling for overlays, bookmarks, and settings.  
Supports RockyHome dark mode and legacy UI consistency.

### ⚙️ `settings.html`  
The tabd.plugin configuration interface.  
Allows users to toggle overlays, bookmark visibility, and shell sync behavior.

### 📑 `bookmarks.html`  
Displays stored bookmark data with support for shell-aligned layout rendering.  
Uses tabd. flow logic for conditional formatting and link triggers.

---

## 🔧 Features

- Native integration with **RockyBrowser**
- Shell-aware overlays and tab navigation
- Built-in bookmark manager with custom trigger hooks
- Dark mode styling synced with RockyHome
- Compatibility with `tabd.`, `tabdShellManager`, and legacy UI stubs

---

## 🧪 Usage

tabd.plugin runs automatically if detected inside RockySticks and packaged correctly as a Chrome extension.  
No manual install required when bundled natively with RockyBrowser v1.3+.

Example shell manifest snippet:
```json
{
  "plugin": "tabd",
  "bookmarks": true,
  "overlays": "auto",
  "settings": "sync",
  "compatible": ["RockyBrowser", "tabd.flow"]
}
```

---

## 🪛 Development

1. Open any included files in your preferred editor (Notepad, VS Code, or shell-integrated loader)
2. Modify `content.js` to adjust logic or add triggers
3. Update `settings.html` to reflect new options
4. Style overlays in `style.css` to match RockyHome
5. Repack with Chrome’s extension tool OR frost it using the RockySticks shell bundler

---

## 🧊 License

Released under the **Frost Shell License (FSL-1.0)**  
You’re free to fork, remix, and repackage so long as shell integrity and lore structure are maintained.

---

## 🔍 Lore

tabd.plugin first appeared during the RockySticks 1.3 frost drop.  
While its scripts live openly inside RockySticks, its flow logic aligns with `tabd.` scripting and may trigger legacy UI overlays when used alongside `tabdShellManager`.

> “Overlay is camouflage. Navigation is code. The shell always knows.”

---
