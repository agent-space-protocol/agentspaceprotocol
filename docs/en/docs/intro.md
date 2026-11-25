---
title: What is the Agent Space Protocol?
description: One open protocol between agents and people and every place they are in.
---

The Agent Space Protocol (ASP) is an open protocol between participants, agents and people, and the places they are in. Every such place is a **space**: a project folder, a browser or a desktop, a chat group, a game server, an evaluation, or a room built for an agent to live in. Each space is a world with a state, laws and participants, and every space keeps three promises: it is **consistent**, **complete** and **recorded**.

<figure class="asp-fig">
<svg viewBox="0 0 1600 760" role="img" aria-label="ASP between participants on the left (agents, people, hosts) and spaces on the right">
<defs><marker id="ah-what" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="40" y="70" width="420" height="140" rx="10"/><text class="t b d" x="70" y="130" font-size="32">Agent</text><text class="m" x="70" y="174" font-size="22">The Harness, or any other agent</text>
<rect class="box" x="40" y="290" width="420" height="140" rx="10"/><text class="t b d" x="70" y="350" font-size="32">People</text><text class="m" x="70" y="394" font-size="22">through terminal and web clients</text>
<rect class="box" x="40" y="510" width="420" height="140" rx="10"/><text class="t b d" x="70" y="570" font-size="32">Hosts</text><text class="m" x="70" y="614" font-size="22">The Harness app, web pages</text>
<rect class="box" x="1140" y="70" width="420" height="140" rx="10"/><text class="t b d" x="1170" y="130" font-size="32">Living and playing</text><text class="m" x="1170" y="174" font-size="22">a room, a town, a card game</text>
<rect class="box" x="1140" y="290" width="420" height="140" rx="10"/><text class="t b d" x="1170" y="350" font-size="32">Working</text><text class="m" x="1170" y="394" font-size="22">a project, a browser, a desktop</text>
<rect class="box" x="1140" y="510" width="420" height="140" rx="10"/><text class="t b d" x="1170" y="570" font-size="32">With others</text><text class="m" x="1170" y="614" font-size="22">a QQ group, a game server</text>
<rect class="proto" x="600" y="270" width="400" height="220" rx="12"/>
<text class="t b d" x="800" y="360" font-size="52" text-anchor="middle">ASP</text>
<text class="t" x="800" y="410" font-size="26" text-anchor="middle">Agent Space Protocol</text>
<text class="m" x="800" y="455" font-size="22" text-anchor="middle">enter · observe · act · events · record</text>
<g class="arrow" marker-start="url(#ah-what)" marker-end="url(#ah-what)"><path d="M474 140 C530 140 530 330 586 330"/><path d="M474 380 H586"/><path d="M474 600 C530 600 530 430 586 430"/><path d="M1014 330 C1070 330 1070 140 1126 140"/><path d="M1014 380 H1126"/><path d="M1014 430 C1070 430 1070 600 1126 600"/></g>
<text class="q" x="800" y="540" font-size="19" text-anchor="middle">both ways: actions, outcomes, events</text>
<text class="q" x="40" y="720" font-size="22">participants</text>
<text class="q" x="1560" y="720" font-size="22" text-anchor="end">space</text>
</svg>
</figure>

An agent enters a space, observes it, acts in it and leaves, and the space pushes what happens to it. Every action ends in exactly one final outcome. Today each of these places is reached in its own way, and an agent has to learn again, every time, how to get in, what it can see and what happens when it acts. With ASP it learns that once.

## What can ASP enable?

- An agent lives in a room, a QQ group and a project folder at once, and what it learns in one is kept under that space's vocabulary and used wherever the same vocabulary appears.
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
