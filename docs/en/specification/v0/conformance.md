---
title: Conformance
description: What the conformance tests check, and how a space or a participant library is tested.
---

The specification and the conformance tests are published together, and the tests never need to
look at an image. They live in the [inspector](https://github.com/agent-space-protocol/inspector)
repository, after A2A's TCK: scenarios, a system under test and a runner.

```sh
agent-space check <address> [--profile <file>] [--launch <command>] [--json <file>]
```

`agent-space check` runs the space end and reports each test as passed, failed or skipped, as text
and as JSON. A space can attach the JSON report to its description, and later to its registry
entry.

Both ends can be tested: a space with the runner, and a participant library with the **test
space**, a minimal space that declares every capability. The inspector also has a **test
participant**, a minimal participant that runs a fixed scenario against any space, so that a space
library can be tested the other way round. Each SDK has its own test space and test participant,
and every pairing of SDKs passes.

## The profile

Most tests derive what to do from the space's declarations: its roles, capabilities and
vocabulary. Some need a concrete action to try, such as one that takes a while. A space names
those in a **profile**, given with `--profile` or in its `hello` as the namespaced member
`inspector.profile`:

| Key | What the runner does with it |
| --- | --- |
| `role` | The role to join as for ordinary actions. |
| `done` | An action that is done. |
| `counter` | An action with a visible effect that adds up, and the `property` of its `object` that shows it. |
| `slow` | An action that takes at least several seconds and stops when asked. |
| `stale` | An action whose verb refuses stale actions, and which changes its own object. |
| `constraint` | An action, or an `edit` given as `changes`, that would break a constraint part way through. |
| `consent` | An action that waits for consent. |
| `owner` | A role that may agree to waiting actions. |
| `forbidden` | A `role` and an action that role may not take; derived from the roles when absent. |
| `offer` | A `thing` to hand over whose type is unknown but has a known parent, and an `unknown` thing with no known type. |

A test whose probe is missing is **skipped**, never passed.

## Launching

Two tests need to close and to kill the space: `outcome.close` and `outcome.restart`. They run only
when the runner starts the space itself, with `--launch <command>` (the command starts the space
at the given address, closes it gracefully when its standard input ends, and keeps its record on
disk), or when the address is a command.

## The tests

| Test | What | How |
| --- | --- | --- |
| `handshake.errors` | Handshake | A request before `hello` gets `error` `malformed`; a `hello` with no common core version gets `error` `unsupported`. |
| `compat.parts` | Negotiation by part | Each part gets the highest common version; a part only one side knows is left out; an extra unknown version is ignored. |
| `compat.unknown-fields` | Unknown fields | `hello`, `join`, `act` and nested arguments carrying unknown namespaced members are handled as usual. |
| `outcome.done` | One outcome: done | The `done` probe ends in exactly one `done`, recorded once with its `asp.act` entry as cause. |
| `outcome.forbidden` | One outcome: no permission | A verb the role may not use is `refused` with `forbidden`, exactly once. |
| `outcome.malformed` | One outcome: wrong parameters | Arguments that break the verb's schema, and an `act` without a verb, are `refused` with `malformed`; an unknown verb is `refused` with `unsupported`. |
| `outcome.deadline` | One outcome: deadline | The `slow` probe with a short deadline ends in exactly one `failed` or `unknown` with `deadline`. |
| `outcome.cancel` | One outcome: cancelled | The `slow` probe, then `cancel`: exactly one `cancelled` (or `done` or `unknown`). |
| `outcome.cancel-after-done` | One outcome: cancel after finishing | `cancel` after `done` brings no second outcome. |
| `outcome.consent-timeout` | One outcome: consent timing out | The `consent` probe gets `waiting`, then exactly one `cancelled` with `deadline` once the declared time passes; an agreed one runs. |
| `outcome.close` | One outcome: closing | The space closes with the `slow` probe under way: its outcome comes first, then `asp.closing`. |
| `outcome.restart` | One outcome: killed and restarted | The process is killed with the `slow` probe under way and started again: the record holds exactly one `unknown` with `restarted` for it, and resending its ID returns that outcome. |
| `idempotency.repeat` | Never done twice | The `counter` probe sent three times with one ID has one effect and three identical answers, and the record holds it once. |
| `stale.basis` | Staleness | The `stale` probe with a basis older than a change of its object is `refused` with `stale`; with a current basis it is done; a basis beyond the head is `malformed`. |
| `atomic.constraint` | Atomicity | The `constraint` probe is `refused` with `constraint`; the observation is unchanged and the record gains only the action and its outcome. |
| `record.once` | The record: exactly once | Every outcome and event of a run of actions is pushed exactly once, in order, and matches `record`. |
| `record.resume` | The record: resuming | A subscribed participant has an action under way when its connection drops; another acts meanwhile, and the action ends while it is away; it resumes its presence and subscribes from its last sequence number: nothing lost, nothing repeated, and the action's one outcome is among what it receives. |
| `record.expired` | The record: retention | A query and a subscription from before the earliest entry kept are `refused` with `expired`. Runs when the space keeps its record for at most 30 seconds. |
| `projection.roles` | Projection | Each role's observations and record match its declaration: no hidden property, no hidden kind of entry. |
| `projection.score` | Projection: scores | Only the evaluator role gets the score; others are `refused` with `forbidden` and never see `asp.score`. |
| `unsupported.all` | Unsupported | Every capability message whose capability is undeclared or whose part was not negotiated, an undeclared form, and an unknown message type get a clear `unsupported`. |
| `doors.handover` | Doors | An offer cut off midway leaves the thing on exactly one side: `take` says whether it was taken and the observation agrees; a resent offer takes it once; an unknown type falls back to its nearest known parent; a participant's pass is signed by the space's key. |

## Deliberately broken spaces

The inspector's test space can be started broken, and each broken variant is caught by its own
test and only by it. This shows that the tests catch real problems.

| Variant | Broken how | Caught by |
| --- | --- | --- |
| `drop-outcome` | An action that was asked to cancel never gets its outcome | `outcome.cancel` |
| `run-twice` | A repeated action ID is carried out again | `idempotency.repeat` |
| `half-commit` | A change that breaks a constraint keeps its first half | `atomic.constraint` |
| `drop-on-resume` | Resuming a subscription loses an entry | `record.resume` |
| `silent-unsupported` | A message of a part that was not negotiated is ignored | `unsupported.all` |
