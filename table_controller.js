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
    }
});
