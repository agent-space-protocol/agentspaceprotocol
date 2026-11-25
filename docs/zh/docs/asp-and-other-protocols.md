---
title: ASP和其他协议
description: agent周围的各个协议，各自连接什么，以及ASP在其中的位置。
---

今天的agent会说好几个开放协议，每个把它连到不同的东西上。ASP补上其中一种连接：agent或人，和它所在的地方之间。

| 协议 | 连接 | 传递什么 |
| --- | --- | --- |
| MCP | AI应用 ↔ 工具、数据和工作流 | 工具调用和结果、资源、提示词 |
| A2A | agent ↔ 另一个agent | 不透明的agent之间的任务、消息和产出 |
| ACP（Agent Client Protocol） | 代码编辑器或客户端 ↔ 编程agent | 提示、修改、权限、agent的输出 |
| AG-UI | agent ↔ 面向用户的应用 | 一串事件：消息、工具调用、状态变化 |
| Gymnasium | 学习程序 ↔ 环境 | `reset`和`step`：观察、动作、奖励、一局结束 |
| Matrix | 客户端 ↔ 服务器，以及服务器之间 | 由有序事件组成的房间，同步到客户端、在服务器间联邦 |
| ASP | agent或人 ↔ 它所在的地方 | 在场、观察、恰好一个结果的动作、事件、记录 |

**MCP**，即[Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)，是把AI应用连到外部系统的开放标准：数据源、工具和工作流。应用调用一个工具，得到一个回答。

**A2A**，即[Agent2Agent Protocol](https://a2a-protocol.org/latest/topics/what-is-a2a/)，让不同厂商、不同框架做的agent互相通信、一起完成任务，而不必共享各自内部的记忆和工具。它跑在HTTP上，用JSON-RPC和服务器推送事件。

**ACP**，即[Agent Client Protocol](https://agentclientprotocol.com/)，统一代码编辑器和编程agent之间的通信；本地的agent作为编辑器的子进程运行，经标准输入输出说JSON-RPC。

**AG-UI**，即[Agent–User Interaction Protocol](https://docs.ag-ui.com/introduction)，是把agent连到面向用户的应用上的事件协议，让界面能跟上并引导agent正在做的事。

**Gymnasium**，即[Gymnasium API](https://gymnasium.farama.org/api/env/)，是强化学习代码和环境之间的标准接口：`reset`开始一局，`step`执行一个动作，返回观察、奖励和这一局是否结束。

**Matrix**，即[Matrix规范](https://spec.matrix.org/latest/)，定义了去中心化通信的开放接口：房间里的事件有序，同步到客户端，并在服务器之间联邦。

**ASP**把agent或人连到它所在的地方，在真实世界或虚拟世界里，并且在它停留期间一直连着。那个地方有自己的状态和定律，别的参与者也在里面行动，事情会自己发生，每个动作恰好得到一个结果，一切都有记录。上面这些协议都不处理这种连接；ASP从其中几个借了想法，规范在用到的地方都写明了出处。

## 一起用

一个agent可以同时说其中好几个：经MCP工具读文档，经A2A把一个子任务交给另一个agent，经ACP在编辑器里、或经AG-UI在网页界面里回答用户，再经ASP住在有机器人的家里、在项目里干活、在群聊里说话。每个协议只管自己那种连接，不需要替别的协议承担什么。
