---
title: Participants
description: Presences, roles, observations, actions and outcomes, events and the record.
---

## Presences and roles

A participant's stay in a space, from entering to leaving, is a **presence**. Each presence has a **role** the space declares, such as owner, member, guest or evaluator, which decides the verbs it may use, whether it may edit and what it sees. A participant's identity is an Ed25519 key, so a space recognises the same participant again.

## What it sees

An observation is a projection of the state for this role and range of perception, in the space's vocabulary. Structure is always there; text, images, sound, video or a 3D scene are forms a space may declare. See [Observations and forms](../../../specification/draft/observations/).

## How it acts

An action has an ID, a verb, an object and parameters, and may name the observation it was based on (`basis`) and a deadline. It may pass through accepted, progress and waiting for consent, and it ends in exactly one of:

| Outcome | Meaning |
| --- | --- |
| `done` | Carried out, with the result and the events it caused |
| `refused` | Nothing happened, decided before any effect, with the reason |
| `failed` | Tried and not achieved, listing the effects that did happen |
| `cancelled` | Confirmed stopped, listing the effects before it stopped |
| `unknown` | It may or may not have happened, with what is known and what is not confirmed |

Sending the same ID again returns the first outcome; nothing runs twice. See [Actions and outcomes](../../../specification/draft/actions/).

## Events and the record

Everything that happens is an event in the record, numbered in order. A participant subscribes from any sequence number and, after a disconnect, continues where it stopped. See [The record](../../../specification/draft/record/).
