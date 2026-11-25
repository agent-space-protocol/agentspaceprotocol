---
title: 传输和身份
description: WebSocket、带SSE的HTTP、标准输入输出；密钥、证明和令牌。
---

## 传输

传输照MCP，消息本身和传输无关。一个**连接**承载一次握手，同一时间最多一次在场。**地址**是一个`ws://`或`wss://` URL、一个`http://`或`https://` URL，或者一条启动本机进程的命令。

### WebSocket

用于远程连接。每条消息是一个文本帧，装一个JSON对象。任何一方都可以关闭连接；关闭连接是断线，绝不是`leave`。

### 带服务器推送事件的HTTP

不能用WebSocket时使用。

1. 参与者用`GET <url>`和`Accept: text/event-stream`打开流。
2. space的第一个事件是`event: session`，带`data: {"session": "<id>"}`。
3. space的每条消息随后以`event: message`发出，JSON放在`data`里。
4. 参与者用`POST <url>`发送它的每条消息，带`Content-Type: application/json`和头部`ASP-Session: <id>`。space回答`202 Accepted`，不带正文；会话不认识时回答`404 Not Found`。
5. space可以发送SSE注释让流保持打开。关闭流就是断线。

### 标准输入输出

同一台电脑上的进程之间：参与者启动space的进程，向它的标准输入写消息，从它的标准输出读消息，一行一个JSON对象（UTF-8，不含内嵌换行）。标准错误用于日志。一个进程承载一个连接。参与者关闭标准输入时，space关闭：每个进行中的动作得到终结结果，发出`asp.closing`，进程退出。

## 身份

参与者的身份是一对**Ed25519密钥**，公钥就是它的ID，写成`ed25519:<unpadded base64url of the 32-byte public key>`。

1. 参与者在`hello`里以`participant`写明它的密钥。
2. space的`hello`带一个至少16字节的随机`nonce`。
3. 在`join`里，参与者给出`proof`：对`asp-v0 join <space> <nonce>`的UTF-8字节所做的Ed25519签名，用无填充base64url表示，其中`<space>`是space的`hello`里的`space`。
4. 写明了密钥、却没有有效证明的参与者发出的`join`，得到`refused`，原因`forbidden`。

据此，space在不同连接和在场之间再次认出同一个参与者，决定它的角色，比如认出主人。动作ID按身份唯一，所以重启后从新的在场重发的动作仍然能被认出。

同一台电脑上的进程之间可以只用一个**令牌**，在`hello`里作为`token`给出；space把这个参与者认作`token:<name>`。两者都没有的参与者是匿名的，只能按它的在场来认。

space也有自己的密钥，在`hello`里作为`key`给出，用它为门的通行凭证和存档签名。

## 续接在场

`join`的结果带一个`resume`令牌。断线后，在space的`participants.grace_seconds`之内，参与者重新连上，以同一个身份再握手一次，发出带`resume`的`join`（有密钥的话再带一个新的`proof`）。space以`done`回答，带`resumed: true`和同一次在场。参与者离开期间结束的请求，它们的回答在记录里，对重复的请求ID会再次返回；参与者从它看到的最后一个序号加一起订阅。

宽限时间过后，这次在场以`asp.leave`结束，原因`closed`，`resume`以`closed`拒绝。
