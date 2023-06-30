from pwn import *
import hashlib
import string
import re
import time
strr = string.ascii_letters+string.digits
def brute_force(suffix, target):
    for a in strr:
        for b in strr:
            for c in strr:
                for d in strr:
                    t = a + b + c + d
                    k = t + suffix
                    if hashlib.sha256((k).encode()).hexdigest() == target:
                        return t

r = remote('127.0.0.1', '25553')
s = r.recvuntil(b'[+] Plz tell me').decode()
print(s)
suffix, target = re.findall(r'sha256\(XXXX\+(.*)\) == (.*)\n', s)[0]
pow_ans = brute_force(suffix, target)
r.sendline(pow_ans.encode())
print(r.recvuntil(b'[-]'))
r.send(b'2')
money = r.recvline()
fo = open('data.txt','w')
print(money)
money = re.findall(r'Your target is (\d+).', money.decode())[0]
fo.write(money + '\n')
a = []
dp = []
for i in range(750):
    dp.append([0] * 750)
start = time.time()
for i in range(750):
    line = r.recvline().decode().strip('\n').split(' ')[-750:]
    a.append(list(map(int, line)))
    fo.write(' '.join(line) + '\n')
end = time.time()
fo.close()
print(end - start)

import os
os.system("./exp")
ans = open("out.txt","r").read()
print(ans)
r.sendline(ans.strip().encode())
print(time.time() - start)
print(r.recvline())
r.interactive()
