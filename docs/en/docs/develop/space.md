---
title: Build a space
description: An adapter for a system you have, or a world of your own, with the SDK keeping the guarantees.
---

There are two ways to make a space.

| Way | When | How |
| --- | --- | --- |
| Adapter | The state lives in a system you already have: a chat platform, a desktop, a game server, an evaluation | The SDK's space skeleton, with laws that call the system and report only what it confirms |
| Engine | You build a world from nothing | The space engine runs packages and a starting state; it is planned, and until it is released, write the world with the SDK |

## With the SDK

The skeleton keeps the protocol's guarantees for you: exactly one final outcome for every action (deadlines, cancels, closing and restarts included), idempotent IDs, `basis` and staleness, “unsupported” for what is not declared, the record with subscriptions, resuming and expiry, projection by role, consent, pausing and doors. You write how verbs are carried out and what the state looks like.

```ts
import { Space, SqliteStore, Refused } from "@agent-space-protocol/sdk/space";

let on = false;
const space = new Space({
  capabilities: { state: "held", participants: { grace_seconds: 60 } },
  vocabulary: {
    namespaces: { room: { version: "0.1.0" } },
    types: { "room.lamp": { line: "A lamp." } },
    verbs: { "room.toggle": { object: "room.lamp", effect: "change", default: { end: "done" }, stale: "refuse" } },
    events: { "room.switched": { line: "A lamp was switched." } },
  },
  store: new SqliteStore("record.db"),
  handlers: {
    observe: () => ({ structure: { things: [{ id: "lamp:1", type: "room.lamp", on }] } }),
    verbs: {
      "room.toggle": (ctx) => {
        if (ctx.object !== "lamp:1") throw new Refused("room.no_such_lamp", `there is no ${ctx.object}`);
        on = !on;
        ctx.emit("room.switched", { on }, { things: ["lamp:1"] });
        return { result: { on } };
      },
    },
  },
});
await space.listen("ws://127.0.0.1:7777");
```

The same space in Python:

```python
from agent_space.space import Space, SqliteStore, Refused

space = Space(
    capabilities={"state": "held", "participants": {"grace_seconds": 60}},
    vocabulary={
        "namespaces": {"room": {"version": "0.1.0"}},
        "types": {"room.lamp": {"line": "A lamp."}},
        "verbs": {"room.toggle": {"object": "room.lamp", "effect": "change", "default": {"end": "done"}, "stale": "refuse"}},
        "events": {"room.switched": {"line": "A lamp was switched."}},
    },
    store=SqliteStore("record.db"),
)
state = {"on": False}

@space.observer
def observe(ctx):
    return {"structure": {"things": [{"id": "lamp:1", "type": "room.lamp", "on": state["on"]}]}}

@space.verb("room.toggle")
def toggle(ctx):
    if ctx.object != "lamp:1":
        raise Refused("room.no_such_lamp", f"there is no {ctx.object}")
    state["on"] = not state["on"]
    ctx.emit("room.switched", {"on": state["on"]}, things=["lamp:1"])
    return {"result": {"on": state["on"]}}
```

A law returns for `done`, raises `Refused` when nothing happened, `Failed` with the effects that did happen, `Uncertain` for unknown with what is known, or `Stopped` when asked to stop. Long laws wait with `ctx.sleep` or `ctx.checkpoint`, so that cancels, deadlines, closing and pauses reach them.

## For an adapter

- Check before acting what you can (parameters, ranges, safety rules), and refuse when a check fails.
- Report only states and outcomes the outside system confirmed, with the time of confirmation; when it cannot confirm, the outcome is `unknown` with what is known.
- Turn changes from outside, including what participants outside the protocol do, into events.

Then run `agent-space check` against it, as in the [quick start](../../quickstart/).
