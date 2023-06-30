n = 750
flag = b'BUAACTF{C0nfu5ing_RoVV5_4nd_C01umns_1n_m@Z3q4Me}'

def gen_matrix(n):
    rd = __import__('numpy').random.RandomState(int(__import__('time').time()))
    return rd.randint(0, 10000, (n, n))


def DP(n, mat,tr=0):# 0 Vertical ,1 Horizontal
    dp = []
    for i in range(n):
        dp.append([0] * n)
    for i in range(n):
        dp[0][i] = mat[i][0] if tr else mat[0][i]
    for i in range(1, n):
        for j in range(n):
            dp[i][j] = dp[i-1][j] + mat[j][i] if tr else dp[i-1][j] + mat[i][j]
            if j > 0: 
                dp[i][j] = max(dp[i][j], dp[i-1][j-1] + mat[j][i]) if tr else max(dp[i][j], dp[i-1][j-1] + mat[i][j])
            if j < n - 1:
                dp[i][j] = max(dp[i][j], dp[i-1][j+1] + mat[j][i]) if tr else max(dp[i][j], dp[i-1][j+1] + mat[i][j])
    return max(dp[n - 1])


def callback():
    while True:
        matrix = gen_matrix(n)
        heng, shu = DP(n, matrix, 1), DP(n, matrix, 0)
        if heng >= shu:
            print(shu, heng-shu)
            return matrix, shu
        
if __name__ == '__main__':
    callback()
