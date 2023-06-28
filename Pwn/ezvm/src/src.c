#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

// Define the number of registers and the instruction set
#define NUM_REGS 16
#define HALT 0
#define LOAD 1
#define MOVE 2
#define ADD 3
#define SUB 4
#define MUL 5
#define DIV 6
#define XOR 7
#define JMP 8
#define IN 9
#define CMP 10
#define JNE 11
#define LOADM 12
#define OUT 13

// Define the virtual machine structure
typedef struct {
    int regs[NUM_REGS]; // The register array
    int *instr; // The instruction array
    int pc; // The program counter
    int flag; // The flag register
    unsigned char *mem; // The mem
} VM;

void init_vm(VM *vm, int *instr, int mem_size) {
    vm->instr = instr; // Set the instruction array
    vm->pc = 0; // Set the program counter to 0
    vm->flag = 0; // Set the flag register to 0
    vm->mem = malloc(sizeof(int) * mem_size); // Allocate memory for the mem
    memset(vm->mem, 0, mem_size);
}

void run_vm(VM *vm) {
    int opcode, reg1, reg2, reg3, imm, addr; // Declare variables for the opcode and the operands
    int running = 1; // Declare a variable for the running state
    while (running) { // Loop while running
        opcode = vm->instr[vm->pc]; // Fetch the opcode from the instruction array
        switch (opcode) { // Switch on the opcode
            case HALT: // If the opcode is HALT
                running = 0; // Set the running state to 0
                break; // Break the switch
            case LOAD: // If the opcode is LOAD
                reg1 = vm->instr[vm->pc + 1]; // Fetch the first register from the instruction array
                imm = vm->instr[vm->pc + 2]; // Fetch the immediate value from the instruction array
                vm->regs[reg1] = imm; // Load the immediate value into the first register
                vm->pc += 3; // Increment the program counter by 3
                break; // Break the switch
            case MOVE: // If the opcode is MOVE
                reg1 = vm->instr[vm->pc + 1]; // Fetch the first register from the instruction array
                reg2 = vm->instr[vm->pc + 2]; // Fetch the second register from the instruction array
                vm->regs[reg2] = vm->regs[reg1]; // MOVE the value of the first register into the second register
                vm->pc += 3; // Increment the program counter by 3
                break; // Break the switch
            case ADD: // If the opcode is ADD
                reg1 = vm->instr[vm->pc + 3]; // Fetch the first register from the instruction array
                reg2 = vm->instr[vm->pc + 2]; // Fetch the second register from the instruction array
                reg3 = vm->instr[vm->pc + 1]; // Fetch the third register from the instruction array
                vm->regs[reg3] = vm->regs[reg1] + vm->regs[reg2]; // Add the values of the first and second registers and store the result in the third register
                vm->pc += 4; // Increment the program counter by 4
                break; // Break the switch
            case SUB: // If the opcode is SUB
                reg1 = vm->instr[vm->pc + 3]; // Fetch the first register from the instruction array
                reg2 = vm->instr[vm->pc + 2]; // Fetch the second register from the instruction array
                reg3 = vm->instr[vm->pc + 1]; // Fetch the third register from the instruction array
                vm->regs[reg3] = vm->regs[reg1] - vm->regs[reg2]; // Subtract the value of the second register from the first register and store the result in the third register
                vm->pc += 4; // Increment the program counter by 4
                break; // Break the switch
            case MUL: // If the opcode is MUL
                reg1 = vm->instr[vm->pc + 3]; // Fetch the first register from the instruction array
                reg2 = vm->instr[vm->pc + 2]; // Fetch the second register from the instruction array
                reg3 = vm->instr[vm->pc + 1]; // Fetch the third register from the instruction array
                vm->regs[reg3] = vm->regs[reg1] * vm->regs[reg2]; // Multiply the values of the first and second registers and store the result in the third register
                vm->pc += 4; // Increment the program counter by 4
                break; // Break the switch
            case DIV: // If the opcode is DIV
                reg1 = vm->instr[vm->pc + 3]; // Fetch the first register from the instruction array
                reg2 = vm->instr[vm->pc + 2]; // Fetch the second register from the instruction array
                reg3 = vm->instr[vm->pc + 1]; // Fetch the third register from the instruction array
                vm->regs[reg3] = vm->regs[reg1] / vm->regs[reg2]; // Divide the value of the first register by the value of the second register and store the result in the third register
                vm->pc += 4; // Increment the program counter by 4
                break; // Break the switch
            case XOR: // If the opcode is XOR
                reg1 = vm->instr[vm->pc + 3]; // Fetch the first register from the instruction array
                reg2 = vm->instr[vm->pc + 2]; // Fetch the second register from the instruction array
                reg3 = vm->instr[vm->pc + 1]; // Fetch the third register from the instruction array
                vm->regs[reg3] = vm->regs[reg1] ^ vm->regs[reg2]; // XOR the values of the first and second registers and store the result in the third register
                vm->pc += 4; // Increment the program counter by 4
                break; // Break the switch
            case JMP: // If the opcode is JMP
                imm = vm->instr[vm->pc + 1]; // Fetch the immediate value from the instruction array
                vm->pc = imm; // Set the program counter to the immediate value
                break; // Break the switch
            case IN: // If the opcode is IN
                read(STDIN_FILENO, (char*)(vm->instr+vm->pc+1), 256); // Read a string from the standard input and store it in the memory starting from the address
                vm->pc += 1; // Increment the program counter by 2
                break; // Break the switch
            case CMP: // If the opcode is CMP
                reg1 = vm->instr[vm->pc + 1]; // Fetch the first register from the instruction array
                reg2 = vm->instr[vm->pc + 2]; // Fetch the second register from the instruction array
                vm->flag = vm->regs[reg1] == vm->regs[reg2]; // Compare the values of the first and second registers and store the result in the flag register
                vm->pc += 3; // Increment the program counter by 3
                break; // Break the switch
            case JNE:
                if(!vm->flag) 
                    vm->pc = vm->instr[vm->pc + 1];
                else vm->pc += 2;
                break;
            case LOADM:  // ld r1,[r2]
                reg1 = vm->instr[vm->pc + 1];
                reg2 = vm->instr[vm->pc + 2];
                addr = vm->regs[reg2];
                vm->regs[reg1] = vm->mem[addr];
                vm->pc += 3;
                break;
            case OUT:
                if(vm->instr[vm->pc + 1]){
                    printf("Please input your own opcodes:\n");
                }
                else{
                }
                vm->pc+=2;
                break;
            default: // If the opcode is invalid
                printf("Invalid opcode: %d\n", opcode); // Print an error message
                exit(1); // Exit the program with an error code
        }
    }
}

int prog[512] = {
    OUT, 1,
    IN, 0
};

void backdoor()
{
    asm volatile(
        "push $0"
    );
    system("/bin/sh");
}

int main()
{
    VM vm;
    init_vm(&vm,prog,256);
    run_vm(&vm);
}