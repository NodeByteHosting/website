---
title: Managed Services vs. External Panels
description: Understand where your server's control deck is located based on whether your instance is hosted natively or via an upstream API integration.
tags: [vps, vds, management, virtfusion, api]
author: NodeByte Team
lastUpdated: 2026-07-09
order: 12
---

NodeByte operates a hybrid infrastructure model. Depending on the specific service lineup, tier, or region you deploy, your server will either be managed directly within the NodeByte Client Portal using custom API extensions or routed to an external dedicated virtualization panel.

Review the structural differences below to locate your instance's management controls.

## 1. Direct Portal Management
Certain virtual private servers and specialized retail instances utilize custom system extensions developed by NodeByte. These extensions hook directly into upstream provider APIs, keeping your infrastructure controls inside your primary dashboard.

* **Where to Manage:**
  * **[billing.nodebyte.host](https://billing.nodebyte.host)** -> **Services**.
* **Control Location:** All power states, reboots, and core metrics are embedded directly inside the service details page within your client account. 
* **Authentication:** No secondary login or external panel accounts are required. Your master NodeByte portal account handles all deployment logic.

## 2. External Panel Management
Our core native virtual environments (`BASE`, `COMP`, `GAME`, and `ELITE` tiers) run on our isolated hardware arrays and utilize a standalone virtualization controller.

* **Where to Manage:** **[vps.nodebyte.host](https://vps.nodebyte.host)** (or the unique endpoint provided in your service activation email).
* **Control Location:** Advanced hypervisor tasks, out-of-band NoVNC console access, image rebuilding, and hardware-edge firewall configuration require logging into this standalone console.
* **Authentication:** Handled via distinct console credentials transmitted automatically upon service verification.

## How to Determine Your Service Type
If you are unsure where your server's control deck resides, check your active service page within the billing portal:
* If you see embedded power switches (`Start`, `Stop`, `Reboot`) and status bars natively inside the billing interface, your plan is **API-Managed**.
* If you see a prominent **Login to Control Panel** button or reference to external console links, your plan is **Panel-Managed**.
