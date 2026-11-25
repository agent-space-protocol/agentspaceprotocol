---
title: 词汇
description: 类型、关系、动词、事件、约束、形式和说明页。
---

每个space发布一份词汇，让懂协议、但不懂这个space的参与者，不需要专门为它写的代码就能理解它：读了词汇就知道能看到什么、能做什么、会得到什么结果。

词汇按**命名空间**组织，由一个或几个包组合，以它的RFC 8785规范JSON的哈希引用，这个哈希在`hello`里作为`vocabulary`给出。参与者用`vocabulary`消息取词汇，可以按哈希缓存。

## 词汇里有什么

| 部分 | 写什么 | 参考 |
| --- | --- | --- |
| `namespaces` | 每个命名空间，以及它来自的包的版本 | — |
| `types` | 事物的种类，每种最多一个`parent`；属性用JSON Schema | LambdaMOO的父对象，Inform 7的种类 |
| `relations` | 事物之间能有的关系、两端的类型和数量 | Inform 7的关系 |
| `verbs` | 作用在哪种事物上、参数schema、可能的结果和原因、默认结果、过期策略、效果类别 | MCP的工具列表 |
| `events` | space追加的记录条目的种类、内容schema、谁感知得到 | CloudEvents |
| `constraints` | 提交前必须成立的条件 | — |
| `forms` | 观察的形式和媒体类型 | — |
| `pages` | 给模型读的说明：每个类型和动词一句简介，每个命名空间一页全文 | `SKILL.md` |

所有名字都由命名空间限定，比如`chat.reply`或`room.lamp`。以`asp.`开头的名字属于协议。

## 动词

```json
"chat.send": {
  "line": "Send a new message to a channel.",
  "object": "chat.channel",
  "params": {"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]},
  "effect": "send",
  "outcomes": ["done", "refused", "unknown"],
  "reasons": ["onebot.timeout"],
  "default": {"end": "refused", "reason": {"code": "forbidden"}},
  "stale": "allow"
}
```

动词的**效果类别**是以下几种之一：`read`（只读）、`change`（改变这个space）、`send`（发送给别人：新的接收方、转发、公开发布）、`spend`（花钱）和`irreversible`（不能撤回）。参与者据此决定要不要先问主人，不需要认识具体的动词。在被问到的那个对话里回话，属于改变这个space，不算发送。

动词的**默认结果**在找不到专门的定律时使用。它要么是什么都没变的`done`，要么是带原因的`refused`，所以词汇里的每个动词都有结果。不在词汇里的动词一律`refused`，原因`unsupported`。

不符合`params`的参数得到`refused`，原因`malformed`。`object`的类型既不是动词的`object`类型、也不是它的后代时，得到`refused`，原因`malformed`。

## 使用词汇

agent用词汇行动的方式和用MCP一样：每个动词变成一个可以调用的函数，名字、一句简介和参数schema进上下文，说明页的全文用到才读。结果里的原因是有类型的代码，agent据此决定等、重试还是换办法。事件的种类可以直接作为它的反应的触发条件。为某种space学到的技能，按那个space的词汇命名空间保存，到了任何用同一套词汇的space照样能用。

## 包的版本

包按大版本号区分，同一个大版本里只加不改（见[兼容的规矩](../compatibility/)）。每个命名空间的`version`说明它来自哪个版本的包。
