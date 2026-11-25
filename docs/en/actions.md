---
title: Actions and outcomes
description: Action IDs, intermediate states, the five final outcomes, reasons, idempotency and basis.
---

Completeness comes down to one rule: **every action and edit carries an ID and gets exactly one
final outcome, taken from a closed set.** This is how A2A handles task states: an ending is one of
a fixed few, among them "rejected" and "unknown".

## Requests and IDs

A message that expects an answer is a **request** and carries an `id`: a non-empty string of at
most 128 characters, unique for the participant that sends it. For a participant with an identity
(a key or a token) the ID is unique across all its presences in this space; for an anonymous
participant, within its presence.

Every request gets exactly one final answer. Actions (`act`), edits (`edit`) and streams
(`stream`) are answered with intermediate states and one `outcome`. Queries are answered with their
reply message (`observe` with `observation`, `subscribe` with `subscribed`, `record` with
`entries`, `vocabulary` with `vocabulary`, `blob` with `blob`) or, when they cannot be answered,
with an `outcome` with `end: "refused"`. All other requests are answered with an `outcome`.

## Intermediate states

Before it ends, an action can pass through three intermediate states:

- `accepted`: the space has taken it and it is under way;
- `progress`: under way, with how far along (`progress` from 0 to 1) or one sentence, any number of
  times;
- `waiting`: waiting for another participant to agree (capability `consent`), saying for whom and
  until when.

Intermediate states are optional. A space MUST NOT send any of them for an ID after that ID's
final outcome.

## The five final outcomes

| `end` | Meaning |
| --- | --- |
| `done` | Carried out. Carries the `result` and the `events` it caused. |
| `refused` | **Nothing happened.** Decided before any effect: lack of permission, wrong parameters, a stale observation, a broken constraint. |
| `failed` | Tried and not achieved. Lists the `effects` that did happen; for a space that commits atomically the list is empty. |
| `cancelled` | Confirmed stopped. Lists the `effects` from before it stopped. |
| `unknown` | It may or may not have happened. States what is `known` and what is `unconfirmed`. |

A space MUST NOT give `done` for something that did not happen, and MUST NOT give `refused` when
anything happened. When it cannot tell, the outcome is `unknown`, which is a truthful outcome.

## Reasons

Every `refused`, `failed` and `unknown` outcome carries a `reason`: a code and one sentence
(`text`), with optional `data`. A `cancelled` outcome carries one when the participant did not ask
for it (`deadline` for consent, `closed`); `done` MAY carry one. A code is either one of the protocol's own or carries a namespace (`chat.delivery_timeout`).

| Code | Meaning |
| --- | --- |
| `unsupported` | A capability, part, message type or verb the space does not have. |
| `forbidden` | The presence's role may not do this, or the participant whose consent was asked refused. |
| `malformed` | The message does not match the schema, or the arguments do not match the verb's parameters. |
| `stale` | The observation named by `basis` is out of date, and the verb refuses stale actions. |
| `constraint` | The change would break a constraint; nothing was changed. `data` names the constraint. |
| `deadline` | The action's deadline, or the time to wait for consent, passed. |
| `closed` | The space closed, or the presence ended. |
| `restarted` | The space restarted and could not confirm the outcome. |
| `expired` | The record no longer keeps what was asked for. |

Reason codes are typed: a participant decides from the code alone whether to wait, retry or try
something else.

## Every mishap lands on one of the five

| What happens | Outcome |
| --- | --- |
| The deadline passes (`deadline`, seconds from receipt) | The space stops the action. Confirmed stopped and not achieved: `failed` with `deadline`. Not stoppable or not confirmable: `unknown` with `deadline`. Finished first: `done`. |
| The participant sends `cancel` | Cancelling is only a request, as in LSP: the action still gets its own final outcome, `cancelled` if it stopped, `done` if it finished first, `unknown` if that cannot be confirmed. |
| The connection drops | Nothing changes: the action runs to its end and its outcome goes into the record. The presence is kept for `participants.grace_seconds`; the participant resumes it and continues the record from the sequence number where it dropped. |
| The participant leaves with `cancel: true` | Each action under way is cancelled as above. Without `cancel`, they run to their own outcomes. |
| The presence ends after the grace period | Actions under way run to their own outcomes, which are recorded. |
| The space closes | Every action under way first gets its final outcome (`cancelled`, or `unknown` with `closed`); then the space appends `asp.closing` and sends it as an `event` to every connection. |
| The space crashes and restarts | Every action whose `asp.act` entry has no final outcome in the record gets `unknown` with `restarted`, appended before anything else. |
| Nobody answers a consent in time | `cancelled` with `deadline`. A refused consent is `refused` with `forbidden`. |

## Nothing is done twice

As with Stripe's idempotency keys, sending a request that changes something (`act`, `edit`,
`leave`, `stream`, `consent`, `snapshot`, `restore`, `episode`, `pause`, `resume`, `sense`,
`offer`) again with the same ID only returns the first final answer, identical, including its
`seq`, or, while it is still under way, its current intermediate state (`accepted` when none was
sent). It is never carried out a second time, even when the second message differs from the first.
The space remembers these IDs for at least as long as it keeps its record, and across restarts.
Queries (`observe`, `subscribe`, `record`, `vocabulary`, `blob`, `score`, `views`, `take`) are
simply answered again, and `join` belongs to its connection. A participant can therefore resend after a disconnect or a timeout without guessing
whether the first attempt took effect.

## Basis and staleness

An action or edit may name the observation it was based on: its record sequence number, `basis`.
Each verb declares in the vocabulary what happens when the basis is stale:

- `stale: "refuse"`: if any thing the action touches has changed after `basis`, the action is
  `refused` with the reason `stale`. The things an action touches are at least its `object`, and
  any others its laws name.
- `stale: "allow"` (the default): the action goes ahead.

A thing has changed after `basis` when a record entry with a greater sequence number lists it in
`things`, or when a save was restored after `basis`. Entries list in `things` only the things they
changed or that took part in what happened: `asp.act`, `asp.edit` and the other request entries
list none, and the `asp.outcome` of an edit lists the things it changed. A `basis` greater than
the head of the record is `malformed`. An edit with a `basis` is refused as `stale` when any thing
it changes has changed after `basis`.

This is the general form of "only a command for the current step is accepted" and "replacing a
file requires the hash that was read", and it holds just as well with many participants.

## Protocol errors and outcomes are kept apart

A message that carries a request ID, even a malformed one, is answered with an outcome: `refused`
with `malformed`, `unsupported` or `forbidden`. Only messages without a usable ID, such as `hello`
and `cancel`, get protocol `error` messages.

## Recording actions

When a space takes an action or edit it appends an `asp.act` or `asp.edit` entry; every final
outcome of an action or edit is appended as an `asp.outcome` entry whose `cause` is the action's
entry (absent for a malformed action that was never taken). The outcome message's `seq` is the
sequence number of its `asp.outcome` entry, and its `events` are the sequence numbers of the
entries the action caused, each of which has the action's entry as its `cause`. Answers to queries
are not recorded.
