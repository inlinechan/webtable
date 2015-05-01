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
    }
});
