---
title: 提案
description: Agent Space Protocol怎么改。
---

提案是协议改变的方式：新的消息、字段、原因、能力或部分，改变某个含义，或者一个扩展。流程照MCP的规范改进提案（SEP）。

| 阶段 | 发生什么 |
| --- | --- |
| 想法 | 开一个issue描述问题：哪些space或参与者需要它，为什么现在的协议做不到 |
| 草稿 | 在一个pull request里把模板复制成`NNNN-short-name.md`，用下一个空着的编号 |
| 评审 | 维护者和实现者讨论；接受前要有至少一个SDK里的参考实现和一致性测试 |
| 接受 | 和规范改动、schema改动、示例和测试一起合并 |
| 拒绝或撤回 | 带着状态合并，原因留下来 |

每个提案都遵守[兼容的规矩](../specification/draft/compatibility/)，写明改的是哪一部分、这一部分要不要升版本，写明一致性测试怎么检查它，并且中英文一起改。

模板和提案列表在[proposals/](https://github.com/agent-space-protocol/agentspaceprotocol/tree/main/proposals)。
