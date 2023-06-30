from functools import reduce
import operator
def xor(a, b):
    assert len(a) == len(b)
    return bytes(map(operator.xor, a, b))

def decrypt(iv, key, parts):
    result = []
    for index, part in enumerate(parts):
        result.append(reduce(xor, [part, iv if index == 0 else parts[index - 1], key]))
    return b''.join(result)

iv = b'\xba=y\xa3\xc6)\xcf\xf7'
key = b'}6E\xeb(\x91\x08\xa0'
parts = [b'\x85^}\t\xad\xec\x81,', b'\xba\x04W\xa1\xee"\xea\xc5', b'\xb7ZW\x18\x99\x82\xd6:', b'\x99\x03}\x9c\xde|\xb1\xc5', b'\xa1Tk.\x8b\xee\xbaf']
print(decrypt(iv, key, parts))