---
title: Troubleshooting
description: Learn how to troubleshoot common Minecraft Server issues. 
tags: [minecraft, server, troubleshooting, errors]
author: Tyler. H
lastUpdated: 2026-06-16
order: 20
---

# Troubleshooting Common Minecraft Server Crashes

When a Minecraft server crashes, it can feel overwhelming to look at a wall of text in the console. However, crash reports are highly structured and usually point directly to the exact file, plugin, or world coordinate causing the issue. 

This guide will show you how to find your crash reports, read them, and fix the most common issues.

---

## 1. Where to Find Your Crash Logs
When a server shuts down due to an error, it will attempt to write a dedicated log.
* **Dedicated Crash Reports:** Check the `/crash-reports/` folder in your server’s root directory. The files are named by date (e.g., `crash-2026-06-16_14.30.00-server.txt`).
* **Console Logs:** If the server crashed so hard it couldn't generate a report, check the `/logs/` folder and open `latest.log`.

---

## 2. The "Watchdog" Crash (The Server Lagged Out)
### The Error String:
`Description: Watching Server` or `A single server tick took 60.00 seconds (Should be max 0.05)`

### What it means:
Minecraft has a built-in safety system called the **Watchdog**. If the main server thread freezes completely for a set amount of time (usually 60 seconds by default), the Watchdog assumes the server is deadlocked and kills the process to prevent world corruption.
* **This is not a network crash.** It means the CPU got stuck trying to process a massive task.

### Common Culprits & Fixes:
* **Massive WorldEdit Commands:** If a player tries to paste a schematic with millions of blocks, the main thread will freeze.
* **Large Redstone Loops:** High-frequency redstone clocks or item sorting loops stuck in an infinite cycle.
* **Massive Entity Cramming:** Hundreds of mobs crammed into a 1x1 hole on a farm.
* **Fix:** You can increase the threshold or disable it entirely in `server.properties` by setting `max-tick-time=-1`. *Note: Disabling this means a frozen server will hang indefinitely instead of restarting automatically.*

---

## 3. Out of Memory (OOM) Errors
### The Error String:
`java.lang.OutOfMemoryError: Java heap space` or `Container killed by OOM Killer`

### What it means:
The server ran completely out of allocated RAM. This happens when the amount of data the server needs to store in memory (loaded chunks, players, entities, plugin data) exceeds the maximum limit (`-Xmx`) set in your startup flags.

### Common Culprits & Fixes:
* **Too many plugins/mods:** Every plugin or mod increases the baseline RAM requirement.
* **High view distance:** Loading too many chunks per player simultaneously.
* **Fix:** Optimize your chunk configurations (see our Optimization Guide), reduce your view distance, or upgrade your server plan to allocate more RAM.

---

## 4. Mod or Plugin Mismatch
### The Error String:
`java.lang.NoClassDefFoundError` or `java.lang.NoSuchMethodError`

### What it means:
A plugin or mod is trying to communicate with code that doesn't exist. This happens when you install a plugin built for an entirely different version of Minecraft, or when two mods conflict with each other.

### Common Culprits & Fixes:
* **Outdated Plugins:** Running a 1.16 plugin on a 1.20+ server.
* **Missing Dependencies:** Many plugins require a core library (like *ProtocolLib*) to function. Check the console right before the crash; it will usually say exactly which plugin failed to load.
* **Fix:** Temporarily remove the most recently added plugin or mod, restart the server, and check if the crash persists.
