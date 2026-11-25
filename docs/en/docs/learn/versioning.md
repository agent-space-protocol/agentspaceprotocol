---
title: Versioning
description: Parts with versions of their own, negotiation, and the compatibility rules.
---

ASP is the part of the system meant to stay stable: agents, spaces and clients are rewritten at any time as long as they speak it. It therefore only grows by addition.

## Parts and versions

The protocol is divided into parts: the core, and one part per capability. Each part has an integer version. In `hello` the space lists the versions it supports for each part and the participant answers with its own; each part uses the highest version both support, and a part with nothing in common is unsupported. A simple space and a rich one speak the same protocol without one global version number.

## Compatibility rules

1. Unknown fields are ignored and passed on unchanged.
2. Names of fields, messages, verbs, outcomes, reasons and events are never renamed, never change meaning and are never reused.
3. New implementations read data of every old version and write only the current one.
4. Every extension carries a namespace.
5. Vocabulary packages are distinguished by major version and only add within it.

See [Negotiation and compatibility](../../../specification/v0/compatibility/).

## Releases

Every part is at version `0`, frozen on 2026-11-25 (release v0), after real environments passed the conformance tests: the text at [specification/v0](../../../specification/v0/) only grows by addition. A change that is not an addition takes a new version of its part, and the text of that release is kept at an address of its own, as MCP's releases are.
## Current status

| Piece | Version | Status |
| --- | --- | --- |
| Specification | v0, every part `0` | Frozen on 2026-11-25; only additions from now on |
| TypeScript SDK | draft | Installed from GitHub, not yet on npm |
| Python SDK | 0.1.0 | On PyPI as `agent-space-protocol` |
| Inspector | draft | Installed from GitHub, not yet on npm |

The [changelog](../../../specification/changelog/) lists every change to the specification.
