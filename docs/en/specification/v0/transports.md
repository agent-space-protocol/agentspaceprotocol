---
title: Transports and identity
description: WebSocket, HTTP with SSE, standard input and output; keys, proofs and tokens.
---

## Transports

Transports follow MCP, and the messages do not depend on them. One **connection** carries one
handshake and at most one presence at a time. An **address** is a `ws://` or `wss://` URL, an
`http://` or `https://` URL, or a command that starts a local process.

### WebSocket

For remote connections. Every message is one text frame holding one JSON object. Either side may
close the connection; closing it is a disconnect, never a `leave`.

### HTTP with server-sent events

Where WebSocket is not available.

1. The participant opens the stream with `GET <url>` and `Accept: text/event-stream`.
2. The space's first event is `event: session` with `data: {"session": "<id>"}`.
3. Every message from the space follows as `event: message` with the JSON in `data`.
4. The participant sends each of its messages with `POST <url>`, `Content-Type: application/json`
   and the header `ASP-Session: <id>`. The space answers `202 Accepted` with no body, or
   `404 Not Found` when the session is unknown.
5. The space MAY send SSE comments to keep the stream open. Closing the stream is a disconnect.

### Standard input and output

Between processes on one computer: the participant starts the space's process, writes messages to
its standard input and reads messages from its standard output, one JSON object a line (UTF-8, no
embedded newlines). Standard error is for logs. One process carries one connection. When the
participant closes standard input, the space closes: every action under way gets its final
outcome, `asp.closing` is sent, and the process exits.

## Identity

A participant's identity is an **Ed25519 key pair**, and the public key is its ID, written
`ed25519:<unpadded base64url of the 32-byte public key>`.

1. The participant names its key in `hello` as `participant`.
2. The space's `hello` carries a random `nonce` of at least 16 bytes.
3. In `join`, the participant gives `proof`: the unpadded base64url Ed25519 signature of the UTF-8
   bytes of `asp-v0 join <space> <nonce>`, where `<space>` is the `space` of the space's `hello`.
4. A `join` from a participant that named a key without a valid proof is `refused` with
   `forbidden`.

From this the space recognises the same participant again across connections and presences and
decides its role, recognising an owner, for example. Action IDs are unique per identity, so an
action resent from a new presence after a restart is still recognised.

Processes on one computer MAY use only a **token**, given in `hello` as `token`; the space knows
the participant as `token:<name>`. A participant with neither is anonymous and is known only by its
presence.

A space has a key of its own too, given in `hello` as `key`, with which it signs passes through
doors and saves.

## Resuming a presence

The result of `join` carries a `resume` token. After a disconnect, within the space's
`participants.grace_seconds`, the participant connects again, repeats the handshake with the same
identity and sends `join` with `resume` (and a fresh `proof` if it has a key). The space answers
`done` with `resumed: true` and the same presence. Answers to requests that ended while the
participant was away are in the record and are returned again for a repeated request ID; the
participant subscribes from the last sequence number it saw plus one.

After the grace period the presence ends with `asp.leave` and the reason `closed`, and `resume` is
refused with `closed`.
