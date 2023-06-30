分解工具有CADO-NFS、msieve、yafu等很多，自己手写实现一个也没有任何问题。

FAC问题在素数选取不存在漏洞的情况下，分解主要有如下方法：

+  Lenstra elliptic curve factorization（ECM）方法，时间复杂度与最小质因数大小有关。
+  各种筛法，时间复杂度与待分解数大小有关。

对目前家用级CPU（R23万分量级）和一般实现而言，ECM方法最多分解出45-55十进制位数，对于更大的数，时间开销迅速增加到不可接受的量级。

不同筛法有自身的优势区间，一般而言，小于75十进制位数选择SNFS（特殊数域筛法），75-130十进制位数选择SIQS（二次筛法），更大的数选择GNFS（通用数域筛法）。

对于本题目而言，应先用ECM方法分解出155二进制位的小质因数，再用任意一种筛法分解剩下的172*172二进制位数。

这里以yafu为例，介绍分解工具使用。

yafu可以通过yafu.ini文件调整配置，比较重要的有以下参数:`threads`，`pretest_ratio`，`xover`，`snfs_xover`，`plan`，`work`。

`threads`默认为1，速度很慢，可以根据处理器线程数设置。

`pretest_ratio`，`xover`，`snfs_xover`，`plan`，`work`这些参数可以参照yafu注释设置，决定了yafu使用哪些分解方法。

gnfs库在yafu项目里默认没有提供，如果要使用gnfs的话，推荐使用ggnfs。

对于本题，将`threads`拉满，调整`pretest_ratio`、`plan`和`work`先使用ECM分解，再调整`snfs_xover`使用SIQS分解即可解出。
