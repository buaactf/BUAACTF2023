## Which Element

给了Element.pcapng，从TCP流里面找到一个流，包含了四个文件

![](<image/截屏2023-04-25 21.45.31_noxSG9lTbg.png>)

![](<image/截屏2023-04-25 21.49.42_yT_xt9A1kc.png>)

根据提示，Google到[https://www.dcode.fr/hexahue-cipher](https://www.dcode.fr/hexahue-cipher "https://www.dcode.fr/hexahue-cipher")

![](<image/截屏2023-04-25 21.52.12_jp1dPZ3G_L.png>)

按照passwd得到密码3.1415

打开flag.zip得到如下三个文件

![](<image/截屏2023-04-25 21.53.24_l1NJsBucS3.png>)

![](<image/截屏2023-04-25 21.53.55_6QvKBfeoJW.png>)

观察flag1和flag2的大小，猜是**盲水印**[https://github.com/chishaxie/BlindWaterMark#blindwatermark](https://github.com/chishaxie/BlindWaterMark#blindwatermark "https://github.com/chishaxie/BlindWaterMark#blindwatermark")，一开始用python3的脚本跑，跑出来是一坨

![](<image/截屏2023-04-25 21.55.09_CvL8SpALFt.png>)

之后看到了一篇文章

[https://www.cnblogs.com/Flat-White/p/13517001.html](https://www.cnblogs.com/Flat-White/p/13517001.html "https://www.cnblogs.com/Flat-White/p/13517001.html")

才知道python2和python3跑出来的结果不一样，之后加上参数—oldseed跑一下就出来了

![](<image/截屏2023-04-25 21.57.39_ZL53aCUZ8n.png>)

\*hint文件结尾有一个提示，盲水印解不出来的时候盯着水银计都要盯麻了，很后来才想到应该是谐音＂水印＂😅

![](<image/截屏2023-04-25 22.01.41_G2ajTG89kV.png>)

![](<image/截屏2023-04-25 22.02.10_RBMEEhYUhs.png>)