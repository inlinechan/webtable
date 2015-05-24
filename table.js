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
    Table: function(table_id, name, container) {
        var that = this;
        var id = table_id;

        var model = new $.Model(name);
        var view = new $.TableView(null, id, name);
        var frame = new $.FrameView($(container || '#table_container'), id, name, view.view());
        var controller = new $.TableController(model, view);

        ////////////////////////////////////////////////////////////////////////////////
        // context menu
        var items = {
            "AddPlot": {name: "AddPlot", icon: "add"}
        };
        frame.addContextMenu(null, function() {
            var data = model.data();
            var plotId = 'plot' + view.id();

            if ($('#' + plotId).length) {
                console.log('#' + plotId + "is already exist");
                return;
            }

            var title = model.name();
            var plot = $("<div></div>").attr('id', plotId);
            var container = new $.FrameView($('#plot_container'), plotId, title, plot);
            var highchartView = new $.HighchartView('#' + plotId, data, {
                'title': model.name(),
                'header': model.header()
            });
            controller.addView(highchartView);
            var frameViewListener = $.FrameViewListener({
                resize: function(w, h) {
                    highchartView.resize(w, h);
                },
                titleChanged: function(title) {
                    highchartView.setTitle(title);
                }
            });
            container.addListener(frameViewListener);
        }, items);

        var frameViewListener = $.FrameViewListener({
            titleChanged: function(title) {
                model.name(title);
            }
        });
        frame.addListener(frameViewListener);

        this.setHeader = function(header) {
            model.setHeader(header);
            view.setHeader(header);
        };

        this.length = function() {
            model.length();
        };

        this.append = function(row) {
            model.append(row);

            // http://stackoverflow.com/a/11715670/2229134
            // Scroll to the bottom: HARD CODED
            var $parent = view.view().parent();
            $parent.stop();
            $parent.animate({scrollTop: $parent[0].scrollHeight}, 500);
        };

        this.addView = function(view) {
            controller.addView(view);
        };
    }
});
