---
title: SDKs
description: The official libraries, for both the participant side and the space side.
---

| Language | Repository | Status | What it has |
| --- | --- | --- | --- |
| TypeScript | [typescript-sdk](https://github.com/agent-space-protocol/typescript-sdk) | Draft, install from GitHub | Participant, space skeleton, record stores (memory, SQLite), WebSocket, HTTP with SSE, standard input and output, Ed25519, generated types |
| Python | [python-sdk](https://github.com/agent-space-protocol/python-sdk) | 0.1.0, `pip install agent-space-protocol` | The same, with no dependencies; optional extras for aiohttp, cryptography and full JSON Schema validation |

Both SDKs carry the same test space and test participant, and the inspector runs all four pairings against each other. Both carry a copy of the specification's `schema.json` and check that it matches.

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

Other languages are welcome: an SDK is conformant when its test space passes `agent-space check` and its test participant runs the same scenario as `agent-space participant`.
