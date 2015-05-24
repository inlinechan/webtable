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
    TableView: function($parent, table_id) {
        var that = this;
        var listeners = new Array();
        var id = table_id;
        var lines = 1;

        var table = $("<table><thead></thead><tbody></tbody></table>").attr('id', 'table' + id).addClass('tableview');

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
    }
});
