import hashlib
import random
import socketserver
import signal
import os
from libnum import generate_prime
from os import urandom

# Flag and RSA settings
flag = b'flag{Cr4ck1ng_RSA_Thr0ugh_Pr1m3_Fact0r_M4st3ry}'
N_P1_BITS = 155
N_P2_BITS = 172
N_P3_BITS = 172
R_BITS = 499
# SEED = '20392045'

"""
def get_seed_with_id(id):
    seed = hashlib.md5(SEED.encode()).hexdigest()
    id_hash = hashlib.md5(id.encode()).hexdigest()
    return int(seed, 16) ^ int(id_hash, 16)
"""

def generate_n():
    random.seed(urandom(32))
    p1 =  generate_prime(N_P1_BITS)
    p2 =  generate_prime(N_P2_BITS)
    p3 =  generate_prime(N_P3_BITS)
    return p1 * p2 * p3

def encrypt_rsa(m, e, N):
    return pow(m, e, N)

def pad_flag(flag, target_length):
    padding_length = target_length - len(flag) - 3
    padding = b'\x00' + os.urandom(padding_length) + b'\x00' + flag
    return int.from_bytes(padding, 'big')

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
        if newline:
            msg += b"\n"
        self.request.sendall(msg)
    
    def recv(self, prompt=b'[-]' ):
        self.send(prompt, newline=False)
        return self._recvall().decode()
    
    def handle(self):
        self.send(b'Welcome to the RSA Prime Factor Mystery Challenge!')
  
        N = generate_n()
        flag_int = pad_flag(flag, R_BITS // 8)
        
        encrypted_flag = encrypt_rsa(flag_int, 65537, N)

        self.send(b'Here is the description of N:')
        self.send(f'N is composed of the product of 3 prime numbers with sizes of {N_P1_BITS}, {N_P2_BITS}, and {N_P3_BITS} bits.'.encode())

        self.send(b'Here is your RSA public key:')
        self.send(f'e: 65537\nN: {N}'.encode())
        self.send(b'Here is the encrypted flag:')
        self.send(f'{encrypted_flag}'.encode())

        self.request.close()



class ThreadedServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass

class ForkedServer(socketserver.ForkingMixIn, socketserver.TCPServer):
    pass

if __name__ == '__main__':
    HOST, PORT = '0.0.0.0', 23331
    ForkedServer.allow_reuse_address = True
    server = ForkedServer((HOST, PORT), Task)
    server.allow_reuse_address = True
    server.serve_forever()

