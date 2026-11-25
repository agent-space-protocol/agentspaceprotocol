---
title: Agent Space Protocol
description: One open protocol between participants, agents and people, and any space they are in.
sidebar:
  label: Overview
---

**Status: draft.** Every part of the protocol is at version `0` and may still change. The parts are
frozen, after which they only grow, once real environments pass the conformance tests.

Every place an agent is in is a **space**: a world with a state, laws and participants. Agents and
people enter a space, observe it and act in it through one open protocol, the **Agent Space
Protocol**. A space can be a project folder, a desktop, a chat group, a game server, an evaluation
or a room built for an agent to live in. Whatever it is, it must be **consistent**, **complete** and
**recorded**; everything else about it is a declared capability.

The protocol is the only part of the whole system meant to stay stable for the long term. Agents,
spaces and clients can be rewritten at any time as long as they speak it. It therefore only grows
by addition, under the [compatibility rules](compatibility/).

## The specification

| Chapter | What it says |
| --- | --- |
| [Spaces and participants](concepts/) | Spaces, participants, presences, roles; participants outside the protocol |
| [Three properties](properties/) | Consistent, complete, recorded: the promises every space keeps |
| [Capabilities](capabilities/) | The capability table and what an undeclared capability means |
| [Observations and forms](observations/) | Projections, structure, other forms, streams, presentation |
| [Actions and outcomes](actions/) | Action IDs, intermediate states, the five final outcomes, reasons, idempotency, `basis` |
| [Consistency](consistency/) | Constraints, atomic commits, honesty for external state |
| [The record](record/) | Entries, sequence numbers, resuming, projection, retention |
| [Vocabulary](vocabulary/) | Types, relations, verbs, events, constraints, forms, pages |
| [Negotiation and compatibility](compatibility/) | Parts and versions, the handshake, the five compatibility rules |
| [Doors](doors/) | Passing participants and handing things over between spaces |
| [Messages](messages/) | Every message of v0 and how it is answered, with one full exchange |
| [Transports and identity](transports/) | WebSocket, HTTP with SSE, standard input and output; keys, proofs, tokens |
| [Conformance](conformance/) | What the conformance tests check, and how |
| [Schema reference](reference/schema/) | Every message and type, generated from `schema.ts` |

## Conventions

The key words MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD NOT, RECOMMENDED, MAY and
OPTIONAL are to be interpreted as described in RFC 2119 and RFC 8174 when, and only when, they
appear in capitals.

The single source of the messages is [`schema/draft/schema.ts`](https://github.com/agent-space-protocol/agentspaceprotocol/blob/main/schema/draft/schema.ts).
[`schema/draft/schema.json`](https://github.com/agent-space-protocol/agentspaceprotocol/blob/main/schema/draft/schema.json)
(JSON Schema 2020-12) and the [schema reference](reference/schema/) are generated from it, and
`schema/draft/examples/` holds at least one checked example of every message. Where this text and
the schema disagree, the schema is a bug to fix; report it.

This English text is normative. The Chinese text is kept in sync with it.

## Where each part comes from

Each part of the protocol follows a protocol that is already widely implemented, so that people
who have written one recognise it at once.

| Part | Follows |
| --- | --- |
| Handshake, capabilities | MCP `initialize`; LSP capabilities |
| Outcomes | A2A task states; Stripe idempotency keys |
| Progress, cancelling | MCP progress and cancelled notifications; LSP `$/cancelRequest` |
| Events, the record | Matrix events and `/sync`; CloudEvents; Kafka offsets |
| Vocabulary | MCP tool lists; JSON Schema; `SKILL.md` |
| Roles | Matrix power levels |
| Compatibility | The field rules of Protocol Buffers |
| Episodes | Gymnasium `reset` and `step` |
| Doors | Our own: handover and parent-type fallback |
