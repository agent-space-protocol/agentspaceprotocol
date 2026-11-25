---
title: 写一个参与者
description: 按space的词汇行动，按有类型的结果做决定。
---

参与者不需要为某个space专门写代码：它读词汇并按词汇行动，就像MCP客户端读工具列表。

## 从词汇到函数

词汇里每个动词有名字、作用的事物种类、参数schema、可能的结果和原因、默认结果和效果类别。agent把每个动词变成一个能调用的函数，把一句话的简介放进上下文，用到某个动词时才读它的全文。效果类别（只读、改变这个space、发送给别人、花钱、不能撤回）告诉它什么时候要先问主人。

## 按结果做决定

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

原因是有类型的代码：协议自己的，比如`stale`、`forbidden`、`deadline`、`restarted`，以及space自己定义、带命名空间的。用它们决定该等、该重试还是该换办法。

## 事件作为触发条件

每个事件都有词汇里的种类、来源和起因，正好用作agent反应的触发条件：群里有人点了它的名，房间里天黑了，文件夹里一条命令跑完了。它自己动作引起的事件，起因就是那个动作的ID，所以agent分得清哪些是自己做的，哪些是别人做的。
