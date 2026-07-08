---
title: Client Portal Overview
description: A complete guide to navigating the NodeByte client portal, managing active services, and handling core account settings.
tags: [billing, account, client portal, navigation]
author: NodeByte Team
lastUpdated: 2026-07-08
order: 1
---

# Client Portal Overview

The NodeByte Client Portal is the central management dashboard for your infrastructure. Within this panel, you can monitor your active hosting deployments, process invoices, adjust account profiles, and open technical support tickets.

## Portal Access

You can access the dashboard securely at **[billing.nodebyte.host](https://billing.nodebyte.host)**.

### First-Time Authentication
If you are logging in for the first time following a purchase:
1. Navigate to the portal landing page.
2. Click **Login**. to start the authorization flow
3. Enter the email address and password credentials specified during checkout.
4. Complete any required multi-factor verification steps.

### Password Recovery
If you lose your login credentials:
1. Click the **Forgot Password?** link on the authentication block.
2. Input your registered administrative email address.
3. Check your inbox for an automated reset token.
4. Click the link within the email to set a new secure password.

## Dashboard Layout

Upon logging in, your main overview screen maps account data into four primary sections:

| Section | Functional Scope |
| :--- | :--- |
| **Active Products & Services** | Displays your currently provisioned virtual environments and hardware nodes. |
| **Recent Invoices** | Lists pending renewals, outstanding bills, and completed transactions. |
| **Recent Support Tickets** | Tracks open, answered, or closed technical escalation logs. |
| **System Announcements** | Houses critical platform notifications, network updates, and maintenance schedules. (**NOTE**: there is no designated section for these they will be displayed in plain view on the dashboard home) |

## Managing Services

### Inspecting Your Deployments
To view the status of your infrastructure allocations, navigate to **Services** in the sidebar and select **My Services**. This ledger tracks the lifecycle state of each deployment, including `Active`, `Suspended`, `Pending`, or `Cancelled`. Clicking on an individual service open its granular management area.

### Accessing the Game Control Panel
While billing and account modifications occur inside the Client Portal, your server files, terminal console, and application configurations are housed inside our isolated game panel.

1. Locate the **View Server** button within your active service page.
2. The portal will securely redirect your session to **[panel.nodebyte.host](https://panel.nodebyte.host)**.
3. Authenticate using the single-sign-on link or the standalone panel credentials provided in your initial deployment welcome email.

## Invoices and Payment Processing

### Auditing Financial Records
To view your complete transaction history, navigate to **Billing** → **My Invoices**. Invoices will show one of the following statuses:

* **Paid:** Payment has been processed and verified. The service remains online.
* **Unpaid:** An invoice has generated and is awaiting manual payment or an automated card debit.
* **Overdue:** The payment deadline has passed. The attached service is nearing automated suspension.
* **Cancelled:** The invoice has been voided or resolved by the billing team.

### Supported Settlement Gateways
NodeByte utilizes two primary payment processors for all store transactions:
* **Stripe Engine:** Handles secure credit and debit card processing (Visa, Mastercard, American Express, Discover) along with supported digital wallets.
* **PayPal:** Supports manual one-time express checkouts or automatic recurring billing agreements.

## Technical Support Tickets

### Submitting an Escalation
If you encounter a platform anomaly, infrastructure fault, or billing question, you can open a direct communication lane with our team:

1. Navigate to **Support** → **Open Ticket**.
2. Select the department best suited to your request:
   * **Technical Support:** Server crashes, network routing anomalies, panel errors, or hardware issues.
   * **Billing:** Invoice adjustments, payment clearance issues, or subscription modifications.
   * **Sales:** Custom resource configurations and deployment pre-sales questions.
3. Provide a clear, concise subject line.
4. Detail the operational issue inside the message body, attaching logs or error traces where applicable.
5. Click **Submit**.

### Support Guidelines
To ensure a rapid resolution time, please observe the following technical best practices:
* Include the specific server ID or assigned IP address in your message body.
* List the exact diagnostic steps you have already performed.
* Paste raw console errors or log blocks instead of paraphrasing the issue.
* Avoid opening multiple tickets for a same running issue, as doing so fragments our engineering queue.
* Do not paste administrative root passwords in plain text inside a ticket body.
