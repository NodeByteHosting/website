---
title: Installing Oxide/uMod
description: Learn how to install the Oxide/uMod modding framework on your Rust server for plugin support.
tags: [rust, oxide, umod, plugins, mods]
author: NodeByte Team
lastUpdated: 2025-12-21
order: 2
---

# Installing Oxide/uMod

Oxide (also known as uMod) is the most popular modding framework for Rust servers. It allows you to install plugins that add features, modify gameplay, and enhance server administration.

## What is Oxide/uMod?

Oxide/uMod is an open-source modding framework that:

- Enables plugin installation
- Provides an extensive API for developers
- Includes permission management
- Supports thousands of community plugins

> **Note:** Oxide and uMod refer to the same framework. uMod is the newer name, but many still call it Oxide.

## Installing Oxide

### Method 1: Game Panel (Recommended)

NodeByte's Game Panel makes Oxide installation simple:

1. Navigate to your Rust server in the [Game Panel](https://panel.nodebyte.host)
2. **Stop your server** if it's running
3. Go to **Settings** or **Startup**
4. Look for the **Oxide/uMod** option
5. Enable it and save
6. Start your server

The server will automatically download and install the latest Oxide version.

### Method 2: Manual Installation

If you prefer manual installation:

1. **Stop your server**
2. Download the latest Oxide build from [umod.org](https://umod.org/games/rust)
3. Extract the files
4. Upload via SFTP to your server's root directory
5. Overwrite existing files when prompted
6. Start your server

## Verifying Installation

After starting your server with Oxide, check the console for:

```log
[Oxide] Loading Oxide Core v2.x.x...
[Oxide] Loading extensions...
[Oxide] Loaded extension Rust v2.x.x
[Oxide] Loading plugins...
```

You can also run this command in RCON:
```
oxide.version
```

## Oxide Directory Structure

After installation, you'll have these new folders:

```
/oxide/
├── config/        # Plugin configuration files
├── data/          # Plugin data storage
├── logs/          # Oxide logs
├── plugins/       # Your installed plugins (.cs files)
└── lang/          # Language files
```

## Installing Plugins

### Finding Plugins

The best sources for Rust plugins:

| Source | URL | Notes |
|--------|-----|-------|
| **uMod** | umod.org/plugins | Official plugin repository |
| **Codefling** | codefling.com | Premium and free plugins |
| **Lone.Design** | lone.design | Premium plugins |

### Installing a Plugin

1. Download the plugin `.cs` file
2. Upload it to `/oxide/plugins/` via SFTP or File Manager
3. The plugin will auto-load (no restart needed!)

Check the console for confirmation:
```log
[Oxide] Loaded plugin PluginName v1.0.0 by Author
```

### Plugin Commands

| Command | Description |
|---------|-------------|
| `oxide.reload PluginName` | Reload a specific plugin |
| `oxide.reload *` | Reload all plugins |
| `oxide.unload PluginName` | Unload a plugin |
| `oxide.load PluginName` | Load a plugin |
| `oxide.plugins` | List all loaded plugins |

## Configuring Plugins

Most plugins create configuration files in `/oxide/config/`:

```json
{
  "Settings": {
    "EnableFeature": true,
    "MaxPlayers": 100
  },
  "Messages": {
    "Welcome": "Welcome to the server!"
  }
}
```

After editing a config:
```
oxide.reload PluginName
```

## Permissions System

Oxide includes a powerful permissions system:

### Basic Commands

```bash
# Grant permission to a player
oxide.grant user PlayerName permission.name

# Grant permission to a group
oxide.grant group groupname permission.name

# Revoke permission
oxide.revoke user PlayerName permission.name

# Create a group
oxide.group add vip

# Add player to group
oxide.usergroup add PlayerName vip
```

### Default Groups

- `default` - All players automatically join this group
- `admin` - Create this for server administrators
- `moderator` - Create this for server moderators
- `vip` - Common group for VIP players

### Example Setup

```bash
# Create groups
oxide.group add admin
oxide.group add vip

# Set up admin group
oxide.grant group admin vanish.use
oxide.grant group admin adminpanel.use

# Set up VIP group  
oxide.grant group vip kits.vip
oxide.grant group vip queue.skip
```

## Updating Oxide

### Automatic Updates

Keep Oxide updated through the Game Panel:

1. Go to your server settings
2. Ensure auto-update is enabled
3. Oxide updates when the server restarts

### Manual Updates

1. Stop your server
2. Download the latest build from umod.org
3. Upload and overwrite files
4. Start your server

> **Tip:** Oxide updates frequently. Check for updates weekly!

## Troubleshooting

### Plugin Won't Load

Check the console for errors. Common issues:

```log
[Oxide] Error while compiling: PluginName.cs
```

**Solutions:**
- Ensure you have the correct Oxide version
- Check plugin dependencies
- Verify the plugin supports your Rust version

### Missing Dependencies

Some plugins require others:

```log
[Oxide] Missing plugin dependency: ImageLibrary
```

Install the required dependency plugin first.

### Performance Issues

If plugins cause lag:

1. Check `/oxide/logs/` for errors
2. Use `oxide.plugins` to identify resource-heavy plugins
3. Consider alternatives or contact the plugin developer

## Essential Plugins

Get started with these must-have plugins:

| Plugin | Purpose |
|--------|---------|
| **Rust:IO** | Live map and RCON |
| **GatherManager** | Adjust gather rates |
| **Kits** | Starter and VIP kits |
| **Clans** | Clan system |
| **BetterChat** | Enhanced chat formatting |
| **NTeleportation** | Teleportation system |
| **Economics** | Server economy |
| **ServerRewards** | Reward point system |

## Next Steps

- [Essential Plugins](/kb/rust/essential-plugins) - Detailed plugin recommendations
- [Admin Commands](/kb/rust/admin-commands) - Complete command reference
- [Server Optimization](/kb/rust/optimization) - Performance tuning

---

Need help? Join our [Discord](https://discord.gg/wN58bTzzpW) or open a [support ticket](https://billing.nodebyte.host/submitticket.php).
