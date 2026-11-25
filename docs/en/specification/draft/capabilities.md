---
title: Capabilities
description: The capability table every space declares, item by item.
---

Every difference between spaces is expressed as a value of one set of capabilities, with no
special cases. On connecting, a space sends its capability table in `hello`, declared item by item
as in LSP.

## Undeclared means unsupported

A capability that is not declared is **unsupported**. When a participant uses it:

- a message with an ID MUST be answered with an `outcome` with `end: "refused"` and the reason
  code `unsupported`;
- a message without an ID MUST be answered with an `error` with the code `unsupported`.

It is never ignored in silence. The same holds for a part of the protocol that the handshake did
not negotiate (see [Negotiation](../compatibility/)), for a message type the space does not know,
and for a verb not in the vocabulary.

A capability declared with an empty object is read at its most conservative value: for example
`"pause": {}` means every verb may be paused, but nothing more is promised.

## The table

| Capability | Key | Values | Messages |
| --- | --- | --- | --- |
| Where the state is | `state` | `held` by the space, or `external`, reached by an adapter | — |
| Lifetime | `lifetime` | `lasting`, or `disposable`: thrown away after use | — |
| Participants | `participants` | `max` presences; `roles`; `default_role`; `outside`: whether there are participants outside the protocol; `grace_seconds`: how long a presence is kept after a disconnect | — |
| Observation forms | `forms` | The forms besides `structure`: text, image, sound, video, a 3D scene, or a form a package defines; each is declared in the vocabulary with a media type | `stream`, `frame` |
| Input forms | `inputs` | The media types an action's parameters may carry | — |
| Editing | `edit` | `roles` that may edit; `changes`: the kinds of change taken; `sentences`: whether edits by sentence are taken | `edit` |
| Saving | `snapshot` | Whether it can be saved, and with `restore`, restored | `snapshot`, `restore` |
| Episodes | `episode` | `tasks`; `evaluator`: the role that receives scores | `episode`, `score` |
| Pace | `pace` | `max_hz`: actions a second per presence; `clock`: `wall` or `stepped`; `step_seconds` | — |
| Consent | `consent` | `verbs`: for each verb, the role that must agree (`by`) and how long the space waits (`seconds`) | `consent`, `waiting` |
| Pausing | `pause` | `verbs` whose actions can be held and continued | `pause`, `resume` |
| Derived observations | `senses` | `languages` a query may be written in; `max` per presence | `sense` |
| Own interface | `views` | `count` of interfaces the space brings | `views` |
| Doors | `doors` | `doors`: the doors and where they lead; `takes`: whether things handed over are accepted | `offer`, `take` |

The exact fields are in the [schema reference](../reference/schema/#capabilities).

## Capabilities and parts

Each capability that has messages is also a **part** of the protocol with an integer version of
its own (`forms`, `snapshot`, `episode`, `consent`, `pause`, `senses`, `views`, `doors`).
The `edit` message belongs to the core part, but is unsupported unless the capability `edit` is
declared. A capability's messages are usable only when the capability is declared **and** its
part, if it has one, was negotiated in the handshake.
