# Working in this repository

This is the specification of the Agent Space Protocol. Read [README.md](README.md) first.

- `schema/draft/schema.ts` is the only source of the messages. Never edit `schema.json` or
  `docs/en/reference/schema.md` by hand; run `pnpm generate`.
- English (`docs/en/`) is normative. Every change to it is made to `docs/zh/` in the same change,
  keeping the same headings, tables, code blocks and links. Use the terms the Chinese text already
  uses.
- Keep the specification about the protocol: no particular space, no particular agent, no product.
- The protocol only grows: do not rename or reuse a published name; extensions carry a namespace.
- Write plain sentences that say what is so. RFC 2119 words in capitals only where a requirement is
  meant.
- Run `pnpm check` before proposing a change. It fails when generated files are stale, an example
  does not match the schema, or `docs/zh` has drifted from `docs/en`.
