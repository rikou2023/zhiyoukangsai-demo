from autowk.AutoWKListen import AutoWKListen
from autowk.AutoWkDriverClient import AutoWK
from autowk.AutoWKOptions import Options
from multiprocessing import Process
import time

def start_listen():
    listen = AutoWKListen(12980)
    listen.start()


if __name__ == '__main__':
    p = Process(target=start_listen, args=())
    p.start()

    options=Options(enableListen=True,networkListenPort=12980)
    client = AutoWK(options=options)
    client.create_session()
    client.navigate(r'https://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&dyTabStr=MCwxMiwzLDEsMiwxMyw3LDYsNSw5&word=pyth')

