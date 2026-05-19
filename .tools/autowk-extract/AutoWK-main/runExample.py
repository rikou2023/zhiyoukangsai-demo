from autowk.AutoWkDriverClient import AutoWK
from autowk.AutoWKOptions import Options
import time

options=Options(userAgent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/605.1.15 (KHTML, like Gecko)',
                headless=False)

client = AutoWK(options=options)
client.create_session()

print("[STATUS]", client.status())

client.set_timeouts({"pageLoad": 50000})
print("[GET TIMEOUTS]", client.get_timeouts())

client.navigate(r'https://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&dyTabStr=MCwxMiwzLDEsMiwxMyw3LDYsNSw5&word=pyth')
print('测试全屏幕长图截图')
time.sleep(3)
client.take_screenshot()

