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
    TableController: function(model, view) {
        var that = this;

        var mlist = $.ModelListener({
            appendItem: function(item) {
                view.appendRow(item);
            }
        });

        model.addListener(mlist);

        this.addView = function(view) {
            var mlist = $.ModelListener({
                appendItem: function(item) {
                    view.appendRow(item);
                }
            });

            model.addListener(mlist);
        };
    }
});
