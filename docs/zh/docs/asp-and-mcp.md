---
title: ASP和MCP
description: MCP把agent接到它用的工具上，ASP把它接到它所在的地方。
---

Model Context Protocol（MCP）把AI应用接到工具和数据上：agent调用一个工具，工具回复它。Agent Space Protocol把agent接到它所在的地方：它进入、观察、和别人一起行动，那个地方在它周围继续发生着事。两者分工不同，一个agent两个都说。

<figure class="asp-fig">
<svg viewBox="0 0 1600 520" role="img" aria-label="同一个 agent 两个都说：用 MCP 拿工具，用 ASP 住进 space">
<defs><marker id="ah-mcp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<text class="q" x="40" y="36" font-size="26">它用的工具</text>
<text class="q" x="1560" y="36" font-size="26" text-anchor="end">它所在的地方</text>
<rect class="box" x="40" y="60" width="280" height="100" rx="10"/><text class="t b d" x="66" y="120" font-size="32">数据库</text>
<rect class="box" x="40" y="200" width="280" height="100" rx="10"/><text class="t b d" x="66" y="260" font-size="32">搜索和网页</text>
<rect class="box" x="40" y="340" width="280" height="100" rx="10"/><text class="t b d" x="66" y="400" font-size="32">Git、Slack…</text>
<rect class="box" x="1280" y="60" width="280" height="100" rx="10"/><text class="t b d" x="1306" y="120" font-size="32">一个家</text>
<rect class="box" x="1280" y="200" width="280" height="100" rx="10"/><text class="t b d" x="1306" y="260" font-size="32">一个项目</text>
<rect class="box" x="1280" y="340" width="280" height="100" rx="10"/><text class="t b d" x="1306" y="400" font-size="32">一个群聊</text>
<rect class="proto" x="400" y="180" width="200" height="140" rx="12"/><text class="t b d" x="500" y="250" font-size="42" text-anchor="middle">MCP</text><text class="m" x="500" y="290" font-size="25" text-anchor="middle">拿工具</text>
<rect class="agent" x="660" y="150" width="280" height="200" rx="12"/><text class="t b d" x="800" y="235" font-size="40" text-anchor="middle">Agent</text><text class="m" x="800" y="278" font-size="22" text-anchor="middle">任何框架</text><text class="q" x="800" y="320" font-size="19" text-anchor="middle">模型 · 技能 · 反应 · 记忆</text>
<rect class="proto" x="1000" y="180" width="200" height="140" rx="12"/><text class="t b d" x="1100" y="250" font-size="42" text-anchor="middle">ASP</text><text class="m" x="1100" y="290" font-size="25" text-anchor="middle">住进 space</text>
<g class="arrow" marker-start="url(#ah-mcp)" marker-end="url(#ah-mcp)"><path d="M332 110 C360 110 360 225 388 225"/><path d="M332 250 H388"/><path d="M332 390 C360 390 360 275 388 275"/><path d="M612 250 H648"/><path d="M952 250 H988"/><path d="M1212 225 C1240 225 1240 110 1268 110"/><path d="M1212 250 H1268"/><path d="M1212 275 C1240 275 1240 390 1268 390"/></g>
<text class="q" x="800" y="495" font-size="27" text-anchor="middle">同一个 agent 两个都说：用 MCP 拿工具，用 ASP 住进 space</text>
</svg>
</figure>

| | MCP | ASP |
| --- | --- | --- |
| 另一端是什么 | agent用的工具、资源和提示词 | agent所在的space：一个有状态、定律和参与者的世界 |
| 谁在那里行动 | 只有agent，通过它的调用 | agent、别的agent、人，以及协议外的参与者 |
| 事情从哪来 | 每次调用的回复 | 随时发生的事件推送给它，可以按序号接着收 |
| 一个动作怎么结束 | 一个返回值或一个错误 | 完成、拒绝、失败、取消、不确定之一，带效果和原因 |
| 留下什么 | 没有要求 | 每个动作、结果、编辑和事件的记录 |
| 另一端怎么描述自己 | 工具列表 | 由类型、关系、动词、事件和约束组成的词汇 |
| 界面 | MCP Apps | space自带的界面，照MCP Apps做 |

## 两个一起用

用MCP拿工具的agent，用ASP进入space：它可以一边经MCP工具读网页，一边经ASP住在房间里、在项目里干活、在群聊里回话。The Harness就是这样的一个agent。ASP照搬了MCP的握手、工具列表、进度和取消，界面扩展也照MCP Apps做，熟悉MCP的人会认出其中大部分。

只说MCP的agent也可以经一座桥，把一个space的动词当作工具用，但它只能看到每次调用的回复：收不到事件，没有在场，也没有记录。这正是ASP补上的部分。
