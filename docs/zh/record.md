---
title: 记录
description: 条目、序号、订阅和续接、投影和保留期。
---

记录是一条按序号追加的历史，参考Kafka的偏移量和Matrix的事件。

## 条目

每个条目是一个CloudEvents 1.0事件，用它的JSON格式。`specversion`、`id`、`source`和`type`总是存在；ASP加上自己的成员。

| 成员 | 含义 |
| --- | --- |
| `specversion` | 总是`"1.0"`。 |
| `id` | 序号的十进制字符串。 |
| `source` | 谁引起的：`space`、`presence/<presence>`，或者`outside` / `outside/<who>`。 |
| `type` | 种类。协议的种类以`asp.`开头；其他的在词汇里命名。 |
| `time` | 追加的时间。 |
| `seq` | 序号：记录从1开始，每个条目取下一个号。 |
| `aspcore` | 写这个条目时核心部分的版本。 |
| `cause` | 引出它的条目的序号，所以任何事都能一路追到源头。 |
| `things` | 涉及的事物。 |
| `roles` | 如果有，只有这些角色收得到它。 |
| `data` | 内容；大的内容只以哈希存在`dataref`里，用`blob`取。 |

协议定义的种类：

| 种类 | 什么时候追加 | `data` |
| --- | --- | --- |
| `asp.join` | 一次在场开始或续接 | `presence`、`role`、`participant`、`resumed` |
| `asp.leave` | 一次在场结束 | `presence`、`reason` |
| `asp.act` | 受理一个动作 | `presence`、`id`、`verb`、`object`、`args`、`basis` |
| `asp.edit` | 受理一个编辑 | `presence`、`id`、`changes`或`sentence`、`basis` |
| `asp.cancel` | 请求取消 | `presence`、`id` |
| `asp.waiting` | 一个动作等待同意 | `presence`、`id`、`for`、`until` |
| `asp.consent` | 给出或拒绝同意 | `presence`、`act`、`agree` |
| `asp.outcome` | 一个动作或编辑结束 | 结果的`presence`、`id`、`end`、`reason`、`result`、`effects`、`events`、`known`、`unconfirmed` |
| `asp.episode` | 一局开始 | `episode`、`task`、`seed` |
| `asp.score` | 领取评分；`roles`是评测者角色 | `episode`、`score` |
| `asp.snapshot`、`asp.restore` | 存档，或从存档恢复 | `snapshot` |
| `asp.take` | 经门交接过来的事物被接收 | `offer`、`from`、`thing`、`as` |
| `asp.restarted` | space重启了 | — |
| `asp.closing` | space正在关闭 | — |

## 读取和订阅

参与者用`record`读取记录，按序号（`from`、`to`）或按时间（`since`、`until`），可选带`limit`；回答是`entries`，还有更多匹配时带`more`。

参与者用`subscribe`从任意序号（`from`）起订阅，或者从下一个新条目起。space回`subscribed`，然后按序号顺序把这次在场能看到的每个条目作为`event`消息推送，每条恰好一次。新的`subscribe`替换之前的。

位置由参与者自己记住。断线后，它续接自己的在场（带`resume`的`join`），从它看到的最后一个序号加一起订阅；它必须恰好一次收到那个序号之后的每个条目，不丢也不重。

## 投影

记录和观察一样按角色投影：一次在场永远收不到`roles`不包括它的角色的条目，也收不到种类列在它角色的`hide.events`里的条目。它的角色隐藏的属性从条目的`data`里去掉。序号不重新编号，所以投影后的记录有空缺。

## 保留期

space在`hello`的`record.keep_seconds`里声明记录保留多久（`null`：永远），并给出仍保留的最早序号（`record.earliest`）。从保留的最早条目之前开始的`record`或`subscribe`，以一个`refused`的`outcome`回答，原因`expired`，绝不是空结果。原因的`data.earliest`给出保留的最早序号。

回看、导出和复盘只需要记录本身；从存档恢复是另一项能力`snapshot`。
