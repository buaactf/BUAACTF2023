import hashlib
import string
import time
import nclib
import numpy

def dfs(mat,x,y,target,now,route):
    if x==749:
        if now==target:
            return route
        return 0
    for i in range(3):
        if 0<=y-1+i<750:
            res=dfs(mat,x+1,y-1+i,target,now+mat[x+1][y-1+i],route+[y-1+i])
            if res!=0:
                return res
    return 0
    
def sha(head):
    h = hashlib.sha256()
    h.update((head + tail).encode())
    str = h.hexdigest()
    if str == result:
        print(head)
        return head
    return 0
"""
以下是过验证
"""
TO=2
obj=nclib.Netcat('10.212.27.23',25553)
rc=obj.recv_line(timeout=TO).decode()
chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789" # A-Z a-z 0-9
tail = rc.split('+')[2][:16] # 原字符串的尾部
result = rc.split('==')[1].strip() # hash值
head=0
rc=obj.recv_line(timeout=TO).decode()
print(rc)
for ch1 in chars:
    if head != 0:
        break
    for ch2 in chars:
        if head != 0:
            break
        for ch3 in chars:
            if head != 0:
                break
            for ch4 in chars:
                head=sha(ch1 + ch2 + ch3 + ch4)
                if head!=0:
                    break
obj.send(head.encode()+b'\n')
rc=obj.recv_all(timeout=TO)
print(rc)
"""
以下是创建连接
"""
print('start')
start=time.time()#计时
obj.send_line(b'2')
rc = obj.recv_line()
target=int(rc[rc.decode().find('is')+3:rc.decode().find('.')].decode())
print(target)
mat=[]
"""
以下是接收数据部分
"""
for i in range(750):
    rc = obj.recv_line().decode()
    mat.append(list(map(int, rc.split())))
mat=numpy.transpose(mat).tolist()

v=[]#验证部分，可以删掉
for i in range(750):
    tmp=[]
    for j in range(750):
        tmp.append(mat[i][j])
    v.append(tmp)
"""
以下是求解前半段部分
"""
for i in range(1,744):
    for j in range(0, 750):
        if j == 0:
            ls= [mat[i-1][j], mat[i-1][j+1]]
        elif j == 749:
            ls= [mat[i-1][j], mat[i - 1][j-1]]
        else:
            ls= [mat[i-1][j - 1], mat[i-1][j], mat[i-1][j+1]]
        mat[i][j] += max(ls)
"""
以下是求解后半段路径部分
"""
secondroute=0
midpoint=0
for i in range(750):
    secondroute=dfs(mat,743,i,target,mat[743][i],[])
    if secondroute:
        print(secondroute)
        midpoint=i
        break
"""
以下是反求前半段路径部分
"""
route=[]
index = midpoint
route.append(index)
for i in range(742, -1, -1):
    if index == 0:
        ls = [0, mat[i][index], mat[i][index + 1]]
        index = index - 1 + ls.index(max(ls))
        route.append(index)
    elif index == 749:
        ls = [mat[i][index - 1], mat[i][index], 0]
        index = index - 1 + ls.index(max(ls))
        route.append(index)
    else:
        ls=[mat[i][index-1],mat[i][index], mat[i][index +1]]
        index = index-1 + ls.index(max(ls))
        route.append(index)
route.reverse()

sum=0#验证部分
for i,j in enumerate(route+secondroute):
    sum+=v[i][j]
assert sum==target

path = list(map(str, route+secondroute))
print(time.time()-start)
obj.send_line(' '.join(path).encode())
print(obj.recv_all().decode())
print(obj.recv_all().decode())