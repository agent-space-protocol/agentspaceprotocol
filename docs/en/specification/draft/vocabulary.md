---
title: Vocabulary
description: Types, relations, verbs, events, constraints, forms and pages.
---

Every space publishes a vocabulary so that a participant that knows the protocol but not this space
can understand it without code written for it: from the vocabulary it knows what it can see, what
it can do and what outcomes to expect.

A vocabulary is organised by **namespaces**, assembled from one or more packages, and referenced
by the hash of its RFC 8785 canonical JSON, given in `hello` as `vocabulary`. A participant fetches
it with the `vocabulary` message and MAY cache it by hash.

## What a vocabulary contains

| Part | What it says | Follows |
| --- | --- | --- |
| `namespaces` | Each namespace and the version of the package it comes from | — |
| `types` | Kinds of things, each with at most one `parent`; properties as a JSON Schema | LambdaMOO's parents, Inform 7's kinds |
| `relations` | Relations things can have, the types at both ends, and how many | Inform 7's relations |
| `verbs` | The type of thing acted on, the parameter schema, the possible outcomes and reasons, the default outcome, the stale policy, the class of effect | MCP's tool list |
| `events` | Kinds of record entry the space appends, their content schemas and who perceives them | CloudEvents |
| `constraints` | Conditions that must hold before a commit | — |
| `forms` | Observation forms and their media types | — |
| `pages` | Explanations for models: one line on each type and verb, and a full page per namespace | `SKILL.md` |

All names are qualified by their namespace, such as `chat.reply` or `room.lamp`. Names starting with
`asp.` belong to the protocol.

## Verbs

```json
"chat.send": {
  "line": "Send a new message to a channel.",
  "object": "chat.channel",
  "params": {"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]},
  "effect": "send",
  "outcomes": ["done", "refused", "unknown"],
  "reasons": ["onebot.timeout"],
  "default": {"end": "refused", "reason": {"code": "forbidden"}},
  "stale": "allow"
}
```

A verb's **class of effect** is one of `read` (reads only), `change` (changes this space), `send`
(sends to others: a new recipient, forwarding, publishing), `spend` (spends money) and
`irreversible` (cannot be undone). A participant decides from it whether to ask its owner first,
without knowing the particular verb. Answering in the conversation where it was asked changes this
space and does not count as sending.

A verb's **default outcome** applies when no specific law is found. It is either `done` with
nothing changed, or `refused` with a reason, so every verb in the vocabulary has an outcome. A verb
not in the vocabulary is always `refused` with `unsupported`.

Arguments that do not match `params` are `refused` with `malformed`. An `object` whose type is not
the verb's `object` type or one of its descendants is `refused` with `malformed`.

## Using a vocabulary

An agent acts from a vocabulary as it does with MCP: each verb becomes a function it can call, with
its name, one line and parameter schema in context and the full page read only when needed. The
reasons in outcomes are typed codes from which it decides to wait, retry or try something else.
Kinds of events serve directly as triggers for its reactions. Skills learned for one kind of space
are kept under that space's vocabulary namespace and work in any other space that uses the same
vocabulary.

## Versions of packages

Packages are distinguished by major version, and within a major version they only add (see the
[compatibility rules](../compatibility/)). The `version` of each namespace says which package
version it comes from.
