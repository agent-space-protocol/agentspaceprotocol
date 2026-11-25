# Contributing

Thank you for helping with the Agent Space Protocol.

## Small fixes

Typos, unclear sentences, broken examples and mismatches between the text and the schema: open a
pull request directly. Fix the English text and the Chinese text together.

## Changes to the protocol

Anything that changes what an implementation must do (a new message, field, reason, capability or
part; a change of meaning) goes through a proposal first. See [proposals/](proposals/README.md).

The parts are frozen at version `0` (release v0, 2026-11-25), so the [compatibility rules](docs/en/specification/v0/compatibility.md)
apply: the protocol only grows by addition, names are never reused, and a change that is not an
addition takes a new integer version of its part.

## How the repository fits together

- `schema/v0/schema.ts` is the single source. Run `pnpm generate` after changing it and commit
  the generated `schema.json` and `docs/en/specification/v0/reference/schema.md` with the change.
- Every message has at least one example in `schema/v0/examples/<Definition>/`. Add one for a new
  message.
- `docs/en/` is the site in English, and its `specification/` is normative; `docs/zh/` keeps the
  same files, headings, tables, code blocks and links. `pnpm check` compares their structure.
- The SDKs carry a copy of `schema.json` and check in CI that it matches this repository.

## Checks

```sh
pnpm install
pnpm check
```

## Licence

By contributing you agree that your contribution to the specification text is licensed under
CC BY 4.0 and your contribution to code under Apache-2.0.
