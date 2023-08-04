#!/bin/sh
if [ ! -f "sd.bin" ]; then
dd if=/dev/zero of=sd.bin bs=1024 count=65536
fi

qemu-system-aarch64 -M virt,gic-version=2 -cpu cortex-a53 -m 128M -smp 4 -kernel rtthread.bin -nographic -drive if=none,file=sd.bin,format=raw,id=blk0 -monitor /dev/null

