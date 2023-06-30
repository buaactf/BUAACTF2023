## 考点

DWT数字水印嵌入

## 工具

python、matlab

## 步骤

首先查看附件有两次encryption。

先看enc2，没有给IV的值，但是有key，事实上因为是CBC模式加上PNG图片前16个字节是确定的，并不需要IV的值也能恢复出图片。

随机选取IV值，用给的key解密，得到dec.png后将前16个字节替换即可得到图片。

```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import os

with open('enc.png', 'rb') as f:
    data = f.read()

iv = os.urandom(16)

cipher = AES.new(key, AES.MODE_CBC, iv=iv)
encrypted_data = cipher.decrypt(pad(data, AES.block_size))

with open('dec.png', 'wb') as f:
    f.write(encrypted_data)
```

再看enc1，可以看出是基于DWT和SVD的数字图像水印嵌入和提取。

水印嵌入过程包括以下几个步骤：
载入载体图像，并将其转为灰度图像。
对载体图像进行二维离散小波变换（DWT）得到LL、LH、HL、HH四个子带。
对LL子带进行奇异值分解（SVD），得到其奇异值矩阵S和左右奇异向量矩阵U和V。
载入水印图像，并将其转为灰度图像。
对水印图像进行奇异值分解，得到其奇异值矩阵Sw和左右奇异向量矩阵Uw和Vw。
根据设定的嵌入量af，将水印图像的奇异值矩阵Sw乘以af，然后加到载体图像LL子代的奇异值矩阵S上得到新的奇异值矩阵S2。
将新的奇异值矩阵S2乘以左右奇异向量矩阵U和V的转置得到嵌入后的新的低频分量LL2。
对LL2、LH、HL、HH四个子带进行逆DWT变换，得到含水印图像IW，并将其保存。

水印提取过程包括以下几个步骤：
载入含水印图像，并将其转为灰度图像。
对含水印图像进行二维离散小波变换（DWT）得到LL3、LH3、HL3、HH3四个子带。
对LL3子带进行奇异值分解（SVD），得到其奇异值矩阵S3和左右奇异向量矩阵U3和V3。
根据水印嵌入时设定的嵌入量af，计算出提取水印图的奇异值矩阵S4，即S4=(S3-S)/af。
将水印图像的左右奇异向量矩阵Uw和Vw以及提取水印图的奇异值矩阵S4乘起来，得到提取水印图W2

对于水印提取，盲提取可能比较麻烦（我不太会😭，所以给出 '**gift**' ----加密脚本运行后工作区的值，有了加密时S的值，就很好做了，导入后编写解密脚本即可得到嵌入的水印

```matlab
J=imread('watermarked.png');                         
J=im2double(J);
[LL3,LH3,HL3,HH3]=dwt2(J,'haar');          
[U3,S3,V3]=svd(LL3);                       
S4=(S3-S)/af;                              
W2=Uw*S4*Vw';                              
imshow(W2);
```

## 总结
