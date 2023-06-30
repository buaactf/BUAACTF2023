from base64 import b64decode
enc = [
    81, 61, 107, 41, 120, 45, 99, 54, 100, 10, 126,
    53, 123, 51, 106, 90, 57, 11, 69, 60, 113, 41,
    107, 91, 3, 49, 1, 49, 80, 42, 100, 2, 96,
    52, 122, 28, 69, 118, 63, 15, 106, 4, 111, 7,
    97, 48, 13, 48
]
for i in range(len(enc)-1, -1, -1):
    enc[i] = enc[i] ^ enc[i-1]
flag = "".join(chr(i) for i in enc)
print(b64decode(flag))