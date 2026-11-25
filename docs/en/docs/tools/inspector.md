---
title: Inspector
description: "The agent-space command: conformance tests, a terminal client, a test space and a test participant."
---

The [inspector](https://github.com/agent-space-protocol/inspector) is the `agent-space` command, after MCP Inspector and A2A's TCK.

```text
agent-space check <address> [--profile <file>] [--launch <command>] [--json <file>]
agent-space tui <address> [--role <role>] [--key <file>] [--script <file>] [--plain]
agent-space participant <address>
agent-space test-space [--listen <address>] [--data <dir>] [--keep-seconds <n>] [--variant <name>] [--close-on-eof]
```

| Command | What it does |
| --- | --- |
| `check` | Runs the conformance tests against any space and reports each as passed, failed or skipped; `--json` writes a report a space can attach to its description |
| `tui` | A terminal client that enters any space through structure and text, and can act and edit |
| `participant` | Runs a fixed scenario against a space with the TypeScript participant |
| `test-space` | A minimal space that declares every capability, with deliberately broken variants |

To run the closing and restart tests, `check` starts the space itself:

```sh
pnpm agent-space check ws://127.0.0.1:7777 \
  --launch "agent-space test-space --listen ws://127.0.0.1:7777 --data ./space-data --keep-seconds 3 --close-on-eof" \
  --json report.json
```

The broken variants of the test space (`drop-outcome`, `run-twice`, `half-commit`, `drop-on-resume`, `silent-unsupported`) each fail exactly the test that should catch them, which is how the tests themselves are tested. A web interface is planned.
