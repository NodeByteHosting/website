---
title: Managing Saved Payment Methods
description: How to safely attach, update, or remove credit cards and digital wallets within your billing profile.
tags: [billing, payments, stripe, credit card]
author: NodeByte Team
lastUpdated: 2026-07-08
order: 5
---

# Managing Saved Payment Methods

NodeByte utilizes the secure Stripe gateway engine to handle all direct credit card, debit card, and digital wallet transactions. When you opt to save a payment method during checkout for faster renewals, your structural financial data is never stored on NodeByte infrastructure. Instead, it is tokenized and stored securely within Stripe's encrypted vault.

You can manage, rotate, or delete your saved cards directly through your client dashboard at any time.

## Adding a New Card or Payment Method

To attach a new payment method to your profile prior to an invoice generating:

1. Authenticate your session at **[billing.nodebyte.host](https://billing.nodebyte.host)**.
2. Select **Account Settings** or click your profile username in the upper navigation zone.
3. Click into the **Payment Methods** management tab.
4. Select **Add New Payment Method**.
5. Input your card parameters securely via the tokenized Stripe window frame.
6. Confirm the assignment. The system will perform a zero-fiat validation check to verify the card's authenticity and attach it to your profile ledger.

## Rotating Cards on Unpaid Invoices

If a recurring renewal invoice fails due to an expired or declined card on file:

1. Open your specific **Unpaid Invoice** from the primary dashboard ledger.
2. Locate the gateway toggle dropdown menu on the upper invoice layout and ensure **Stripe** is active.
3. Click **Pay Now**.
4. Rather than using the card currently assigned, select **Use a new payment method**.
5. Enter your updated billing information and execute the settlement. 
6. Checking the **Save for future renewals** box will automatically set this fresh token as your primary payment instrument, displacing the expired card.

## Removing Payment Tokens

If you wish to completely wipe a saved card from our platform:

1. Go to your profile settings menu and enter the **Payment Methods** sub-panel.
2. Locate the specific card token you want to remove.
3. Click the **Delete** or **Remove** action node next to the card identifier.
4. Confirm the prompt. The tokenized link to Stripe is severed instantly, ensuring no future automated draws can be attempted against that instrument.

> **Note:** If you destroy your only saved payment method while running an active infrastructure deployment, your upcoming renewal invoice will generate as a manual `Unpaid` invoice. You must settle it manually before the end of the billing grace window to prevent automated container suspension.
