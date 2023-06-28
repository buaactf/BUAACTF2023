对 Linux 下 rand() 进行逆向。
逆向一下算法，得到 32 轮输出后能大致还原 state，然后后续精度在右移 15 位后差不多也能满足，实在不行可以进行两次逆推 state，使用z3解出状态矩阵，并进行后续推导：
```
# !/usr/bin/env python
from time import sleep
from pwn import process, ELF, remote
from z3 import *
import re

state = [BitVec('s%d' % i, 32) for i in range(31)]

fptr, rptr = 4, 1

def rand():
    global fptr, rptr
    state[fptr] += state[rptr]
    state[fptr] &= 0xffffffff
    val = state[fptr]
    result = (val >> 1) & 0x7fffffff
    fptr += 1
    fptr %= 31
    rptr += 1
    rptr %= 31
    return result & 0xffffffff


def getrand():
    return rand() >> 15

def rand1():
    global fptr, rptr
    ans[fptr] += ans[rptr]
    ans[fptr] &= 0xffffffff
    val = ans[fptr]
    result = (val >> 1) & 0x7fffffff
    fptr += 1
    fptr %= 31
    rptr += 1
    rptr %= 31
    return result & 0xffffffff


def getrand1():
    return rand1() >> 15


so = Solver()

sh = process('./randomize')
i = 0

sleep(2)
sh.recv()

while i < 38:
    sh.sendline(b'5')
    sleep(0.1)
    x = sh.recv().decode()
    x = int(re.findall(r'\d+',x)[0])
    print(x)
    so.add(getrand() == x)
    i += 1

so.check()

ans = [0]*31
model=so.model()
for i in model:
    ans[int(i.name()[1:])] = model[i].as_long()
print(ans)

fptr, rptr = 4, 1
for i in range(38):
    print(getrand1())

while True:
    try:
        x = getrand1()
        # print(x)
        sh.sendline(str(x).encode())
        sleep(0.1)
        s=sh.recv().decode()
        print(s)
    except:
        break

```