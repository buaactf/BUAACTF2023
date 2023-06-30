import operator
import random
import re
from functools import reduce
from secret import flag


def pad(s):
    padding_length = (8 - len(s)) % 8
    return s + chr(padding_length) * padding_length


def xor(a, b):
    assert len(a) == len(b)
    return bytes(map(operator.xor, a, b))


def encrypt(s):
    iv = bytes(random.randint(0, 255) for _ in range(8))
    key = bytes(random.randint(0, 255) for _ in range(8))
    parts = list(map(str.encode, map(pad, re.findall(r'.{1,8}', s))))
    results = []
    for index, part in enumerate(parts):
        results.append(reduce(xor, [part, iv if index == 0 else results[-1], key]))
    return iv, key, results

iv, key, parts = encrypt(flag)
print(f"iv = {iv}")
print(f"key = {key}")
print(f"parts = {parts}")
