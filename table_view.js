jQuery.extend({
    TableView: function($parent, table_id) {
        var that = this;
        var listeners = new Array();
        var id = table_id;
        var lines = 1;

        var table = $("<table><thead></thead><tbody></tbody></table>").attr('id', 'table' + id).addClass('tableview');
        table.dblclick(function() {
            console.log("table(" + table.attr('id') + ") dbl clicked");
            that.notifyDblClick();
        });

        this.id = function() {
            return id;
        };

        this.view = function() {
            return table;
        };

        this.setHeader = function(header) {
            var thead = $('#table'+id+' thead');
            var headerTR = '';
            var header_cloned = header.slice();
            header_cloned.splice(0, 0, "No");
            $.each(header_cloned, function (index, value) {
                headerTR += "<th>" + value + "</th>";
            });
            thead.html(headerTR);
        };

        this.appendRow = function(items) {
            var table = $('#table'+id);
            var tr = $("<tr></tr>");
            var tds = '';
            var items_cloned = items.slice();
            items_cloned.splice(0, 0, lines++);
            $.each(items_cloned, function(index, value) {
                tds += '<td>' + value + '</td>';
            });
            tr.append(tds);
            table.append(tr);
        };

        this.addListener = function(list) {
            listeners.push(list);
        };

        this.notifyDblClick = function() {
            $.each(listeners, function(i) {
                listeners[i].dblclick();
            });
        };
    },
    TableViewListener: function(list) {
        if (!list) list = {};
        return $.extend({
            dblclick: function() {}
        }, list);
    }
});
