---
title: ASP and other protocols
description: The protocols around an agent, each by what it connects, and where ASP fits.
---

An agent today speaks several open protocols, each connecting it to something different. ASP adds one connection: between an agent or a person and a place it is in.

| Protocol | Connects | What crosses it |
| --- | --- | --- |
| MCP | An AI application ↔ tools, data and workflows | Tool calls and their results, resources, prompts |
| A2A | An agent ↔ another agent | Tasks, messages and artifacts between opaque agents |
| ACP (Agent Client Protocol) | A code editor or client ↔ a coding agent | Prompts, edits, permissions, agent output |
| AG-UI | An agent ↔ a user-facing application | A stream of events: messages, tool calls, state changes |
| Gymnasium | A learner ↔ an environment | `reset` and `step`: observations, actions, rewards, episode ends |
| Matrix | A client ↔ a server, and servers with one another | Rooms of ordered events, synchronised and federated |
| ASP | An agent or a person ↔ a place it is in | Presence, observations, actions with exactly one outcome, events, a record |

**MCP**, the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro), is an open standard for connecting AI applications to external systems: data sources, tools and workflows. An application calls a tool and gets an answer.

**A2A**, the [Agent2Agent Protocol](https://a2a-protocol.org/latest/topics/what-is-a2a/), lets agents built by different vendors and frameworks communicate and work together on tasks, without sharing their internal memory or tools. It runs over HTTP with JSON-RPC and server-sent events.

**ACP**, the [Agent Client Protocol](https://agentclientprotocol.com/), standardises communication between code editors and coding agents; a local agent runs as a subprocess of the editor and speaks JSON-RPC over standard input and output.

**AG-UI**, the [Agent–User Interaction Protocol](https://docs.ag-ui.com/introduction), is an event-based protocol for connecting agents to user-facing applications, so that an interface can follow and steer what an agent is doing.

**Gymnasium**, the [Gymnasium API](https://gymnasium.farama.org/api/env/), is the standard interface between reinforcement-learning code and an environment: `reset` starts an episode, `step` takes an action and returns the observation, the reward and whether the episode ended.

**Matrix**, the [Matrix specification](https://spec.matrix.org/latest/), defines open APIs for decentralised communication: rooms whose events are ordered, synchronised to clients and federated between servers.

**ASP** connects an agent or a person to a place it is in, in the real world or a virtual one, for as long as it stays. The place has a state and laws of its own, other participants act there too, things happen there without being asked for, every action ends in exactly one outcome, and everything is recorded. None of the protocols above is about that connection; ASP takes ideas from several of them, which the specification names where it uses them.

## Using them together

One agent can speak several of these at once. It reads documents through MCP tools, hands a sub-task to another agent through A2A, answers its user in an editor through ACP or in a web interface through AG-UI, and, through ASP, lives in a home with a robot, works in a project and talks in a group chat. Each protocol carries its own connection; none of them has to carry the others'.
