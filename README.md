# Agent Space Protocol

The specification of the **Agent Space Protocol**: one open protocol between participants, agents
and people, and any space they are in.

Every place an agent is in is a space: a world with a state, laws and participants. A space can be
a project folder, a desktop, a chat group, a game server, an evaluation or a room built for an agent
to live in. Whatever it is, it must be **consistent** (what participants see makes sense),
**complete** (every action with an ID gets exactly one final outcome: `done`, `refused`, `failed`,
`cancelled` or `unknown`) and **recorded** (everything is appended to a record by sequence
number). Everything else about a space is a declared capability.

**Status: draft.** Every part of the protocol is at version `0`. The parts are frozen, after which
they only grow, once real environments pass the conformance tests.

## What is here

| Path | What it holds |
| --- | --- |
| [`schema/draft/schema.ts`](schema/draft/schema.ts) | The single source of every message and type |
| [`schema/draft/schema.json`](schema/draft/schema.json) | JSON Schema 2020-12, generated from `schema.ts` |
| [`schema/draft/examples/`](schema/draft/examples/) | At least one example of every message, and a full exchange, all checked against the schema |
| [`docs/en/`](docs/en/) | The specification text, in English (normative) |
| [`docs/zh/`](docs/zh/) | The specification text, in Chinese, kept in sync with the English |
| [`docs/en/reference/schema.md`](docs/en/reference/schema.md) | The schema reference, generated from `schema.ts` |
| [`proposals/`](proposals/) | How to propose a change or an extension |
| [`site/`](site/) | The documentation site (Astro Starlight) |

Start with [the overview](docs/en/index.md) ([中文](docs/zh/index.md)), then
[Actions and outcomes](docs/en/actions.md) and [Messages](docs/en/messages.md).

## Implementations and tools

| Repository | What it is |
| --- | --- |
| [typescript-sdk](https://github.com/agent-space-protocol/typescript-sdk) | Participants and spaces in TypeScript |
| [python-sdk](https://github.com/agent-space-protocol/python-sdk) | Participants and spaces in Python |
| [inspector](https://github.com/agent-space-protocol/inspector) | The `agent-space` command: conformance tests (`check`) and a terminal client (`tui`) |

## Working on the specification

Node 24 and pnpm.

```sh
pnpm install
pnpm generate      # schema.json and the schema reference, from schema.ts
pnpm check         # generated files up to date, every example valid, docs/zh in step with docs/en
pnpm docs:build    # the documentation site, into site/dist (run pnpm install in site/ first)
```

Change `schema.ts`, never the generated files. A change to the English text is mirrored in the
Chinese text in the same pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

The specification text (everything under `docs/` and `proposals/`) is licensed under
[CC BY 4.0](LICENSE-SPEC). The schema, the examples, the scripts and the site's code are licensed
under [Apache-2.0](LICENSE).
