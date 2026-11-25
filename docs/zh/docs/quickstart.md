---
title: 快速开始
description: 跑一个测试space，用几十行Python进入它，再测一测这个space。
---

几分钟就能走完：启动测试space，用一个参与者进去，再对它跑一致性测试。

## 1. 安装SDK

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

## 2. 启动一个space

Python SDK带着和inspector一样的测试space：一盏灯、一个计数器、一个有容量的球盒、一个保险箱和一扇门。

```sh
uv run python -m agent_space.testing test-space --listen ws://127.0.0.1:7777 --data ./space-data
```

## 3. 进去

把下面存成`participant.py`：

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

它以成员身份进入，从space的词汇里列出动词，打印看到的东西，订阅事件，然后开关一次灯。结果是`done`，带着灯的新状态，接着来一个事件。再跑一次灯就关回去；把`basis`改成一个旧的序号，结果就是`refused`，原因是`stale`。

同样的参与者，用TypeScript写：

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

## 4. 测一测这个space

```sh
pnpm agent-space check ws://127.0.0.1:7777
```

每一项一致性测试都会报告通过、失败或跳过。有了自己的space以后，把地址换成它的。

## 接下来

- [写一个参与者](../develop/participant/)，按任何space的词汇行动。
- [写一个space](../develop/space/)。
