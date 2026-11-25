---
title: Messages
description: Every message of ASP v0, how it is answered, and one full exchange.
---

Every message is one JSON object with a `type`. Requests carry an `id`. The exact fields of every
message are in the [schema reference](../reference/schema/); this chapter says what each one does.

## One exchange

An agent enters a chat-group space. Lines starting with `→` are what the participant sends, lines
starting with `←` what the space sends. It shakes hands, enters, takes one observation and answers
in the group. After its second message goes out the network drops, the adapter cannot confirm
whether the chat platform delivered it, and the outcome is `unknown`, stating what is known.

```text
→ {"type":"hello", "parts":{"core":[0], "forms":[0], "consent":[0]},
   "participant":"ed25519:7Hq2…"}
← {"type":"hello", "space":"example:chat/team", "parts":{"core":0, "forms":0},
   "capabilities":{"state":"external", "participants":{"outside":true, "grace_seconds":300},
                   "forms":["structure","text","image"]},
   "vocabulary":"sha256:4be1…", "record":{"head":1040, "earliest":1, "keep_seconds":7776000},
   "nonce":"q3V9sT1mYb2hR8kL0pZx4w"}
→ {"type":"join", "id":"j1", "role":"member",
   "presentation":{"name":"Fin", "avatar":"sha256:90c3…"}, "proof":"…"}
← {"type":"outcome", "id":"j1", "end":"done", "seq":1041,
   "result":{"presence":"p-3", "role":"member", "presentation":{"avatar":"used"},
             "resume":"r-8f2a6c", "head":1040}}
→ {"type":"observe", "id":"o1", "forms":["structure"]}
← {"type":"observation", "id":"o1", "seq":1041, "confirmed":"2026-11-24T21:05:12Z",
   "structure":{"things":[{"id":"msg:88", "type":"chat.message", "from":"member:41",
                           "text":"@Fin what time do we meet today?"}]}}
→ {"type":"act", "id":"a17", "verb":"chat.reply", "object":"msg:88",
   "args":{"text":"Seven, at the east gate."}, "basis":1041}
← {"type":"outcome", "id":"a17", "end":"done", "seq":1043, "events":[1042]}
→ {"type":"act", "id":"a18", "verb":"chat.send", "object":"channel:main",
   "args":{"text":"I'm here already."}, "basis":1043}
← {"type":"accepted", "id":"a18"}
← {"type":"outcome", "id":"a18", "end":"unknown", "seq":1050,
   "reason":{"code":"chat.delivery_timeout", "text":"no receipt 20 s after sending"},
   "known":{"handed_to_platform":true}, "unconfirmed":["delivered"]}
→ {"type":"consent", "id":"c9", "act":1043, "agree":true}
← {"type":"outcome", "id":"c9", "end":"refused",
   "reason":{"code":"unsupported", "text":"consent was not negotiated"}}
```

The space did not declare consent, so that part is missing from the result of the handshake, and
the participant's `consent` gets `unsupported`. The full exchange is checked against the schema in
`schema/draft/examples/exchanges/chat-group.jsonl`.

## Core messages

| Message | Direction | Answer | What it does |
| --- | --- | --- | --- |
| `hello` | both ways | `hello` | The handshake. The participant gives the versions it supports for each part, and optionally its identity (`participant`) or a local `token`. The space gives its identifier, the negotiated versions (`parts`), the versions it supports, its capability table, the hash of its vocabulary, the state of its record and a `nonce`. |
| `join` | participant → space | `outcome` | Start a presence, or `resume` one after a disconnect, or arrive through a door with a `pass`. Carries the role asked for, presentation preferences and the `proof` of identity. The result has the presence ID, the role given, the range of perception, what was done with the presentation preferences, a `resume` token and the record's head. |
| `leave` | participant → space | `outcome` | End the presence. With `cancel: true`, actions under way are cancelled with it. |
| `observe` | participant → space | `observation` | One observation in the forms asked for, with the record sequence number it is at and the time of confirmation. |
| `subscribe` | participant → space | `subscribed`, then `event`s | Push every entry this presence may see from a sequence number on. |
| `act` | participant → space | intermediate states, `outcome` | An action: ID, `verb`, `object`, `args`, optional `basis` and `deadline`. |
| `edit` | participant → space | intermediate states, `outcome` | An edit: ID, structured `changes` or a `sentence`, optional `basis` and `deadline`. Requires the capability `edit`. |
| `cancel` | participant → space | none of its own | Ask to cancel an action, edit or stream of this participant. That request still gets its own final outcome. |
| `accepted` / `progress` / `waiting` | space → participant | — | An action's intermediate states. |
| `outcome` | space → participant | — | The final outcome of a request: `end`, `reason`, `result`, `effects`, `events`, `seq`; `unknown` also has `known` and `unconfirmed`. |
| `event` | space → participant | — | One record entry: to subscribed presences, and `asp.closing` to every connection. |
| `record` | participant → space | `entries` | Fetch the record by sequence numbers or by time. |
| `vocabulary` | participant → space | `vocabulary` | Fetch the vocabulary. |
| `blob` | participant → space | `blob` | Fetch large content by hash. |
| `error` | space → participant | — | A protocol error, only for messages without a usable ID. |

### Before and after joining

Before the handshake completes, only `hello` is accepted. Before `join` succeeds, a participant may
send `vocabulary`, `blob` and `join`; any other request is refused with `forbidden`. A connection
carries at most one presence; a second `join` while a presence is active is refused with
`malformed`, except a `resume` of the same presence.

## Capability messages

These belong to the part of the same name and are unsupported unless the space declares the
capability and the part was negotiated.

| Message | Capability | Answer | What it does |
| --- | --- | --- | --- |
| `stream` | `forms` | `accepted`, `frame`s, `outcome` | Subscribe to a continuous form at a rate. `cancel` ends it. |
| `consent` | `consent` | `outcome` | A presence whose role may consent agrees to or refuses a waiting action, named by the sequence number of its `asp.act` entry. |
| `snapshot` / `restore` | `snapshot` | `outcome` | Save the state; the result has its hash. Restore a saved state. |
| `episode` / `score` | `episode` | `outcome` | Start an episode from a task and a seed. Take the score; only the evaluator role receives it, any other role is refused with `forbidden`. |
| `pause` / `resume` | `pause` | `outcome` | Hold one of this participant's actions under way, and continue it. |
| `sense` | `senses` | `outcome` | Place, list or remove a derived observation. |
| `views` | `views` | `outcome` | List the space's own interfaces; bundles are fetched with `blob`. |
| `offer` / `take` | `doors` | `outcome` | Pass through a door; hand a thing over; ask whether an offer was taken. |

## Ordering

On one connection, a space sends the answers to one request in order: intermediate states, then
the final answer. Answers to different requests may interleave. `event` messages are sent in order
of sequence number. A participant MUST NOT assume that an `event` and the `outcome` it relates to
arrive in a particular order.
