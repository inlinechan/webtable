jQuery.extend({
    TableView: function($parent, table_id) {
        var that = this;
        var listeners = new Array();
        var id = table_id;

        var table = $("<table><thead><tr><th>Name</th><th>Address</th></tr></thead><tbody></tbody></table>").attr('id', 'table' + id).addClass('tableview');
        $parent.append(table);

        makeDraggable(table);

        function makeDraggable(obj) {
            obj.css('position', 'absolute');
            var dom_element = obj[0];

            dragObject(dom_element, dom_element);
        }

        this.setHeader = function(header) {
            var thead = $('#table'+id+' thead');
            var headerTR = "";
            $.each(header, function (index, value) {
                headerTR += "<th>" + value + "</th>";
            });
            thead.html(headerTR);
        };

        this.appendRow = function(items) {
            var table = $('#table'+id);
            var tr = $("<tr></tr>");
            var tds = '';
            $.each(items, function(index, value) {
                tds += '<td>' + value + '</td>';
            });
            tr.append(tds);
            table.append(tr);
        };
    }
});
