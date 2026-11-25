---
title: Contributing
description: Fixes, proposals, SDKs and spaces.
---

- **Small fixes** to the text, the examples or the schema: open a pull request directly, fixing the English and Chinese text together.
- **Changes to the protocol** go through a [proposal](../../proposals/).
- **SDKs in other languages** are welcome; one is conformant when its test space passes `agent-space check` and its test participant runs the inspector's scenario.
- **Spaces and participants**: build them with the SDKs, run the conformance tests, and tell us about them in GitHub Discussions.

In the specification repository, `schema/draft/schema.ts` is the single source of every message; run `pnpm generate` after changing it and `pnpm check` before a pull request.

By contributing you agree that your contribution to the specification text is licensed under CC BY 4.0 and your contribution to code under Apache-2.0. Repositories: [agent-space-protocol](https://github.com/agent-space-protocol).
