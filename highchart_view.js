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
    HighchartView: function(parent, data, options) {
        var that = this;
        var series = null;
        var _data = data;

        var nbr_of_series = data && data[0].length || 0;
        var series_data = new Array(nbr_of_series);

        for (var i = 0; i < nbr_of_series; ++i) {
            var s = series_data[i] = [];
            data.forEach(function(e, _i, ar) {
                s.push(Number(e[i]));
            });
        }
        var remove_series = [];
        var initial_series = [];
        series_data.forEach(function(e, i, ar) {
            var isAllNumber = e.every(function(e, i, ar) { return $.isNumeric(e); });
            if (isAllNumber) {
                initial_series.push({
                    'data': e,
                    'name': options.header[i] || 'series' + i
                });
            } else
                remove_series[i] = true;
        });

        var plot = $(parent).highcharts({
            chart: {
                type: 'spline',
                zoomType: 'x',
                events: {
                    load: function() {
                        series = this.series;
                    }
                }
            },
            title: {
                text: options.title || 'Untitled'
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                }
            },
            xAxis: {
                minRange: 10,
                title: {
                    text: 'Iteration'
                }
            },
            plotOptions: {
                series: {
                    pointStart: 1
                }
            },
            tooltip: {
                formatter: function() {
                    var index_name = this.x + ': ' + this.series.name;
                    return 'The value for <b>' + index_name + '</b> is ' + this.y + 'KB';
                }
            },
            series: initial_series
        });

        var count = 3;
        this.appendRow = function(items) {
            var valid_number_index = 0;
            items.forEach(function(e, i, ar) {
                if (!remove_series[i]) {
                    var value = Number(e);
                    series[valid_number_index].addPoint(!isNaN(value) ? value : -1, true, false);
                    valid_number_index++;
                }
            });
            count++;
        };

        this.resize = function(w, h) {
            $(parent).width(w - 30).height(h - 20);
            $(parent).highcharts().reflow();
        };

        this.setTitle = function(title) {
            $(parent).highcharts().setTitle({text: title});
        };
    }
});
