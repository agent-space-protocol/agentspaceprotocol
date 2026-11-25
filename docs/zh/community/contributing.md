---
title: 参与贡献
description: 修正、提案、SDK和space。
---

- **小的修正**（正文、示例或schema）：直接开pull request，中英文一起改。
- **改协议**先走[提案](../../proposals/)。
- **其他语言的SDK**欢迎：它的测试space通过`agent-space check`，测试参与者跑通inspector的场景，就算一致。
- **space和参与者**：用SDK写，跑一致性测试，在GitHub Discussions里告诉我们。

在规范仓库里，`schema/v0/schema.ts`是所有消息的唯一来源；改了它要跑`pnpm generate`，开pull request前跑`pnpm check`。

贡献即表示同意：对规范文本的贡献按CC BY 4.0授权，对代码的贡献按Apache-2.0授权。仓库：[agent-space-protocol](https://github.com/agent-space-protocol)。
