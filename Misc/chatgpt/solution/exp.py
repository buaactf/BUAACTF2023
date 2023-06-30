import hashlib
def sha(head):
    h = hashlib.sha256()
    h.update((head + tail).encode())
    str = h.hexdigest()
    if str == result:
        print(head)
        return head
    return 0
hashstr="sha256(XXXX+srwxZ1nUFH2Cl8qu) == 798421dfdb693f3aeac37918815512086b393ebdc002e6193ae6b06783e346f5"
chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789" # A-Z a-z 0-9
tail = hashstr.split('+')[1][:28] # 原字符串的尾部
result = hashstr.split('==')[1].strip() # hash值
head=0
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