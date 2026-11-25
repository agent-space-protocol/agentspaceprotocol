---
title: Spaces and participants
description: Spaces, participants, presences and roles.
---

## Spaces

A **space** is any place an agent is in. Each space is a world made of three things:

- a **state**: a set of typed things and the relations between them;
- **laws**, which decide the outcome of everything that happens;
- **participants**, the agents and people who observe and act in it.

A project folder's state is its files and processes, and its laws are the semantics of the
operating system. A chat group's state is its members and messages, and its laws say who may speak
and what follows. A room's state is its walls, its furniture and whoever lives there, and its laws
say how things are put down and how a lamp comes on.

A space whose state it holds itself (run by a space engine) declares the capability
`state: "held"`; a space whose state is outside, reached by an adapter, declares
`state: "external"`. Participants see no other difference: the differences between spaces are not
special cases but different values of one set of [capabilities](../capabilities/).

## Participants and presences

Participants use one interface: **connect, enter, observe, act, leave**. The space pushes what
happens to them.

A participant's stay from entering (`join`) to leaving (`leave`) is a **presence**. Every
observation and action belongs to a presence. A presence has an ID chosen by the space.

A participant has an **identity**: an Ed25519 public key, a local token, or nothing (see
[Transports and identity](../transports/)). The same participant can have several presences over
time, and with the same identity the space recognises it again.

A participant never changes the state directly. It submits **actions**; a role with the right to
edit may also submit **edits**, which change the world itself. Both get exactly one final
[outcome](../actions/).

## Roles

Each presence has a **role**. As with Matrix power levels, a space declares its roles in the
capability `participants.roles`, and for each role:

- `verbs`: the verbs it may use (`["*"]` for all);
- `edit`: whether it may edit;
- `consent`: whether it may agree to waiting actions;
- `hide`: what it does not see, as property names and kinds of record entry.

The default roles are `owner`, `member` and `guest`; spaces with episodes add `evaluator`. A
participant asks for a role in `join`; the space decides the role it gives and MAY refuse the join
with `forbidden`.

A space MUST enforce its role declarations: an action whose verb the role may not use is
`refused` with the reason `forbidden`, and what a role may not see never appears in its
observations or in the record entries it receives.

## Participants outside the protocol

Some participants do not use the protocol: the person sitting at a real desktop, members of a
chat group who have not joined through ASP, other players on a game server. They are
**participants outside the protocol**. A space that has them declares `participants.outside: true`.

What they change still happens in the space and appears as record entries whose `source` is
`outside` or `outside/<who>`. A space MUST NOT attribute such a change to a participant of the
protocol.
