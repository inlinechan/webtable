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
                var container = $("<div></div>").addClass('widget');
                var plot = $("<div></div>").attr('id', plotId).addClass('plot');
                var title = $("<div>" + model.name() + "<div style=\"float: right\"> ID: " + plotId + "</div>" + "</div>").addClass('title');
                container.append(title);
                container.append(plot);
                $('#plot_container').append(container);
                that.addView(new $.HighchartView('#' + plotId, data, {'title': model.name()}));

                function makeDraggable(obj) {
                    var dom_element = obj[0];

                    dragObject(dom_element, dom_element);
                }
                makeDraggable(container);
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
