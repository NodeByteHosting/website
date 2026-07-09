---
title: Resolving Service Suspensions & AUP Infractions
description: Actions required to restore a suspended NodeByte server due to billing lapses or Acceptable Use Policy violations.
tags: [support, billing, suspension, compliance]
author: NodeByte Team
lastUpdated: 2026-07-08
order: 4
---

# Resolving Service Suspensions

If your instance shifts into a **Suspended** state, network connectivity to that specific deployment is immediately paused. Your data remains intact and secure on the underlying hypervisor array, but the container or virtual machine will refuse all incoming connections until the underlying restriction block is systematically removed.

Suspensions occur under two distinct scenarios: **Billing Delinquency** or **Compliance Actions**.

## Scenario A: Suspensions for Non-Payment

This is the most common cause of service interruption. It occurs when a billing cycle concludes and the corresponding renewal invoice remains unpaid past our standard system grace period.

### Resolution Steps:
1. Log into the client area at **[billing.nodebyte.host](https://billing.nodebyte.host)**.
2. Review your dashboard alerts or navigate to **Account** → **Invoices**.
3. Select the **Unpaid** or **Overdue** invoice tied to your suspended infrastructure node.
4. Complete checkout using either Stripe or PayPal.
5. *The moment our payment gateway registers the transaction, our backend pushes an automated power-on command to the hypervisor. Your instance and panel access will restore completely within 60 to 180 seconds.*

## Scenario B: Suspensions for Compliance or Abuse Flags

If your invoices are fully settled but your infrastructure is offline, our automated network filtering layers or security operations team has flagged your instance for an Acceptable Use Policy (AUP) violation.

Common compliance triggers include:
* **Outbound Network Anomalies:** Participating in outbound denial-of-service (DDoS) traffic loops, running unauthorized vulnerability scanning scripts, or hosting brute-force matrices.
* **Hypervisor Resource Depletion:** Executing unauthorized cryptocurrency mining logic or locking sustained, non-standard I/O or CPU spikes that degrade performance for neighboring instances on the host node.
* **Abuse Documentation:** External DMCA takedown requests or verified malicious software distribution reports sent to our network abuse handling desk.

### Resolution Steps:
1. Navigate to **Support** → **Tickets** within the portal.
2. Locate the active compliance ticket. Our operations team automatically opens an investigation log whenever an administrative suspension block is executed.
3. Review the diagnostic data, logs, or external complaint text provided by our staff.
4. Reply directly to the ticket detailing your precise remediation strategy (such as purging compromised system directories or removing the offending application strings).
5. *Compliance locks require a manual review by our network engineering team. We will restore your hypervisor container to an active status as soon as the core policy infraction or system vulnerability is confirmed resolved.*
