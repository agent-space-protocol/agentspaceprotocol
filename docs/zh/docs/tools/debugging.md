---
title: 调试
description: 看到每条消息，读记录，弄懂常见的原因。
---

## 看说了什么

```sh
AGENT_SPACE_TRANSPORT=stdlib uv run python participant.py   # the standard-library transports
pnpm agent-space tui ws://127.0.0.1:7777 --plain            # every message, one line each
```

首先看记录：`p.record(start, to)`返回一个范围内的每个动作、结果、编辑和事件，每条都带起因，所以任何结果都能追到引起它的事。

## 常见的原因

| 原因 | 通常意味着 |
| --- | --- |
| `malformed` | 消息不符合schema，或者它的`basis`超前于记录 |
| `unsupported` | space没声明这项能力，或者这一部分没协商上 |
| `forbidden` | 这次在场的角色不能用这个动词或编辑 |
| `stale` | 动作涉及的东西在`basis`之后变了；重新观察 |
| `constraint` | 这个变化会违反space声明的约束；什么都没变 |
| `deadline` | 动作的期限，或者等同意的时间，过了 |
| `closed`、`restarted` | 动作进行中，space关闭了，或者崩溃后重启了 |

完整的列表见[动作和结果](../../../specification/v0/actions/)。
