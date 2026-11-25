---
title: Observations and forms
description: Projections of the state, structure, other forms, streams, interfaces and presentation.
---

## Projections

An observation is a **projection** of the state: only what this presence may know, by its role
and its range of perception, in the space's vocabulary.

- Projections differ by **role**. One space can give an agent and an evaluator different things.
  Properties listed in the role's `hide.properties` MUST NOT appear in its observations.
- Projections differ by **range**. Where something is, is a basic relation that decides which
  things and events a participant perceives. The space MAY give the range in the result of `join`.

## Structure and other forms

**Structure** is the form every space MUST have: things, properties and relations written as JSON
in the vocabulary's terms, readable by any participant.

```json
{"things": [{"id": "lamp:1", "type": "test.lamp", "on": true}],
 "relations": [{"rel": "test.in", "from": "lamp:1", "to": "box:1"}]}
```

A thing is an object whose `id` and `type` members are reserved; every other member is a property
named in the vocabulary.

A space declares its other forms in the capability `forms`, each declared in the vocabulary with a
name and a media type: a text description for a model, a screenshot of a desktop, readings from a
sensor, video from a camera, sound from a microphone, the 3D scene of a room (glTF and VRM), or a form a package
defines. A participant asks for forms in `observe`; an undeclared form is refused with
`unsupported`. Small content is carried inline in `data` (text as is, binary as base64); large
content is carried as a `blob` hash and fetched with the `blob` message.

The truth of a space is only in its state and laws; every form is only a way of looking at it, and
none ranks above another. A participant that does not know a form MUST still be able to use the
space fully through structure.

## Streams

Continuous forms such as video and sound are declared with `continuous: true` and subscribed to
with `stream`, giving a frame or sample rate. The space answers `accepted`, then sends `frame`
messages numbered from 0, and ends the stream with one final `outcome`. Cancelling the stream
(`cancel` with the stream's ID) ends it as `cancelled`.

## Observation and the record

Every observation carries `seq`, the record sequence number it is at. A participant names that
number as `basis` in an action to say what it saw (see [Actions](../actions/)). A space whose state
is external gives `confirmed`, the time the outside system last confirmed the state, and MAY mark
individual things with their own `confirmed` time.

## Derived observations

With the capability `senses`, a participant may place a query or code in the space with
`sense` (`op: "place"`), written in one of the declared `languages`. The space computes it every
time it reports state to that presence and returns the values in the observation's `senses`.
`op: "list"` lists the presence's senses; `op: "remove"` removes one.

## Input forms

A verb's parameters can carry media, such as a voice clip or a picture. The parameter schema names
the media type with `contentMediaType`, and the space lists the media types it takes in the
capability `inputs`.

## The space's own interface

Forms are data; an interface is a way of looking at the data and acting. With the capability
`views` a space brings interfaces of its own, after MCP Apps: `views` lists them, each a web bundle
referenced by hash and fetched with `blob`. A host runs a bundle in a sandbox, and the interface
observes and acts only through the host, as this presence, seeing and doing exactly what the
presence may. When a host does not know or does not trust an interface, it falls back to the
general structure view. The bridge between host and interface is specified by the `ext-views`
extension.

## Presentation

Appearance belongs to the space, not to the participant. A participant may hand over
**presentation preferences** in `join`: a name, an avatar, a VRM model, a line describing itself,
large content by hash. The space decides for each whether it is `used` as it is, `converted`,
replaced by its own `default`, or `ignored`, and says which in the result of `join`. Appearance
only enters forms; it takes no part in the laws.
