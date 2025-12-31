# Bot WhatsApp - Modular Architecture

Bot WhatsApp dengan arsitektur modular yang clean dan mudah di-maintain.

## 🚀 Fitur

- ✅ Modular architecture dengan separation of concerns
- ✅ Anti-ban dengan humanlike responses (typing indicator + random delay)
- ✅ Command-based system yang mudah dikembangkan
- ✅ LocalAuth untuk menyimpan sesi WhatsApp

## 📁 Struktur Proyek

```
src/
├── index.js                      # Entry point
├── config/
│   └── client.config.js          # Konfigurasi WhatsApp Client
├── utils/
│   └── helpers.js                # Helper functions
├── handlers/
│   └── messageHandler.js         # Message routing
└── commands/
    ├── index.js                  # Command exports
    ├── ping.js                   # !ping command
    ├── greeting.js               # halo bot command
    └── info.js                   # !info command
```

## 🎮 Commands

| Command    | Deskripsi                           |
| ---------- | ----------------------------------- |
| `!ping`    | Cek apakah bot masih aktif          |
| `halo bot` | Sapaan ke bot                       |
| `!info`    | Tampilkan info grup (hanya di grup) |

## 🛠️ Installation

1. Clone repository:

```bash
git clone https://github.com/ryokf/bot-wa.git
cd bot-wa
```

2. Install dependencies:

```bash
npm install
```

3. Jalankan bot:

```bash
node src/index.js
```

4. Scan QR Code yang muncul di terminal dengan WhatsApp Anda

## ➕ Menambahkan Command Baru

1. Buat file baru di `src/commands/namaCommand.js`
2. Export command di `src/commands/index.js`
3. Tambahkan routing di `src/handlers/messageHandler.js`

Contoh:

```javascript
// src/commands/help.js
const { replyHumanlike } = require("../utils/helpers");

const helpCommand = async (message, client) => {
  const helpText = "📋 Daftar Command:\n- !ping\n- !info\n- !help";
  await replyHumanlike(message, client, helpText);
};

module.exports = helpCommand;
```

## 📝 License

MIT
