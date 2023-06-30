# 赛题设计说明

## 题目信息

- 题目名称：Can_Your_Noggin_Survive
- 预估难度：hard

## 题目描述

In a certain CTF competition, the solution records for some challenges have been lost. You need to recover the solution records; otherwise, 2045 will eat your head!

2045 is very benevolent and acts as a spell Oracle for you to use, but 2045 may not always give the correct answer – that's how capricious it is!

However, 2045 is full of love deep inside. Try using this magical spell, and perhaps you can escape the predicament!

The syntax rules for the spells are:

CX: Ask the X-th person if they solved the challenge, returning Yes/No.

CX love CY: A mysterious magical spell of unknown use.

Words that can be used in the spell:

1.{C0, C1, ..., CN} represents N+1 CTF players.

2."(" and ")".

3.The magical spell "love".

Note: Each word must be separated by a space, including "(" and ")".

There are several players at the competition site, and you can ask 2045 a limited number of questions.

Can Your Noggin Survive？

## 考点

离散数学完全集+信息论纠错码

## 出题思路与解题思路

出题思路：想考考大家纠错码，为了让题目变得有趣加了一点点离散数学表皮。

解题思路：经过试验发现love符号是或非，对离散数学知识敏感的人可以知道或非构成完全集，之后选用任意一种满足（15，7）纠两位错和（31，16）纠三位错的纠错码即可。

## 提示

1. Discrete Mathematics + Information Theory
2. https://en.wikipedia.org/wiki/BCH_code

## 参考

无

