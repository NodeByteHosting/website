---
title: Managing Pre-Funded Account Credit
description: How to add and utilize pre-funded account credits to streamline automated renewals and protect nodes from bank drops.
tags: [billing, wallet, credit, payments]
author: NodeByte Team
lastUpdated: 2026-07-08
order: 3
---

# Managing Pre-Funded Account Credit

NodeByte supports a pre-funded wallet system within the client portal. This feature allows developers, systems administrators, and community managers to maintain an active cash balance on their profiles, protecting continuous infrastructure workloads against sudden banking flags, card expirations, or transaction declines.

When a renewal invoice is generated, the system will automatically exhaust any available account credit before attempting to process your primary on-file payment method.

## Depositing Funds to Your Account

1. Authenticate your session on the Client Portal: **[billing.nodebyte.host](https://billing.nodebyte.host)**.
2. Navigate to [**Account** → **Credits**](https://billing.nodebyte.host/account/credits) via the interface menu.
3. Input the exact currency amount you wish to add to your balance.
4. Select your preferred deposit gateway: **Stripe** (for credit/debit cards) or **PayPal**.
5. Finalize the transaction through the secure routing window.

Once confirmed by the payment gateway, the funds will immediately populate as an active balance on your account dashboard.

## System Credit Mechanics

* **Automated Settlement Priority:** When a service renewal invoice generates (typically 5 to 7 days prior to your service expiration date), our billing engine automatically checks your profile balance. If credit is present, it is applied immediately to settle or reduce the invoice.
* **Partial Invoice Mitigation:** If an invoice total exceeds your available credit, the billing system will exhaust your wallet balance first, then issue a revised invoice showing only the remaining unpaid balance.
* **Non-Refundable Parameters:** Deposited account credits are strictly non-refundable and hold zero cash-out value. Deposited balances are securely locked to your NodeByte profile to cover future hosting fees, hardware upgrades, or addon assignments.

> **Recommendation:** If you host production-grade API systems, active storage nodes, or large multiplayer communities, keeping a one-to-two month runtime buffer in your account credit balance is an effective strategy to insulate your services from abrupt merchant-side processing interruptions.
