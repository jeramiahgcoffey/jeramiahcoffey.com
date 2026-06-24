---
title: What HIPAA actually means in code
date: 2026-06-12
pillar: aba
summary: Compliance is not a PDF you sign. It is a set of concrete engineering decisions about identity, access, and audit that show up in every layer of the stack.
draft: false
---

When people hear HIPAA, they picture a binder of policies and an annual training video. When you build a healthtech platform, it stops being abstract. It becomes a series of specific decisions you make in code, over and over.

Here is what it has actually looked like for me, building on a regulated ABA therapy platform.

## Identity has to be enforceable, not optional

It is not enough to offer multi-factor authentication. An organization needs to be able to require it for everyone, with no opt-out for the one admin who finds it annoying. That is a different feature than a checkbox in user settings. It is a policy the system enforces on behalf of the org, and it has to survive every edge case in the login flow.

Clinical settings also break the usual one-person-one-device assumption. Devices get shared between clinicians during a session. So you need a fast, secure way to switch the active person without fully logging out and back in. A PIN-gated layer on top of the real session solves the human problem without weakening the security model underneath.

## Every meaningful action leaves a trail

Audit logging is the part nobody demos but everybody needs. Who accessed which record, when, and what they did. The hard part is not writing log lines. It is deciding what counts as an event worth recording, keeping that consistent across services, and making sure the log is something you could actually answer questions with later.

## Least privilege all the way down

The same instinct that protects patient data protects the infrastructure. Credentials rotate automatically instead of living forever in a config file. Services get the narrowest access that lets them do their job. Observability is wired in so that if something behaves strangely, you can see it.

## The reframe

None of this is glamorous. There is no clever algorithm in rotating a database credential or enforcing MFA at the org level. But this is the work that makes software trustworthy enough to hold something as sensitive as a child's clinical record. Compliance is not a document. It is the sum of a hundred small engineering decisions, and getting them right is the actual job.
