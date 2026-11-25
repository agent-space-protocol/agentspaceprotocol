---
title: 写一个space
description: 给已有的系统写适配器，或者搭一个自己的世界，由SDK守住协议的保证。
---

做space有两条路。

| 路 | 什么时候 | 怎么做 |
| --- | --- | --- |
| 适配器 | 状态在一个已有的系统里：聊天平台、桌面、游戏服务器、评测环境 | 用SDK的space骨架，定律去调用那个系统，只报告它确认过的东西 |
| 引擎 | 从零搭一个世界 | space引擎运行包和起始状态；引擎还在计划中，发布之前用SDK写这个世界 |

## 用SDK

骨架替你守住协议的保证：每个动作恰好一个终结结果（含到期、取消、关闭和重启）、幂等的ID、`basis`和过期、没声明的就是"不支持"、记录和订阅、续订和过期、按角色投影、同意、暂停和门。你只写动词怎么执行、状态长什么样。

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

同一个space，用Python写：

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

定律正常返回就是`done`；抛出`Refused`表示什么都没发生，`Failed`带上已经发生的效果，`Uncertain`表示不确定并带上已知的部分，被要求停下时抛出`Stopped`。耗时长的定律用`ctx.sleep`或`ctx.checkpoint`等待，这样取消、期限、关闭和暂停才能传到它那里。

## 写适配器时

- 能在执行前检查的（参数、范围、安全规则）先检查，不通过就拒绝。
- 只报告外部系统确认过的状态和结果，并带上确认的时间；确认不了，结果就是`unknown`，写明知道多少。
- 把外部的变化，包括协议外的参与者做的事，变成事件。

然后像[快速开始](../../quickstart/)里那样，对它跑`agent-space check`。
