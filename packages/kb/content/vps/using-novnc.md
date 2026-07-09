---
title: Accessing Your Server via NoVNC
description: How to establish a direct visual connection to your VPS using VirtFusion's out-of-band NoVNC console when network access is lost.
tags: [vps, vds, virtfusion, novnc, console, recovery]
author: NodeByte Team
lastUpdated: 2026-07-09
order: 4
---

If a firewall configuration script errors, an SSH service port drops, or a network interface modification disconnects your server from the internet, traditional SSH or SFTP access will fail. 

To resolve this on panel-managed instances without data loss, VirtFusion includes an out-of-band **NoVNC Console** link. This tool establishes a direct visual stream to your instance's virtual monitor from within your web browser, mimicking a physical keyboard and screen plugged into a bare-metal rack.

## Launching the Console Terminal

1. Login to the [VPS Panel](https://vps.nodebyte.host).
2. Select your instance and locate the **Console** button in the upper management action bar.
3. Click the button to launch an isolated secure visual connection frame.
4. Press Enter to awaken the instance screen layer.

## Authenticating via NoVNC

Because the NoVNC console acts as a direct hardware monitor, it does not accept SSH key tokens.

1. When the system displays your distribution’s local login prompt, type `root` and hit Enter.
2. Input your administrative root password string and confirm. *Note that characters will remain hidden as you type for security.*
3. You are now inside a secure shell terminal operating entirely outside your server's standard public network interface.

## Resolving Local Lockouts

Once your session initializes, you can troubleshoot the underlying network block natively:
* **Check Local Firewall Status:** If an active Uncomplicated Firewall (UFW) block locked your connection, you can temporarily suspend it via `ufw disable`.
* **Inspect Active Port Bindings:** Verify that the system's SSH daemon is active and listening cleanly on your intended ports by executing `systemctl status ssh` or `ss -tulpn`.
