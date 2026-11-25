---
title: ASP and MCP
description: MCP connects an agent to the tools it uses; ASP connects it to the places it is in.
---

The Model Context Protocol (MCP) connects an AI application to tools and data: the agent calls a tool and the tool answers. The Agent Space Protocol connects an agent to the places it is in: it enters, observes, acts among others, and the place goes on happening around it. The two do different jobs, and one agent speaks both.

<figure class="asp-fig">
<svg viewBox="0 0 1600 520" role="img" aria-label="One agent speaks both: MCP to the tools it uses, ASP to the spaces it is in">
<defs><marker id="ah-mcp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<text class="q" x="40" y="36" font-size="26">the tools it uses</text>
<text class="q" x="1560" y="36" font-size="26" text-anchor="end">the places it is in</text>
<rect class="box" x="40" y="60" width="280" height="100" rx="10"/><text class="t b d" x="66" y="120" font-size="32">A database</text>
<rect class="box" x="40" y="200" width="280" height="100" rx="10"/><text class="t b d" x="66" y="260" font-size="32">Web search</text>
<rect class="box" x="40" y="340" width="280" height="100" rx="10"/><text class="t b d" x="66" y="400" font-size="32">Git, Slack…</text>
<rect class="box" x="1280" y="60" width="280" height="100" rx="10"/><text class="t b d" x="1306" y="120" font-size="32">A room</text>
<rect class="box" x="1280" y="200" width="280" height="100" rx="10"/><text class="t b d" x="1306" y="260" font-size="32">A project</text>
<rect class="box" x="1280" y="340" width="280" height="100" rx="10"/><text class="t b d" x="1306" y="400" font-size="32">A QQ group</text>
<rect class="proto" x="400" y="180" width="200" height="140" rx="12"/><text class="t b d" x="500" y="250" font-size="42" text-anchor="middle">MCP</text><text class="m" x="500" y="290" font-size="25" text-anchor="middle">uses tools</text>
<rect class="agent" x="660" y="150" width="280" height="200" rx="12"/><text class="t b d" x="800" y="235" font-size="40" text-anchor="middle">Agent</text><text class="m" x="800" y="278" font-size="22" text-anchor="middle">The Harness</text><text class="q" x="800" y="320" font-size="17" text-anchor="middle">skills · reactions · memory</text>
<rect class="proto" x="1000" y="180" width="200" height="140" rx="12"/><text class="t b d" x="1100" y="250" font-size="42" text-anchor="middle">ASP</text><text class="m" x="1100" y="290" font-size="25" text-anchor="middle">lives in spaces</text>
<g class="arrow" marker-start="url(#ah-mcp)" marker-end="url(#ah-mcp)"><path d="M332 110 C360 110 360 225 388 225"/><path d="M332 250 H388"/><path d="M332 390 C360 390 360 275 388 275"/><path d="M612 250 H648"/><path d="M952 250 H988"/><path d="M1212 225 C1240 225 1240 110 1268 110"/><path d="M1212 250 H1268"/><path d="M1212 275 C1240 275 1240 390 1268 390"/></g>
<text class="q" x="800" y="495" font-size="27" text-anchor="middle">One agent speaks both: MCP to use tools, ASP to live in spaces</text>
</svg>
</figure>

| | MCP | ASP |
| --- | --- | --- |
| What is on the other side | Tools, resources and prompts the agent uses | A space the agent is in: a world with a state, laws and participants |
| Who acts there | The agent, through its calls | The agent, other agents, people, and participants outside the protocol |
| Where things come from | An answer to each call | Events pushed whenever anything happens, resumable by sequence number |
| How an action ends | A result or an error | Exactly one of done, refused, failed, cancelled, unknown, with the effects and a reason |
| What is kept | Nothing required | A record of every action, outcome, edit and event |
| How the other side is described | A tool list | A vocabulary of types, relations, verbs, events and constraints |
| Interfaces | MCP Apps | Spaces' own interfaces, after MCP Apps |

## Using both

An agent that uses MCP for its tools enters spaces with ASP: The Harness, for example, reads web pages through MCP tools while it lives in a room and a chat group through ASP. ASP borrows MCP's handshake, tool lists, progress and cancellation, and its interface extension follows MCP Apps, so people who know MCP will recognise most of it.

An agent that only speaks MCP can still be given a space's verbs as tools by a bridge, but it then sees only answers to its calls: it receives no events, holds no presence and keeps no record. That is the part ASP adds.
