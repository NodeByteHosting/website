---
title: Server Optimizations
description: Learn how to optimize your Minecraft server for peak performance. 
tags: [minecraft, perfromance, optimization, tps-lag]
author: Tyler. H
lastUpdated: 2026-06-16
order: 3
---

# Optimizing Your Minecraft Server: A Complete Performance Guide

It is a common misconception that rubber-banding, delayed block breaking, and "ghost pings" are always caused by network routing. More often than not, these issues stem from **Server Tick Lag** meaning the server's CPU is struggling to keep up with the game's internal simulation loop rather than a breakdown in the network pipeline.

Minecraft is inherently reliant on single-threaded performance. When the main loop chugs, packet transmission stalls, mimicking a poor connection. This guide covers how to profile, optimize, and configure your server for maximum performance.

---

## 1. Understanding the Core Metrics: TPS vs. MSPT

Before changing configurations, you need to understand how Minecraft measures its own performance.

* **TPS (Ticks Per Second):** A perfectly healthy server runs at **20 TPS**. This means the game simulates 20 game loops every second. If this drops below 20, the game world slows down, causing visible lag.
* **MSPT (Milliseconds Per Tick):** This is the rawest metric of server health. It measures exactly how long it takes the CPU to calculate a single tick. 
  * To maintain 20 TPS, a tick must finish in **under 50ms**.
  * If your MSPT is at **30ms**, your server is running perfectly and has a 20ms safety margin.
  * If your MSPT hits **55ms**, your TPS will drop below 20 because the CPU has run out of time.

---

## 2. Choose the Right Server Software

Running a vanilla Minecraft server jar for a public or multi-player environment is highly inefficient. Upgrading your server software is the single easiest performance boost you can achieve.

| Server Jar | Use Case & Performance Impact |
| :--- | :--- |
| **Vanilla** | **Terrible.** Completely unoptimized. Avoid for multiplayer environments. |
| **Paper / Purpur** | **Excellent (Plugins).** Paper fixes thousands of vanilla performance bottlenecks and exploits. Purpur adds even deeper-level configuration options. |
| **Fabric + Lithium** | **Excellent (Vanilla/Mods).** Perfect for technical vanilla communities who want vanilla mechanics preserved exactly, but with highly optimized physics and chunk loading. |

---

## 3. High-Impact Configuration Tweaks (Paper/Purpur)

If you are using **Paper** or **Purpur**, navigate to your server's root directory and adjust the following settings in `config/paper-world-defaults.yml` or `bukkit.yml`.

### Chunk Loading & View Distance
Generating and loading chunks on-the-fly is one of the heaviest operations a server performs.

* **`view-distance`** *(in server.properties)*: Drop this from the default 10 down to **6 or 8**. This exponentially reduces the number of chunks loaded per player.
* **`no-tick-view-distance`** *(in paper-world-defaults.yml)*: Set this to **10 or 12**. This allows players to still see far into the distance without the server actually simulating/ticking the entities, redstone, or crops in those far-away chunks.

### Entity Ticking & Spawning
Mob AI calculations eat massive amounts of CPU cycles.

* **`despawn-ranges`** *(in paper-world-defaults.yml)*:
```yaml
  entities:
    spawning:
      despawn-ranges:
        soft: 28
        hard: 96
```


This removes monsters faster when players move away, stopping hidden caves from filling up with entities that drain performance.
 * **max-entity-collisions** *(in spigot.yml)*: Set this to **2 or 4**. This stops massive mob farms with hundreds of animals or monsters from crashing the physics engine when they bump into each other.
## 4. Stop Chunk Generation Lag: Pre-Generate Your Worlds
When players explore your world at high speeds (like flying with Elytras), the server has to generate new terrain, structures, and lighting data on a single CPU thread. This will cause massive lag spikes for everyone online.
**The Solution:** Pre-generate your world boundaries before opening the server to the public.
 1. Install the plugin **Chunky**.
 2. Set your world border (e.g., a 5,000-block radius): /chunky radius 5000
 3. Start the pre-generation task: /chunky start
 4. Let the process run fully. It may take several hours, but it saves your CPU from ever having to generate chunks dynamically during gameplay.
## 5. Optimize Your Java Startup Flags (Aikar's Flags)
If your server suffers from "periodic lag spikes" every few minutes or seconds, your Java Garbage Collector (GC) is likely freezing the game to clear out old memory. Using optimized startup flags keeps memory management smooth and continuous.
Ensure your server startup script uses **Aikar's Flags** (optimized for modern Java versions):

```bash
java -Xms10G -Xmx10G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=20 -XX:+UnlockExperimentalVMOptions -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8m -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=[https://mcflags.emc.gs](https://mcflags.emc.gs) -Daikars.new.flags=true -jar server.jar nogui
```

> ⚠️ **Note:** Ensure -Xms (minimum RAM) and -Xmx (maximum RAM) match your allocated server memory size.
> 
## 6. Diagnostic Profiling: How to Find the Culprit
Stop guessing what is causing your lag. Use built-in diagnostic tools to pinpoint exactly which plugin, world, or mob farm is draining your resources.
### Using Spark (Highly Recommended)
Spark is a lightweight performance profiler plugin (available for Paper, Fabric, and Forge).
 1. Run the command: /spark profiler start
 2. Let it sample server activity for 3 to 5 minutes during a period of lag.
 3. Run the command: /spark profiler stop
 4. It will output a web link containing a detailed call tree showing you precisely what percentage of your CPU cycles are being spent on specific tasks (e.g., pathfinding, specific plugins, or chunk generation).
## 7. Performance Troubleshooting Matrix
| Symptoms | Likely Culprit | Action Item |
|---|---|---|
| **High Ping / Rubber-banding**, but /spark shows stable 20 TPS & low MSPT. | True Network Lag or Client ISP Routing. | Run a traceroute / MTR to the server IP. Check proxy/CDN settings if applicable. |
| **High Ping / Rubber-banding**, and /spark shows TPS drops and high MSPT (>50ms). | **Fake Network Lag.** The CPU loop is choking, delaying network packet output. | Run a /spark profile to identify the ticking entity or plugin causing the bottleneck. |
| **Consistent lag spikes every 60 seconds.** | Java Garbage Collection freeze or autosave issues. | Apply Aikar's Flags. Increase your autosave interval using a dedicated backup/save plugin. |
| **Lag spikes only when players are moving fast.** | Dynamic Chunk Generation. | Install the **Chunky** plugin and pre-generate your world terrain. |

