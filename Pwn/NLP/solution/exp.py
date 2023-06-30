from pwn import *
import re

phone_pattern = re.compile(r'\b\d{11}\b')  
email_pattern = re.compile(r'[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}')
url_pattern = re.compile(r'https?://\S+')
date_pattern = re.compile(r'\d{4}年\d{1,2}月\d{1,2}日')
ip_pattern = re.compile(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')  
id_pattern = re.compile(r'110\d{14}[0-9X]') 
salary_pattern = re.compile(r'\d+k-\d+k')
time_pattern = re.compile(r'\d{1,2}:\d{1,2}-\d{1,2}:\d{1,2}')
region_dict = {
    '110101': '东城区',
    '110102': '西城区',
    '110105': '朝阳区',
    '110106': '丰台区',
    '110107': '石景山区',
    '110108': '海淀区',
    '110109': '门头沟区',
    '110111': '房山区',
    '110112': '通州区',
    '110113': '顺义区',
    '110114': '昌平区',
    '110115': '大兴区',
    '110116': '怀柔区',
    '110117': '平谷区',
    '110228': '密云区',
    '110229': '延庆区'
}
gender_dict = {
    '0': '女',
    '1': '男'
}


def get_id_info(id):

    region = region_dict.get(id[0:6])

    year = int(id[6:10])
    month = int(id[10:12])
    day = int(id[12:14])
    birthday = f'{year}年{month}月{day}日'

    gender_code = int(id[16:17])
    gender = gender_dict[str(gender_code % 2)]

    return f"{id} (地区: {region}, 生日: {birthday}, 性别: {gender})"


def process_ad(ad):

    phones = phone_pattern.findall(ad)
    emails = email_pattern.findall(ad)
    urls = url_pattern.findall(ad)
    dates = date_pattern.findall(ad)
    ips = ip_pattern.findall(ad)
    ids = id_pattern.findall(ad)
    salaries = salary_pattern.findall(ad)
    times = time_pattern.findall(ad)


    ids_info = [get_id_info(id) for id in ids]


    output = f"电话: {', '.join(phones)} | 邮箱: {', '.join(emails)} | URL: {', '.join(urls)} | 日期: {', '.join(dates)} | IP: {', '.join(ips)} | 身份证: {', '.join(ids_info)} | 薪资: {', '.join(salaries)} | 工作时间: {', '.join(times)}"
    return output

context.arch = 'amd64'
context.os = 'linux'
context.log_level = 'debug'
conn = remote('127.0.0.1', 23335)
for i in range(20):
    conn.recvuntil(b"round")
    conn.recvline()
    a = int(re.search(b'numberA = :(\d+)', conn.recvline()).group(1))
    b = int(re.search(b'numberB = :(\d+)', conn.recvline()).group(1))
    getline=conn.recvuntil(b": ")
    if b"please tell me answer a + b: " in getline:
        conn.sendline(str(a + b))
    elif b"please tell me answer a * b: " in getline:
        conn.sendline(str(a * b))
    elif b"please tell me answer a - b: " in getline:
        conn.sendline(str(a - b))
# conn.interactive()
for i in range(20):
    conn.recvuntil(b"round")
    ad = conn.recvuntil(b"Generated Ad:\n").decode()
    ad = conn.recvuntil(b"\n", drop=True).decode()


    extracted_info = process_ad(ad)


    conn.sendline(extracted_info)
conn.interactive()