## 考点
流量分析、盲水印、base64、Morse

## 工具
Wireshark、BlindWaterMark(https://github.com/chishaxie/BlindWaterMark) 

## 步骤
1. 打开Element.pcapng后，发现是文件上传过程，可发现上传了四个文件 
![upload_file](./attachments/pics/1.png)

2. 可分析出四个文件分别是 fakepw.png, flag.wav, passwd.png, flag.zip

3. 通过查看flag.wav, 可知为摩斯码，转换后发现为fake flag，并且real flag在flag.zip中。
![flag.wav](./attachments/pics/2.png)

4. flag.zip需要密码，密码为passwd.png，fakepw.png和passwd.png均为Hexahue编码，根据fakepw.png中“f”“a”“k”“e”“p”“w”的顺序可知压缩包密码为3.1415

5. 打开压缩包，查看hint.png，可发现文件尾有一段用base64编码的文字，解码可得提示“What's that in my hand”，百度识图可得人物为托里拆利，手中拿的是水银气压计，**水银=水印**，而且给了两幅图片，使用BlindWaterMark(https://github.com/chishaxie/BlindWaterMark)工具即可提取最终flag：BUAACTF{Yes_It_i5_Hg}。
![flag](./attachments/pics/3.png)

## 总结
Hg=水银=水印（ps：虽然你帮助小z解出了最后一种元素，但他承诺的是炼制出药后会给你一份。很不幸，他炼不出来，你拿不到“再无ddl”药。这个饼好吃吗？）

