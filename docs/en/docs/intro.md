---
title: What is the Agent Space Protocol?
description: One open protocol between agents and people and every place they are in.
---

The Agent Space Protocol (ASP) is an open protocol between participants, agents and people, and the places they are in. Every such place is a **space**: a home, a lab or a warehouse an agent acts in through a robot and its sensors, a room or a town in a virtual world, a project folder, a browser or a desktop, a group chat or an email thread, a game server, or an evaluation. Each space is a world with a state, laws and participants, and every space keeps three promises: it is **consistent**, **complete** and **recorded**.

<figure class="asp-fig">
<svg viewBox="0 0 1600 860" role="img" aria-label="ASP between participants on the left (agents, applications, people) and spaces on the right (the real world, virtual worlds, digital workspaces, chats)">
<defs><marker id="ah-what" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="40" y="135" width="420" height="150" rx="10"/><text class="t b d" x="70" y="199" font-size="32">Agents</text><text class="m" x="70" y="243" font-size="22">coding agents, assistants, NPCs</text>
<rect class="box" x="40" y="335" width="420" height="150" rx="10"/><text class="t b d" x="70" y="399" font-size="32">Applications</text><text class="m" x="70" y="443" font-size="22">desktop apps, IDEs, web pages</text>
<rect class="box" x="40" y="535" width="420" height="150" rx="10"/><text class="t b d" x="70" y="599" font-size="32">People</text><text class="m" x="70" y="643" font-size="22">through terminal and web clients</text>
<rect class="box" x="1140" y="40" width="420" height="150" rx="10"/><text class="t b d" x="1170" y="104" font-size="32">Real world</text><text class="m" x="1170" y="148" font-size="22">homes, labs, warehouses</text>
<rect class="box" x="1140" y="235" width="420" height="150" rx="10"/><text class="t b d" x="1170" y="299" font-size="32">Virtual worlds</text><text class="m" x="1170" y="343" font-size="22">rooms, towns, multiplayer games</text>
<rect class="box" x="1140" y="430" width="420" height="150" rx="10"/><text class="t b d" x="1170" y="494" font-size="32">Digital workspaces</text><text class="m" x="1170" y="538" font-size="22">repositories, browsers, desktops</text>
<rect class="box" x="1140" y="625" width="420" height="150" rx="10"/><text class="t b d" x="1170" y="689" font-size="32">Chats</text><text class="m" x="1170" y="733" font-size="22">group chats, email, forums, calls</text>
<rect class="proto" x="600" y="300" width="400" height="220" rx="12"/>
<text class="t b d" x="800" y="390" font-size="52" text-anchor="middle">ASP</text>
<text class="t" x="800" y="440" font-size="26" text-anchor="middle">Agent Space Protocol</text>
<text class="m" x="800" y="485" font-size="22" text-anchor="middle">enter · observe · act · events · record</text>
<g class="arrow" marker-start="url(#ah-what)" marker-end="url(#ah-what)"><path d="M474 210 C530 210 530 370 586 370"/><path d="M474 410 H586"/><path d="M474 610 C530 610 530 450 586 450"/><path d="M1014 360 C1070 360 1070 115 1126 115"/><path d="M1014 395 C1070 395 1070 310 1126 310"/><path d="M1014 425 C1070 425 1070 505 1126 505"/><path d="M1014 460 C1070 460 1070 700 1126 700"/></g>
<text class="q" x="800" y="570" font-size="19" text-anchor="middle">both ways: actions, outcomes, events</text>
<text class="q" x="40" y="830" font-size="22">participants</text>
<text class="q" x="1560" y="830" font-size="22" text-anchor="end">space</text>
</svg>
<figcaption>Any of these spaces can also run as an evaluation, episode by episode, with a score.</figcaption>
</figure>

An agent enters a space, observes it, acts in it and leaves, and the space pushes what happens to it. Every action ends in exactly one final outcome. Today each of these places is reached in its own way, and an agent has to learn again, every time, how to get in, what it can see and what happens when it acts. With ASP it learns that once.

## What can ASP enable?

- An agent works in a lab through a robot arm. A motion it cannot confirm ends as “unknown”, never as an assumed “done”, and a step that cannot be undone waits for a person to agree.
- An agent lives in a room, a group chat and a project folder at once, and what it learns in one is kept under that space's vocabulary and used wherever the same vocabulary appears.
- An agent written in any framework enters a game server, a desktop or an evaluation through the same protocol, and knows from the outcome whether to wait, retry or try something else.
- People and agents share one space: a person edits the room by saying a sentence, while the agent lives in it under the room's laws.
- Every evaluation, chat group and simulator keeps a record that agents learn from and people review.

## Why does ASP matter?

| For | What it gives |
| --- | --- |
| Developers of agents | One interface to every space, typed outcomes, resuming after a disconnect, and nothing ever done twice |
| Developers of spaces | Many agents and clients for one implementation, and conformance tests that say whether a space keeps its promises |
| Agents | Outcomes they can learn from: never a “done” that did not happen, and an honest “unknown” when nothing can be confirmed |
| People | Agents that live in the same places as they do, with a record of everything that happened |

In the real world these promises are what makes acting safe: an agent never mistakes a command sent for a motion done, and actions that cannot be undone can be made to wait for a person.

## Start building

<div class="asp-cards">
<div class="asp-card"><h3>Build a participant</h3><p>Enter any space and act from its vocabulary.</p><a href="../develop/participant/">Start →</a></div>
<div class="asp-card"><h3>Build a space</h3><p>An adapter for a system you have, or a world of your own.</p><a href="../develop/space/">Start →</a></div>
<div class="asp-card"><h3>Give a space its own interface</h3><p>A 3D picture or any view that hosts can embed.</p><a href="../develop/views/">Start →</a></div>
</div>

## Learn more

- [Architecture](../learn/architecture/): participants, spaces, hosts and clients.
- [ASP and MCP](../asp-and-mcp/): how the two protocols divide the work.
- [The specification](../../specification/draft/): the normative text.
