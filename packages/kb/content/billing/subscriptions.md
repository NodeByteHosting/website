---
title: Understanding the Invoice & Subscription Lifecycle
description: A breakdown of the chronological timeline for automated invoice generation, payment processing, and grace windows.
tags: [billing, invoices, subscriptions, lifecycle]
author: NodeByte Team
lastUpdated: 2026-07-08
order: 6
---

# Understanding the Invoice & Subscription Lifecycle

NodeByte's billing infrastructure runs on a strict automated task loop that handles the lifecycle of your active deployments. To help you plan your community operations and corporate expense reporting, this article outlines the exact chronology of automated billing routines from creation to decommissioning.

## The Billing Timeline

All hosting services are tracked via independent subscription blocks tied to your unique provision date. The timeline below highlights how an active monthly billing cycle operates from invoice generation through to service deprovisioning:

* **Day -7 (Invoice Generation):** Exactly 7 days before your current active hosting period concludes, our core database loop instantiates a fresh invoice string for the upcoming cycle. An automated email alert is pushed to your administrative address containing the line-item audit summary. If you have an active pre-funded account credit balance, the system will instantly consume those funds to settle or discount the invoice here, changing the status flag to `Paid`.
* **Day 0 (The Due Date):** The exact calendar date your current service period ends is the designated Due Date. For Stripe users, our system triggers an automated payment intent to debit your primary saved card token during the early morning execution loop. For PayPal users, if you have an active billing agreement, PayPal pushes the funds to our platform natively; if you pay manually, the invoice remains open awaiting your action.
* **Day +1 to Day +2 (The Grace Window):** If your primary payment method fails due to insufficient funds, card expiration, or false-positive flags, our platform logs the exception and keeps your game server slots or dedicated compute arrays completely online. The service state flag remains marked as `Active` during this 48-hour buffer window, and a follow-up notification is dispatched to alert your team of the payment block.
* **Day +3 (Automated Service Suspension):** If an invoice sits uncollected for 3 consecutive days past its original due date, the automated billing system communicates directly with our edge hypervisors. The container or machine instance is forcefully set into a `Suspended` execution state. Network ports are shut down, blocking all public client entries and file access. Your persistent game data, server configurations, and database volumes remain completely safe on our storage nodes during this hold phase.
* **Day +7 (Automated Deprovisioning & Wiping):** If an invoice is neglected for a full 7 days past the due date, the resource allocation is terminated. The system purges the container and entirely wipes all underlying localized files from the hardware array to free up the physical memory and NVMe blocks for new deployment slots. Data wiped at this stage is completely unrecoverable.

## Modifying Renewal Frequencies

If you wish to shift an active deployment from its current billing interval (such as migrating a server from a standard monthly cycle to a discounted quarterly or annual block):

1. Do not submit a cancellation request.
2. Open a direct request to our **Billing Department** from the portal dashboard.
3. Specify your target server ID and your preferred new payment frequency.
4. Our finance desk will manually restructure your underlying plan parameters and rebuild your active invoice strings to match the chosen interval.
