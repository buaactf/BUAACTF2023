## 考点

签到

## 工具

浏览器

## 步骤

flag的三部分分别藏在第2、5、8层的三个仙灵中，与它们对话即可获得。

#### 法一

正常玩，不用玩到通关就能拿完flag。

#### 法二

作弊玩，开启无限数值+道具的模式。

注意数值和道具**得预先在`Core.js`里下断点改**，否则不在作用域里；改之后的永久道具还是得去游戏里拿一遍才能用

![image-20230106123219115](D:\markdown_photo\image-20230106123219115.png)

![image-20230106123255759](D:\markdown_photo\image-20230106123255759.png)

![image-20230106123452646](D:\markdown_photo\image-20230106123452646.png)

#### 法三

审源码，flag全在Event.js中。

```js
case 51:
   useful= "BUAACTF{HT";
   Message = ["[Npc=3,仙子]恭喜你找到了第一段芙拉隔,它的值为","[Npc=3,仙子]"+useful];
   Event.ShowMessageList(Message,function(){
      Event.RemoveEvent("Npc",1,9,7);
    });
break;
```

藏在事件13和14之间。

```js
case 52:
   text = "NV9tb3RhXzFz" 
   useful = atob(text);
   Message = ["[Npc=3,仙子]哇!你拿下了第二段腐拉蛤,它是","[Npc=3,仙子]"+useful];
   Event.ShowMessageList(Message,function(){
      Event.RemoveEvent("Npc",0,0,5);
    });
break;
```

藏在事件36和37之间。

```js
case 53:
   text = new Uint8Array([95, 115, 48, 95, 102, 117, 110, 33, 125]); 
   useful = String.fromCharCode.apply(null, text);;
   Message = ["[Npc=3,仙子]奈斯!你找到了最后一段富菈哥,它的内容:","[Npc=3,仙子]"+useful];
   Event.ShowMessageList(Message,function(){
      Event.RemoveEvent("Npc",1,5,3);
    });
break;
```

放在Event.js最后。



## 总结

签到

