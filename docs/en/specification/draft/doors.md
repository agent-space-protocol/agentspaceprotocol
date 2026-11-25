---
title: Doors
description: Passing participants and handing things over between spaces.
---

Spaces that can be linked can have **doors** between them. A door is a thing on each side that
points to the other's address. A space declares its doors in the capability `doors`, each with the
thing that is the door, the address it leads to and the identity of the space there.

One space and a graph of many spaces linked together are the same kind of thing, differing only in
the number of doors. Each space's laws hold only inside it, and it MAY refuse anything it does not
want.

## Participants pass through doors

A participant passing through a door leaves here and enters there:

1. It sends `offer` with the `door` and no `thing`.
2. This side answers `done` with a **pass**, signed with this space's key, and the address it leads
   to; the presence ends here.
3. The participant connects to the other side and sends `join` with the `pass`. The other side
   checks the signature against the key of the space its own door points back to, and admits the
   participant. The identity goes with the participant; its role over there is decided over there.

A pass is `<payload>.<signature>`: the unpadded base64url form of the UTF-8 JSON object
`{"participant", "from", "to", "door", "expires"}` and of the Ed25519 signature of those payload
bytes by the issuing space.

## Things are handed over

A thing passing through a door is a **handover** between two spaces, and at any moment exactly one
space owns it. This part has no counterpart in the references: Matrix federation keeps a room's
events in sync between servers but never moves ownership of a thing.

The handover has two steps. The giving space connects to the receiving space as a participant,
with its own key.

1. The giving side **locks** the thing and sends `offer` with the `thing`, its `parents` (nearest
   first) and the `door`.
2. The receiving side checks it, **takes** it and appends `asp.take`, then answers `done` with the
   ID the thing has there, the type it is treated as and the `take` sequence number.
3. The giving side removes the thing on seeing the take. If the other side refuses, the thing is
   unlocked and stays.

After a disconnect midway, **the receiving side's record decides**. The giving side asks with
`take`, naming the offer; the answer says whether it was taken. Without a recorded take the thing
still belongs to the giving side, and the receiving side MUST NOT take that offer later. Because
`offer` is a request like any other, sending it again with the same ID never takes the thing
twice.

## Unknown types fall back to their parents

When the receiving side does not know the thing's type, it follows the declared parent types up to
the nearest one it knows, treats the thing as that and says so in the result (`as`). If it knows
none, it refuses with `unsupported`.
