#include<bits/stdc++.h>
using namespace std;
#define mem(a,b) memset(a,b,sizeof(a))
typedef long long LL;
typedef pair<int,int> PII;
#define X first
#define Y second
inline int read()
{
	int x=0,f=1;char c=getchar();
	while(!isdigit(c)){if(c=='-')f=-1;c=getchar();}
	while(isdigit(c)){x=x*10+c-'0';c=getchar();}
	return x*f;
}
const int maxn=800;
int n,m,a[maxn][maxn], dp[maxn][maxn]; 
int answer[maxn],rans[maxn];
void dfs(int step,int number,int last){
	if(step==-1)return;
	for(int i=0;i<m;i++)
	{
		if((i+1==last || i==last || i-1==last) && dp[step][i]+a[step+1][last]==number)
			answer[step]=i,dfs(step-1,dp[step][i],i);
	}
}
int have[10010],tag[maxn][maxn],flag,last,pos[maxn<<1],up[maxn<<1],len;
int new_ans,tmp_ans;
vector <int> V;
int main()
{
	freopen("data.txt","r",stdin);
	freopen("out.txt","w",stdout);
	m=750;
	n=read();
	for(int i=0;i<m;i++)
		for(int j=0;j<m;j++)
			a[i][j]=read();
	for(int i=0;i<m;i++)dp[0][i]=a[i][0];
	for(int i=1;i<m;i++)
		for(int j=0;j<m;j++) 
		{
			dp[i][j]=dp[i-1][j]+a[j][i];
			if(j>0)dp[i][j]=max(dp[i][j], dp[i-1][j-1]+a[j][i]);
			if(j<m-1)dp[i][j]=max(dp[i][j], dp[i-1][j+1]+a[j][i]);
		}
	int ans=0,now=0;
	for(int i=0;i<m;i++)ans=max(ans,dp[m-1][i]);
	for(int i=0;i<m;i++)if(ans==dp[m-1][i])now=i;
	answer[m-1]=now;
	for(int i=m-2;i>=0;i--)
	{
		last=answer[i+1];
		if(dp[i][last] + a[last][i+1] == dp[i+1][last])answer[i]=last;
		else if(last>0 && dp[i][last-1] + a[last][i+1] == dp[i+1][last])answer[i]=last-1;
		else if(last<m-1 && dp[i][last+1] + a[last][i+1] == dp[i+1][last])answer[i]=last+1;
	}
	for(int i=0;i<m-2;i++)
	{
		if(answer[i]==answer[i+2])
		{
			int target=a[answer[i+1]][i+1];
			if(target-a[answer[i]+1][i+1]>0 and target-a[answer[i]+1][i+1]<ans-n)
				V.push_back(target-a[answer[i]+1][i+1]),pos[len]=i+1,up[len++]=answer[i]+1;
			if(target-a[answer[i]-1][i+1]>0 and target-a[answer[i]-1][i+1]<ans-n)
				V.push_back(target-a[answer[i]-1][i+1]),pos[len]=i+1,up[len++]=answer[i]-1; 
			if(target-a[answer[i]][i+1]>0 and target-a[answer[i]][i+1]<ans-n)
				V.push_back(target-a[answer[i]][i+1]),pos[len]=i+1,up[len++]=answer[i];
		}
	}
	for(int i=0;i<V.size()-1 && !flag;i++)
		for(int j=i+1;j<V.size() && !flag;j++){
			int tmp = V[i]+V[j];
			if(tmp==ans-n){
				answer[pos[i]]=up[i];
				answer[pos[j]]=up[j];
				flag=1;
				break;
			}
		} 
	for(int i=0;i<m;i++)printf("%d ",answer[i]);
	return 0;
}
/*

*/


