#!/usr/bin/env python3

import asyncio
import json
import websockets

@asyncio.coroutine
def producer():
    table_id = 1
    r = [({'jsonrpc': '2.0', 'id': 1, 'method': 'create_table', 'params': ['Timestamp', 'Process Name', 'RSS']}, {'jsonrpc': '2.0', 'id': 1, 'table_id': table_id}),
         ({'jsonrpc': '2.0', 'id': 2, 'method': 'append_row', 'table_id': table_id, 'params': ["123456789", "Chrome", "54321"]}, {"jsonrpc": "2.0", "id": 2, "table_id": 1, "length": 1}),
         ({'jsonrpc': '2.0', 'id': 3, 'method': 'append_row', 'table_id': table_id, 'params': ["123490000", "Chrome", "54321"]}, {"jsonrpc": "2.0", "id": 3, "table_id": 1, "length": 2}),
         ({'jsonrpc': '2.0', 'id': 3, 'method': 'append_row', 'table_id': table_id, 'params': ["123500000", "Chrome", "54321"]}, {"jsonrpc": "2.0", "id": 4, "table_id": 1, "length": 3})]
    for item in r:
        yield(item)

    table_id += 1
    r = [({'jsonrpc': '2.0', 'id': 1, 'method': 'create_table', 'params': ['Name', 'Mobile', 'Location']}, {'jsonrpc': '2.0', 'id': 1, 'table_id': table_id}),
         ({'jsonrpc': '2.0', 'id': 2, 'method': 'append_row', 'table_id': table_id, 'params': ["James", "010-1212-3434", "Chicago"]}, {"jsonrpc": "2.0", "id": 2, "table_id": 2, "length": 1}),
         ({'jsonrpc': '2.0', 'id': 3, 'method': 'append_row', 'table_id': table_id, 'params': ["Tony", "010-2222-8737", "Seoul"]}, {"jsonrpc": "2.0", "id": 3, "table_id": 2, "length": 2}),
         ({'jsonrpc': '2.0', 'id': 3, 'method': 'append_row', 'table_id': table_id, 'params': ["Jack", "010-9999-1111", "Boston"]}, {"jsonrpc": "2.0", "id": 4, "table_id": 2, "length": 3})]
    for item in r:
        yield(item)

import random
import time

@asyncio.coroutine
def highchart_producer():
    table_id = 1
    name = 'Temperature'
    yield ({'jsonrpc': '2.0', 'id': 1, 'method': 'create_table', 'name': name, 'params': ['Iteration', 'Temperature']}, {'jsonrpc': '2.0', 'id': 1, 'table_id': table_id})
    r = ({'jsonrpc': '2.0', 'id': 1, 'method': 'append_row', 'table_id': table_id, 'params': ['1', 24]}, {"jsonrpc": "2.0", "id": 1, "table_id": table_id, "length": 1})
    table_id = 2
    yield ({'jsonrpc': '2.0', 'id': 1, 'method': 'create_table', 'name': name, 'params': ['Iteration', 'Temperature']}, {'jsonrpc': '2.0', 'id': 1, 'table_id': table_id})
    r = ({'jsonrpc': '2.0', 'id': 1, 'method': 'append_row', 'table_id': table_id, 'params': ['1', 24]}, {"jsonrpc": "2.0", "id": 1, "table_id": table_id, "length": 1})
    for ID in range(2, 100):
        req, res = r
        req['params'] = [str(ID), random.randint(-10, 40)]
        req['id'] = ID
        req['table_id'] = random.randint(1, 2)
        time.sleep(1)
        yield(r)

@asyncio.coroutine
def handler(websocket, path):
    for job in highchart_producer():
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
