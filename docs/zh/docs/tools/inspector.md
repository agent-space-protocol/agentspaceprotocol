---
title: Inspector
description: agent-space命令：一致性测试、终端客户端、测试space和测试参与者。
---

[inspector](https://github.com/agent-space-protocol/inspector)就是`agent-space`命令，照MCP Inspector和A2A的TCK做。

```text
agent-space check <address> [--profile <file>] [--launch <command>] [--json <file>]
agent-space tui <address> [--role <role>] [--key <file>] [--script <file>] [--plain]
agent-space participant <address>
agent-space test-space [--listen <address>] [--data <dir>] [--keep-seconds <n>] [--variant <name>] [--close-on-eof]
```

| 命令 | 做什么 |
| --- | --- |
| `check` | 对任何space跑一致性测试，每项报告通过、失败或跳过；`--json`写出一份报告，space可以附在自己的说明里 |
| `tui` | 终端客户端，用结构和文字进入任何space，能行动、能编辑 |
| `participant` | 用TypeScript参与者对一个space跑一个固定的场景 |
| `test-space` | 一个声明了全部能力的最小space，还有故意做坏的变体 |

要跑关闭和重启的测试，让`check`自己启动space：

```sh
pnpm agent-space check ws://127.0.0.1:7777 \
  --launch "agent-space test-space --listen ws://127.0.0.1:7777 --data ./space-data --keep-seconds 3 --close-on-eof" \
  --json report.json
```

测试space的几个坏变体（`drop-outcome`、`run-twice`、`half-commit`、`drop-on-resume`、`silent-unsupported`）各自只让本该抓住它的那一项测试失败，测试本身就是这样被检验的。网页界面在计划中。
