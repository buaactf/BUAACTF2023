import random
import signal
import socketserver
import socket
import string
from hashlib import sha256
from os import urandom
from random import choice as c
from random import shuffle
import time

def nor(a, b):
    return not (a or b)


class LogicValue:
    def __init__(self, value):
        self.value = bool(value)

    def __repr__(self):
        return f"LogicValue({self.value})"

    def __or__(self, other):
        if isinstance(other, LogicValue):
            return LogicValue(nor(self.value, other.value))
        return NotImplemented

    __ror__ = __or__

    def __invert__(self):
        return LogicValue(not self.value)

    def __bool__(self):
        return self.value


flag = "flag{2045_8r0ught_D0wn_39_h34ds_1n_th1s_cyb3r_g4m3}"
white_list = ['(', ')', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'love']
white_list2 = ['(', ')', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13',
               'C14', 'C15', 'love']


class Task(socketserver.BaseRequestHandler):
    
    def _recvall(self):
        BUFF_SIZE = 1024
        data = b''
        max_data_size = 65536
        no_new_data_counter = 0
        wait_time = 0.1
        self.request.setblocking(True)
        part = self.request.recv(BUFF_SIZE)
        data += part
        while True:
            try:
                self.request.setblocking(False)
                part = self.request.recv(BUFF_SIZE)
                data += part
                no_new_data_counter = 0
                if len(data) >= max_data_size:
                    break
            except BlockingIOError as e:
                no_new_data_counter += 1
                if no_new_data_counter >= 3:
                    break
                time.sleep(wait_time)
                
        return data.strip()


    def send(self, msg, newline=True):
        if type(msg) == str:
            msg = msg.encode()
        if newline:
            msg += b"\n"
        self.request.sendall(msg)

    def recv(self, prompt=b'[-]'):
        self.send(prompt, newline=False)
        return self._recvall().decode()

    def calc(self, ans, chests, expr):
        try:
            C0, C1, C2, C3, C4, C5, C6 = chests

            r = eval(expr)
            return ans(r)
        except Exception as e:
            self.send("2045 fails to understand your words.\n")
            self.request.close()
            return "hack"

    def calc2(self, ans, chests, expr):
        try:
            C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13, C14, C15 = chests

            r = eval(expr)
            return ans(r)
        except Exception as e:
            self.send("2045 fails to understand your words.\n")
            self.request.close()
            return "hack"

    def do_round(self):
        truth = lambda r: not not r
        lie = lambda r: not r
        chests = [LogicValue(c((True, False))) for i in range(7)]
        bool_chests = [logic_value.value for logic_value in chests]
        self.send(
            "Seven CTFers stand here.\nBut don't worry. I believe you know what to do.")
        lie_count = c((1, 2))
        Patches = [truth] * (15 - lie_count) + [lie] * lie_count
        shuffle(Patches)
        for i in range(15):
            self.send("Ask 2045:")
            question = self.recv().strip()
            for word in question.split(" "):
                if word not in white_list:
                    self.send("({}) hacker!".format(word))
                    return False
            question = question.replace("love", "|")
            res = self.calc(Patches[i], chests, question)
            if res == "hack":
                return False
            if res == True:
                self.send('2045s answer: Yes!\n')
            else:
                self.send('2045s answer: No!\n')
        self.send("Now tell me who solved the question:")
        self.send("Please input a 0-1 string ,0 for no solved and 1 for solved, with space between each symbol")
        self.send("example:")
        self.send("1 0 0 1 0 0 0 means only C0 and C3 solved the question.")
        return bool_chests == list(map(int, self.recv().strip().split(" ")))

    def do_round2(self):
        truth = lambda r: not not r
        lie = lambda r: not r
        chests = [LogicValue(c((True, False))) for i in range(16)]
        bool_chests = [logic_value.value for logic_value in chests]
        self.send(
            "Sixteen CTFers stand here.\nBut don't worry. I believe you know what to do.")
        lie_count = c((1, 2, 3))
        Patches = [truth] * (31 - lie_count) + [lie] * lie_count
        shuffle(Patches)
        for i in range(31):
            self.send("Ask 2045:")
            question = self.recv().strip()
            for word in question.split(" "):
                if word not in white_list2:
                    self.send("({}) hacker!".format(word))
                    return False
            question = question.replace("love", "|")
            res = self.calc2(Patches[i], chests, question)
            if res == "hack":
                return False
            if res == True:
                self.send('2045s answer: Yes!\n')
            else:
                self.send('2045s answer: No!\n')
        self.send("Now tell me who solved the question:")
        self.send("Please input a 0-1 string ,0 for no solved and 1 for solved, with space between each symbol")
        self.send("example:")
        self.send("1 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 means only C0 and C3 solved the question.")
        return bool_chests == list(map(int, self.recv().strip().split(" ")))

    def handle(self):
        try:
            signal.alarm(1000)

            def proof_of_work():
                random.seed(urandom(32))
                alphabet = string.ascii_letters + string.digits
                proof = ''.join(random.choices(alphabet, k=32))
                hash_value = sha256(proof.encode()).hexdigest()
                self.send(f'sha256(XXXX+{proof[4:]}) == {hash_value}'.encode())
                nonce = self.recv(prompt=b'Give me XXXX > ')
                if len(nonce) != 4 or sha256(nonce.encode() + proof[4:].encode()).hexdigest() != hash_value:
                    return False
                return True

            if not proof_of_work():
                self.send("Wrong!")
                self.request.close()

            for i in range(100):
                rc = c((1, 2))
                if i == 0:
                    rc = 2
                if rc == 1:
                    if not self.do_round():
                        self.send("Wrong! 2045 BITES YOUR HEAD OFF.\n")
                        self.request.close()
                    else:
                        self.send(
                            "You find all the CTFers who solved the question with your head. Head to the next task!\n")
                else:
                    if not self.do_round2():
                        self.send("Wrong! 2045 BITES YOUR HEAD OFF.\n")
                        self.request.close()
                    else:
                        self.send(
                            "You find all the CTFers who solved the question with your head. Head to the next task!\n")
            self.send("You've recovered all the results! {}\n".format(flag))

            self.request.close()
        except Exception as e:
            self.request.close()


class ThreadedServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass


class ForkedServer(socketserver.ForkingMixIn, socketserver.TCPServer):
    pass


if __name__ == '__main__':
    HOST, PORT = '0.0.0.0', 23205
    ForkedServer.allow_reuse_address = True
    server = ForkedServer((HOST, PORT), Task)
    server.allow_reuse_address = True
    server.serve_forever()
