---
title: VPS Server Management
description: An introduction to navigating your VPS instance controls, resource monitoring, and identifying your management interface.
tags: [vps, vds, virtfusion, api, management]
author: NodeByte Team
lastUpdated: 2026-07-09
order: 1
---

# Managing your Server

NodeByte delivers unmanaged virtual private servers and virtual dedicated servers utilizing two distinct backend execution frameworks: native hardware nodes virtualized via **VirtFusion**, and partner configurations powered by custom **billing panel API extensions**. 

Because control placements vary depending on your specific plan deployment, identifying your instance's management lane is your first step.

## Locating Your Control Deck

When your server allocation is provisioned, our billing engine logs the server type and transmits an automated service activation log to your email. 

### Integrated API Management
If your plan utilizes our direct API extension hooks, your infrastructure switches are integrated into your billing profile. You do not need an external account.
1. Authenticate at **[billing.nodebyte.host](https://billing.nodebyte.host)**.
2. Navigate to **My Services** and select the node.
3. Use the embedded interface elements to issue power cycles, reboots, or monitor resource allocations natively from the page.

### Dedicated Panel Management (VirtFusion)
If your plan is deployed on our native hardware nodes, lifecycle management requires accessing our isolated virtualization panel.
1. Locate the standalone console address and temporary login credentials inside your service welcome email.
2. Navigate to **[vps.nodebyte.host](https://vps.nodebyte.host)** or click the single-sign-on redirect inside your client portal.
3. Access your instance card to manage low-level kernel properties, out-of-band console access, and operating system reinstalls.

## Standard Unmanaged Responsibilities
Regardless of whether your instance is managed via direct API or the external VirtFusion console, all VPS allocations are fundamentally unmanaged. The NodeByte operations team maintains network routes to your node and guarantees hardware uptime, but configuration tasks remain the client's responsibility:
* Operating system configuration and package updates.
* Firewall optimization and security posture hardening.
* Database management and external application backups.
