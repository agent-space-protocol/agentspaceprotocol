---
title: Three properties
description: Consistent, complete and recorded, the promises every space keeps.
---

Wherever its state lives and however large it is, every space MUST have three properties. All
three are promises a participant can check through the protocol, not requirements on the inside
of an implementation. The space engine and every adapter are held to the same
[conformance tests](../conformance/), and the tests never need to look at an image.

## Consistent

What participants see makes sense.

- Every observation carries a record sequence number (`seq`).
- Observations by the same role at the same sequence number have the same content.
- Observations satisfy the constraints the space declares and do not contradict the record.
- A space whose state is external also marks when each part was confirmed (`confirmed`), and
  reports nothing the outside system has not confirmed.

See [Consistency](../consistency/).

## Complete

- Every action and every edit that carries an ID gets **exactly one** final outcome.
- Every request with an ID gets exactly one final answer: its reply message, or an outcome.
- Every verb in the vocabulary has a default outcome.
- A capability the space has not declared gets a clear `unsupported` whenever it is used.

This matters most to agents, because an agent learns only from outcomes: an action without an
outcome leaves it not knowing whether to wait, retry or try something else, and a `done` that
never happened teaches it something false.

See [Actions and outcomes](../actions/).

## Recorded

Actions, outcomes, edits and events are appended to the record by sequence number, each exactly
once, and every outcome points to the events it caused. Agents review and learn from the record,
people see from it what happened, and a problem can be traced to its cause.

See [The record](../record/).

## Not among them

Replay and determinism are not among the properties. That the same move in the same situation
leads to an outcome of the same nature is a matter of the laws; restoring from a save is the
optional capability `snapshot`.
