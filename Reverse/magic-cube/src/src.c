#include<stdio.h>
#include<string.h>
#include<stdlib.h>
char maze[2][197] = {"S.#############..#############..##############################R..#############.#############..#########################################R..#############.#############..#############################","###############################R.#############..#############..#############################.R############..#############.#############.#############################.R############...############N."};
char flag[12];
FILE *fp = NULL;
int i = 0, steps = 0;
int lenth = 196;
int floor = 0;
int position = 0;
int ifsuccess = 1;
int k = 0;
void my_maze(){
	i = 0;
	steps = 0;
	while (i<strlen(flag))
  	{
		for ( k = 6; k >= 0; k -= 2)
		{
			switch ( (flag[i] >> k) & 3 )
			{
				case 0:
					if(maze[floor^1][position]==82)
						floor^=1;
					else {
						ifsuccess=0;
						break;
					}
					break;
				case 1:
					++position;
					break;
				case 2:
					position += 14;
					break;
				case 3:
					--position;
					break;
				default:
					break;
			}
			if ( maze[floor][position] == 35)
			{
				ifsuccess = 0;
				break;
			}
			if ( maze[floor][position] == 78 )
			{
				ifsuccess = 1;
				break;
			}
			++steps;
		}
    	++i;
  	}
	
	if(steps != 35){
		ifsuccess = 0;
	}
  	if(ifsuccess == 0)
  	{
		printf("Sorry!!!!!!!!!!!!!!!!!!!!");
  	}
  	else if(ifsuccess == 1){
  		printf("Congratulations!");
  	}
}
int main(){
	if ((fp = fopen("flag.txt", "r")) == NULL)
	{
    	printf("Error! opening file");
    	// 文件指针返回 NULL 则退出
    	exit(1);         
	}
	else
	{
		fgets(flag,12,fp);
	}
	my_maze();
}