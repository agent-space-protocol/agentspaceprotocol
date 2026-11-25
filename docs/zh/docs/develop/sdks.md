---
title: SDK
description: 官方的库，参与者和space两头都有。
---

| 语言 | 仓库 | 状态 | 有什么 |
| --- | --- | --- | --- |
| TypeScript | [typescript-sdk](https://github.com/agent-space-protocol/typescript-sdk) | 草案，从GitHub安装 | 参与者、space骨架、记录存储（内存、SQLite）、WebSocket、带SSE的HTTP、标准输入输出、Ed25519、生成的类型 |
| Python | [python-sdk](https://github.com/agent-space-protocol/python-sdk) | 0.1.0，`pip install agent-space-protocol` | 同样的内容，没有依赖；可选附加aiohttp、cryptography和完整的JSON Schema校验 |

两个SDK带着同样的测试space和测试参与者，inspector把四种组合互相跑一遍。两个SDK都带着规范的`schema.json`副本，并检查它和规范一致。

```sh
# Python 3.11+, no dependencies
uv add "agent-space-protocol @ git+https://github.com/agent-space-protocol/python-sdk"

# TypeScript, Node 24+
git clone https://github.com/agent-space-protocol/typescript-sdk
cd typescript-sdk && pnpm install && pnpm --filter @agent-space-protocol/sdk build

# The agent-space command: conformance tests, a terminal client, a test space
git clone https://github.com/agent-space-protocol/inspector
cd inspector && pnpm install && pnpm agent-space --help
```

欢迎其他语言的SDK：它的测试space通过`agent-space check`，测试参与者跑通和`agent-space participant`一样的场景，就算一致。
