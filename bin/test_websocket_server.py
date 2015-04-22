# TODO: ADD LICENSE
#
# requires: autobahn, trollius(asyncio in python 2.x)
# pip install autobahn trollius --user(if non-root)

from autobahn.asyncio.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory

import json
import sys
import functools

try:
    import asyncio
except ImportError:
    # Trollius >= 0.3 was renamed
    import trollius as asyncio
    from trollius import From

class MyServerProtocol(WebSocketServerProtocol):
    @staticmethod
    def handleStdin(input):
        data = input.readline().strip()
        print("Queue.put: {}".format(data))
        asyncio.async(queue.put(data)) # Queue.put is a coroutine, so you can't call it directly.

    @staticmethod
    @asyncio.coroutine
    def sendLine():
        while True:
            line = yield From(queue.get())
            print("Queue.get: {}".format(line))
            for conn in CONNECTIONS:
                if not hasattr(conn, 'id'):
                    setattr(conn, 'id', 1)

                if not hasattr(conn, 'table_id') and not hasattr(conn, 'waitingTableId'):
                    msg = {'jsonrpc': '2.0', 'id': conn.id, 'method': 'create_table',
                           'params': line.split()}
                    setattr(conn, 'waitingTableId', True)
                else:
                    msg = {'jsonrpc': '2.0', 'id': conn.id, 'method': 'append_row',
                           'table_id': conn.table_id, 'params': line.split()}

                conn.id += 1
                conn.sendMessage(json.dumps(msg).encode('utf8'))
                print("Sending msg: {}".format(msg))


    def onConnect(self, request):
        print("Client connecting: {0}".format(request.peer))

    def onOpen(self):
        print("WebSocket connection open.")
        CONNECTIONS.append(self)
        loop = asyncio.get_event_loop()
        loop.add_reader(sys.stdin, functools.partial(MyServerProtocol.handleStdin, sys.stdin))

    def onMessage(self, payload, isBinary):
        print("Received: {}".format(payload))
        response = json.loads(payload)
        for socket in CONNECTIONS:
            if self.waitingTableId and response.has_key('table_id') and not response.has_key('length'):
                table_id = response['table_id']
                # CONNECTIONS[socket]['table_id'] = table_id
                if not hasattr(self, 'table_id'):
                    setattr(self, 'table_id', table_id)

        # echo back message verbatim
        # self.sendMessage(payload, isBinary)

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))
        CONNECTIONS.remove(self)

if __name__ == '__main__':
    # import logging
    # logging.basicConfig(level=logging.DEBUG)

    CONNECTIONS = []
    queue = asyncio.Queue()

    PORT = "7778"
    factory = WebSocketServerFactory("ws://localhost:{}".format(PORT), debug=False)
    factory.protocol = MyServerProtocol

    loop = asyncio.get_event_loop()
    # loop.add_reader(sys.stdin, functools.partial(handleStdin, sys.stdin))
    coro = loop.create_server(factory, '127.0.0.1', int(PORT))
    server = loop.run_until_complete(asyncio.wait(
        [coro, asyncio.async(MyServerProtocol.sendLine())]))

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.close()
        loop.close()
