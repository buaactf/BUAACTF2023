## MC

给了两个文件

![](<image/截屏2023-04-25 22.05.29_F2MEGPkBSN.png>)

system.raw是内存镜像文件，用volatility工具来分析，这里给了很详细的介绍[https://blog.csdn.net/m0\_68012373/article/details/127419463](https://blog.csdn.net/m0_68012373/article/details/127419463 "https://blog.csdn.net/m0_68012373/article/details/127419463")，github项目[https://github.com/volatilityfoundation](https://github.com/volatilityfoundation "https://github.com/volatilityfoundation")

volatility有针对python3的版本volatility3，但是觉得没有python2的版本好用，由于现在kali都是自带python3，所以安装python2的库就有点麻烦，需要先安装pip2，不然安装的都是python3的库，这里有详细介绍安装pip2：[https://blog.csdn.net/huayimy/article/details/128338899](https://blog.csdn.net/huayimy/article/details/128338899 "https://blog.csdn.net/huayimy/article/details/128338899")，要注意一下pip2装完在/home/username/.local/bin下，需要进入文件夹才能用。

用volatility扫一下文件，hint.txt和devcpp.txt比较可疑，还看到一个VeraCrypt.exe，这里我忘记这是个硬盘挂载程序，我还以为是自己写的加密程序，dump也dump不下来，卡了半天。

![](<image/截屏2023-04-25 22.13.35_-FmBhIK9Do.png>)

![](<image/截屏2023-04-25 22.17.55_8ufsxQmNTK.png>)

![](<image/截屏2023-04-25 22.18.53_gkLROzCarT.png>)

扫一下进程，没看到什么太可疑的，有cmd、notepad、mspaint可以再查查

![](<image/截屏2023-04-25 22.14.30_wymnQ1VYq_.png>)

notepad内容，和devcpp.txt内容一样的

![](<image/截屏2023-04-25 22.16.00_E3niGOAowI.png>)

cmd没扫到什么

mspaint将进程dump下来之后后缀改成.data然后用gimp打开

![](<image/截屏2023-04-25 22.20.28_QtTeinqReq.png>)

width=1920的时候会找到这个，反转之后和hint.txt的内容一样

总结一下，总共拿到的信息有

```c
devcpp.txt
Administrator:admin:4cb9c8a8048fd02294477fcb1a41191a::
sjh123:sjh:a1562f9392c4b70d4ad3bf9d116fa71f::c2bd324d229b098b8175954812a8d8a2
ch3v4l:caiji:8a24367a1f46c141048752f2d5bbd14b::022da9d18852ffb0ea9a0b8020046733

hint.txt
LP49.13_m7sdq0#J

```

用VeraCrypt挂载Visual Studio，密码就是LP49.13\_m7sdq0#J

![](<image/截屏2023-04-25 23.30.58_YrQWZSB4d7.png>)

得到压缩文件DontLookInThisFile.zip，也需要密码

![](<image/截屏2023-04-25 23.32.07_qk70-KX55i.png>)

用[https://www.somd5.com/](https://www.somd5.com/ "https://www.somd5.com/")解密之前得到的密码hash

```c
Administrator:admin:4cb9c8a8048fd02294477fcb1a41191a（changeme）
sjh123:sjh:a1562f9392c4b70d4ad3bf9d116fa71f（songjinghang123）
ch3v4l:caiji:8a24367a1f46c141048752f2d5bbd14b（P@ssw0rd!）

```

用P\@ssw0rd!解密DontLookInThisFile.zip

得到traffic.pcapng

![](<image/截屏2023-04-25 23.35.41_k8ASfgxalM.png>)

![](<image/截屏2023-04-25 23.37.04_54oyKSFiZT.png>)

这里提示文件可能损坏，但是没关系，还可以继续分析，进去之后结合提示发现是向两个UDP端口轮流转发

![](<image/截屏2023-04-25 23.38.14_SKx-ihz0-G.png>)

怀疑是把文件分成了两部分分别发向两个端口，将两部分文件取下来观察

![](<image/截屏2023-04-25 23.41.49_ZJ0LqwfO5L.png>)

发现了非常熟悉的504B0403，发现文件是以4字节为单位，轮流发给12345和12346端口，同时发给12345端口的字节是逆序，写脚本结合后又得到了一个zip

```python
file1=open('5',mode='rb')
file2=open('6',mode='rb')
data1=file1.read()
data2=file2.read()
data=b''
for i in range(len(data1)//4):
    for j in range(4):
        data += data1[i * 4+(3-j):i  * 4+(4-j)]
    for j in range(4):
        data += data2[i* 4+j:i*4+j+1]
file3=open('7.zip',mode='wb')
file3.write(data)

```

![](<image/截屏2023-04-25 23.45.00_dg25Ac4uRI.png>)

显然flag在里面，可惜又要密码，这里的密码找了好一段时间。

还记得之前的pcapng文件损坏提示吗，用二进制打开pcapng文件，发现最下面有一大段数据

![](<image/截屏2023-04-25 23.47.18_P_iAN1qUn_.png>)

将下面的数据提取出来，一开始一直在Google evoM，esuoM，YALED，突然才看出来这是反的，分别是Move，Mouse，DELAY，把所有数据都反过来就是

![](<image/截屏2023-04-25 23.50.42_6Vpzpmk8KJ.png>)

google了一下很像是**鼠标轨迹记录**，找记录鼠标的软件，发现Jitbit Macro Recorder非常像要找到软件。

![](<image/截屏2023-04-25 23.54.55_Z7tmFSjw53.png>)

成功导入数据，打开画板，见证奇迹的时刻，鼠标自己动起来把密码写出来了

![](<image/截屏2023-04-25 23.55.52_0Ulxt00mBM.png>)

密码是083b18030440da0b785d2beb1c5bc4e3

用这个密码解压刚刚有flag.png的压缩包，本来以为已经到头了，结果还有一层

![](<image/截屏2023-04-25 23.57.05_f21g-OxZXz.png>)

这个编码方式感觉是在某处见过但是想不起来，直接google搜图，发现这个是**MaxiCode**[：https://de.wikipedia.org/wiki/MaxiCode](https://de.wikipedia.org/wiki/MaxiCode "：https://de.wikipedia.org/wiki/MaxiCode")，上网找在线解码，直接扔进去是不行的，因为**MaxiCode**中间还有个同心圆，

![](<image/截屏2023-04-25 23.59.07_N9Zd8L8RAu.png>)

随便什么内容生成一张，之后用ps把同心圆放好位置得到最终的图片

![](image/flag-circle_LGKdSVuxiS.jpg)

[https://www.dynamsoft.com/barcode-reader/barcode-types/maxicode/](https://www.dynamsoft.com/barcode-reader/barcode-types/maxicode/ "https://www.dynamsoft.com/barcode-reader/barcode-types/maxicode/")扔进去解码

![](<image/截屏2023-04-26 00.01.32_wTO07Nm55z.png>)