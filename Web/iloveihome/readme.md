# 赛题设计说明

## 题目信息

- 题目名称：iloveihome
- 预估难度：困难

## 题目描述

老版的平台下线了，爷的青春结束了，以此题致敬我们的青春。
bot的说明文档见附件。

## 考点

1. 前端JS原型链污染，html标签CSP绕过，CSRF，JS中replace特性

## 出题思路与解题思路

扒了老版的ihome源码，手动开debug模式对着报错一点点建数据库搭起来老版ihome，手动将所需要的页面前后端分离成ejs模板，之后才开始出题的，解题思路见writeup。

## 提示

1. Hint 1 https://www.runoob.com/jsref/jsref-replace.html
2. Hint 2 尝试花式js执行的同学注意一下serverjs的第29行代码哦

## 参考

dicectf2021 build-a-better-panel

