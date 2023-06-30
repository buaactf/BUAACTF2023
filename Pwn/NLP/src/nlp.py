import random
import re
import string
import socketserver
import signal
# from secret import flag
flag = b'flag{R3gEx_Ma5t3r_4nd_Pwnt00ls_Exprt!}'
templates = [
    "诚邀有志者加入{company_name}，共创辉煌！发送简历至：{email}。了解更多：{url} 。如有疑问，请拨打联系电话：{phone}。我们提供优厚的薪资待遇：{salary}。工作时间：{time}。请关注面试日期：{date}。注意：面试时请携带有效证件，如：{id}。公司IP：{ip}。",
    "{company_name}欢迎您的加入！我们共同成长。请发送您的简历至：{email}。了解职位详情：{url} 。如需联系，请拨打：{phone}。工作时间：{time}。薪资待遇：{salary}。下次招聘日期：{date}。IP地址：{ip}。面试时，请务必携带证件，如：{id}。",
    "期待您的到来，共创未来！{company_name}诚邀您的加入。联系电话：{phone}。简历投递：{email}。了解职位信息：{url} 。我们为员工提供舒适的工作时间安排：{time}。薪资范围：{salary}。面试时间：{date}。IP地址：{ip}。身份证样例：{id}。",
    "我们期待您的加入，让我们一起迈向成功！欢迎加入{company_name}！联系电话：{phone}。投递简历至：{email}。了解更多职位信息：{url} 。工作安排：{time}。薪酬：{salary}。下次面试将于：{date}。您的IP地址：{ip}。面试时，请携带证件：{id}。",
    "我们诚挚地邀请您成为{company_name}的一员，共创美好未来！联系方式：{phone}。投递简历：{email}。详细信息：{url} 。工作时长：{time}。薪资待遇：{salary}。请关注下次面试时间：{date}。IP地址：{ip}。温馨提示：面试时需要您携带身份证：{id}。"
]

# 定义信息库
company_names = ["Google", "Microsoft", "Apple", "Amazon", "Facebook","BUAA","https","http","BUAA_School"]
phones = ["13812345678", "13798765432", "13987654321", "13123456789", "13634567890"]
emails = ["hr@google.com", "jobs@microsoft.com", "careers@apple.com", "work@amazon.com", "hr@facebook.com","2045@buaa.edu.cn","g2039+1@gmail.com"]
urls = ["https://www.google.com/jobs", "http://www.microsoft.com/hr", "http://www.apple.com/jobs", "https://www.amazon.com/", "https://www.facebook.com/jobs", "http://www.buaa.edu.cn/"]
times = ["9:00-18:00", "10:00-19:00", "8:00-17:00", "9:30-18:30", "8:30-17:30"]
salaries = ["10k-15k", "12k-18k", "15k-25k", "18k-30k", "20k-40k"]
dates = ["2023年4月1日", "2023年4月15日", "2023年5月1日", "2023年5月15日", "2023年6月1日"]
ips = ["192.168.1.1", "172.16.0.1", "10.0.0.1", "192.168.2.1", "172.16.1.1","255.255.255.255"]
ids = ['11010119941207234X', '11010220000510345X', '11010519950417456X', '11010619941112567X', '11010719990209678X', '110116199608087102', '110115200007103527', '110229199503233248', '110228199209026784', '110109199110177248', '110107200210016664']
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

class Task(socketserver.BaseRequestHandler):
    def _recvall(self):
        BUFF_SIZE = 1024
        data = b''
        while True:
            part = self.request.recv(BUFF_SIZE)
            data += part
            if len(part) < BUFF_SIZE:
                break
        return data.strip()
    
    def send(self, msg, newline=True):
        if newline:
            msg += b"\n"
        self.request.sendall(msg)
    
    def recv(self, prompt=b'[-]' ):
        self.send(prompt, newline=False)
        return self._recvall().decode()
    
    def testcalc(self):
        random.seed()
        for i in range(20):
            a = abs(random.randint(0, 3938))
            b = abs(random.randint(0, 3938))
            cal = random.randint(0, 2)
            self.send(f"round{i}\nnumberA = :{a}\nnumberB = :{b}".encode())
            if cal == 0:
                ans = int(self.recv(prompt=b"please tell me answer a + b: "))
                if ans == a + b:
                    self.send(b"right")
                else:
                    return False
            elif cal == 1:
                ans = int(self.recv(prompt=b"please tell me answer a * b: "))
                if ans == a * b:
                    self.send(b"right")

                else:
                     return False
            elif cal == 2:
                ans = int(self.recv(prompt=b"please tell me answer a - b: "))
                if ans == a - b:
                    self.send(b"right")
                else:
                      return False
        return True

    def testregexp(self):
        def generate_job_ad():
            template = random.choice(templates)
            job_ad = template.format(
                company_name=random.choice(company_names),
                phone=random.choice(phones),
                email=random.choice(emails),
                url=random.choice(urls),
                time=random.choice(times),
                salary=random.choice(salaries),
                date=random.choice(dates),
                ip=random.choice(ips),
                id=random.choice(ids)
            )
            return job_ad
        def get_id_info(id):
            region = region_dict.get(id[0:6])
            year = int(id[6:10])
            month = int(id[10:12])
            day = int(id[12:14])
            birthday = f'{year}年{month}月{day}日'
            gender_code = int(id[16:17])
            gender = gender_dict[str(gender_code % 2)]

            return f"{id} (地区: {region}, 生日: {birthday}, 性别: {gender})"

        # 处理招聘信息的函数
        def process_ad(ad):
            # 提取各类信息
            phones = phone_pattern.findall(ad)
            emails = email_pattern.findall(ad)
            urls = url_pattern.findall(ad)
            dates = date_pattern.findall(ad)
            ips = ip_pattern.findall(ad)
            ids = id_pattern.findall(ad)
            salaries = salary_pattern.findall(ad)
            times = time_pattern.findall(ad)

            # 获取身份证详细信息
            ids_info = [get_id_info(id) for id in ids]

            # 拼接成单行输出
            output = f"电话: {', '.join(phones)} | 邮箱: {', '.join(emails)} | URL: {', '.join(urls)} | 日期: {', '.join(dates)} | IP: {', '.join(ips)} | 身份证: {', '.join(ids_info)} | 薪资: {', '.join(salaries)} | 工作时间: {', '.join(times)}"
            return output

        # 生成样例并输出
        sample_ad = generate_job_ad()
        self.send(f"Sample Ad:\n{sample_ad}".encode())
        sample_output = process_ad(sample_ad)
        self.send(f"Sample Output:\n{sample_output}".encode())

        # 生成招聘信息并发送
        for i in range(20):
            ad = generate_job_ad()
            self.send(f"round{i}\nGenerated Ad:\n{ad}".encode())
            
            extracted_info = process_ad(ad)

            # 接收回复并比较
            ans = self.recv(prompt=b"Please extract the information and return it in the format: ")
            if ans == extracted_info:
                self.send(b"right")
            else:
                return False

        return True

      

    def handle(self):
            signal.alarm(40)
            if not self.testcalc():
                self.send(b"Wrong!")
                self.request.close()
                return
            if not self.testregexp():
                self.send(b"Wrong!")
                self.request.close()
                return
            self.send(flag)
            self.request.close()

class ThreadedServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass

class ForkedServer(socketserver.ForkingMixIn, socketserver.TCPServer):
    pass

if __name__ == '__main__':
    HOST, PORT = '0.0.0.0', 23004
    ForkedServer.allow_reuse_address = True
    server = ForkedServer((HOST, PORT), Task)
    server.allow_reuse_address = True
    server.serve_forever()
