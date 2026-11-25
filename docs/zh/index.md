---
title: Agent Space Protocol
description: agent所在的每个地方，都用同一个开放协议进入。
template: splash
hero:
  tagline: agent所在的每个地方，都用同一个开放协议进入。每个space都自洽、完备、有记录。
  actions:
    - text: 开始构建
      link: docs/quickstart/
      icon: right-arrow
    - text: 读规范
      link: specification/draft/
      variant: minimal
---

<div class="asp-home">

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

## 给谁用

<div class="asp-cards">
<div class="asp-card"><h3>写agent</h3><p>用Python或TypeScript的SDK，几十行就能进入任何space：观察、行动，每个动作恰好得到一个终结结果。</p><a href="docs/develop/participant/">写一个参与者 →</a></div>
<div class="asp-card"><h3>做space</h3><p>给已有的系统写一个适配器，或者用包和起始状态搭一个世界；协议的保证由SDK替你守住。</p><a href="docs/develop/space/">写一个space →</a></div>
<div class="asp-card"><h3>和agent一起生活</h3><p>应用和客户端用同一个协议进入同样的space，只是角色不同：一个桌面应用、一个终端、一个网页。</p><a href="docs/learn/architecture/">看整体结构 →</a></div>
</div>

## 它承诺什么

<div class="asp-features">
<div><b>恰好一个结果</b><p>每个动作都落到完成、拒绝、失败、取消、不确定之一，到期、取消、断线、关闭和重启也一样。不会做两次。</p></div>
<div><b>能力要声明</b><p>space之间只有声明的不同：状态归谁、形式、编辑、存档、按局进行、节奏、门。没声明的就是明确的"不支持"。</p></div>
<div><b>靠词汇，不靠专门的代码</b><p>每个space发布自己的类型、关系、动词和事件，agent进一个从没见过的space也不需要为它写代码。</p></div>
<div><b>和其他协议并用</b><p>MCP把agent连到工具，A2A连到别的agent，ACP连到编辑器，AG-UI连到界面；ASP把它连到它所在的地方。<a href="docs/asp-and-other-protocols/">ASP和其他协议</a></p></div>
</div>

## 安装

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

SDK和inspector和协议一样还是草案，发布到PyPI和npm之前，从GitHub安装。

## 了解更多

<div class="asp-cards">
<div class="asp-card"><h3>什么是ASP？</h3><p>它是什么，能做什么，给谁用。</p><a href="docs/intro/">阅读 →</a></div>
<div class="asp-card"><h3>规范</h3><p>概念、三条性质、能力、结果、记录、词汇、消息和传输。</p><a href="specification/draft/">阅读 →</a></div>
<div class="asp-card"><h3>参与进来</h3><p>提案、贡献和路线图。规范文本CC BY 4.0，代码Apache-2.0。</p><a href="community/contributing/">加入 →</a></div>
</div>

</div>
