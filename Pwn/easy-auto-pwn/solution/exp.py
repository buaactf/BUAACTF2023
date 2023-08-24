from pwn import *

#base64 -d
#tar -xvf
#upx -d
# p = process("./pwn")
p = remote("39.107.108.120", 36774)
# elf = ELF("./pwn")
# raw = elf.read(0x400000,0x36f00)
# start1= "\x55\x48\x89\xe5\x8b\x05"
# start2= "\x55\x48\x89\xe5\x48\x81"
# function_list = []
# offset = raw.find(start1)
# while offset != -1:
#     function_list.append(offset+0x400000)
#     offset = raw.find(start1,offset+1)
# magic = raw.find(start2,offset+1)+0x400000
# next_calls=[]
# function={}
# for i in function_list:
#     func_id_address=i+0x13
#     function_id=0
#     num=0
#     if elf.data[func_id_address-0x400000:func_id_address-0x400000+2]=="\x85\xc0":
#          function_id=0
#          num=0x5c
#     elif elf.data[func_id_address-0x400000]=="\x3d":
#          function_id=u32(elf.data[func_id_address-0x400000+1:func_id_address-0x400000+4+1])
#          num=0x5f
#     else:
#          function_id=u32(elf.data[func_id_address-0x400000+2]+"\x00\x00\x00")   
#          num=0x5d   
#     function[function_id]=i
#     call_func=[]
#     for j in range(11):
#           call_asm=i+num+j*0xc
#           tmp=u32(elf.data[call_asm-0x400000+1:call_asm-0x400000+4+1])
#           tmp_addr=call_asm+5
#           if tmp>0x80000000:
#               tmp=tmp-0x100000000
#           next_func=call_asm+5+tmp
#           call_func.append(next_func)
#     next_calls.append(call_func)
# print next_calls
# ans=""
# for i in range(999):
#       current=function[i]
#       next=function[i+1]
#       ans+=str(next_calls[function_list.index(current)].index(next))
# ans+=str(next_calls[function_list.index(function[999])].index(magic))
# print ans

p.sendline(str(5642460770963085094263401006427226829824582648788972201687858596715764335873388505294553734415906820856685793867330464199188121660361594459266801634437725223305747333964063836221118617713973323087720089375299389031532671868683780981031731935996756825573772579463061725706333478408182656978574579973718380185650569294353041146262112140275573058539788078859479036709722507526119823691777908279452929141519092731592295973279954603974037860646900438648325631513292829589191867666573581406911452044279144710140044322291755989935450575934073873712815842124123493591061204373380095898340907469300409228519122074828549956626166035706722457669001506860895909587157837327607853233247164576750761862868365100337782901439502649554358765659299839991676541686432618735090040578275693744848979816168549677442520912859807250604061432264043915937134496012629857998064927460081555363609148473222492560051972133682084275782560892776105040156685553266429040684058854193541606205215023744883523412050746444226589612403429))

p.interactive()