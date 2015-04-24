jQuery.extend({
    HighchartView: function(parent, data, options) {
        var that = this;
        var series = null;
        var _data = data;

        var nbr_of_series = data && data[0].length || 0;
        var series_data = new Array(nbr_of_series);

        var valid_number_start_index = -1;
        for (var i = 0; i < nbr_of_series; ++i) {
            if ($.isNumeric(data[0][i])) {
                valid_number_start_index = i;
                break;
            }
        }
        if (valid_number_start_index == 0)
            valid_number_start_index = -1;

        for (var i = 0; i < nbr_of_series; ++i) {
            var s = series_data[i] = [];
            data.forEach(function(e, _i, ar) {
                s.push(Number(e[i]));
            });
        }
        var initial_series = [];
        series_data.forEach(function(e, i, ar) {
            i >= valid_number_start_index && initial_series.push({
                'data': e,
                'name': options.header[i] || 'series' + i
            });
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
                    var index_name = this.x;
                    if (valid_number_start_index != -1)
                        index_name += ': ' + this.series.name;
                    return 'The value for <b>' + index_name + '</b> is ' + this.y + 'KB';
                }
            },
            series: initial_series
        });

        var count = 3;
        this.appendRow = function(items) {
            // items.forEach(function(e, i, ar) { series[i].addPoint(Number(e), true, false); });
            items.slice(valid_number_start_index+1).forEach(function(e, i, ar) { series[i].addPoint(Number(e), true, false); });
            count++;
        };

        this.resize = function(w, h) {
            $(parent).width(w - 30).height(h - 20);
            $(parent).highcharts().reflow();
        };
    }
});
