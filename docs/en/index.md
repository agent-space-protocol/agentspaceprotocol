---
title: Agent Space Protocol
description: One open protocol for every place an agent is in.
template: splash
hero:
  tagline: Every place an agent is in, entered through one open protocol. Every space is consistent, complete and recorded.
  actions:
    - text: Start building
      link: docs/quickstart/
      icon: right-arrow
    - text: Read the specification
      link: specification/draft/
      variant: minimal
---

<div class="asp-home">

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

## Who it is for

<div class="asp-cards">
<div class="asp-card"><h3>Write an agent</h3><p>Enter any space in a few dozen lines with the Python or TypeScript SDK, observe it, act, and get exactly one final outcome for every action.</p><a href="docs/develop/participant/">Build a participant →</a></div>
<div class="asp-card"><h3>Make a space</h3><p>Wrap a system you already have in an adapter, or build a world from packages and a starting state; the SDK keeps the protocol's guarantees for you.</p><a href="docs/develop/space/">Build a space →</a></div>
<div class="asp-card"><h3>Live with agents</h3><p>Applications and clients enter the same spaces as the agents, with other roles: a desktop app, a terminal, a web page.</p><a href="docs/learn/architecture/">How it fits together →</a></div>
</div>

## What it promises

<div class="asp-features">
<div><b>Exactly one outcome</b><p>Every action ends as done, refused, failed, cancelled or unknown, including through deadlines, cancels, disconnects, closing and restarts. Nothing is done twice.</p></div>
<div><b>Declared capabilities</b><p>Spaces differ only in what they declare: who holds the state, forms, editing, saving, episodes, pace, doors. Anything not declared is a clear “unsupported”.</p></div>
<div><b>A vocabulary, not special code</b><p>Each space publishes its types, relations, verbs and events, so an agent acts in a space it has never seen without code written for it.</p></div>
<div><b>Alongside other protocols</b><p>MCP connects an agent to tools, A2A to other agents, ACP to editors and AG-UI to interfaces; ASP connects it to the places it is in. <a href="docs/asp-and-other-protocols/">ASP and other protocols</a></p></div>
</div>

## Install

```sh
# Python 3.11+, no dependencies
uv add "agent-space-protocol @ git+https://github.com/agent-space-protocol/python-sdk"

# TypeScript, Node 24+
git clone https://github.com/agent-space-protocol/typescript-sdk
cd typescript-sdk && pnpm install && pnpm --filter @agent-space-protocol/sdk build

# The agent-space command: conformance tests, a terminal client, a test space
git clone https://github.com/agent-space-protocol/inspector
cd inspector && pnpm install && pnpm agent-space --help
```

The SDKs and the inspector are drafts, like the protocol, and are installed from GitHub until they are published to PyPI and npm.

## Learn more

<div class="asp-cards">
<div class="asp-card"><h3>What is ASP?</h3><p>The idea, what it makes possible, and who it is for.</p><a href="docs/intro/">Read →</a></div>
<div class="asp-card"><h3>The specification</h3><p>Concepts, the three properties, capabilities, outcomes, the record, vocabulary, messages and transports.</p><a href="specification/draft/">Read →</a></div>
<div class="asp-card"><h3>Take part</h3><p>Proposals, contributing and the roadmap. Specification text CC BY 4.0, code Apache-2.0.</p><a href="community/contributing/">Join →</a></div>
</div>

</div>
