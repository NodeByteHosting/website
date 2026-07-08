---
title: Cancelling PayPal Subscriptions
description: Instructions for requesting a plan cancellation and properly revoking automatic PayPal billing agreements.
tags: [billing, paypal, cancellation, account]
author: NodeByte Team
lastUpdated: 2026-07-08
order: 2
---

# Decommissioning Services & PayPal Cancelations

When you submit a cancellation request for a NodeByte service, our system immediately flags the instance to stop future invoice generation. However, if you originally checked out using an automated **PayPal Billing Agreement**, PayPal’s internal subscription system will continue pushing automated renewals until the token is explicitly revoked within your personal wallet.

Please follow these steps to cleanly decommission a service and prevent accidental gateway charges.

## Step 1: Submit the Infrastructure Cancellation Request

Before removing payment tokens, you must instruct our backend to release your hardware resource allocations.

1. Log into the Client Portal at **[billing.nodebyte.host](https://billing.nodebyte.host)**.
2. Go to **Services** → **My Services** and select the specific node you wish to terminate.
3. On the management sidebar, select **Request Cancellation**.
4. Choose your preferred decommissioning timeline:
   * **Immediate:** The container or virtual machine is powered down and sent to a secure data wiping queue within 24 hours.
   * **End of Billing Period:** The server remains active and accessible until your current paid cycle concludes, at which point it gracefully deprovisions.
5. Provide brief feedback regarding your cancellation (optional) and confirm the request.

## Step 2: Revoke the PayPal Pre-Authorized Token

Once the portal records your cancellation, you must manually break the billing link on the payment processor's end:

1. Log into your account at **[PayPal.com](https://www.paypal.com)**.
2. Click the **Settings** gear icon in the top right corner of your account navigation bar.
3. Select the **Payments** tab.
4. Click on **Manage Automatic Payments** or locate your active automatic merchant list.
5. Select **NodeByte LTD** from your list of authorized merchants.
6. Click **Cancel Automatic Payments** and confirm your decision on the prompt.

> **Administrative Note:** Revoking your billing agreement is a mandatory security step. While our finance team conducts regular manual audits to catch and reverse stray incoming funds, manually terminating the token on the PayPal platform is the only way to ensure their system does not push an unassigned payment.
