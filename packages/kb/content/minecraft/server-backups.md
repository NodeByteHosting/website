---
title: Server Backups
description: A comprehensive guide for backing up your server files.
tags: [minecraft, mods, server, backups]
author: NodeByte Team
lastUpdated: 2026-06-16
order: 14
---

# Managing and Backing Up Your Server Files Securely

Data integrity is the foundation of a great server. Whether you are adding a new modpack, editing plugin configuration files, or ensuring your players don't lose progress if something breaks, understanding how to manage your files securely is essential.

---

## 1. Web File Manager vs. SFTP
Our web panel includes a built-in file manager, but it is designed for quick tasks. Knowing when to use SFTP will save you time and prevent corrupted transfers.

* **Use the Web File Manager for:** Quick configuration text changes, deleting a single file, or uploading small plugins under 50MB.
* **Use SFTP (Secure File Transfer Protocol) for:** Uploading entire world folders, downloading backups, transferring modpacks, or managing directories with thousands of files.

### How to Connect via SFTP:
1. Download an SFTP client like **FileZilla** or **Cyberduck**.
2. On your server panel, navigate to the **Settings** or **SFTP Details** tab to find your connection details (Host, Port, and Username).
3. Open your SFTP client, enter those details, and use your **panel password** to connect.

---

## 2. Upgrading Server Versions Safely
When a major new Minecraft version drops, rushing to update without a plan can permanently corrupt your world files. Always use this exact order of operations:

1. **Take a Manual Backup:** Never rely on luck. Create a full backup of your server before changing anything.
2. **Update the Server Jar:** Change your server software version in the panel settings.
3. **Update Dependencies First:** Before booting up, make sure core layout plugins like *ProtocolLib*, *LuckPerms*, or *Geyser* are updated to support the new version.
4. **Boot and Monitor:** Start the server and watch the console closely for errors or severe missing block warnings.

---

## 3. Automating Your Backups
Do not rely on remembering to click "Backup" every day. Set up an automated schedule through the panel:

1. Navigate to the **Schedules** tab in your control panel.
2. Create a new schedule called "Daily Backup".
3. Configure the cron expression for your preferred time (e.g., every night at 3:00 AM).
4. Add a new task to that schedule and set the action to **Create Backup**.
5. Set it to lock older vital backups so they don't get automatically rotated out or overwritten.

