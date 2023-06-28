# 赛题设计说明

## 题目信息

- 题目名称：chatgpt
- 预估难度：

## 题目描述

都什么年代了还在玩传统chatgpt，试试这个能赚money的（

10.212.26.206 23692

## 考点

1.netcat交互
2.信息搜索
3.game-hacking

## 出题思路与解题思路

母题RITSEC2023 discord-bot，原题是用golang编写的，我改成python版的了。
娱乐题，netcat远程连上之后自行探索即可。
第一关的信息在ciscn官网、学院新闻、o4blog上可以看到，这里怕大家无法入手给了hint。
第二关经典game-hacking，未检查输入范围，输入负数反向溢出就行。
第三关ban了负数，调一下类型发现钱数从0变成0.0，测试int2float的类型输入，复数搞定。

## 提示


## 参考


