#!/usr/bin/env python3.9
# -*- coding: utf-8 -*-
import random
import string
import socketserver
from socketserver import ThreadingMixIn, TCPServer
from hashlib import sha256
from os import urandom
from secret import FLAG1, FLAG2, FLAG3, FAKEFLAG

welcome = """
 ________  ___  ___  ________  _________  ________  ________  _________  ________      
|\   ____\|\  \|\  \|\   __  \|\___   ___\\   ____\|\   __  \|\___   ___\\   ____\     
\ \  \___|\ \  \\\  \ \  \|\  \|___ \  \_\ \  \___|\ \  \|\  \|___ \  \_\ \  \___|_    
 \ \  \    \ \   __  \ \   __  \   \ \  \ \ \  \  __\ \   ____\   \ \  \ \ \_____  \   
  \ \  \____\ \  \ \  \ \  \ \  \   \ \  \ \ \  \|\  \ \  \___|    \ \  \ \|____|\  \  
   \ \_______\ \__\ \__\ \__\ \__\   \ \__\ \ \_______\ \__\        \ \__\  ____\_\  \ 
    \|_______|\|__|\|__|\|__|\|__|    \|__|  \|_______|\|__|         \|__| |\_________\
                                                                           \|_________|
                                                                                                                                                             
"""

good_command = ["/showcmd", "/hello", "/money", "/or4nge", "/withdraw", "/exam", "/flag", "/pss", "/hard-pss", "/pss-exercise", "/bye", "/hints"]

Questions = {
    "Do you know the level of the honor we've got in the 7th XCTF final last month?":"3",
    "Do you know ch3v4l, the lazy MISC player of or4nge? Tell me which floor he live in his Dormitory(NO OFFLINE ATTACK!!!):":"6",
    "Do you know the city where we played CISCN-CTF finals last year? Answer in English with the first letter capital":"Beijing",
    "Do you know the city where the CISCN-CTF finals will be held this year? Answer in English with the first letter capital":"Hefei",
    "Do you know the city where we played CISCN-CTF finals offline last time? Answer in English with the first letter capital":"Harbin",
    "Do you know the exact number of teams participated in 2022 CISCN?":"2219",
    "Do you know the exact year when CISCN was held first?":"2008",
    "Do you know the amount of the prize for the team who get 1st place in the CTF we played last month in Hangzhou?":"150000",
    "Do you know the final place we've got in the *CTF 2022?":"11",
    "How many Crypto questions are there in the Wangding Cup 2022 Qinglong Group Qualification (we participated in Aug, 2022)?":"3"
}

pss = ["paper", "scissor", "stone"]

class Task(socketserver.BaseRequestHandler):
    def _recvall(self):
        BUFF_SIZE = 1024
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

    def recv(self, prompt=b'> '):
        self.send(prompt, newline=False)
        return self._recvall()

    def proof_of_work(self):
        random.seed(urandom(32))
        alphabet = string.ascii_letters + string.digits
        proof = ''.join(random.choices(alphabet, k=32))
        hash_value = sha256(proof.encode()).hexdigest()
        self.send(f'sha256(XXXX+{proof[4:]}) == {hash_value}'.encode())
        nonce = self.recv(prompt=b'Give me XXXX > ')
        if len(nonce) != 4 or sha256(nonce + proof[4:].encode()).hexdigest() != hash_value:
            return False
        return True

    def handle(self):
        try:
            if not self.proof_of_work():
                self.send(b'\nWrong!')
                return

            money1 = 0
            money2 = 0
            self.send(b"\n")
            self.send(welcome.encode())
            self.send(b"\nWelcome to ch3v4l's chatgpt5 for BUAACTF2023! ^_^")
            self.send(b"\nchatgpt5 is a smart ctf-bot which can give responses when you put specific commands. It can even give you part of flag if you solve some questions!")
            self.send(b"\nThis is a test version of chargpt5, so input cmds has restrictions.")
            self.send(b"\nTry /showcmd to start chat with it!")
            while True:
                s = str(self.recv(prompt=b'cmd > '))
                if "/showcmd" in s:
                    self.send(b"\nchatgpt5 permits input cmds as follows:")
                    reply = ""
                    for i in good_command:
                        reply += i
                        reply += ' '
                    self.send(b"\n")
                    self.send(reply.encode())
                    self.send(b"\n")
                elif "/bye" in s:
                    self.send(b"\nBye!")
                    return
                elif "/hello" in s:
                    self.send(b"\nHi! I'm chatgpt5, copyright BUAA or4nge.")
                    self.send(b"\nAsk me something!")
                elif "or4nge" in s:
                    self.send(b"\nYou are right, but BUAACTF is a new open world adventure game independently developed by team or4nge.")
                    self.send(b"\nThe game takes place in a fantasy world called BUAA SCST, where the chosen person is granted the 'Eye of Security' to guide the power of the virtual machines. ")
                    self.send(b"\nYou will play a mysterious role called 'CTFer'. ")
                    self.send(b"\nYou will encounter teammates with different personalities and unique abilities in your competitions, ")
                    self.send(b"\ndefeat powerful enemies with them, and find lost flags - at the same time, gradually discover the truth of '0 solved jail'.")
                    self.send(b"\nUse cmd /exam to learn more about or4nge team.")
                elif "/exam" in s:
                    self.send(b"\nA small 5-question test for you to check if you know or4nge team and CTFs good!")
                    count = 0
                    questions_number = random.sample(range(0,len(Questions)),5)
                    for i in range(5):
                        self.send(b"\n")
                        self.send(list(Questions.keys())[questions_number[i]].encode())
                        self.send(b"\n")
                        answer = self.recv(prompt=b'answer > ')
                        if answer.decode().strip() == Questions[list(Questions.keys())[questions_number[i]]]:
                            self.send(b"\nGood!")
                            count += 1
                        else:
                            self.send(b"\nNo No No!")
                    if count == 5:
                        self.send(b"\nGood knowledge of CTF and or4nge! A gift for you!")
                        self.send(b"\n")
                        self.send(FLAG1.encode())
                        self.send(b"\n")
                    else:
                        self.send(b"\nSorry, your point is not enough.")
                        self.send(b"\nFind more information about or4nge!")
                        self.send(b"\nMaybe check /hints is useful?")
                elif "/money" in s:
                    self.send(b"\nMoney can use to get flag!")
                    self.send(b"\nmoney1:")
                    self.send(str(money1).encode())
                    self.send(b"\n")
                    self.send(b"\nmoney2:")
                    self.send(str(money2).encode())
                    self.send(b"\n")
                elif "/withdraw" in s:
                    self.send(b"\nOpen bank gives you 1 money1 and 1 money2, but up to 10000!")
                    if money1 <= 10000:
                        money1 += 1
                    else:
                        self.send(b"\nRich ye v me 50 money1 for KFC-Crazy-Thursday!")
                        money1 -= 50
                    if money2 <= 10000:
                        money2 += 1
                    else:
                        self.send(b"\nOpen bank has no money2 TAT!")
                elif "/flag" in s:
                    self.send(b"\nYou have the chance to get the flag!! Come and see if you are the lucky dog!")
                    coin = random.randint(0, 120000)
                    if coin >= 80000:
                        self.send(b"Lucky Lucky!")
                        self.send(b"\n")
                        self.send(FAKEFLAG.encode())
                        self.send(b"\n")
                    else:
                        self.send(b"Unlucky~~But you can use 100000000 money1 and 100000000 money2 to buy flag parts!")
                        num = int(self.recv(prompt=b'use money > '))
                        if num == 1:
                            if money1 >= 100000000:
                                money1 -= 100000000
                                self.send(b"Enough money1! Here is your flag:")
                                self.send(b"\n")
                                self.send(FLAG2.encode())
                                self.send(b"\n")
                            else:
                                self.send(b"\nNot enough money1! Get some from open bank with /withdraw or gamble in /pss!")
                        elif num == 2:
                            if money2 >= 100000000:
                                money2 -= 100000000
                                self.send(b"Enough money2! Here is your flag:")
                                self.send(b"\n")
                                self.send(FLAG3.encode())
                                self.send(b"\n")
                            else:
                                self.send(b"\nNot enough money2! Get some from open bank with /withdraw or gamble in /hard-pss!")
                        else:
                            self.send(b"\nIllegal choice! Come with me and surrender yourself.")
                elif "/pss-exercise" in s:
                    self.send(b"\nLet's play paper, scissor and stone game!")
                    self.send(b"\nYour choice: 1.Paper 2.Scissor 3.Stone")
                    choice = int(self.recv(prompt=b'choice > '))
                    my_choice = random.randint(1,3)
                    if (choice == 1 and my_choice == 1) or (choice == 2 and my_choice == 2) or (choice == 3 and my_choice == 3):
                        self.send(b"\nchapgpt5 chooses: ")
                        self.send(b"\n")
                        self.send(pss[my_choice - 1].encode())
                        self.send(b"\n")
                        self.send(b"It's a tie!")
                    elif (choice == 1 and my_choice == 2) or (choice == 2 and my_choice == 3) or (choice == 3 and my_choice == 1):
                        self.send(b"\nchapgpt5 chooses: ")
                        self.send(b"\n")
                        self.send(pss[my_choice - 1].encode())
                        self.send(b"\n")
                        self.send(b"You lose!")
                    elif (choice == 1 and my_choice == 3) or (choice == 2 and my_choice == 1) or (choice == 3 and my_choice == 2):
                        self.send(b"\nchapgpt5 chooses: ")
                        self.send(b"\n")
                        self.send(pss[my_choice - 1].encode())
                        self.send(b"\n")
                        self.send(b"You win!")
                    else:
                        self.send(b"\nIllegal choice! Come with me and surrender yourself.")
                elif "/pss" in s:
                    self.send(b"\npaper, scissor and stone gamble!")
                    self.send(b"\nYou can earn lots of money1 if you can beat chatgpt5 here.")
                    self.send(b"\nYour choice: 1.Paper 2.Scissor 3.Stone")
                    choice = int(self.recv(prompt=b'choice > '))
                    self.send(b"\nHow many bets do you want to pay?")
                    bets = int(self.recv(prompt=b'bets money > '))
                    if choice == 1:
                        self.send(b"\nchapgpt5 chooses: ")
                        self.send(b"\n")
                        self.send(b"\nscissor")
                        self.send(b"\n")
                        self.send(b"You lose!")
                        money1 -= bets
                    elif choice == 2:
                        self.send(b"\nchapgpt5 chooses: ")
                        self.send(b"\n")
                        self.send(b"\nstone")
                        self.send(b"\n")
                        self.send(b"You lose!")
                        money1 -= bets
                    elif choice == 3:
                        self.send(b"\nchapgpt5 chooses: ")
                        self.send(b"\n")
                        self.send(b"\npaper")
                        self.send(b"\n")
                        self.send(b"You lose!")
                        money1 -= bets
                    else:
                        self.send(b"\nIllegal choice! Come with me and surrender yourself.")
                elif "/hard-pss" in s:
                    self.send(b"\nhard paper, scissor and stone gamble!")
                    self.send(b"\nYou can earn lots of money2 if you can beat chatgpt5 here.")
                    self.send(b"\nYour choice: 1.Paper 2.Scissor 3.Stone")
                    choice = int(self.recv(prompt=b'choice > '))
                    self.send(b"\nHow many bets do you want to pay?")
                    bets = complex(self.recv(prompt=b'bets money > ').decode())
                    if bets.real < 0:
                        self.send(b"\nNo hacker!")
                        return
                    if choice == 1:
                        self.send(b"\nchapgpt5 chooses: ")
                        self.send(b"\n")
                        self.send(b"\nscissor")
                        self.send(b"\n")
                        self.send(b"You lose!")
                        money2 -= bets.imag
                    elif choice == 2:
                        self.send(b"\nchapgpt5 chooses: ")
                        self.send(b"\n")
                        self.send(b"\nstone")
                        self.send(b"\n")
                        self.send(b"You lose!")
                        money2 -= bets.imag
                    elif choice == 3:
                        self.send(b"\nchapgpt5 chooses: ")
                        self.send(b"\n")
                        self.send(b"\npaper")
                        self.send(b"\n")
                        self.send(b"You lose!")
                        money2 -= bets.imag
                    else:
                        self.send(b"\nIllegal choice! Come with me and surrender yourself.")
                elif "/hints" in s:
                    self.send(b"Each request may get different hint!")
                    k = random.randint(0,2)
                    if k == 0:
                        self.send(b"\nSubscribe our wechat official accounts and github blog: https://or4ngesec.github.io/ to find useful information!")
                    elif k == 1:
                        self.send(b"\nIn pss games you can try different types of input!!")
                    else:
                        self.send(b"\nPay attention to the official website of BUAA 39!")
                else:
                    self.send(b"\nWrong cmds!")

        except Exception:
            self.send(b'Something Wrong!')
        finally:
            self.request.close()


class ThreadedServer(ThreadingMixIn, TCPServer):
    pass


if __name__ == '__main__':
    HOST, PORT = '0.0.0.0', 10002
    print(HOST, PORT)
    server = ThreadedServer((HOST, PORT), Task)
    server.allow_reuse_address = True
    server.serve_forever()


