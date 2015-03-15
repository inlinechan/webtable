jQuery.extend({
    TableController: function(model, view) {
        var that = this;

        var mlist = $.ModelListener({
            appendItem: function(item) {
                view.appendRow(item);
                console.log('appendItem: ' + item);
            }
        });

        model.addListener(mlist);

        var vlist = $.TableViewListener({
            dblclick: function() {
                var data = model.data();
                var plotId = 'plot' + view.id();
                var title = model.name();
                var plot = $("<div></div>").attr('id', plotId).addClass('plot');
                var container = new $.FrameView($('#plot_container'), plotId, title, plot);
                that.addView(new $.HighchartView('#' + plotId, data, {
                    'title': model.name(),
                    'header': model.header()
                }));
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
