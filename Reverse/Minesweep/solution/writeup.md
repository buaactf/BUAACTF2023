看似是自己扫，实则是自动扫。主要逻辑在encrypt和Game里

[![img](./1/3151976-20230427120011062-612930768.png)](https://img2023.cnblogs.com/blog/3151976/202304/3151976-20230427120011062-612930768.png)

点开Game里面有个Sweep，再进去，会发现即使输入了x和y，之后也会赋值成0，所以扫雷都是自动的。

[![img](./1/3151976-20230427120010642-60285087.png)](https://img2023.cnblogs.com/blog/3151976/202304/3151976-20230427120010642-60285087.png)

本质上就是一个个扫过，每个点都要加上get_num的值，查看encrypt

[![img](./1/3151976-20230427120010251-931157607.png)](https://img2023.cnblogs.com/blog/3151976/202304/3151976-20230427120010251-931157607.png)

这是自己写的一个加密逻辑，按照相反方向把利用mine还原即可

（但是没考虑好多解问题 暴力的xdm可能能得到很多个能过得答案 非常抱歉！）

这里的mine是经过扫雷之后的，与初始值不同，可以通过静态分析得到也可以通过动调dump

