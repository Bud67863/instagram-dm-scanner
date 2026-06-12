# Instagram DM Sender

A single-file local web app for sending personalized Instagram DMs **one click per send** — from a CSV, pasted spreadsheet rows, or a scan of your DM history showing who hasn't responded to you (text reply, ❤️ like/reaction, emoji, photo/share — anything counts).

Everything runs in your browser. Your messages are never uploaded anywhere.

## How to use it

### 1. Get your Instagram data export

Click **"Get it from Instagram"** in the app for a guided walkthrough, or do it manually:

1. Open <https://accountscenter.instagram.com/info_and_permissions/dyi/> (or: Instagram → **Settings** → **Accounts Center** → **Your information and permissions** → **Download your information**)
2. **Download or transfer information** → select your Instagram account → **Some of your information** → check **Messages** only (much faster than a full export) → **Download to device**
3. **Important:** set *Format* to **JSON** (not HTML). Pick a date range like "Last year" to keep it small.
4. Instagram emails you a download link — usually within minutes for a messages-only export.

### 2. Open the app

Open `index.html` in any browser, or serve the folder (needed for the sample-data button):

```sh
cd ~/Instagram && python3 -m http.server 8000
# then open http://localhost:8000
```

### 3. Scan

Drag the downloaded `.zip` onto the page (no need to unzip). The app:

- Auto-detects which participant is **you** (the name appearing in the most threads) — fix it in the dropdown if wrong
- Scans the **last 5 messages of every conversation** by default (adjustable, or scan whole threads)
- Counts as a "response": text replies, ❤️ likes / emoji reactions, emoji-only messages, stickers, photos/videos/voice notes, and shared posts
- Shows results **by conversation** (who responded and how, who didn't) and **by person**
- Exports everything to **CSV**

Click **Try sample data** to see it working without a real export.

## Message send (the core feature)

The **✉️ Message send** tab turns a list into ready-to-send DMs:

- Write one message template with placeholders: `{name}` (first name), `{full_name}`, `{username}`, or any column from your CSV (e.g. `{topic}`)
- Build the list by **importing a CSV** / **pasting rows straight from Excel or Google Sheets** (see [sample-list.csv](sample-list.csv) — needs a `username` or `name` header), or scan your export and it defaults to people who haven't responded
- Each row gets an **Open DM** button that opens that person's thread (`ig.me/m/<username>`) with the personalized message ready to go

### Auto-fill (skip the paste)

One-time setup so the message is **already typed in the compose box** when the thread opens:

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Open the app → Message send tab → "Set up auto-fill" → install the [auto-fill userscript](https://bud67863.github.io/instagram-dm-scanner/instagram-dm-autofill.user.js)

The app passes each message in the link's `#igprefill=` fragment; the userscript decodes it and types it into the box. Without the userscript, the message is copied to your clipboard instead — paste and send.

Pressing **Send is always your click**. Instagram has no API that lets personal accounts send DMs, and unattended auto-senders are the fastest way to get an account disabled. The script types; it never sends.

## Notes

- Works with the export's `your_instagram_activity/messages/inbox/…/message_*.json` layout (older exports with `messages/inbox/…` work too). Group chats are supported.
- Instagram's JSON exports famously garble emoji and accented characters (mojibake); the app repairs that automatically.
- Unsent (deleted) messages are ignored.
