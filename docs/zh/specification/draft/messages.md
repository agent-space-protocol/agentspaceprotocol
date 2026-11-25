---
title: 消息
description: ASP v0的每条消息、它们怎么得到回答，以及一次完整往来。
---

每条消息是一个带`type`的JSON对象。请求带`id`。每条消息的确切字段见[schema参考](../reference/schema/)；这一章说明每条消息做什么。

## 一次往来

一个agent进入一个聊天群space。以`→`开头的行是参与者发出的，以`←`开头的行是space发出的。它握手、进入、取一次观察，在群里回一句话。第二句话发出去之后网络断了，适配器确认不了聊天平台是否送达，结果就是`unknown`，写明知道的部分。

```text
→ {"type":"hello", "parts":{"core":[0], "forms":[0], "consent":[0]},
   "participant":"ed25519:7Hq2…"}
← {"type":"hello", "space":"onebot:group/demo", "parts":{"core":0, "forms":0},
   "capabilities":{"state":"external", "participants":{"outside":true, "grace_seconds":300},
                   "forms":["structure","text","image"]},
   "vocabulary":"sha256:4be1…", "record":{"head":1040, "earliest":1, "keep_seconds":7776000},
   "nonce":"q3V9sT1mYb2hR8kL0pZx4w"}
→ {"type":"join", "id":"j1", "role":"member",
   "presentation":{"name":"Fin", "avatar":"sha256:90c3…"}, "proof":"…"}
← {"type":"outcome", "id":"j1", "end":"done", "seq":1041,
   "result":{"presence":"p-3", "role":"member", "presentation":{"avatar":"used"},
             "resume":"r-8f2a6c", "head":1040}}
→ {"type":"observe", "id":"o1", "forms":["structure"]}
← {"type":"observation", "id":"o1", "seq":1041, "confirmed":"2026-11-24T21:05:12Z",
   "structure":{"things":[{"id":"msg:88", "type":"chat.message", "from":"member:41",
                           "text":"@Fin what time do we meet today?"}]}}
→ {"type":"act", "id":"a17", "verb":"chat.reply", "object":"msg:88",
   "args":{"text":"Seven, at the east gate."}, "basis":1041}
← {"type":"outcome", "id":"a17", "end":"done", "seq":1043, "events":[1042]}
→ {"type":"act", "id":"a18", "verb":"chat.send", "object":"channel:main",
   "args":{"text":"I'm here already."}, "basis":1043}
← {"type":"accepted", "id":"a18"}
← {"type":"outcome", "id":"a18", "end":"unknown", "seq":1050,
   "reason":{"code":"onebot.timeout", "text":"no receipt 20 s after sending"},
   "known":{"handed_to_onebot":true}, "unconfirmed":["delivered"]}
→ {"type":"consent", "id":"c9", "act":1043, "agree":true}
← {"type":"outcome", "id":"c9", "end":"refused",
   "reason":{"code":"unsupported", "text":"consent was not negotiated"}}
```

space没有声明consent，所以握手的结果里没有这一部分，参与者的`consent`得到`unsupported`。完整的往来在`schema/draft/examples/exchanges/chat-group.jsonl`里对照schema检查过。

## 核心消息

| 消息 | 方向 | 回答 | 做什么 |
| --- | --- | --- | --- |
| `hello` | 双向 | `hello` | 握手。参与者给出每部分支持的版本，可选给出身份（`participant`）或本地`token`。space给出自己的标识、协商好的版本（`parts`）、它支持的版本、能力表、词汇的哈希、记录的状态和一个`nonce`。 |
| `join` | 参与者 → space | `outcome` | 开始一次在场，或者断线后`resume`一次在场，或者带着`pass`过门而来。带上请求的角色、呈现偏好和身份的`proof`。结果里有在场ID、给的角色、感知范围、对呈现偏好的处理、一个`resume`令牌和记录的头部。 |
| `leave` | 参与者 → space | `outcome` | 结束这次在场。带`cancel: true`时，进行中的动作一并取消。 |
| `observe` | 参与者 → space | `observation` | 以所要的形式取一次观察，带它所在的记录序号和确认时间。 |
| `subscribe` | 参与者 → space | `subscribed`，然后是若干`event` | 从某个序号起，推送这次在场能看到的每个条目。 |
| `act` | 参与者 → space | 中间状态、`outcome` | 一个动作：ID、`verb`、`object`、`args`，可选的`basis`和`deadline`。 |
| `edit` | 参与者 → space | 中间状态、`outcome` | 一次编辑：ID、结构化的`changes`或一句`sentence`，可选的`basis`和`deadline`。需要能力`edit`。 |
| `cancel` | 参与者 → space | 没有自己的回答 | 请求取消这个参与者的一个动作、编辑或流。被取消的那个请求仍然得到它自己的终结结果。 |
| `accepted` / `progress` / `waiting` | space → 参与者 | — | 动作的中间状态。 |
| `outcome` | space → 参与者 | — | 一个请求的终结结果：`end`、`reason`、`result`、`effects`、`events`、`seq`；`unknown`另有`known`和`unconfirmed`。 |
| `event` | space → 参与者 | — | 一个记录条目：发给已订阅的在场；`asp.closing`发给每个连接。 |
| `record` | 参与者 → space | `entries` | 按序号或时间取记录。 |
| `vocabulary` | 参与者 → space | `vocabulary` | 取词汇。 |
| `blob` | 参与者 → space | `blob` | 按哈希取大内容。 |
| `error` | space → 参与者 | — | 协议错误，只用于不带可用ID的消息。 |

### 进入前后

握手完成之前，只接受`hello`。`join`成功之前，参与者可以发送`vocabulary`、`blob`和`join`；其他任何请求都以`forbidden`拒绝。一个连接最多承载一次在场；已有在场时再发`join`，以`malformed`拒绝，同一次在场的`resume`除外。

## 能力消息

这些消息属于同名的部分；除非space声明了这项能力，并且这个部分协商过，否则不支持。

| 消息 | 能力 | 回答 | 做什么 |
| --- | --- | --- | --- |
| `stream` | `forms` | `accepted`、若干`frame`、`outcome` | 按某个速率订阅一个连续形式。`cancel`结束它。 |
| `consent` | `consent` | `outcome` | 角色有权同意的在场，同意或拒绝一个等待中的动作，这个动作以它的`asp.act`条目的序号指明。 |
| `snapshot` / `restore` | `snapshot` | `outcome` | 存档状态，结果里有它的哈希。恢复一个存档的状态。 |
| `episode` / `score` | `episode` | `outcome` | 按任务和种子开一局。领取评分；只有评测者角色收得到，其他角色以`forbidden`拒绝。 |
| `pause` / `resume` | `pause` | `outcome` | 停住这个参与者一个进行中的动作，再接着做。 |
| `sense` | `senses` | `outcome` | 放入、列出或删除一个派生观察。 |
| `views` | `views` | `outcome` | 列出space自带的界面；网页包用`blob`取。 |
| `offer` / `take` | `doors` | `outcome` | 过门；交接一个事物；询问一次offer是否被接收。 |

## 顺序

在一个连接上，space按顺序发出对同一个请求的回答：先是中间状态，然后是最终回答。对不同请求的回答可以交错。`event`消息按序号顺序发送。参与者不得假定一个`event`和与它相关的`outcome`以某种特定顺序到达。
