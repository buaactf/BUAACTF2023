这是一个独特的虚拟机，每个寄存器、ROM、RAM 并行执行。首先，为每个寄存器、代码段（ROM）、读写数据段（RAM）分配一个线程。它们会从第0层开始执行到下一个状态，会有几个进程等待数据准备。比如R1寄存器，它的下一个状态会由R类指令和I类指令决定。根据不同的指令，会查询不同数据的准备状态，比如添加ra，rb，状态传递函数会先判断第一个操作数是否为r1，如果是，则等待数据准备就绪rb 的先前状态，然后执行计算。程序流程如图
![](1.png)

指令集如下

> - R [00000]: add ra, rb
> - R [00001]: sub ra, rb
> - R [00010]: mov ra, rb
> - R [00011]: xor ra, rb

> - I [01000]: add ra, imm
> - I [01001]: sub ra, imm
> - I [01010]: mov ra, imm
> - I [01011]: lsh ra, imm
> - I [01100]: rsh ra, imm

> - B [01111]: jne ra, imm

> - R [10000]: ld ra, [rb]
> - R [10001]: st ra, [rb]

> - Z [11100]: write r0
> - Z [11101]: read r0
> - E [11111]: exit

`r0~r9:32bit`

`pc:32bit`

`ROM:1024 Byte`

`RAM:200 Byte`

每条指令是按位分割的，也就是说，它不拘泥于整字节的长度，而会不断的按位append，得到的最终的内容再按字节进行存储。
反汇编，代码如下（用movi似乎不太规范，可以想成li的作用）

```nasm
# 0x0~0x18: Input
# 0x18~0x28: Key
# 0x28~0x30: String
# 0x30~0x34: Iter
# 0x40~0x58: Cipher
# 0x58~0x70: Cmp

movi    r1,24
movi    r2,0
input:
read    r0
st      r0,[r2]
subi    r1,1
addi    r2,1
jne     r1,input

blocks:
xor     r2,r2
movi    r3,29687
lsh     r3,16
movi    r4,5513
xor     r3,r4

movi    r1,48
movi    r2,4
ld      r1,[r1]
lsh     r1,3
xor     r4,r4
loadv0:
ld      r5,[r1]
lsh     r4,8
xor     r4,r5
addi    r1,1
subi    r2,1
jne     r2,loadv0

movi    r2,4
xor     r5,r5
loadv1:
ld      r6,[r1]
lsh     r5,8
xor     r5,r6
addi    r1,1
subi    r2,1
jne     r2,loadv1
# r4=v0,r5=v1,r2=sum,r3=delta

movi    r1,32
round:
add     r2,r3

mov     r6,r5
lsh     r6,4

movi    r0,4
xor     r7,r7
loadk0:
addi    r0,23
lsh     r7,8
ld      r8,[r0]
xor     r7,r8
subi    r0,24
jne     r0,loadk0  # r7=key[0]

add     r6,r7
mov     r7,r2
add     r7,r5
xor     r6,r7
mov     r7,r5
rsh     r7,5

movi    r0,4
xor     r8,r8
loadk1:
addi    r0,27
lsh     r8,8
ld      r9,[r0]
xor     r8,r9
subi    r0,28
jne     r0,loadk1  # r8=key[1]

add     r7,r8
xor     r6,r7
add     r4,r6


mov     r6,r4
lsh     r6,4

movi    r0,4
xor     r7,r7
loadk2:
addi    r0,31
lsh     r7,8
ld      r8,[r0]
xor     r7,r8
subi    r0,32
jne     r0,loadk2  # r7=key[2]

add     r6,r7
mov     r7,r2
add     r7,r4
xor     r6,r7
mov     r7,r4
rsh     r7,5

movi    r0,4
xor     r8,r8
loadk3:
addi    r0,35
lsh     r8,8
ld      r9,[r0]
xor     r8,r9
subi    r0,36
jne     r0,loadk3  # r8=key[3]

add     r7,r8
xor     r6,r7
add     r5,r6

subi    r1,1
jne     r1,round

movi    r1,48
ld      r1,[r1]
lsh     r1,3
addi    r1,64
mov     r2,r1
addi    r2,4
movi    r3,4
store:
subi    r3,1
st      r4,[r1]
st      r5,[r2]
addi    r1,1
addi    r2,1
rsh     r4,8
rsh     r5,8
jne     r3,store

movi    r2,48
ld      r1,[r2]
addi    r1,1
st      r1,[r2]
subi    r1,3
jne     r1,blocks


movi    r1,64
movi    r2,88
movi    r3,24
cmp:
ld      r4,[r1]
ld      r5,[r2]
xor     r4,r5
jne     r4,fail
addi    r1,1
addi    r2,1
subi    r3,1
jnz     r3,cmp

movi    r1,40
ld      r0,[r1]
write   r0
addi    r1,1
ld      r0,[r1]
write   r0
addi    r1,1
ld      r0,[r1]
write   r0
addi    r1,1
ld      r0,[r1]
write   r0
exit

fail:
movi    r1,44
ld      r0,[r1]
write   r0
addi    r1,1
ld      r0,[r1]
write   r0
addi    r1,1
ld      r0,[r1]
write   r0
addi    r1,1
ld      r0,[r1]
write   r0
exit

```

分析汇编可知，是一个更换了delta的tea加密，key和cipher均已在代码中填进内存，找到key和cipher，进行解密即可

```python
from ctypes import *

def decrypt(v, k):
    v0, v1 = c_uint32(v[0]), c_uint32(v[1])
    delta = 0x73f71589
    k0, k1, k2, k3 = k[0], k[1], k[2], k[3]

    total = c_uint32(delta * 32)
    for i in range(32):                       
        v1.value -= ((v0.value<<4) + k2) ^ (v0.value + total.value) ^ ((v0.value>>5) + k3) 
        v0.value -= ((v1.value<<4) + k0) ^ (v1.value + total.value) ^ ((v1.value>>5) + k1)  
        total.value -= delta

    return v0.value, v1.value   

from libnum import n2s

# test
if __name__ == "__main__":
    value = [0xba6a1271, 0xf71fe442, 0xa89e704b, 0x5619f593, 0xe1645e87, 0x5be57baf]
    key = [0x1, 0x5, 0x8, 0xf]

    flag=''
    for i in range(0,len(value),2):
        res = decrypt(value[i:i+2], key)
        flag+=(n2s(res[0])+n2s(res[1])).decode()
    print(f'Flag is BUAACTF{{{flag}}}')


```
