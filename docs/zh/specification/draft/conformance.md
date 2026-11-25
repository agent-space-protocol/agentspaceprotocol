---
title: 一致性测试
description: 一致性测试检查什么，以及怎么测试一个space或一个参与者库。
---

规范和一致性测试一起发布，测试从不需要看任何图像。测试在[inspector](https://github.com/agent-space-protocol/inspector)仓库里，照A2A的TCK：场景、被测系统和运行器。

```sh
agent-space check <address> [--profile <file>] [--launch <command>] [--json <file>]
```

`agent-space check`跑space这一头，把每个测试报告为通过、失败或跳过，以文字和JSON两种形式输出。space可以把JSON报告附在自己的说明里，以后也附在registry的登记条目里。

两头都能测：用运行器测space，用**测试space**测参与者库，测试space是一个声明了每项能力的最小space。inspector还有一个**测试参与者**，它是一个对任何space运行固定场景的最小参与者，这样也能反过来测space库。每个SDK都有自己的测试space和测试参与者，SDK之间的每种配对都能通过。

## 测试配置

大多数测试从space的声明推出该做什么：它的角色、能力和词汇。有些测试需要一个具体的动作来试，比如一个要花一些时间的动作。space在**测试配置**里写明这些动作，用`--profile`给出，或者在它的`hello`里作为带命名空间的成员`inspector.profile`给出：

| 键 | 运行器拿它做什么 |
| --- | --- |
| `role` | 普通动作以哪个角色进入。 |
| `done` | 一个会完成的动作。 |
| `counter` | 一个有可见、可累加效果的动作，以及它的`object`上显示这个效果的`property`。 |
| `slow` | 一个至少要几秒、被要求时会停下的动作。 |
| `stale` | 一个动作，它的动词拒绝过期的动作，而且它会改变自己的对象。 |
| `constraint` | 一个动作，或者以`changes`给出的`edit`，做到一半会违反约束。 |
| `consent` | 一个要等同意的动作。 |
| `owner` | 一个能同意等待中的动作的角色。 |
| `forbidden` | 一个角色（`role`）和这个角色不能做的一个动作；没写时从角色声明推出。 |
| `offer` | 一个要交接的事物（`thing`），它的类型不认识但有认识的父类型；以及一个没有任何认识类型的事物（`unknown`）。 |

缺少探针的测试被**跳过**，绝不算通过。

## 启动

有两个测试需要关闭和杀掉space：`outcome.close`和`outcome.restart`。只有当运行器自己启动space时它们才运行：用`--launch <command>`（这条命令在给定地址启动space，标准输入结束时优雅地关闭它，并把记录保存在磁盘上），或者地址本身就是一条命令。

## 测试

| 测试 | 测什么 | 怎么测 |
| --- | --- | --- |
| `handshake.errors` | 握手 | `hello`之前的请求得到`error` `malformed`；没有共同核心版本的`hello`得到`error` `unsupported`。 |
| `compat.parts` | 按部分协商 | 每部分取到最高的共同版本；只有一方认识的部分不列出；多出的未知版本被忽略。 |
| `compat.unknown-fields` | 未知字段 | 带有未知的、带命名空间成员的`hello`、`join`、`act`和嵌套参数，照常处理。 |
| `outcome.done` | 一个结果：完成 | `done`探针以恰好一个`done`结束，只记录一次，以它的`asp.act`条目为起因。 |
| `outcome.forbidden` | 一个结果：没有权限 | 角色不能用的动词得到`refused`，原因`forbidden`，恰好一次。 |
| `outcome.malformed` | 一个结果：参数不对 | 违反动词schema的参数，以及不带动词的`act`，得到`refused`，原因`malformed`；未知的动词得到`refused`，原因`unsupported`。 |
| `outcome.deadline` | 一个结果：期限 | 期限很短的`slow`探针以恰好一个原因为`deadline`的`failed`或`unknown`结束。 |
| `outcome.cancel` | 一个结果：取消 | 先发`slow`探针，再发`cancel`：恰好一个`cancelled`（或`done`或`unknown`）。 |
| `outcome.cancel-after-done` | 一个结果：完成后取消 | `done`之后的`cancel`不带来第二个结果。 |
| `outcome.consent-timeout` | 一个结果：等同意超时 | `consent`探针得到`waiting`，过了声明的时间后得到恰好一个原因为`deadline`的`cancelled`；得到同意的照常执行。 |
| `outcome.close` | 一个结果：关闭 | `slow`探针进行中时space关闭：先出现它的结果，然后是`asp.closing`。 |
| `outcome.restart` | 一个结果：杀掉后重启 | `slow`探针进行中时杀掉进程再启动：记录里为它恰好有一个原因为`restarted`的`unknown`，重发它的ID返回这个结果。 |
| `idempotency.repeat` | 不重复执行 | 用同一个ID连发三次`counter`探针，只有一次效果，三次回答相同，记录里只有一次。 |
| `stale.basis` | 过期 | basis早于其对象某次变化的`stale`探针得到`refused`，原因`stale`；basis是当前的则完成；超过头部的basis是`malformed`。 |
| `atomic.constraint` | 原子性 | `constraint`探针得到`refused`，原因`constraint`；观察不变，记录只多出这个动作和它的结果。 |
| `record.once` | 记录：恰好一次 | 一串动作的每个结果和事件都恰好推送一次，按顺序，并与`record`一致。 |
| `record.resume` | 记录：续接 | 一个已订阅的参与者有一个动作在进行时连接断了；期间另一个参与者行动，那个动作也在它不在时结束；它续接在场，从最后一个序号起订阅：什么都没丢，什么都没重复，那个动作唯一的结果就在它收到的条目里。 |
| `record.expired` | 记录：保留期 | 从保留的最早条目之前开始的查询和订阅得到`refused`，原因`expired`。space的记录保留不超过30秒时运行。 |
| `projection.roles` | 投影 | 每个角色的观察和记录符合它的声明：没有隐藏的属性，没有隐藏种类的条目。 |
| `projection.score` | 投影：评分 | 只有评测者角色拿到评分；其他角色得到`refused`，原因`forbidden`，也从来看不到`asp.score`。 |
| `unsupported.all` | 不支持 | 能力没有声明或部分没有协商的每条能力消息、没有声明的形式、未知的消息类型，都得到明确的`unsupported`。 |
| `doors.handover` | 门 | 中途被切断的offer让事物恰好留在一边：`take`说明它是否被接收，观察与之一致；重发的offer只接收一次；未知类型回退到最近的已知父类型；参与者的通行凭证由space的密钥签名。 |

## 故意弄坏的space

inspector的测试space可以以坏掉的方式启动，每个坏掉的变体都被它自己的测试捕获，而且只被这个测试捕获。这说明测试能抓到真问题。

| 变体 | 坏在哪里 | 由谁捕获 |
| --- | --- | --- |
| `drop-outcome` | 被要求取消的动作永远得不到结果 | `outcome.cancel` |
| `run-twice` | 重复的动作ID被再执行一次 | `idempotency.repeat` |
| `half-commit` | 违反约束的变化保留了前一半 | `atomic.constraint` |
| `drop-on-resume` | 续接订阅时丢了一个条目 | `record.resume` |
| `silent-unsupported` | 没有协商的部分的消息被忽略 | `unsupported.all` |
