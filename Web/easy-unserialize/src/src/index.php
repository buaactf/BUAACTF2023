<?php

class KeyPort {

    public function __call($name, $arguments)
    {
        if(!isset($this->wakeup)||!$this->wakeup){
            call_user_func_array($this->format[$name],$arguments);
        }
    }

    public function finish(){
        $this->format=array();
        return $this->finish->iffinish;
    }

    public function __wakeup(){
        //$this->wakeup=True;
    }
}

class ArrayObj{

    private $iffinish;
    public $name;

    public function __get($name){
        return $this->$name=$this->name[$name];
    }
}

class Sun {
    public function __destruct()
    {
        if ($this->process->finish()) {
            $this->process->forward($this->_forward);
        }
    }
}

class Moon {
    public function __destruct()
    {
        if ($this->process->finish()) {
            $this->options['new']->forward($this->_forward);
        }
    }
    public function __wakeup(){
    }
}

if($_GET['u']){
    unserialize(base64_decode($_GET['u']));
}else{
    highlight_file(__FILE__);
} 
