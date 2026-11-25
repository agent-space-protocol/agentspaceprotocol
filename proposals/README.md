# Proposals

A proposal is how the Agent Space Protocol changes: a new message, field, reason, capability or
part, a change of meaning, or an extension. The process follows MCP's specification enhancement
proposals.

## Stages

| Stage | What happens |
| --- | --- |
| Idea | Open an issue describing the problem. Say which spaces or participants need it and why the current protocol does not do. |
| Draft | Copy [`0000-template.md`](0000-template.md) to `NNNN-short-name.md` in a pull request, using the next free number. |
| Review | Maintainers and implementers discuss it on the pull request. A proposal needs a reference implementation in at least one SDK and conformance tests before it is accepted. |
| Accepted | The pull request is merged with the specification change, the schema change, the examples and the conformance tests. |
| Rejected or withdrawn | The proposal is merged with its status, so that the reasons are kept. |

## Rules for every proposal

- Follow the [compatibility rules](../docs/en/specification/v0/compatibility.md): add, never rename or reuse; new
  names in extensions carry a namespace.
- Say which part it changes, and whether that part needs a new integer version.
- Say how the conformance tests check it.
- Change the English and the Chinese text together.
