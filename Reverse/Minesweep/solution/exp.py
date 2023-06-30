mine=["accddcd",
    "cedcdca",
    "cfdebcc",
    "dddbdcc",
    "ddebdbc",
    "ccadecc",
    "adcdbac"]
s = "vahii_Ts_nice!"
s = list(s)
for k in range(len(s) - 7)[::-1]:
    if s[k] >= 'a' and s[k] <= 'z':
        temp = 0
        for i in range(7):
            for j in range(7):
                temp += (ord(s[k + 1 + i]) - ord('a')) ^ (ord(mine[i][j]) - ord('a'))
        s[k] = chr((temp ^ (ord(s[k]) - ord('a'))) % 26 + ord('a'))
s = ''.join(s)
print(s)  # 打印处理后的字符串s