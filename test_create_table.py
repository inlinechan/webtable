#!/usr/bin/env python3

import asyncio
import json
import websockets

@asyncio.coroutine
def producer():
    r = [({'jsonrpc': '2.0', 'id': 1, 'method': 'create_table', 'params': ['timestamp', 'process_name', 'RSS']}, {'jsonrpc': '2.0', 'id': 1, 'table_id': 1}),
         ({'jsonrpc': '2.0', 'id': 2, 'method': 'append_row', 'table_id': 1, 'params': ["123456789", "Chrome", "54321"]}, {"jsonrpc": "2.0", "id": 2, "table_id": 1, "length": 1})]
    for item in r:
        yield(item)

@asyncio.coroutine
def handler(websocket, path):
    for job in producer():
        request, expected_response = job
        print("request: {}".format(request))
        print("expected_response: {}".format(expected_response))
        yield from websocket.send(json.dumps(request))
        response = yield from websocket.recv()
        print("response: {}".format(json.loads(response)))

start_server = websockets.serve(handler, 'localhost', 7778)
print("listening on port {}".format(7778))
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
