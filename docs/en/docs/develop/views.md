---
title: A space's own interface
description: Give a space an interface that any host can embed, after MCP Apps.
---

**Status: planned.** The interface extension is specified in the `ext-views` repository, which is not public yet; this page describes its design.

Forms are data; an interface is a way of looking at the data and acting. A space may bring its own interface, the capability `views`: it declares one or more interfaces, each a web bundle referenced by content hash. A host runs the bundle in a sandboxed iframe, and the interface observes and acts only through the host, as the host's presence, seeing and doing exactly what that presence may. A host that does not know or does not trust an interface falls back to the general structure view.

This follows MCP Apps, where an MCP tool declares a `ui://` resource that the host renders in a sandboxed iframe. The room's 3D picture is one such interface: it belongs to the room, is released with it and can be shown by any host. `ext-views` also provides the `<agent-space>` web component, which connects to a space and shows its own interface, or the structure view, in full, view-only or mini mode.
