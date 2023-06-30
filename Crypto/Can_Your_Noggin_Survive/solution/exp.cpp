#include <bits/stdc++.h>
#include <sys/prctl.h>
#include <fcntl.h>
#include "sha256.h"
#define BUFSIZE 0x400000
#define MAXN 1000
char buf[BUFSIZE];

#define out(fmt, s) { \
    strcpy(buf, s);   \
    int len = strlen(s); \
    buf[len] = '\n', buf[len + 1] = 0; \
    write(1, buf, len + 1); fflush(stdout); }
#define RECV_AND_PRINT { fgets(buf, BUFSIZE, stdin); fprintf(stderr, "[%d]:", __LINE__); fputs(buf, stderr); fflush(stderr); }
int qwq = 0x10;
int quota = 0;
using u32 = unsigned int;

int lin16[16][31] = {
	{1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0},
	{0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0},
	{0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0},
	{0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0},
	{0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0},
	{0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1},
	{0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1},
	{0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1},
	{0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0},
	{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1},
	{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1},
	{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1},
	{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0},
	{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1},
	{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0},
	{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1}
};

int lin7[7][15] = {
	{0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1},
	{0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0},
	{0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0},
	{0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1},
	{0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0},
	{1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0},
	{1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1}
};

std::string Nor (const std::string &s1, const std::string &s2) {
	return "( " + s1 + " love " + s2 + " )";
}

std::string Not (const std::string &s) {
	return Nor(s, s);
}

std::string Or (const std::string &s1, const std::string &s2) {
	return Not(Nor(s1, s2));
}

std::string And (const std::string &s1, const std::string &s2) {
	return Nor(Not(s1), Not(s2));
}

std::string Xor (const std::string &s1, const std::string &s2) {
	return Nor(Nor(s1, s2), Nor(Not(s1), Not(s2)));
}

std::string query16(const std::vector<int> &v, int l, int r) {
	if (l == r) return "C" + std::to_string(v[l]);
	int m = (l + r) >> 1;
	return Xor(query16(v, l, m), query16(v, m + 1, r));
}

std::string query16(int x) {
	std::vector<int> v;
	for (int i = 0; i < 16; ++i) {
		if (lin16[i][x]) v.emplace_back(i);
	}
	return query16(v, 0, int(v.size()) - 1);
}

u32 mul16(u32 x) {
	u32 r = 0;
	for (int i = 0; i < 16; ++i) {
		for (int j = 0; j < 31; ++j) {
			r ^= (((x >> i) & lin16[i][j]) << j);
		}
	}
	return r;
}

u32 judge16(u32 x) {
	u32 r = 0, ri = 233;
	for (u32 i = 0; i < (1 << 16); ++i) {
		int v = __builtin_popcount(x ^ mul16(i));
		if (v < ri) r = i, ri = v;
	}
	return r;
}

std::string query7(const std::vector<int> &v, int l, int r) {
	if (l == r) return "C" + std::to_string(v[l]);
	int m = (l + r) >> 1;
	return Xor(query7(v, l, m), query7(v, m + 1, r));
}

std::string query7(int x) {
	std::vector<int> v;
	for (int i = 0; i < 7; ++i) {
		if (lin7[i][x]) v.emplace_back(i);
	}
	return query7(v, 0, int(v.size()) - 1);
}

u32 mul7(u32 x) {
	u32 r = 0;
	for (int i = 0; i < 7; ++i) {
		for (int j = 0; j < 15; ++j) {
			r ^= (((x >> i) & lin7[i][j]) << j);
		}
	}
	return r;
}

u32 judge7(u32 x) {
	u32 r = 0, ri = 233;
	for (u32 i = 0; i < (1 << 7); ++i) {
		int v = __builtin_popcount(x ^ mul7(i));
		if (v < ri) r = i, ri = v;
	}
	return r;
}

int ask(const std::string &s) {
	--quota;
//	for (int i = 0; i < 0x10000000; ++i) qwq ^= qwq * 0x37;
	out(" %s \n", s.c_str());
//	sleep(1);
//	for (int i = 0; i < 0x1000000; ++i) qwq ^= qwq * 0x37;
	fprintf(stderr, "red %d\n", qwq);
	RECV_AND_PRINT;
	char res = buf[17];
	if (res == 'u') exit(666);
	if (buf[3] == '(') exit(1234);
	RECV_AND_PRINT;
	RECV_AND_PRINT;
//	fprintf(stderr, "[I%d,%d]:%c\n", __LINE__, i, res); fflush(stderr);
	return (res == 'Y');
}

int main() {
	int round = 0;
	int fdDown[2]; // read write
	int fdUp[2]; // read write
	pipe(fdDown);
	pipe(fdUp);
	int t = fork();
	if (!t) {
		dup2(fdUp[1], 1);
		dup2(fdDown[0], 0);
//		std::setvbuf(stdin, nullptr, _IONBF, 0);
//		std::setvbuf(stdout, nullptr, _IONBF, 0);
		prctl(PR_SET_PDEATHSIG, SIGKILL);
		execl("/usr/bin/nc", "/usr/bin/nc", "10.212.26.206", "23205", NULL);
	}
	dup2(fdUp[0], 0);
	dup2(fdDown[1], 1);
//	std::setvbuf(stdin, nullptr, _IONBF, 0);
//	std::setvbuf(stdout, nullptr, _IONBF, 0);
	char tail[256];
	BYTE expected[256];
	scanf("sha256(XXXX+%28s) == %s", tail, expected);
//	fcntl(0, F_SETFL, O_NONBLOCK);
	fprintf(stderr, "t:%s e:%s\n", tail, expected);
	for (int i = 0; i < 64; ++i) expected[i] = expected[i] - (isdigit(expected[i]) ? '0' : 'a' - 10);
	char word[64] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	char bb[256];
	BYTE hh[SHA256_BLOCK_SIZE];
	strcpy(bb + 4, tail);
	SHA256_CTX ctx;
	for (int i1 = 0; i1 < 62; ++i1) {
		bb[0] = word[i1];
		fprintf(stderr, "%c", bb[0]);
		for (int i2 = 0; i2 < 62; ++i2) {
			bb[1] = word[i2];
			for (int i3 = 0; i3 < 62; ++i3) {
				bb[2] = word[i3];
				for (int i4 = 0; i4 < 62; ++i4) {
					bb[3] = word[i4];
					sha256_init(&ctx);
					sha256_update(&ctx, (BYTE *) bb, strlen(bb));
					sha256_final(&ctx, hh);
					int equ = 1;
					for (int i = 0; i < SHA256_BLOCK_SIZE; ++i) {
						equ = equ && (expected[i * 2] == (hh[i] >> 4) && expected[i * 2 + 1] == (hh[i] & 15));
					}
					if (equ) {
						printf("%c%c%c%c\n", bb[0], bb[1], bb[2], bb[3]);
						fflush(stdout);
						fprintf(stderr, "\nfound hash: %c%c%c%c\n", bb[0], bb[1], bb[2], bb[3]);
						goto found_hash;
					}
				}
			}
		}
	}
	fputs("not found hash???", stderr);
	return 0;
	found_hash:

	RECV_AND_PRINT;
	RECV_AND_PRINT;
	int ans[16] = {};
	int chk[16] = {};
	char tmp[233];
	u32 res = 0;
	for (int i = 0; i < 31; ++i) fprintf(stderr, "%s\n", query16(i).c_str());
	for (int i = 0; i < 15; ++i) fprintf(stderr, "%s\n", query7(i).c_str());

sixteen:
	fprintf(stderr, "------------ [Round %d] ------------\n", ++round);
	RECV_AND_PRINT;
	RECV_AND_PRINT;

	res = 0;
	for (int i = 0; i < 31; ++i) {
		res ^= ask(query16(i)) << i;
	}
	res = judge16(res);
	for (int i = 0; i < 16; ++i) ans[i] = int((res >> i) & 1u);

	RECV_AND_PRINT;
	RECV_AND_PRINT;
	RECV_AND_PRINT;
	for (int i = 0; i < 16; ++i) {
		int o = ans[i];
		printf("%d%c", o, " \n"[i == 15]);
		fprintf(stderr, "%d%c", o, " \n"[i == 15]);
	}
	fflush(stdout);
	fflush(stderr);
	RECV_AND_PRINT;
	if (buf[3] == 'W' && buf[4] == 'r' && buf[5] == 'o') return -233;
	RECV_AND_PRINT;
	RECV_AND_PRINT;
	sscanf(buf, "%s", tmp);
	if (strcmp(tmp, "Sixteen") == 0) goto sixteen;
	else if (strcmp(tmp, "Seven") == 0) goto seven;
	else goto success;
seven:
	fprintf(stderr, "------------ [Round %d] ------------\n", ++round);
	RECV_AND_PRINT;
	RECV_AND_PRINT;

	res = 0;
	for (int i = 0; i < 15; ++i) {
		res ^= ask(query7(i)) << i;
	}
	res = judge7(res);
	for (int i = 0; i < 7; ++i) ans[i] = int((res >> i) & 1u);

	RECV_AND_PRINT;
	RECV_AND_PRINT;
	RECV_AND_PRINT;
	for (int i = 0; i < 7; ++i) {
		int o = ans[i];
		printf("%d%c", o, " \n"[i == 6]);
		fprintf(stderr, "%d%c", o, " \n"[i == 6]);
	}
	fflush(stdout);
	fflush(stderr);
	RECV_AND_PRINT;
	if (buf[3] == 'W' && buf[4] == 'r' && buf[5] == 'o') return -233;
	RECV_AND_PRINT;
	RECV_AND_PRINT;
	sscanf(buf, "%s", tmp);
	if (strcmp(tmp, "Sixteen") == 0) goto sixteen;
	else if (strcmp(tmp, "Seven") == 0) goto seven;
	success:
	RECV_AND_PRINT;
	RECV_AND_PRINT;
	RECV_AND_PRINT;
	RECV_AND_PRINT;
	return 0;
}