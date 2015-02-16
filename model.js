jQuery.extend({
    Model: function(name) {
        var that = this;
        var listeners = new Array();
        var data = new Array();

        // Return cloned data
        this.data = function() {
            return data.slice();
        };

        this.name = function() {
            return name;
        };

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
