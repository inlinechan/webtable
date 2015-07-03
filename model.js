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
    Model: function(name) {
        var that = this;
        var listeners = new Array();
        var data = new Array();
        var _header;
        var _name;

        that._name = name;

        // Return cloned data
        this.data = function() {
            return data.slice();
        };

        this.name = function(newName) {
            if (newName != null) {
                that._name = newName;
                return that;
            } else {
                return that._name;
            }
        };

        this.append = function(arr) {
            data.push(arr);
            that.notifyItemAppended(arr);
        };

        this.addListener = function(list) {
            listeners.push(list);
        };

        this.notifyItemAppended = function(item) {
            $.each(listeners, function(i, e) {
                e.appendItem(item);
            });
        };
        this.notifyNameChanged = function(name) {
            $.each(listeners, function(i, e) {
                e.nameChanged(name);
            });
        };
        this.length = function() {
            return data.length;
        };
        this.setHeader = function(header) {
            that._header = header;
        };
        this.header = function() {
            return that._header;
        };
    },
    ModelListener: function(list) {
        if (!list) list = {};
        return $.extend({
            appendItem : function(item) {},
            nameChanged: function(name) {}
        }, list);
    }
});
