---
title: Debugging
description: See every message, read the record, and understand the common reasons.
---

## See what is said

```sh
AGENT_SPACE_TRANSPORT=stdlib uv run python participant.py   # the standard-library transports
pnpm agent-space tui ws://127.0.0.1:7777 --plain            # every message, one line each
```

The record is the first place to look: `p.record(start, to)` returns every action, outcome, edit and event in a range, each with its cause, so any outcome can be traced to what led to it.

## Common reasons

| Reason | Usually means |
| --- | --- |
| `malformed` | The message does not match the schema, or its `basis` is ahead of the record |
| `unsupported` | The space did not declare that capability, or the part was not negotiated |
| `forbidden` | The role of this presence may not use the verb or edit |
| `stale` | Something the action touches changed after its `basis`; observe again |
| `constraint` | The change would break a constraint the space declares; nothing changed |
| `deadline` | The action's deadline, or the time to wait for consent, passed |
| `closed`, `restarted` | The space closed, or crashed and restarted, while the action was under way |

The full list is in [Actions and outcomes](../../../specification/v0/actions/).
