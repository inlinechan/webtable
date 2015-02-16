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
                that.addView(new $.HighchartView('#container', data, {'title': model.name()}));
                $('#container').css('position', 'absolute').css('right', '50px');
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
