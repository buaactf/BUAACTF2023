#!/usr/bin/python3
from pwn import *
from sys import exit
from os import popen
from uuid import uuid4
from base64 import b64encode,b64decode
from random import randint,shuffle
from hashlib import md5,sha256,sha384,sha512,sha1,sha224
from time import time
from pathlib import Path
from string import printable
from requests import get
import socketserver
import threading
import queue



DEBUG=False
path='.'
log_path  = path + '/fast1.log'
context.log_level='critical'
max_docker_nums=60

# tk=str(uuid4())
ftime=str(int(time()))
# uname= ftime + '-' + tk

def perror(info,code=-1):
    print(info)
    exit(code)

def debug(info):
    if DEBUG:
        print(info)

def randPort():
    res=popen('docker ps -a --format "{{.Ports}}"')
    while True:
        port=randint(20000+1,30000-1)
        if str(port) not in res:
            break
    return port

# def check_docker():
#     res=popen('docker ps -qa').read().split('\n')[:-1]
#     if len(res) >= max_docker_nums:
#         write(log_path,'%s docker use full\n'%ftime,mode='a')
#         perror("\033[31;5m[!]\033[0m\033[31;1m The number of dockers created reaches the maximum, please wait or contact the administrator\033[0m",0)

# def check_dir(path):
#     paths=["/sources","/elfs","/tars","/maps"]
#     for i in paths:
#         if not Path(path+i).is_dir():
#              mkdir_p(path+i)

# def pow_check():
#     hash_func=[md5,sha256,sha512]
#     rand_hash_func=hash_func[randint(1,len(hash_func))-1]
#     pstr=list(printable[:-10])
#     shuffle(pstr)
#     seed=''.join(pstr)[:4].encode()
#     if DEBUG:
#         print(seed,type(seed),str(rand_hash_func))
#     a=rand_hash_func(seed).hexdigest()
#     print("POW(printable)\nx[:20] = %s\n%s"%(a[:20],str(rand_hash_func)))

#     b=input('> ').strip()
#     if b == seed.decode() or rand_hash_func(b.encode()).hexdigest()[:20] == a[:20]:
#         # print("OK")
#         pass
#     else:
#         if DEBUG:
#             print(b,seed)
#         print("POW error!")
#         exit(0)

# def token_check():
#     global flag
#     token=input("Please input your token: ").strip()
#     #print(token)
#     token_encode=sha256(('SALT-%s-gamectf'%token).encode()).hexdigest()
#     res=get(url+'/check',params={'token':token_encode}).text
#     if 'no' in res:
#         print("Token error!")
#         exit(0)
#     debug(res)
#     real_flag=get(url+'/get_flag',params={'token':token,'flag':flag}).text
#     if real_flag == '':
#         raise Exception("GET flag error!")
#     debug(real_flag)
#     flag=real_flag
#     debug(flag)

# run docker and return docker port
def createDocker(tk,uname):
    port=randPort()
    elf_path = path + "/elfs/%s"%('pwn-%s'%md5(uname.encode()).hexdigest())
    debug(port)
    # print(port)
    res=popen("docker run -tid -p %d:1234 --name %s fast"%(port,tk)).read()
    res=popen("docker cp %s.old %s:/home/ctf/pwn"%(elf_path,tk)).read()
    res=popen("docker exec %s bash -c 'echo %s>flag && chmod +x /home/ctf/pwn && echo %s>pass'"%(tk,flag,tk)).read()
    write(log_path,'[%s] create docker -> [%s] , port -> [%d]\n'%(ftime,tk,port),mode='a')
    return port

# def newTask():
#     print("Welcome to play my game, you will receive a base64 string (the pwn file with upx+tar, runing in Ubuntu 19.10), can you pwn it ?")
#     print("Creating pwn file, please wait ...\n\n\n")
#     makeELF()
#     print("\n\nCreating docker, please wait ...")
#     port=createDocker()
#     print("Docker is runing\n\n")
#     print("\033[31;5m[!]\033[0m\033[31;1m Your docker run port [%d] , and the password is \"%s\"\033[0m"%(port,tk))
#     print("\nHave a good time!")

# def makeELF():
#     MAX_NUMS = 1000

#     template_main = '''// gcc main.c -o pwn -fno-stack-protector -no-pie && strip pwn \n#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\n#include <string.h>\n\nint nums=0;\nvoid read_n(char *buf, int size){memset(buf,0,size);for (int i = 0; i < size - 1; i++){if (read(0, buf + i, 1) != 1){exit(-1);}if(buf[i] == '\\n'){buf[i]=0;i=size;}}}\nint read_int(){char buf[0x10];read_n(buf, 0x10);return atoi(buf);}\nint read_one(){char buf[0x10]="";read(0,buf,1);return atoi(buf);}\n\n%s\n\nint main() {setbuf(stdin, NULL);setbuf(stdout, NULL);setbuf(stderr, NULL);alarm(300);func0000();return 0;}'''
#     func_define = '''void func%04d();'''
#     func = '''void func%04d(){if(nums++ != %#05x)exit(-1);switch (read_one()) {case 0:func%04d();break;case 1:func%04d();break;case 2:func%04d();break;case 3:func%04d();break;case 4:func%04d();break;case 5:func%04d();break;case 6:func%04d();break;case 7:func%04d();break;case 8:func%04d();break;case 9:func%04d();break;default:func0000();break;}}'''
#     func_fin = '''void func%04d() {char c,buf[200];if((c=getchar())!=0xa)exit(-1);write(1,"WOW,U R GREAT !\\n",0x10);read(0, buf, 0x200);}'''

#     defines = ''
#     funcs = []
#     trace = []

#     for i in range(MAX_NUMS):
#         defines += func_define % i
#         rand_list = []
#         for count in range(9):
#             rand_list.append(randint(0, MAX_NUMS - 1))
#         rand_list.append(i + 1)
#         shuffle(rand_list)
#         trace.append(rand_list.index(i + 1))
#         funcs.append(func % (tuple([i] + [i] + rand_list)))

#     random.shuffle(funcs)
#     funcs=''.join(funcs)
#     defines += func_define % MAX_NUMS
#     funcs += func_fin % MAX_NUMS
#     code = template_main % (defines + '\n' + funcs)

#     source_path = path + "/sources/%s"%('main-%s.c'%uname)
#     elf_path    = path + "/elfs/%s"%('pwn-%s'%md5(uname.encode()).hexdigest())
#     tar_path    = path + "/tars/%s.tar.gz"%('pwn-%s'%uname)
#     maps_path   = path + "/maps/%s"%('pwn-%s'%uname)
#     elf_name    = 'pwn-%s'%md5(uname.encode()).hexdigest()

#     write(source_path,code)
#     write(maps_path,str(trace))
#     res=popen("gcc  %s -o %s.old -fno-stack-protector -no-pie && strip %s.old 2>>%s"%(source_path,elf_path,elf_path,log_path)).read()
#     res=popen("upx %s.old -o %s && tar -zcvf %s -C%s/elfs/ %s 2>>%s"%(elf_path,elf_path,tar_path,path,elf_name,log_path)).read()
#     write(log_path,'[%s] gcc source\n'%ftime)
#     print(b64encode(open("%s"%tar_path,'rb').read()).decode())
#     return elf_path,tar_path,source_path

class Task(socketserver.BaseRequestHandler):
    def _recvall(self):
        BUFF_SIZE = 2048
        data = b''
        while True:
            part = self.request.recv(BUFF_SIZE)
            data += part
            if len(part) < BUFF_SIZE:
                break
        return data.strip()

    def send(self, msg, newline=True):
        try:
            if newline:
                msg += b'\n'
            self.request.sendall(msg)
        except:
            pass

    def recv(self, prompt=b'[-] '):
        self.send(prompt, newline=False)
        return self._recvall()
    
    def proof_of_work(self, queue):
        random.seed(os.urandom(8))
        proof = ''.join([random.choice(string.ascii_letters + string.digits) for _ in range(20)])
        _hexdigest = sha256(proof.encode()).hexdigest()
        self.send(f"[+] sha256(XXXX+{proof[4:]}) == {_hexdigest}".encode())
        x = self.recv(prompt=b'[+] Plz tell me XXXX: ')
        if len(x) != 4 or sha256(x + proof[4:].encode()).hexdigest() != _hexdigest:
            queue.put(False)
            return False
        queue.put(True)
        return True
    
    def newTask(self):
        tk=str(uuid4())
        uname= ftime + '-' + tk
        self.send(b"Welcome to play my game, you will receive a base64 string (the pwn file with upx+tar, runing in Ubuntu 19.10), can you pwn it ?")
        self.send(b"Creating pwn file, please wait ...\n\n\n")
        self.makeELF(uname)
        self.send(b"\n\nCreating docker, please wait ...")
        port=createDocker(tk,uname)
        self.send(b"Docker is runing\n\n")
        self.send(("\033[31;5m[!]\033[0m\033[31;1m Your docker run port [81.70.246.245%d] , and the secret is \"%s\"\033[0m"%(port,tk)).encode())
        self.send(b"\nHave a good time!")        

    def check_docker(self):
        res=popen('docker ps -qa').read().split('\n')[:-1]
        if len(res) >= max_docker_nums:
            write(log_path,'%s docker use full\n'%ftime,mode='a')
            perror("\033[31;5m[!]\033[0m\033[31;1m The number of dockers created reaches the maximum, please wait or contact the administrator\033[0m",0)

    def check_dir(self,path):
        paths=["/sources","/elfs","/tars","/maps"]
        for i in paths:
            if not Path(path+i).is_dir():
                mkdir_p(path+i)

    def makeELF(self,uname):
        MAX_NUMS = 1000
        print(uname)
        template_main = '''// gcc main.c -o pwn -fno-stack-protector -no-pie && strip pwn \n#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\n#include <string.h>\n\nint nums=0;\nvoid read_n(char *buf, int size){memset(buf,0,size);for (int i = 0; i < size - 1; i++){if (read(0, buf + i, 1) != 1){exit(-1);}if(buf[i] == '\\n'){buf[i]=0;i=size;}}}\nint read_int(){char buf[0x10];read_n(buf, 0x10);return atoi(buf);}\nint read_one(){char buf[0x10]="";read(0,buf,1);return atoi(buf);}\n\n%s\n\nint main() {setbuf(stdin, NULL);setbuf(stdout, NULL);setbuf(stderr, NULL);alarm(300);func0000();return 0;}'''
        func_define = '''void func%04d();'''
        func = '''void func%04d(){if(nums++ != %#05x)exit(-1);switch (read_one()) {case 0:func%04d();break;case 1:func%04d();break;case 2:func%04d();break;case 3:func%04d();break;case 4:func%04d();break;case 5:func%04d();break;case 6:func%04d();break;case 7:func%04d();break;case 8:func%04d();break;case 9:func%04d();break;default:func0000();break;}}'''
        func_fin = '''void func%04d() {char c,buf[200];if((c=getchar())!=0xa)exit(-1);write(1,"WOW,U R GREAT !\\n",0x10);read(0, buf, 0x200);}'''

        defines = ''
        funcs = []
        trace = []

        for i in range(MAX_NUMS):
            defines += func_define % i
            rand_list = []
            for count in range(9):
                rand_list.append(randint(0, MAX_NUMS - 1))
            rand_list.append(i + 1)
            shuffle(rand_list)
            trace.append(rand_list.index(i + 1))
            funcs.append(func % (tuple([i] + [i] + rand_list)))

        random.shuffle(funcs)
        funcs=''.join(funcs)
        defines += func_define % MAX_NUMS
        funcs += func_fin % MAX_NUMS
        code = template_main % (defines + '\n' + funcs)

        source_path = path + "/sources/%s"%('main-%s.c'%uname)
        elf_path    = path + "/elfs/%s"%('pwn-%s'%md5(uname.encode()).hexdigest())
        tar_path    = path + "/tars/%s.tar.gz"%('pwn-%s'%uname)
        maps_path   = path + "/maps/%s"%('pwn-%s'%uname)
        elf_name    = 'pwn-%s'%md5(uname.encode()).hexdigest()

        write(source_path,code)
        write(maps_path,str(trace))
        res=popen("gcc  %s -o %s.old -fno-stack-protector -no-pie && strip %s.old 2>>%s"%(source_path,elf_path,elf_path,log_path)).read()
        res=popen("upx %s.old -o %s && tar -zcvf %s -C%s/elfs/ %s 2>>%s"%(elf_path,elf_path,tar_path,path,elf_name,log_path)).read()
        write(log_path,'[%s] gcc source\n'%ftime)
        self.send(b64encode(open("%s"%tar_path,'rb').read()))
        return elf_path,tar_path,source_path


    def handle(self):
        q = queue.Queue()
        # if not self.proof_of_work(q,):
        #         self.send(b'\nWrong!')
        #         return
        # t1 = threading.Thread(target=self.proof_of_work, args=(q,))
        # t2 = threading.Thread(target=self.newTask)
        # t1.start()
        # t1.join()
        # if not q.get():
        #     return
        self.proof_of_work(q)
        self.check_dir(path)
        self.check_docker()
        self.newTask()
        # self.check_dir(path)
        # self.check_docker()
        # t2.start()
        # t2.join()
        self.request.close()

class ThreadedServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass

class ForkedServer(socketserver.ForkingMixIn, socketserver.TCPServer):
    pass

if __name__ == '__main__':
    HOST, PORT = '0.0.0.0', 25555
    server = ForkedServer((HOST, PORT), Task)
    server.allow_reuse_address = True
    server.serve_forever()
    # if DEBUG:
    #     context.log_level='debug'
    # try:
    # pow_check()
    # token_check()  # It is strongly recommended to add token detection !!!  or add pow
    
    
    # check_dir(path)
    # check_docker()
    # newTask()
    
    
    # token_check()  # It is strongly recommended to add token detection !!!  or add pow
    
    # except Exception as e:
    #     text="Found some bug, Please contact the administrator"
    #     text+=str(e) if DEBUG else ''
    #     perror(text,0)
    #test()
