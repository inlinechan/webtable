jQuery.extend({
    HighchartView: function(parent, data, options) {
        var that = this;
        var series = null;
        var _data = data;

        var nbr_of_series = data && data[0].length || 0;
        var series_data = new Array(nbr_of_series);
        for (var i = 0 ; i < nbr_of_series; ++i) {
            var s = series_data[i] = []
            data.forEach(function(e, _i, ar) { s.push(e[i]); });
        }
        var initial_series = [];
        series_data.forEach(function(e, i, ar) { initial_series.push({'data': e}); });

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
            series: initial_series
        });

        var count = 3;
        this.appendRow = function(items) {
            /* console.log('items: ' + items); */
            items.forEach(function(e, i, ar) { series[i].addPoint(e, true, false); });
            count++;
        };
    }
});
