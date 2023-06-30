from sage.all import *
from Crypto.Util.number import *
def add(a,p):
    if pow(a,(p-1) // 2,p) == 1:
        return 0
    else:
        return 1

f = open("C:/Users/lenovo/Desktop/attachments/output.txt",'rb')
q = 210767327475911131359308665806489575328083
out = eval(f.read())

A = Matrix(GF(2), len(out))
v = vector(GF(2), len(out))
for i in range(len(out)):
    t1, t2 = out[i]
    for j in range(len(t1)):
        A[i,j] = add(t1[j], q)
        v[i] = add(t2, q)

m = A.solve_right(v)[:len(t1)]
m = ''.join(map(str, m))
print(long_to_bytes(int(m, 2)))
# flag{H1dd3n_Rul3s_4r3_7h3_K3y_70_Unl0ck_Cryp70_C0d3s!}