var tail = require('tail').Tail;
var ws = require('nodejs-websocket');
var lineReader = require('line-reader');
var readline = require('readline');

var PORT = 7778;
var args = process.argv.slice(2);

var server = ws.createServer(function (conn) {
    var table_id;

    console.log("New connection");
    conn.on("text", function (str) {
        console.log("Received "+str);
        // conn.sendText(str.toUpperCase()+"!!!");
        var msg = JSON.parse(str);
        table_id = msg['table_id'];
    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    });

    var source = args[0] || 'tail_example';
    var id = 0;
    var name = 'MemInfo';
    // var table_id = 1;

    // 1. file name from process.argv
    // lineReader.eachLine(source, function(line) {
    //     console.log(line + ', id: ' + id);
    //     var msg;
    //     if (id == 0)
    //         msg = {'jsonrpc': '2.0',
    //                'id': id++,
    //                'method': 'create_table',
    //                'name': name, 'params': line.split(/\s+/)};
    //     else
    //         msg = {'jsonrpc': '2.0',
    //                'id': id++,
    //                'method': 'append_row',
    //                'table_id': table_id,
    //                'params': line.split(/\s+/)};
    //     conn.sendText(JSON.stringify(msg));
    // });
    // var tailReader = new tail(source);
    // tailReader.on("line", function(data) {
    //     var msg = {'jsonrpc': '2.0',
    //                'id': id++,
    //                'method': 'append_row',
    //                'table_id': table_id,
    //                'params': line.split(/\s+/)};

    //     conn.sendText(JSON.stringify(msg));
    //     console.log(data);
    // });

    // 2. from stdin
    var stdReader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    var pendings = [];

    function send(msg) {
        if (conn.readyState == conn.OPEN)
            conn.sendText(JSON.stringify(msg));
    }

    function append_row_msg(line, id, table_id) {
        return {'jsonrpc': '2.0',
               'id': id++,
               'method': 'append_row',
               'table_id': table_id,
               'params': line.trim().split(/\s+/)};
    }

    function create_table_msg(line, id) {
        return {'jsonrpc': '2.0',
               'id': id++,
               'method': 'create_table',
               'name': name, 'params': line.trim().split(/\s+/)};
    }

    var create_table_sent = false;
    stdReader.on('line', function(line) {
        if (!create_table_sent) {
            send(create_table_msg(line, id));
            create_table_sent = true;
            return;
        }
        if (table_id === undefined) {
            pendings.push(line);
        } else {
            if (pendings.length) {
                pendings.forEach(function(e, i, ar) {
                    send(append_row_msg(e, id, table_id));
                });
                pendings = [];
            }
            send(append_row_msg(line, id, table_id));
        }
    });

}).listen(PORT);
