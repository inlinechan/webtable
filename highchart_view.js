jQuery.extend({
    HighchartView: function(parent, data, options) {
        var that = this;
        var series = null;
        var _data = data;

        var nbr_of_series = data && data[0].length || 0;
        var series_data = new Array(nbr_of_series);
        for (var i = 0 ; i < nbr_of_series; ++i) {
            var s = series_data[i] = [];
            data.forEach(function(e, _i, ar) { s.push(Number(e[i])); });
        }
        var initial_series = [];
        series_data.forEach(function(e, i, ar) {
            initial_series.push({
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
            series: initial_series
        });

        var count = 3;
        this.appendRow = function(items) {
            /* console.log('items: ' + items); */
            items.forEach(function(e, i, ar) { series[i].addPoint(Number(e), true, false); });
            count++;
        };

        this.resize = function(w, h) {
            $(parent).width(w).height(h - 20);
            $(parent).highcharts().reflow();
        };
    }
});
