jQuery.extend({
    HighchartView: function(parent, data, options) {
        var that = this;
        var series = null;
        var _data = data;

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
            series: [{
                data: data
            }]
        });

        var count = 3;
        this.appendRow = function(items) {
            console.log('items: ' + items);
            series[0].addPoint(items, true, false);
            count++;
        };
    }
});
