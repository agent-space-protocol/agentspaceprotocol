---
title: Views
description: A space's own interface, embedded by hosts in a sandbox.
---

**Status: planned**, in the `ext-views` repository.

| Piece | What it is |
| --- | --- |
| Capability `views` | A space lists its interfaces, each a web bundle referenced by content hash |
| Message `views` | List the interfaces and fetch a bundle by hash |
| Bridge | How the host passes observations and events to the interface, and its actions back, as the host's presence |
| `<agent-space>` | A web component that connects to a space and shows its own interface or the structure view, in full, view-only or mini mode |

An interface can never see or do more than the presence it runs in. A host that does not trust an interface shows the structure view instead. See [A space's own interface](../../docs/develop/views/).
