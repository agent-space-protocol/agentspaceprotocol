---
title: The record
description: Entries, sequence numbers, subscribing and resuming, projection and retention.
---

The record is a history appended by sequence number, after Kafka's offsets and Matrix's events.

## Entries

Each entry is a CloudEvents 1.0 event in its JSON format. `specversion`, `id`, `source` and `type`
are always present; ASP adds its own members.

| Member | Meaning |
| --- | --- |
| `specversion` | Always `"1.0"`. |
| `id` | The sequence number as a decimal string. |
| `source` | Who caused it: `space`, `presence/<presence>`, or `outside` / `outside/<who>`. |
| `type` | The kind. Kinds of the protocol start with `asp.`; others are named in the vocabulary. |
| `time` | When it was appended. |
| `seq` | The sequence number: the record starts at 1 and each entry takes the next number. |
| `aspcore` | The version of the core part it was written with. |
| `cause` | The sequence number of the entry that led to it, so anything can be traced back to where it started. |
| `things` | The things involved. |
| `roles` | If present, only these roles receive it. |
| `data` | The content; large content is stored only as a hash in `dataref` and fetched with `blob`. |

The kinds the protocol defines:

| Kind | Appended when | `data` |
| --- | --- | --- |
| `asp.join` | A presence starts or resumes | `presence`, `role`, `participant`, `resumed` |
| `asp.leave` | A presence ends | `presence`, `reason` |
| `asp.act` | An action is taken | `presence`, `id`, `verb`, `object`, `args`, `basis` |
| `asp.edit` | An edit is taken | `presence`, `id`, `changes` or `sentence`, `basis` |
| `asp.cancel` | A cancel is asked for | `presence`, `id` |
| `asp.waiting` | An action waits for consent | `presence`, `id`, `for`, `until` |
| `asp.consent` | A consent is given or refused | `presence`, `act`, `agree` |
| `asp.outcome` | An action or edit ends | the outcome's `presence`, `id`, `end`, `reason`, `result`, `effects`, `events`, `known`, `unconfirmed` |
| `asp.episode` | An episode starts | `episode`, `task`, `seed` |
| `asp.score` | A score is taken; `roles` is the evaluator role | `episode`, `score` |
| `asp.snapshot`, `asp.restore` | A save is made or restored | `snapshot` |
| `asp.take` | A thing handed over through a door is taken | `offer`, `from`, `thing`, `as` |
| `asp.restarted` | The space restarted | — |
| `asp.closing` | The space is closing | — |

## Fetching and subscribing

A participant fetches the record with `record`, by sequence numbers (`from`, `to`) or by time
(`since`, `until`), with an optional `limit`; the answer is `entries`, with `more` when more match.

A participant subscribes with `subscribe` from any sequence number (`from`), or from the next new
entry. The space answers `subscribed` and then pushes every entry the presence may see as an
`event` message, in order of sequence number, each exactly once. A new `subscribe` replaces the
previous one.

The participant keeps its own position. After a disconnect it resumes its presence (`join` with
`resume`) and subscribes from the last sequence number it saw plus one; it MUST receive every entry
after that number exactly once, with none lost and none repeated.

## Projection

The record is projected by role as observations are: a presence never receives an entry whose
`roles` does not include its role, or whose kind its role's `hide.events` lists. Properties its role
hides are removed from the entry's `data`. Sequence numbers are not renumbered, so a projected
record has gaps.

## Retention

A space declares how long it keeps its record, in `hello`'s `record.keep_seconds` (`null`: for
ever), and gives the earliest sequence number still kept (`record.earliest`). A `record` or
`subscribe` that starts before the earliest entry kept is answered with an `outcome` `refused` with
the reason `expired`, never with an empty result. The reason's `data.earliest` gives the earliest
sequence number kept.

Looking back, exporting and reviewing need only the record itself; restoring from a save is the
separate capability `snapshot`.
