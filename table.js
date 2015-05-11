jQuery.extend({
    Table: function(table_id, name, container) {
        var that = this;
        var id = table_id;

        var model = new $.Model(name);
        var view = new $.TableView(null, id, name);
        var frame = new $.FrameView($(container || '#table_container'), id, name, view.view());
        var controller = new $.TableController(model, view);

        ////////////////////////////////////////////////////////////////////////////////
        // context menu
        var items = {
            "AddPlot": {name: "AddPlot", icon: "add"}
        };
        frame.addContextMenu(null, function() {
            var data = model.data();
            var plotId = 'plot' + view.id();

            if ($('#' + plotId).length) {
                console.log('#' + plotId + "is already exist");
                return;
            }

            var title = model.name();
            var plot = $("<div></div>").attr('id', plotId);
            var container = new $.FrameView($('#plot_container'), plotId, title, plot);
            var highchartView = new $.HighchartView('#' + plotId, data, {
                'title': model.name(),
                'header': model.header()
            });
            controller.addView(highchartView);
            var frameViewListener = $.FrameViewListener({
                resize: function(w, h) {
                    highchartView.resize(w, h);
                },
                titleChanged: function(title) {
                    highchartView.setTitle(title);
                }
            });
            container.addListener(frameViewListener);
        }, items);

        var frameViewListener = $.FrameViewListener({
            titleChanged: function(title) {
                model.name(title);
            }
        });
        frame.addListener(frameViewListener);

        this.setHeader = function(header) {
            model.setHeader(header);
            view.setHeader(header);
        };

        this.length = function() {
            model.length();
        };

        this.append = function(row) {
            model.append(row);
        };

        this.addView = function(view) {
            controller.addView(view);
        };
    }
});
