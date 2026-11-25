---
title: Proposals
description: How the Agent Space Protocol changes.
---

A proposal is how the protocol changes: a new message, field, reason, capability or part, a change of meaning, or an extension. The process follows MCP's specification enhancement proposals.

| Stage | What happens |
| --- | --- |
| Idea | Open an issue describing the problem: which spaces or participants need it and why the current protocol does not do |
| Draft | Copy the template to `NNNN-short-name.md` in a pull request, with the next free number |
| Review | Maintainers and implementers discuss it; it needs a reference implementation in at least one SDK and conformance tests |
| Accepted | Merged together with the specification change, the schema change, the examples and the tests |
| Rejected or withdrawn | Merged with its status, so the reasons are kept |

Every proposal follows the [compatibility rules](../specification/draft/compatibility/), says which part it changes and whether that part needs a new version, says how the conformance tests check it, and changes the English and Chinese text together.

The template and the list of proposals are in [proposals/](https://github.com/agent-space-protocol/agentspaceprotocol/tree/main/proposals).
