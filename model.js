jQuery.extend({
    Model: function(name) {
        var that = this;
        var listeners = new Array();
        var data = new Array();
        var _header;
        var _name = name;

        // Return cloned data
        this.data = function() {
            return data.slice();
        };

        this.name = function(newName) {
            if (newName != null) {
                that._name = newName;
                return that;
            } else {
                return that._name;
            }
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
        this.notifyNameChanged = function(name) {
            $.each(listeners, function(i) {
                listeners[i].nameChanged(name);
            });
        };
        this.length = function() {
            return data.length;
        };
        this.setHeader = function(header) {
            that._header = header;
        };
        this.header = function() {
            return that._header;
        };
    },
    ModelListener: function(list) {
        if (!list) list = {};
        return $.extend({
            appendItem : function(item) {},
            nameChanged: function(name) {}
        }, list);
    }
});
