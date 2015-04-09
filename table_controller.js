jQuery.extend({
    TableController: function(model, view) {
        var that = this;

        var mlist = $.ModelListener({
            appendItem: function(item) {
                view.appendRow(item);
            }
        });

        model.addListener(mlist);

        var vlist = $.TableViewListener({
            dblclick: function() {
                var data = model.data();
                var plotId = 'plot' + view.id();

                if ($('#' + plotId).length) {
                    console.log('#' + plotId + "is already exist");
                    return;
                }

                var title = model.name();
                var plot = $("<div></div>").attr('id', plotId); //.addClass('plot');
                var container = new $.FrameView($('#plot_container'), plotId, title, plot);
                var highchartView = new $.HighchartView('#' + plotId, data, {
                    'title': model.name(),
                    'header': model.header()
                });
                that.addView(highchartView);
                var frameViewListener = $.FrameViewListener({
                    resize: function(w, h) {
                        highchartView.resize(w, h);
                    }
                });
                container.addListener(frameViewListener);

            }
        });
        view.addListener(vlist);

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
