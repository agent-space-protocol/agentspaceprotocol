---
title: 什么是Agent Space Protocol？
description: agent和人与它们所在的每个地方之间的一个开放协议。
---

Agent Space Protocol（ASP）是参与者（agent和人）与它们所在的地方之间的一个开放协议。这样的地方都叫**space**：agent通过机器人和传感器行动的家、实验室或仓库，虚拟世界里的房间或小镇，项目文件夹、浏览器或桌面，群聊或邮件往来，游戏服务器，或者一次评测。每个space都是一个有状态、定律和参与者的世界，并且都守三个承诺：**自洽**、**完备**、**有记录**。

<figure class="asp-fig">
<svg viewBox="0 0 1600 860" role="img" aria-label="ASP 位于左边的参与者（agent、应用、人）和右边的 space（真实世界、虚拟世界、数字工作环境、对话）之间">
<defs><marker id="ah-what" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="head" d="M0 0L10 5L0 10z"/></marker></defs>
<rect class="box" x="40" y="135" width="420" height="150" rx="10"/><text class="t b d" x="70" y="199" font-size="32">Agent</text><text class="m" x="70" y="243" font-size="22">编程 agent、助理、游戏角色</text>
<rect class="box" x="40" y="335" width="420" height="150" rx="10"/><text class="t b d" x="70" y="399" font-size="32">应用</text><text class="m" x="70" y="443" font-size="22">桌面应用、IDE、网页</text>
<rect class="box" x="40" y="535" width="420" height="150" rx="10"/><text class="t b d" x="70" y="599" font-size="32">人</text><text class="m" x="70" y="643" font-size="22">经终端、网页客户端进入</text>
<rect class="box" x="1140" y="40" width="420" height="150" rx="10"/><text class="t b d" x="1170" y="104" font-size="32">真实世界</text><text class="m" x="1170" y="148" font-size="22">家、实验室、仓库</text>
<rect class="box" x="1140" y="235" width="420" height="150" rx="10"/><text class="t b d" x="1170" y="299" font-size="32">虚拟世界</text><text class="m" x="1170" y="343" font-size="22">房间、小镇、多人游戏</text>
<rect class="box" x="1140" y="430" width="420" height="150" rx="10"/><text class="t b d" x="1170" y="494" font-size="32">数字工作环境</text><text class="m" x="1170" y="538" font-size="22">代码仓库、浏览器、桌面</text>
<rect class="box" x="1140" y="625" width="420" height="150" rx="10"/><text class="t b d" x="1170" y="689" font-size="32">对话</text><text class="m" x="1170" y="733" font-size="22">群聊和私聊、邮件、论坛、通话</text>
<rect class="proto" x="600" y="300" width="400" height="220" rx="12"/>
<text class="t b d" x="800" y="390" font-size="52" text-anchor="middle">ASP</text>
<text class="t" x="800" y="440" font-size="26" text-anchor="middle">Agent Space Protocol</text>
<text class="m" x="800" y="485" font-size="22" text-anchor="middle">进入 · 观察 · 行动 · 事件 · 记录</text>
<g class="arrow" marker-start="url(#ah-what)" marker-end="url(#ah-what)"><path d="M474 210 C530 210 530 370 586 370"/><path d="M474 410 H586"/><path d="M474 610 C530 610 530 450 586 450"/><path d="M1014 360 C1070 360 1070 115 1126 115"/><path d="M1014 395 C1070 395 1070 310 1126 310"/><path d="M1014 425 C1070 425 1070 505 1126 505"/><path d="M1014 460 C1070 460 1070 700 1126 700"/></g>
<text class="q" x="800" y="570" font-size="19" text-anchor="middle">双向：动作和结果、事件和记录</text>
<text class="q" x="40" y="830" font-size="22">参与者</text>
<text class="q" x="1560" y="830" font-size="22" text-anchor="end">space</text>
</svg>
<figcaption>任何一类 space 都可以按局运行、给出评分，作为评测。</figcaption>
</figure>

agent进入一个space，观察它，在里面行动，然后离开；space把发生的事推送给它。每个动作恰好得到一个终结结果。今天这些地方各有各的接法，agent每次都得重新学一遍怎么进去、能看到什么、做了之后会怎样。有了ASP，这些只要学一次。

## ASP能做什么？

- 一个agent通过机械臂在实验室里做事。确认不了的动作结果是"不确定"，不会被当成"完成"；不能撤回的一步，先等人同意。
- 一个agent同时住在房间、群聊和项目文件夹里；在一处学到的东西按那个space的词汇保存，在用同一套词汇的地方都能用。
- 任何框架写的agent都用同一个协议进入游戏服务器、桌面或评测环境，并且从结果里就知道该等、该重试还是该换办法。
- 人和agent共用一个space：人说一句话就能编辑房间，agent按房间的定律在里面生活。
- 每个评测环境、聊天群和模拟器都有记录，agent从中学习，人从中回看。

## ASP为什么重要？

| 对谁 | 带来什么 |
| --- | --- |
| 写agent的人 | 进入任何space都是同一个接口：有类型的结果、断线后接着来，什么都不会做两次 |
| 做space的人 | 写一次实现，很多agent和客户端都能用；一致性测试告诉你这个space有没有守住承诺 |
| agent | 能用来学习的结果：不会有没发生的"完成"，确认不了就如实说"不确定" |
| 人 | agent和自己住在同样的地方，发生过的事都有记录 |

在真实世界里，这些承诺正是安全行动的前提：agent不会把发出的指令当成做完的动作，不能撤回的动作也可以让它先等人同意。

## 开始构建

<div class="asp-cards">
<div class="asp-card"><h3>写一个参与者</h3><p>进入任何space，按它的词汇行动。</p><a href="../develop/participant/">开始 →</a></div>
<div class="asp-card"><h3>写一个space</h3><p>给已有的系统写适配器，或者搭一个自己的世界。</p><a href="../develop/space/">开始 →</a></div>
<div class="asp-card"><h3>给space一个自带界面</h3><p>三维画面，或者任何宿主能嵌入的界面。</p><a href="../develop/views/">开始 →</a></div>
</div>

## 了解更多

- [整体结构](../learn/architecture/)：参与者、space、宿主和客户端。
- [ASP和其他协议](../asp-and-other-protocols/)：agent周围的各个协议，各自连接什么。
- [规范](../../specification/draft/)：规范性的正文。
