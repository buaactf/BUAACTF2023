#define _CRT_SECURE_NO_WARNINGS 1
#include<stdio.h>
#include<stdlib.h>
#include<time.h>
#include<string.h>
#define rows 7
#define cols 7
char mine[7][8] = {"aabbaab","abbabaa","abababb","aaaabbb","aababab","aaabbab","abbbaab"};
int HP = 88;
char result[15] = {"vahii_Ts_nice!"};
//菜单函数
int menu()
{
	printf("********************************************\n");
	printf("********************************************\n");
	printf("*************welcome  to saolei*************\n");
	printf("*************   1.      play   *************\n");
	printf("*************   0.      exit   *************\n");
	printf("********************************************\n");
	printf("********************************************\n");
	return 0;
}
 
 
//设置雷的位置
//打印下棋完了显示的界面
void display()  
{
	int i = 0;
	int j = 0;
	for (i = 0; i < rows; i++)
	{
		for (j = 0; j < cols; j++)
		{
			printf(" %c", mine[i][j]);
		}
		printf("\n");
	}
}
 
//计算雷的个数
int get_num(int x, int y)
{
	int count = 0;
	if (mine[x - 1][y - 1] == 'a')//左上方
	{
		count++;
	}
	if (mine[x - 1][y] == 'a')//左边
	{
		count++;
	}
	if (mine[x - 1][y + 1] == 'a')//左下方
	{
		count++;
	}
	if (mine[x][y - 1] == 'a')//上方
	{
		count++;
	}
	if (mine[x][y + 1] == 'a')//下方
	{
		count++;
	}
	if (mine[x + 1][y - 1] == 'a')//右上方
	{
		count++;
	}
	if (mine[x + 1][y] == 'a')//右方
	{
		count++;
	}
	if (mine[x + 1][y + 1] == 'a')//右下方
	{
		count++;
	}
	return  count;
}
//扫雷
int Sweep(char show[rows][cols])
{
	int x = 0;
	int y = 0;
	printf("请输入坐标：");
	scanf("%d %d",&x,&y);
	x = 0;
	y = 0;
	HP--;
	while (1)
	{
		if(y==6){
			x++;
			y = 0;
		}
		else{
			y++;
		}
		if(x>=7){
			break;
		}
		if (!HP)
		{
			printf("你踩到雷了！\n");
			return 0;
		}
		else
		{
			int ret = get_num(x, y);
			show[x][y] = ret + '0';
			//set_mine(mine);
			mine[x][y] += ret;
			//display(mine);
		}
	}
	printf("恭喜你赢得了扫雷！继续解密吧\n");
	display();
	return 0;
}
 
 
//游戏
int Game(char show[rows][cols])
{
//	set_mine(mine);
	//display(show);
	//display(mine);//可以将雷的位置显示出来
	Sweep(show);
	return 0;
}

void encrypt(char s[]) //Hill加密算法
{
	int i = 0;
	int j = 0;
	int k = 0;
	for(k=0;k<strlen(s)-7;k++){
		if('a'<=s[k]&&s[k]<='z'){
			int temp = 0;
			for(i = 0;i<7;i++){
				for(j = 0;j<7;j++){
					temp += (s[k+i+1]-'a')^(mine[i][j]-'a');
				}
			}
			printf("%d",temp);
			s[k] = (((s[k]-'a')^temp%26)+'a');	
		}
	}
}
int main()
{
	int input = 0;
	char show[rows][cols];
	int i = 0;
	int j = 0;
	char flag[15];
	for (i = 0; i < rows ; i++)
	{
		for (j = 0; j < cols ; j++)
		{
			show[i][j] = '*';
		}
	}
	menu();
	while (1)
	{
		printf("请选择:");
		scanf("%d", &input);
		if (input == 1)
		{
			printf("进入游戏\n");
			Game(show);
			break;
		}
		else if (input == 0)
		{
			printf("退出游戏！\n");
			exit(0);
			break;
		}
		else
		{
			printf("输入有误！\n");
		}
	}
	scanf("%s",flag);
	if(strlen(flag)!=14){
		printf("Wrong lenth!");
	}
	else{
		encrypt(flag);
		if(strcmp(flag,result)==0){
			printf("Succeed!!!!!");
		}
	}
	return 0;
}