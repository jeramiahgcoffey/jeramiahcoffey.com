---
title: Owning the whole system in ABA healthtech
date: 2026-07-27
pillar: aba
summary: A case study in carrying one clinical workflow across offline mobile, identity, reporting, infrastructure, and operations without losing sight of the person using it.
draft: false
---

The hard part of healthtech is rarely one screen or one service. It is making the whole path reliable when the user, the network, the security model, and the reporting requirements all pull in different directions.

That is especially true in Applied Behavior Analysis. A clinician may be working in a home, school, or clinic. Connectivity can disappear. Devices may be shared between staff. The data being recorded is not generic application state. It represents care delivered to a real person and becomes part of how progress is understood later.

My job as the founding engineer on an ABA platform has been to own that path end to end. This is what that ownership looks like in practice.

## Start with the work, not the interface

The visible request might sound like a mobile feature: let a clinician record data during a session.

If I treat that as a screen-building problem, I can make a polished form that fails the first time the network drops. If I treat it as a workflow, the questions change:

- What must remain possible without connectivity?
- Which data can be created locally?
- How do pending changes survive an app restart?
- What happens when local and remote state disagree?
- Which images or reference materials must already be on the device?
- How does the active clinician prove who they are on a shared device?
- How will a supervisor use the resulting data later?

The interface is one surface of the answer. The product is the complete loop.

## Make offline normal

Clinical work happens where the client is, not where the Wi-Fi is strongest. Offline support cannot be an error state with a better message. It has to be a normal operating mode.

The React Native application keeps the session workflow available through local persistence, background synchronization, and image caching. Work is written locally first, then reconciled when connectivity returns. The person using the app should not have to understand which request failed or decide when to retry it.

That moves complexity into the system, where it belongs. The application has to track pending work, make retries safe, prevent duplicate writes, and communicate sync state without interrupting the session.

The outcome is simple to describe: clinicians can keep working when the network cannot.

## Fit security to the clinical setting

Healthcare security often gets discussed as if the only choice is stronger or weaker authentication. The real design problem is making secure behavior compatible with the work.

Organizations need enforceable identity controls, including multi-factor authentication. Clinical settings also include shared devices, where a full account logout between every handoff would be slow enough that people would look for a shortcut.

The model I built separates the authenticated application session from fast, PIN-gated access for the active clinician. The organization keeps a strong account boundary. The person holding the device gets a workflow that matches the pace of a real session. Audit events connect sensitive actions back to an identity that the system can enforce.

The point is not to remove friction. It is to put friction at the correct boundary.

## Carry the data into decisions

Recording data is only the first half of the product. Supervisors and clinical leaders need to understand progress, program health, and what deserves attention.

The same domain model that supports session collection feeds MongoDB aggregation pipelines and reporting interfaces in the React web application. That creates a useful pressure on the design. Fields cannot exist only because a form needed somewhere to put them. Their meaning has to remain coherent from collection through aggregation and display.

Owning both ends changes how I evaluate a data model. I am asking whether it is easy to save today, but also whether it can answer tomorrow's question without reconstructing meaning from scattered flags and exceptions.

The outcome is continuity. The information collected during care can become a trustworthy view of progress instead of a separate reporting project.

## Infrastructure is part of the feature

A clinical workflow is not done when it works in a development environment.

The platform runs on AWS managed through Terraform. Deployment, credential rotation, logs, metrics, and alerts are part of the same ownership boundary as the application code. If a sync failure reaches production, I need enough context to distinguish a device problem, an API problem, and an infrastructure problem. If a credential changes, the rotation path has to be deliberate and repeatable.

Infrastructure as code makes the runtime reviewable. CI/CD makes releases consistent. Observability closes the loop between what I intended the system to do and what it is doing for users.

That work is not separate from the feature. It is how the feature keeps its promises after release.

## What whole-system ownership means

Owning the whole system does not mean writing every line personally. It means maintaining the thread of intent across every boundary:

1. A clinician needs to complete work without depending on connectivity.
2. Local state and synchronization preserve that work.
3. Identity and audit controls protect it.
4. APIs and data models keep its meaning intact.
5. Reporting turns it into information another person can use.
6. Infrastructure and observability keep the loop running in production.

The implementation crosses mobile, backend services, web reporting, databases, and cloud infrastructure. The outcome is one coherent workflow.

That is the standard I now use for end-to-end ownership. Not "I built the frontend and backend." The better question is whether the person using the product can reach the outcome, under the conditions they actually work in, and whether the system can keep earning their trust after it ships.
