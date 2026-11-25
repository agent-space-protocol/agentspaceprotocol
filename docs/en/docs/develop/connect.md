---
title: Connect to a space
description: Addresses, keys, roles and what happens when the connection drops.
---

## Addresses

```text
ws://127.0.0.1:7777             WebSocket
https://space.example/asp       HTTP, with server-sent events for pushes
python -m my_space              a command: standard input and output, one message a line
```

A command address starts the space as a child process and talks to it over standard input and output, as MCP's local servers do.

## Identity and roles

A participant proves its identity by signing the random value the space sends in `hello` with its Ed25519 key. Keep the key to be recognised again; `load_or_create_key` in Python stores one in a file. Ask for a role in `join`; the space decides which role it gives and says so in the result. On this computer, a space may accept a token instead of a key.

## When the connection drops

The SDK reconnects, resumes the presence within the space's grace period, continues the subscription from the last sequence number it received and resends every request still waiting. Request IDs are idempotent, so nothing runs twice and every request gets exactly one final answer. An action keeps running in the space while the participant is away; its outcome is in the record.
