// Webtable is to show tabular data in plot form as well as table.
// Copyright (C) 2015  Hyungchan Kim <inlinechan@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

jQuery.extend({
    WebTable: function() {
        var that = this;
        var listeners = new Array();
        var socket;
        var default_uri = "ws://localhost:7778";
        var table_next_id = 1;
        var tables = {};

        function send(msg) {
            if (socket && socket.readyState == socket.OPEN)
                socket.send(msg);
        };

        function onmessage(msg) {
            var request = JSON.parse(msg);
            var method = request['method'];
            var handlers = {'create_table' : handle_create_table,
                            'append_row' : handle_append_row};
            handlers[method](request);
            notifyMessage(msg);
        };

        this.append = onmessage;

        this.connect = function(uri) {
            try {
                socket = new WebSocket(uri || default_uri);
                socket.onmessage = function(event) {
                    onmessage(event.data);
                };

                socket.onopen = function(event) {
                    console.log("socket.onopen");
                    notifyOpen(event);
                };

                socket.onclose = function(event) {
                    console.log("socket.onclose");
                    notifyClose(event);
                };
            } catch (e) {
                console.log('failed to connect ' + uri);
                return;
            }
        };

        this.disconnect = function() {
            socket.close();
        };

        this.addListener = function(list) {
            listeners.push(list);
        };

        // --------------------------------------------------------------------------------
        function notifyOpen(event) {
            $.each(listeners, function(i, e) {
                e.onopen(event, socket);
            });
        };

        function notifyClose(event) {
            $.each(listeners, function(i, e) {
                e.onclose(event, socket);
            });
        };

        function notifyMessage(msg) {
            $.each(listeners, function(i, e) {
                e.onmessage(msg);
            });
        };

        function handle_create_table(request) {
            var r = request;
            if (r['method'] != 'create_table')
                return false;

            var table_id = table_next_id++;
            var table = new $.Table(table_id, r['name']);
            table.setHeader(r['params']);
            tables[table_id] = table;
            var response = {
                "jsonrpc": "2.0",
                "id": r['id'],
                "table_id": table_id
            };
            var msg = JSON.stringify(response);
            send(msg);
            return true;
        }

        function handle_append_row(request) {
            var r = request;
            if (r['method'] != 'append_row')
                return false;

            var table = tables[r['table_id']];
            table.append(r['params']);
            var response = {
                "jsonrpc": "2.0",
                "id": r['id'],
                "table_id": r['table_id'],
                "length": table.length()
            };
            var msg = JSON.stringify(response);
            send(msg);
            return true;
        }
    },
    WebTableListener: function(list) {
        if (!list) list = {};
        return $.extend({
            onopen : function(event, socket) {},
            onclose: function(event, socket) {},
            onmessage: function(msg) {}
        }, list);
    }
});
