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