#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

//gcc -fno-stack-protector -no-pie pirate.c -o pirate  

void backdoor()
{
    system("/bin/sh");
}

void trade()
{
    char s[8];
    puts("Now you can give all of your gold coins to me, and say something.");
    read(0,s,0x20);
}

int main()
{
    setvbuf(stdin, 0, 2, 0);
    setvbuf(stdout, 0, 2, 0);
    int m=0,n=0;
    srand(time(NULL));
    while(m<1 || n<1)
    {
        m=rand()%1000;
        n=rand()%(2*m);
    }
    printf("Boom~! You are a pirate, and now you and %d other pirates have %d gold coins.\n",n-1,m);
    puts("You need to divide the coins according to the following rules:\n");
	printf("1. Pirates are numbered from 1 to %d, and everyone can propose how to divide these gold coins.\n",n);
    puts("2. Each pirate, including the proposer, can vote on the proposal.");
    puts("   If 50% or more pirates support the proposal, it is passed and executed immediately.");
    puts("   Otherwise, the proposer will be thrown to the sharks.");
    puts("3. If the proposal is not passed, the next pirate proposes a new one and going on.");
    puts("4. All pirates are intelligent and know that all other pirates are intelligent too.");
    puts("5. The gold coins are indivisible and cannot be shared.");
    puts("6. For pirates, staying alive > get more gold coins > killing others.");
    puts("7. Pirates do not like taking risks.\n");
    puts("Congratulations!~ You are No.1, now you can give me your proposal:\n");
    int num=m,i; 
    int pirate[2001];
    int joinNum;
    int poke[2001];
    int ticket;
    for(i=1;i<=n;i++)
    {
        int tmp=-1;
        do
        {
            printf("How many coins you will give to pirate No.%d:",i);
            scanf("%d",&tmp);
            if(tmp>num || tmp<0)
                puts("Invalid number!");
        }
        while(tmp>num || tmp<0);
        pirate[i]=tmp;
        num-=tmp;
    }
    int pirates=n,gold=m;
    for(i=pirates;i>=1;i--){
    	joinNum=pirates-i+1; 
    	ticket=0;
    	int j;
    	for(j=pirates;j>=i;j--)
      	{
        	if((pirates-j+1)==joinNum) 
        	{
          		poke[j]=gold;    
          		gold=gold-poke[j];
          		ticket=ticket+1;
        	}
        	else
        	{
          		if(poke[j]>0)  
          		{
            		gold=gold+poke[j];
            		poke[j]=0;
          		}
          		else
          		{
            		poke[j]=1;  
            		gold=gold-1;
            		ticket=ticket+1;
          		}
        	}
      	}
      	if((double)ticket/(double)joinNum<0.5){ break;} 
    }
	for(i=1;i<=n;i++)
	{
		if(poke[i]!=pirate[i])
		{
			printf("Oops!~ You are not a nice pirate.");
			return 0;
		}
	}
	printf("Wow!~~~ You are really a intelligent pirate! You get %d gold coins!!!\n",pirate[1]);
   	trade();
    return 0;
}
