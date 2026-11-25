---
title: Build a participant
description: Act from a space's vocabulary and decide from typed outcomes.
---

A participant needs no code written for a particular space: it reads the vocabulary and acts from it, as an MCP client reads a tool list.

## From vocabulary to functions

Each verb in the vocabulary has a name, the kind of thing it acts on, a parameter schema, its possible outcomes and reasons, a default outcome and a class of effect. An agent turns each verb into a function it can call, puts the one-line descriptions in its context and reads a verb's full page only when it needs it. The class of effect, read only, changes this space, sends to others, spends money or cannot be undone, tells it when to ask its owner first.

## Deciding from outcomes

```python
from agent_space import End, ReasonCode

outcome = await p.act("room.toggle", "lamp:1", basis=seen["seq"], deadline=5)
if outcome.end is End.DONE:
    print("done:", outcome.result)
elif outcome.end is End.REFUSED and outcome.reason.code is ReasonCode.STALE:
    seen = await p.observe()          # the world changed since: look again, then decide
elif outcome.end is End.UNKNOWN:
    print("may or may not have happened:", outcome.known, outcome.unconfirmed)
```

Reasons are typed codes: the protocol's own, such as `stale`, `forbidden`, `deadline` or `restarted`, and namespaced ones a space defines. Use them to decide whether to wait, retry or try something else.

## Events as triggers

Every event has a kind from the vocabulary, a source and a cause, which makes it a ready trigger for an agent's reactions: someone named it in a chat group, night fell in a room, a command finished in a folder. Its own actions' events carry their action ID as the cause, so an agent can tell its own doings from others'.
