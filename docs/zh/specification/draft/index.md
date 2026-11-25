---
title: Agent Space Protocol
description: 参与者（agent和人）和它们所在的任何space之间的一个开放协议。
sidebar:
  label: 概览
---

**状态：草案**。协议的每一部分都处于版本`0`，仍可能改变。等真实的环境通过一致性测试后，各部分冻结，冻结之后只做加法。

agent所在的每个地方都是一个**space**：一个有状态、定律和参与者的世界。agent和人通过一个开放协议进入space、观察它、在里面行动，这个协议就是**Agent Space Protocol**。space可以是项目文件夹、桌面、聊天群、游戏服务器、一次评测，或者一间为agent建来生活的房间。不管是什么，它都必须**自洽**、**完备**、**有记录**；除此之外的一切都是声明的能力。

协议是整个系统里唯一要长期保持稳定的部分。agent、space和客户端只要还说这个协议，随时可以重写。所以它只按[兼容的规矩](compatibility/)做加法。

## 规范

| 章 | 内容 |
| --- | --- |
| [space和参与者](concepts/) | space、参与者、在场、角色；协议外的参与者 |
| [三条性质](properties/) | 自洽、完备、有记录：每个space都遵守的承诺 |
| [能力](capabilities/) | 能力表，以及没有声明的能力意味着什么 |
| [观察和形式](observations/) | 投影、结构、其他形式、流、呈现 |
| [动作和结果](actions/) | 动作ID、中间状态、五种终结结果、原因、幂等、`basis` |
| [自洽](consistency/) | 约束、原子提交、对外部状态的诚实 |
| [记录](record/) | 条目、序号、续接、投影、保留期 |
| [词汇](vocabulary/) | 类型、关系、动词、事件、约束、形式、说明页 |
| [协商和兼容](compatibility/) | 部分和版本、握手、五条兼容规矩 |
| [门](doors/) | 参与者过门，事物在space之间交接 |
| [消息](messages/) | v0的每条消息及其回答方式，附一次完整往来 |
| [传输和身份](transports/) | WebSocket、带SSE的HTTP、标准输入输出；密钥、证明、令牌 |
| [一致性测试](conformance/) | 一致性测试检查什么、怎么检查 |
| [Schema参考](reference/schema/) | 每条消息和每个类型，由`schema.ts`生成 |

## 约定

MUST、MUST NOT、REQUIRED、SHALL、SHALL NOT、SHOULD、SHOULD NOT、RECOMMENDED、MAY和OPTIONAL这些关键词，当且仅当以大写出现时，按RFC 2119和RFC 8174的描述理解。中文文本用下面的词表达它们：MUST、REQUIRED、SHALL写作"必须"，MUST NOT、SHALL NOT写作"不得"，SHOULD、RECOMMENDED写作"应当"，SHOULD NOT写作"不应"，MAY、OPTIONAL写作"可以"。这些词在中文文本里表达要求时，含义与对应的英文关键词相同。

消息的唯一来源是[`schema/draft/schema.ts`](https://github.com/agent-space-protocol/agentspaceprotocol/blob/main/schema/draft/schema.ts)。[`schema/draft/schema.json`](https://github.com/agent-space-protocol/agentspaceprotocol/blob/main/schema/draft/schema.json)（JSON Schema 2020-12）和[schema参考](reference/schema/)都由它生成，`schema/draft/examples/`里每种消息至少有一个经过检查的例子。本文和schema不一致时，schema就是需要修正的错误；请报告。

英文文本是规范性的。中文文本与它保持同步。

## 每一部分的来源

协议的每一部分都照着一个已经被广泛实现的协议来做，让写过那个协议的人一眼就能认出来。

| 部分 | 照着 |
| --- | --- |
| 握手、能力 | MCP的`initialize`；LSP的capabilities |
| 结果 | A2A的任务状态；Stripe的幂等键 |
| 进度、取消 | MCP的progress和cancelled通知；LSP的`$/cancelRequest` |
| 事件、记录 | Matrix的事件和`/sync`；CloudEvents；Kafka的偏移量 |
| 词汇 | MCP的工具列表；JSON Schema；`SKILL.md` |
| 角色 | Matrix的power levels |
| 兼容 | Protocol Buffers的字段规则 |
| 按局进行 | Gymnasium的`reset`和`step` |
| 门 | 我们自己的：交接和父类型回退 |
