# 赛题设计说明

## 题目信息

- 题目名称：Factor
- 预估难度：hard

## 题目描述

People always think that factoring is easy to crack RSA, but in fact, there are various methods for factoring, and you need to use a combination of them to solve this problem. This problem guarantees that it can be solved using appropriate methods within an acceptable time frame on a home laptop CPU.

nc 123.57.4.116 23331

## 考点

FAC问题的算法、复杂度及相关工具的使用

## 出题思路与解题思路

此题是一个经过巧妙选择参数构造的FAC问题，组合ECM方法和任意一种筛法即可解决。

## 提示

hint1：https://github.com/bbuhrow/yafu

hint2：https://en.wikipedia.org/wiki/Lenstra_elliptic-curve_factorization

hint3：https://en.wikipedia.org/wiki/Quadratic_sieve

hint4：https://en.wikipedia.org/wiki/General_number_field_sieve

## 参考

相关论文，维基百科链接：

https://www.sciencedirect.com/science/article/pii/S2213020916300210

https://en.wikipedia.org/wiki/Integer_factorization

