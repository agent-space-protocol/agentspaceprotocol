---
title: Extensions
description: Optional additions to the protocol, each with a namespace and a version of its own.
---

An extension adds to ASP without changing the core: new messages, capabilities or forms, under a namespace of their own. A space declares the extensions it supports in `hello`, and a participant that does not know one ignores it.

| Extension | What it adds | Status |
| --- | --- | --- |
| [Views](views/) | A space's own interface that hosts embed in a sandbox | Planned |

New extensions go through the [proposal process](../proposals/).
