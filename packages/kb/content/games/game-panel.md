---
title: Introduction to the Game Panel
description: Learn how to navigate and use the NodeByte game panel to manage your servers.
tags: [panel, pterodactyl, management, tutorial]
author: NodeByte Team
lastUpdated: 2025-12-21
order: 3
---

# Introduction to the Game Panel

The NodeByte Game Panel is a custom fork of Pterodactyl, designed specifically for managing your Minecraft and Rust game servers. This guide will help you navigate and understand the panel's features.

## Accessing the Panel

Visit [panel.nodebyte.host](https://panel.nodebyte.host) and log in with your credentials. If you've forgotten your password, use the "Forgot Password" link.

## Dashboard Overview

When you log in, you'll see the main dashboard with:

| Section | Description |
|---------|-------------|
| Server List | All your active servers |
| Account Settings | Profile and security options |
| API Credentials | For integrations and automation |

## Server Console

The console is your primary interface for managing your server:

### Controls

- **Start** - Boot your server
- **Stop** - Gracefully shut down
- **Restart** - Stop and start in one click
- **Kill** - Force stop (use sparingly!)

### Console Output

The console shows real-time server logs:

```log
[Server] Starting Minecraft server version 1.21.4
[Server] Loading properties...
[Server] Done! (5.234s)
```

You can also type commands directly into the console.

## File Manager

Access and manage your server files without external software:

### Features

- 📁 Create folders
- 📄 Create/edit files
- ⬆️ Upload files (drag & drop supported!)
- ⬇️ Download files
- 🗑️ Delete files
- ✏️ Rename files

### Important Directories

| Game | Config Location |
|------|-----------------|
| Minecraft | `/server.properties`, `/bukkit.yml` |
| Rust | `/server/rust/cfg/` |

## SFTP Access

For bulk file transfers, use SFTP:

```bash
Host: panel.nodebyte.host
Port: 2022
Username: your-username.server-id
Password: Your panel password
```

> **Note:** Some FTP clients (FileZilla, WinSCP) may need explicit SFTP configuration.

## Database Management

Create and manage MySQL databases:

1. Go to **Databases** tab
2. Click **New Database**
3. Note your database credentials
4. Connect from your server/plugins

Example connection string:
```
jdbc:mysql://host:3306/database_name
```

## Backup System

Keep your data safe with automatic and manual backups:

### Creating Backups

1. Navigate to **Backups**
2. Click **Create Backup**
3. Optionally name your backup
4. Wait for completion

### Restoring Backups

1. Find the backup you want
2. Click **Restore**
3. Confirm the restoration

> ⚠️ **Warning:** Restoring a backup will overwrite current files!

## Schedule Tasks

Automate server management with scheduled tasks:

### Common Schedules

```javascript
// Daily restart at 4 AM
0 4 * * * power restart

// Backup every 6 hours
0 */6 * * * backup create

// Weekly restart on Sundays
0 3 * * 0 power restart
```

### Creating a Schedule

1. Go to **Schedules**
2. Click **Create Schedule**
3. Set the cron expression
4. Add tasks to run
5. Enable the schedule

## Subusers

Grant access to friends or team members:

| Permission Level | Capabilities |
|-----------------|--------------|
| **Viewer** | Console view only |
| **Operator** | Console + start/stop |
| **Admin** | Full access (except delete) |

### Adding a Subuser

1. Go to **Users**
2. Enter their email
3. Select permissions
4. Send invite

## Activity Log

Track all actions on your server:

- Who did what
- When it happened
- What commands were run

Great for security auditing!

## Network Settings

Manage allocations (IP:Port combinations):

- View your server's connection address
- Request additional ports if needed
- See allocation usage

## Tips & Best Practices

1. **Regular Backups** - Schedule daily backups minimum
2. **Monitor Resources** - Check CPU/RAM usage regularly
3. **Update Regularly** - Keep server software current
4. **Secure Access** - Use strong passwords, limit subuser access
5. **Document Changes** - Note what you modify for troubleshooting

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + /` | Focus console input |
| `Up Arrow` | Previous command |
| `Down Arrow` | Next command |
| `Tab` | Command autocomplete (some servers) |

## Need More Help?

- Check specific game guides in our [Knowledge Base](/kb)
- Join our [Discord](https://discord.gg/wN58bTzzpW)
- Contact [Support](https://billing.nodebyte.host/submitticket.php)
