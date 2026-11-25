---
title: 能力
description: 每个space逐项声明的能力表。
---

space之间的每一处不同，都表达为同一组能力的取值，没有特殊情况。连上时，space在`hello`里发出能力表，照LSP的做法逐项声明。

## 没有声明就是不支持

没有声明的能力就是**不支持**。参与者用到它时：

- 带ID的消息必须以一个`outcome`回答，`end: "refused"`，原因代码是`unsupported`；
- 不带ID的消息必须以一个`error`回答，代码是`unsupported`。

它绝不会被悄悄忽略。握手时没有协商的协议部分（见[协商](../compatibility/)）、space不认识的消息类型、不在词汇里的动词，也都一样。

以空对象声明的能力，按最保守的取值理解：比如`"pause": {}`表示每个动词都可以暂停，但不承诺更多。

## 能力表

| 能力 | 键 | 取值 | 消息 |
| --- | --- | --- | --- |
| 状态归属 | `state` | `held`，由space持有；或`external`，在外部，由适配器接入 | — |
| 存续 | `lifetime` | `lasting`，一直存在；或`disposable`，用完即弃 | — |
| 参与者 | `participants` | `max`：最多几次在场；`roles`；`default_role`；`outside`：有没有协议外的参与者；`grace_seconds`：断线后在场保留多久 | — |
| 观察的形式 | `forms` | `structure`之外的形式：文字、图像、声音、视频、三维场景，或者某个包定义的形式；每一种都在词汇里声明，带媒体类型 | `stream`、`frame` |
| 输入的形式 | `inputs` | 动作的参数能带的媒体类型 | — |
| 编辑 | `edit` | `roles`：能编辑的角色；`changes`：接受的修改种类；`sentences`：收不收一句话的编辑 | `edit` |
| 存档 | `snapshot` | 能否存档，以及带`restore`时能否恢复 | `snapshot`、`restore` |
| 按局进行 | `episode` | `tasks`；`evaluator`：领取评分的角色 | `episode`、`score` |
| 节奏 | `pace` | `max_hz`：每次在场每秒最多几个动作；`clock`：`wall`或`stepped`；`step_seconds` | — |
| 同意 | `consent` | `verbs`：每个动词要哪个角色同意（`by`），space等多久（`seconds`） | `consent`、`waiting` |
| 暂停 | `pause` | 哪些`verbs`的动作能先停住、之后接着做 | `pause`、`resume` |
| 派生观察 | `senses` | 查询可以用的`languages`；每次在场最多`max`个 | `sense` |
| 自带界面 | `views` | space自带界面的数量`count` | `views` |
| 门 | `doors` | `doors`：有哪些门、通向哪里；`takes`：接不接收交接过来的事物 | `offer`、`take` |

确切的字段见[schema参考](../reference/schema/#capabilities)。

## 能力和部分

每一项有消息的能力，同时也是协议的一个**部分**，有自己的整数版本（`forms`、`snapshot`、`episode`、`consent`、`pause`、`senses`、`views`、`doors`）。`edit`消息属于核心部分，但除非声明了能力`edit`，否则不支持。一项能力的消息，只有在声明了这项能力，**并且**它的部分（如果有）在握手时协商过之后，才能使用。
