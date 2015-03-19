jQuery.extend({
    WebTable: function() {
        var that = this;
        var listeners = new Array();
        var socket;
        var default_uri = "ws://localhost:7778";
        var table_next_id = 1;
        var tables = {};

        function send(msg) {
            if (socket.readyState == socket.OPEN)
                socket.send(msg);
        };

        this.connect = function(uri) {
            try {
                socket = new WebSocket(uri || default_uri);
                socket.onmessage = function(event) {
                    console.log("onmessage: " + event.data);
                    request = JSON.parse(event.data);
                    var handlers = new Array();
                    handlers.push(handle_create_table,
                                  handle_append_row);
                    var handled = false;
                    handlers.forEach(function(element, index, list) {
                        if (handled)
                            return;
                        handled = element(request);
                    });
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
            $.each(listeners, function(i) {
                listeners[i].onopen(event, socket);
            });
        };

        function notifyClose(event) {
            $.each(listeners, function(i) {
                listeners[i].onclose(event, socket);
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
            console.log("table created: " + table_id);
            var response = {
                "jsonrpc": "2.0",
                "id": r['id'],
                "table_id": table_id
            };
            var msg = JSON.stringify(response);
            console.log("handle_create_table: " + msg);
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
            console.log("handle_append_row: " + msg);
            send(msg);
            return true;
        }
    },
    WebTableListener: function(list) {
        if (!list) list = {};
        return $.extend({
            onopen : function() {},
            onclose: function() {}
        }, list);
    }
});