#include <stdio.h>
#include <stdlib.h>

void set_init_rand()
{
    FILE *stream; 
    int j; 
    int i; 
    unsigned int seed; 

    seed = 0;
    stream = fopen("/dev/urandom", "r");
    for ( i = 0; i <= 7; ++i )
    {
        seed += fgetc(stream);
        if ( i != 7 )
        seed <<= 8;
    }
    fclose(stream);
    srand(seed);

}

unsigned int get_rand()
{
    return (unsigned int)(rand() >> 15);
}

char s[100]={0};

int main()
{
    setvbuf(stdin, 0LL, 2, 0LL);
    setvbuf(stdout, 0LL, 2, 0LL);
    setvbuf(stderr, 0LL, 2, 0LL);

    puts("Guess what I think, and I'll tell you what I know!");
    puts("Acceptable range is 20 points.");
    puts("2000 points IN, 0 points OUT.");

    set_init_rand();
    int score = 1000;
    int random_number, guessed_number;
    int decreasement = 1, increasement = 1;
    while(1){
        printf("Your current score: %d\n", score);
        if(score >= 2000) break;
        if(score <= 0) {
            puts("Bye bye.");
            return 1;
        }
        random_number = get_rand();
        puts("Now guess!");
        scanf("%d", &guessed_number);
        if(guessed_number > random_number - 20 && guessed_number < random_number + 20)
        {
            printf("Yes you are right! Go on!\n");
            score += increasement++;
        }
        else 
        {
            printf("Wrong! The number in my mind is %d\n", random_number);
            score -= decreasement++;
        }
        puts("");
    }
    puts("You make it! This is what you deserve:\n");
    FILE* flag = fopen("./flag", "r");
    fscanf(flag, "%s", s);

    printf("%s",s);
}