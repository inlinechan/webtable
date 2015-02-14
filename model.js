jQuery.extend({
    Model: function() {
        var that = this;
        var listeners = new Array();
        var data = new Array();

        this.append = function(arr) {
            data.push(arr);
            that.notifyItemAppended(arr);
        };

        this.addListener = function(list) {
            listeners.push(list);
        };

        this.notifyItemAppended = function(item) {
            $.each(listeners, function(i) {
                listeners[i].appendItem(item);
            });
        };
        this.length = function() {
            return data.length;
        };
    },
    ModelListener: function(list) {
        if (!list) list = {};
        return $.extend({
            appendItem : function() {}
        }, list);
    }
});
