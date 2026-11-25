---
title: Quick start
description: Run a test space, enter it with a participant in a few dozen lines of Python, and test the space.
---

This takes a few minutes: start the test space, enter it with a participant, then run the conformance tests against it.

## 1. Install the SDK

```sh
# Python 3.11+, no dependencies
uv add "agent-space-protocol @ git+https://github.com/agent-space-protocol/python-sdk"

# TypeScript, Node 24+
git clone https://github.com/agent-space-protocol/typescript-sdk
cd typescript-sdk && pnpm install && pnpm --filter @agent-space-protocol/sdk build

# The agent-space command: conformance tests, a terminal client, a test space
git clone https://github.com/agent-space-protocol/inspector
cd inspector && pnpm install && pnpm agent-space --help
```

## 2. Start a space

The Python SDK carries the same test space as the inspector: a lamp, a counter, a box of balls with a capacity, a safe and a door.

```sh
uv run python -m agent_space.testing test-space --listen ws://127.0.0.1:7777 --data ./space-data
```

## 3. Enter it

Save this as `participant.py`:

```python
import asyncio
from agent_space import Participant, generate_key

async def main():
    async with await Participant.connect("ws://127.0.0.1:7777", key=generate_key()) as p:
        joined = await p.join(role="member")
        print("entered as", joined["role"])

        verbs = (await p.vocabulary()).get("verbs", {})
        print("verbs:", ", ".join(verbs))

        seen = await p.observe()
        for thing in seen["structure"]["things"]:
            print(thing["id"], thing["type"])

        p.on("event", lambda e: print("event", e["seq"], e["type"]))
        await p.subscribe()

        outcome = await p.act("test.toggle", "lamp:1", basis=seen["seq"])
        print(outcome.end, outcome.reason, outcome.result)
        await asyncio.sleep(0.3)

asyncio.run(main())
```

```sh
uv run python participant.py
```

It enters as a member, lists the verbs from the space's vocabulary, prints what it sees, subscribes to events, and switches the lamp. The outcome is `done` with the lamp's new state, and an event follows. Run it twice and the lamp goes back; change `basis` to an old sequence number and the outcome is `refused` with the reason `stale`.

The same participant in TypeScript:

```ts
import { Participant } from "@agent-space-protocol/sdk/participant";
import { generateKey } from "@agent-space-protocol/sdk/identity";

const p = await Participant.connect("ws://127.0.0.1:7777", { key: generateKey() });
await p.join({ role: "member" });
const seen = await p.observe();
p.on("event", (entry) => console.log(entry.seq, entry.type));
await p.subscribe();
const outcome = await p.act({ verb: "test.toggle", object: "lamp:1", basis: seen.seq })
  .onUpdate((u) => console.log(u.type))
  .done;
console.log(outcome.end, outcome.reason?.code, outcome.result);
```

## 4. Test the space

```sh
pnpm agent-space check ws://127.0.0.1:7777
```

Every conformance test reports passed, failed or skipped. Point it at a space of your own when you have one.

## Next

- [Build a participant](../develop/participant/) that acts from any space's vocabulary.
- [Build a space](../develop/space/) of your own.
