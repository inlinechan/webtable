#!/usr/bin/env python3

import asyncio
import json
import random
import sys
import time
import websockets

PORT   = 7778
SLEEP  = 1
TITLE  = 'MemInfo'
USE_NO = False

@asyncio.coroutine
def stdin_producer():
    table_id = 1
    name = TITLE
    param = sys.stdin.readline()
    column_header = ['No'] if USE_NO else []
    column_header += param.split()
    yield {'jsonrpc': '2.0', 'id': 1, 'method': 'create_table', 'name': name, 'params': column_header}
    req = {'jsonrpc': '2.0', 'id': 0, 'method': 'append_row', 'table_id': table_id, 'params': ['0', 0]}
    for id0, param in enumerate(sys.stdin):
        seq = id0 + 1
        id = seq + 1
        no = [str(seq)] if USE_NO else []
        req['params'] = no + [int(v) for v in param.split()]
        req['id'] = seq
        req['table_id'] = table_id
        yield(req)
        if SLEEP > 0:
            time.sleep(SLEEP)

@asyncio.coroutine
def handler(websocket, path):
    for request in stdin_producer():
        print("request : {}".format(request))
        yield from websocket.send(json.dumps(request))
        response = yield from websocket.recv()
        print("response: {}".format(json.loads(response)))

def main():
    port = PORT
    start_server = websockets.serve(handler, 'localhost', port)
    print("listening on port {}".format(port))
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()
