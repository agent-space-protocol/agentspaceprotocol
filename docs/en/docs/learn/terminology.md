---
title: Terminology
description: Every term of the protocol in one sentence.
---

| Term | Meaning |
| --- | --- |
| Space | Any place an agent is in: a world with a state, laws and participants, in the real world or a virtual one |
| State | The typed things in a space and the relations between them |
| Laws | What decides the outcome of everything that happens in a space |
| Participant | An agent or a person that enters a space and acts in it through the protocol |
| Participant outside the protocol | Someone or something in a space that does not use ASP, such as a person in the room; what they do appears as external events |
| Presence | One participant's stay in a space, from `join` to `leave` |
| Role | What a presence may do and see, declared by the space, such as owner, member, guest or evaluator |
| Host | The application a user runs, which connects agents to spaces and embeds spaces' own interfaces; the same meaning as in MCP |
| Client | A participant that shows a space to people in the forms it knows, such as a terminal client |
| Adapter | A space whose state is outside, in a robot controller, a device, a chat platform or a desktop, which it reaches and reports on honestly |
| Engine | A program that runs spaces whose state they hold, from packages and a starting state |
| Observation | What a presence sees of the state, in structure and other declared forms |
| Form | One way to observe a space: structure, text, image, sound, video, a 3D scene, sensor readings |
| Action | A verb on a thing with parameters, sent with an ID; it ends in exactly one outcome |
| Edit | A change to the world itself, structured or as a sentence, by a role that may edit |
| Outcome | The final result of an action or edit: `done`, `refused`, `failed`, `cancelled` or `unknown` |
| Event | Something that happened in a space, numbered in the record and pushed to those who perceive it |
| Record | The ordered history of a space: actions, outcomes, edits and events |
| Vocabulary | What a space publishes about itself: types, relations, verbs, events, constraints, forms and pages |
| Capability | Something a space declares it supports; anything undeclared is unsupported |
| Door | A link between two spaces, through which participants pass and things are handed over |
| Part | A piece of the protocol with its own version: the core, or one capability |

The normative definitions are in the [specification](../../../specification/v0/concepts/).
