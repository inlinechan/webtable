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
                var plot = $("<div></div>").attr('id', plotId).addClass('plot');
                $('#plot_container').append(plot);
                that.addView(new $.HighchartView('#' + plotId, data, {'title': model.name()}));
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
