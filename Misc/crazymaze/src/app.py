from hashlib import sha256
import socketserver
import signal
import string
import random
import os
import threading
import secret
import queue

MENU = br'''[+] 1.show rules
[+] 2.enter the challenge 
[+] 3.exit
'''
rules = br'''[*] I'll give you a weighted matrix of size n*n and a number $target$. (In this game, n=750)
[*] Your task is to start from any cell in the first column of the matrix and make n-1 moves to reach the last column (meaning you can only move right, right-up or right-down at each step). 
[*] Your goal is to ensure that the sum of the weights of the n cells you pass through is exactly equal to the target. Please provide your route.
[*] Time Limit: 1s
[*] Input Format: You will be given n+1 rows. The first row contains $target$, followed by n rows each containing n positive integers, representing a matrix. The j-th number in the i-th row represents the element in the i-th row and j-th column of the matrix.
[*] Output Format: One line containing n positive integers separated by a space. The i-th number represents the row position of your route when you are in the i-th column.
[*] Sample Input(n=3):
[-]Your target is 15.
[-]1 3 5
[-]9 4 2
[-]1 6 7
[*] Sample Output:
[-]0 1
[*] Notice:THIS IS A CTF GAME.
'''
n = secret.n

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

    def gen_challenge(self):
        self.mat, self.target = secret.callback() 
        return

    def check(self, ans):
        try:
            ans = [int(_) for _ in ans.decode().split(' ')]
            assert len(ans) == n
            sum = 0
            for i in range(n):
                assert 0 <= ans[i] < n
                if i > 0:
                    assert abs(ans[i] - ans[i - 1]) <= 1
                sum += self.mat[ans[i]][i]
            print(sum, self.target)
            return b'[+] Congratulations, you won! Here\'s your flag: %s' % secret.flag if sum == self.target else b'Wrongggg.'
        except:
            return b'[+] You\'re not following the rules.'

    def handle(self):
        q = queue.Queue()
        t1 = threading.Thread(target=self.proof_of_work, args=(q,))
        t2 = threading.Thread(target=self.gen_challenge)
        t1.start()
        t2.start()
        t1.join()
        t2.join()
        if not q.get():
            return
        self.send(b'[+] Welcome!')
        self.send(b'[+] Let\'s play a game!^_^!')
        self.send(b'[+] If you win once, I\'ll give you the flag.')
        self.send(MENU, newline=False)
        choice = self.recv()
        if (choice == b'1'):
            self.send(rules, newline=False)
        elif (choice == b'2'):
            self.send(b'Your target is %d.' % self.target)
            for i in range(n):
                self.send(' '.join([str(_) for _ in self.mat[i]]).encode())
            signal.alarm(1)
            ans = self.recv(prompt=b'[+] Plz input your route: ')
            self.send(self.check(ans))

        self.request.close()


class ThreadedServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass


class ForkedServer(socketserver.ForkingMixIn, socketserver.TCPServer):
    pass


if __name__ == "__main__":
    HOST, PORT = '0.0.0.0', 25553
    server = ForkedServer((HOST, PORT), Task)
    server.allow_reuse_address = True
    server.serve_forever()
