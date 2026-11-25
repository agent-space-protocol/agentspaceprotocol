---
title: Negotiation and compatibility
description: Parts and integer versions, the handshake, and the five compatibility rules.
---

ASP is the only part of the whole system that has to stay stable for the long term: agents, spaces
and clients can be rewritten at any time as long as they speak the same protocol. So the protocol
only grows by addition, and its compatibility rules are part of the specification and of the
conformance tests.

## Parts

The protocol is divided into **parts**: the `core` (entering, observing, acting, editing, outcomes,
events, the record and the vocabulary) and one part for each capability that has messages of its
own: `forms`, `snapshot`, `episode`, `consent`, `pause`, `senses`, `views`, `doors`. Each part has a
version of its own, an integer. Parts outside this list carry a namespace.

## The handshake

The first message on a connection is the participant's `hello`, listing the versions it supports
for each part. The space answers with its own `hello`:

- `parts`: for each part, the highest version both support. A part with no version in common is
  left out and counts as unsupported on this connection.
- `supported`: the versions the space supports for each part.
- `capabilities`, `vocabulary`, `record`, `nonce` and, when it has one, its `key`.

If there is no common version of `core`, the space answers with an `error` with the code
`unsupported` and closes the connection. Any message before the handshake is answered with an
`error` with the code `malformed`.

A simple space that supports only observing and acting and a rich one with editing, saving and
doors speak the same protocol; no single global version number is needed.

## The five rules

After Protocol Buffers and Matrix:

1. **Unknown fields are ignored.** A receiver MUST ignore members it does not know, in every
   message and every nested object, and MUST pass them on unchanged when it passes the object on.
2. **Names are never reused.** The names of fields, messages, parts, verbs, outcomes, reasons and
   events, once published, are never renamed, never change meaning and are never reused. A name
   being retired is marked deprecated and kept for ever.
3. **Read old, write new.** New implementations read data of every old version and write only the
   current one.
4. **Extensions carry a namespace.** Every extension outside the protocol, whether a field, a
   message type, a part, a reason code or a kind of entry, carries a namespace, such as
   `x.example.trace`.
5. **Packages only add within a major version.** Vocabulary packages are distinguished by major
   version; within a major version they only add.

## Freezing

While the protocol is a draft, every part is at version `0` and problems are fixed directly in the
specification. When the parts are frozen, each change that is not an addition takes a new integer
version of its part, and spaces and participants list every version they still support.
