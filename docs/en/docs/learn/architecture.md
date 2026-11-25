---
title: Architecture
description: Participants, spaces, hosts and clients, and how a connection goes.
---

## Participants and spaces

ASP has two ends. A **space** is a world: it holds or reaches a state, applies its laws, keeps its record and pushes events. A **participant** enters a space and acts in it. Agents and people are both participants; what tells them apart is the role a space gives them, not the protocol.

| Piece | What it is | Examples |
| --- | --- | --- |
| Participant | Anything that enters a space and acts in it, through an SDK | An agent in any framework, such as The Harness; a script |
| Space | A world with a state, laws and participants | A home with a robot, a virtual room, a group chat, a project folder, a game server, an evaluation |
| Host | The application a user runs, which connects agents to spaces and embeds spaces' own interfaces; the same meaning as in MCP | A desktop agent app, an IDE, a web page |
| Client | A participant that shows a space to people in the forms it knows | The inspector's terminal client |

Some participants are outside the protocol: the person at a real desktop or in a room with a robot, members of a group chat who have not joined through ASP. What they do appears as events whose cause is external.

## Two kinds of spaces

A space either **holds** its state, as a room or a card game run by an engine does, or reaches it **outside**, as an adapter for a robot controller and its sensors, a project folder, a desktop or a chat platform does. Both speak the same protocol and pass the same conformance tests; an adapter reports only what the outside system has confirmed, and says “unknown” when it cannot confirm.

## A connection

1. **hello** both ways: the space sends its identity, the versions of each part it supports, its capabilities and the hash of its vocabulary; the participant answers with its key, a proof and its versions. Each part settles on the highest version both support.
2. **join** starts a presence with a role and, optionally, presentation preferences.
3. **observe** and **subscribe**: a projection of the state for this role, then events from a sequence number on.
4. **act** and **edit**: each with an ID, ending in exactly one **outcome**.
5. **leave** ends the presence.

Messages are JSON over WebSocket, HTTP with server-sent events, or standard input and output. See [Messages](../../../specification/draft/messages/) and [Transports and identity](../../../specification/draft/transports/), and [Terminology](../terminology/) for every term.
