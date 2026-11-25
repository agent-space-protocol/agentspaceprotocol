---
title: 动作和结果
description: 动作ID、中间状态、五种终结结果、原因、幂等和basis。
---

完备落到协议上就是一条规则：**每个动作和编辑带一个ID，恰好得到一个终结结果，结果取自一个封闭的集合**。这是A2A处理任务状态的做法：结束的状态只有固定几种，其中有"拒绝"和"不确定"。

## 请求和ID

期待回答的消息是**请求**，带一个`id`：一个非空字符串，最多128个字符，在发送它的参与者范围内唯一。有身份（密钥或令牌）的参与者，ID在它于这个space的所有在场中唯一；匿名参与者，ID在它这次在场内唯一。

每个请求恰好得到一个最终回答。动作（`act`）、编辑（`edit`）和流（`stream`）以中间状态和一个`outcome`回答。查询以各自的回复消息回答（`observe`回`observation`，`subscribe`回`subscribed`，`record`回`entries`，`vocabulary`回`vocabulary`，`blob`回`blob`），回答不了时以一个`end: "refused"`的`outcome`回答。其他请求都以一个`outcome`回答。

## 中间状态

动作在结束前可以经过三种中间状态：

- `accepted`：space已经受理，正在进行；
- `progress`：正在进行，报告进展到哪里（`progress`从0到1）或者一句话，可以任意多次；
- `waiting`：等另一个参与者同意（能力`consent`），写明等谁、等到什么时候。

中间状态是可选的。某个ID得到终结结果之后，space不得再为它发送任何中间状态。

## 五种终结结果

| `end` | 含义 |
| --- | --- |
| `done` | 做完了。带`result`和它引起的`events`。 |
| `refused` | **什么都没发生**。在任何效果之前就决定了：没有权限、参数不对、观察已经过期、违反约束。 |
| `failed` | 做了但没做成。列出已经发生的`effects`；原子提交的space，这个列表是空的。 |
| `cancelled` | 确认已经停下。列出停下之前的`effects`。 |
| `unknown` | 可能做了也可能没做。写明知道的部分（`known`）和没确认的部分（`unconfirmed`）。 |

space不得为没有发生的事给出`done`，有任何事发生时不得给出`refused`。分辨不了时结果是`unknown`，这是一个如实的结果。

## 原因

每个`refused`、`failed`和`unknown`结果都带一个`reason`：一个代码和一句话（`text`），可选带`data`。`cancelled`结果在参与者没有要求取消时带原因（等同意超时是`deadline`，关闭是`closed`）；`done`可以带原因。代码要么是协议自己的，要么带命名空间（`chat.delivery_timeout`）。

| 代码 | 含义 |
| --- | --- |
| `unsupported` | space没有的能力、部分、消息类型或动词。 |
| `forbidden` | 这次在场的角色不能做这件事，或者被请求同意的参与者拒绝了。 |
| `malformed` | 消息不符合schema，或者参数不符合动词的参数定义。 |
| `stale` | `basis`所指的观察已经过期，而这个动词拒绝过期的动作。 |
| `constraint` | 这个变化会违反约束；什么都没改。`data`写明是哪条约束。 |
| `deadline` | 动作的期限，或者等同意的时间，已经过了。 |
| `closed` | space关闭了，或者这次在场结束了。 |
| `restarted` | space重启了，确认不了结果。 |
| `expired` | 记录里已经不再保留所要的内容。 |

原因代码是有类型的：参与者仅凭代码就能决定等、重试还是换办法。

## 各种意外都落在这五种里

| 发生了什么 | 结果 |
| --- | --- |
| 期限到了（`deadline`，从收到时起算的秒数） | space停下这个动作。确认停下且没做成：`failed`，原因`deadline`。停不下或确认不了：`unknown`，原因`deadline`。先一步做完了：`done`。 |
| 参与者发出`cancel` | 照LSP的做法，取消只是请求：动作仍然得到自己的终结结果，停下了是`cancelled`，先一步做完了是`done`，确认不了是`unknown`。 |
| 连接断了 | 什么都不变：动作照常走完，结果进记录。在场保留`participants.grace_seconds`；参与者续接这次在场，从断开时的序号接着读记录。 |
| 参与者带`cancel: true`离开 | 每个进行中的动作都按上面的方式取消。不带`cancel`时，它们各自走到自己的结果。 |
| 宽限时间过后在场结束 | 进行中的动作各自走到自己的结果，结果进记录。 |
| space关闭 | 每个进行中的动作先得到终结结果（`cancelled`，或者原因为`closed`的`unknown`）；然后space追加`asp.closing`，并把它作为`event`发给每个连接。 |
| space崩溃后重启 | 每个`asp.act`条目在记录里没有终结结果的动作，都得到原因为`restarted`的`unknown`，在其他任何条目之前追加。 |
| 等同意超时没人回 | `cancelled`，原因`deadline`。同意被拒绝是`refused`，原因`forbidden`。 |

## 不会做两次

照Stripe的幂等键，会改变什么的请求（`act`、`edit`、`leave`、`stream`、`consent`、`snapshot`、`restore`、`episode`、`pause`、`resume`、`sense`、`offer`）用同一个ID再发一次，只返回第一次的最终回答，原样不变，包括它的`seq`；还在进行时，返回它当前的中间状态（还没发过就是`accepted`）。它绝不会被执行第二次，即使第二条消息和第一条不同。space至少在记录的保留期内记住这些ID，重启后也记得。查询（`observe`、`subscribe`、`record`、`vocabulary`、`blob`、`score`、`views`、`take`）只是再回答一次，`join`属于它所在的连接。所以参与者在断线或超时后可以放心重发，不需要猜第一次有没有生效。

## basis和过期

动作或编辑可以写明它所依据的观察，即那次观察的记录序号`basis`。每个动词在词汇里声明basis过期时怎么办：

- `stale: "refuse"`：动作涉及的任何事物在`basis`之后变过，动作就得到`refused`，原因`stale`。动作涉及的事物至少包括它的`object`，以及它的定律指明的其他事物。
- `stale: "allow"`（默认）：动作照做。

一个序号大于`basis`的记录条目在`things`里列出某个事物，或者在`basis`之后恢复过存档，这个事物就算在`basis`之后变过。条目的`things`只列出它改变了的、或参与了所发生之事的事物：`asp.act`、`asp.edit`和其他请求条目不列，编辑的`asp.outcome`列出它改变的事物。大于记录头部的`basis`是`malformed`。带`basis`的编辑，如果它改变的任何事物在`basis`之后变过，就以`stale`拒绝。

这是"只接受当前这一步的命令"和"替换文件要带上读到的哈希"的一般形式，对多个参与者同样成立。

## 协议错误和结果分开

带请求ID的消息，哪怕格式不对，也以结果回答：`refused`，原因是`malformed`、`unsupported`或`forbidden`。只有不带可用ID的消息，比如`hello`和`cancel`，才得到协议`error`消息。

## 记录动作

space受理一个动作或编辑时，追加一个`asp.act`或`asp.edit`条目；动作或编辑的每个终结结果都作为一个`asp.outcome`条目追加，条目的`cause`是那个动作的条目（格式不对、从未被受理的动作没有这一项）。结果消息的`seq`是它的`asp.outcome`条目的序号，它的`events`是这个动作引起的条目的序号，这些条目的`cause`都是这个动作的条目。查询的回答不进记录。
