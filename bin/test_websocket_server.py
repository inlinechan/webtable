# Webtable is to show tabular data in plot form as well as table.
# Copyright (C) 2015  Hyungchan Kim <inlinechan@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


# Requires: autobahn, trollius(asyncio in python 2.x)
# pip install autobahn trollius --user(if non-root)

from autobahn.asyncio.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory

import functools
import json
import re
import sys

try:
    import asyncio
except ImportError:
    # Trollius >= 0.3 was renamed
    import trollius as asyncio
    from trollius import From


class MyServerProtocol(WebSocketServerProtocol):
    @staticmethod
    def handleStdin(server, stream):
        line = stream.readline().strip()
        if re.match(r'^\s*$', line):
            loop = asyncio.get_event_loop()
            loop.remove_reader(sys.stdin)
            server.close()
            loop.close()
            return

        print("Queue.put: {}".format(line))
        asyncio.async(queue.put(line)) # Queue.put is a coroutine, so you can't call it directly.

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
        loop.add_reader(sys.stdin, functools.partial(MyServerProtocol.handleStdin, self, sys.stdin))

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

    port="7778"
    if len(sys.argv) == 2:
        port = sys.argv[1]

    CONNECTIONS = []
    queue = asyncio.Queue()

    factory = WebSocketServerFactory("ws://localhost:{}".format(port), debug=False)
    factory.protocol = MyServerProtocol

    loop = asyncio.get_event_loop()
    # loop.add_reader(sys.stdin, functools.partial(handleStdin, sys.stdin))
    coro = loop.create_server(factory, '127.0.0.1', int(port))
    server = loop.run_until_complete(asyncio.wait(
        [coro, asyncio.async(MyServerProtocol.sendLine())]))

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.close()
        loop.close()
