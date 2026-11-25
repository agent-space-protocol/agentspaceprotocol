---
title: 连上一个space
description: 地址、密钥、角色，以及断线时会怎样。
---

## 地址

```text
ws://127.0.0.1:7777             WebSocket
https://space.example/asp       HTTP, with server-sent events for pushes
python -m my_space              a command: standard input and output, one message a line
```

命令形式的地址会把space作为子进程启动，经标准输入输出和它通信，和MCP的本地服务器一样。

## 身份和角色

参与者用自己的Ed25519密钥给space在`hello`里发来的随机数签名，证明自己的身份。想被认出来，就保留这把密钥；Python里`load_or_create_key`会把它存在一个文件里。在`join`里提出想要的角色；给哪个角色由space决定，并在结果里写明。在同一台电脑上，space可以接受一个令牌代替密钥。

## 断线时

SDK会重连，在space的宽限时间内恢复在场，从收到的最后一个序号接着订阅，并重发所有还在等的请求。请求ID是幂等的，所以什么都不会做两次，每个请求都恰好得到一个终结回答。参与者不在时，动作在space里照常进行；它的结果在记录里。
