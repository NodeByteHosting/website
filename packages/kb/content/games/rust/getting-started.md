---
title: Getting Started with Rust
description: Learn the basics of setting up and configuring your Rust server on NodeByte.
tags: [rust, getting-started, setup, tutorial]
author: NodeByte Team
lastUpdated: 2025-12-21
order: 1
---

# Getting Started with Rust

This guide will help you set up and configure your Rust server on NodeByte. We'll cover everything from initial setup to basic configuration.

## Accessing Your Server

After purchasing your Rust server from NodeByte:

1. Log into the [Game Panel](https://panel.nodebyte.host)
2. Select your Rust server from the server list
3. You'll see the main console and server controls

## First Boot

When you first start your server, it will:

1. Download the latest Rust Dedicated Server files
2. Generate the default configuration
3. Create your first procedurally generated map

> **Note:** The first startup may take several minutes as the server downloads all necessary files.

## Server Configuration

### Basic Settings

Your server's main configuration is found in `server.cfg`. Key settings include:

```cfg
# Server Identity
server.hostname "My NodeByte Rust Server"
server.description "Welcome to our server!"
server.url "https://nodebyte.host"
server.headerimage "https://your-image-url.com/banner.png"

# Gameplay Settings
server.maxplayers 100
server.worldsize 3500
server.seed 12345
server.saveinterval 300

# Security
server.secure true
server.encryption 1
```

### Map Settings

| Setting | Description | Recommended |
|---------|-------------|-------------|
| `server.worldsize` | Map size in meters | 3000-4000 for small, 4000-6000 for large |
| `server.seed` | Procedural generation seed | Any number, or leave blank for random |
| `server.level` | Map type | `Procedural Map` (default) |

### Player Slots

Your maximum players depends on your plan's RAM allocation:

| RAM | Recommended Players |
|-----|---------------------|
| 4GB | 50-75 players |
| 8GB | 100-150 players |
| 16GB | 200+ players |

## Connecting to Your Server

### Finding Your Connection Info

1. Go to your server in the Game Panel
2. Look for the **Connection Address** in the sidebar
3. Format: `IP:Port` (e.g., `192.168.1.1:28015`)

### Client Connection

Players can connect via:

**Console Command:**
```
client.connect IP:PORT
```

**Steam Server Browser:**
1. Open Steam → View → Servers
2. Click "Add a Server"
3. Enter your server IP:Port
4. Click "Add This Address to Favorites"

## RCON Access

RCON (Remote Console) allows you to run commands remotely:

### Setting Up RCON

In your `server.cfg`:
```cfg
rcon.ip 0.0.0.0
rcon.port 28016
rcon.password "your_secure_password"
rcon.web 1
```

### RCON Tools

- **RustAdmin** - Desktop application for Windows
- **Battlemetrics** - Web-based RCON and server management
- **RustIO** - Web RCON with live map

## Essential Commands

| Command | Description |
|---------|-------------|
| `server.save` | Force a world save |
| `server.writecfg` | Save current config |
| `kick "player"` | Kick a player |
| `ban "player"` | Ban a player |
| `unban "steamid"` | Unban a player |
| `say "message"` | Server-wide message |
| `status` | List connected players |

## Performance Optimization

### Recommended Settings

```cfg
# Performance
fps.limit 60
gc.interval 60
gc.buffer 256

# Network
server.tickrate 30
server.netlog 0
```

### Monitoring

Keep an eye on these metrics in your Game Panel:

- **CPU Usage** - Should stay below 80%
- **RAM Usage** - Leave at least 1GB headroom
- **Tick Rate** - Should stay close to your set value

## Wipe Schedule

Rust servers typically wipe on a schedule:

- **Forced Wipes** - First Thursday of each month (required by Facepunch)
- **Map Wipes** - You choose the frequency
- **Blueprint Wipes** - Optional, often monthly

### Setting Up Automatic Wipes

Use the Game Panel's **Schedules** feature:

1. Create a new schedule
2. Set the cron expression (e.g., `0 12 * * 4` for Thursdays at noon)
3. Add task: `server.save` then `quit`
4. Your server will restart fresh on the scheduled time

## Next Steps

Now that your server is running:

1. [Install Oxide/uMod](/kb/rust/oxide-installation) - Add plugin support
2. [Essential Plugins](/kb/rust/essential-plugins) - Must-have plugins
3. [Admin Commands](/kb/rust/admin-commands) - Full command reference

---

Need help? Join our [Discord](https://discord.gg/wN58bTzzpW) or open a [support ticket](https://billing.nodebyte.host/submitticket.php).
