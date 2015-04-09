// require drag.js
jQuery.extend({
    FrameView: function($parent, id, title, $content) {
        var that = this;
        var listeners = new Array();

        // initialize
        var container = $("<div></div>").addClass('FrameView');
        var inner_container = $("<div></div>").addClass('inner');
        var $title = $("<div>" + title + "</div>").addClass('title');
        $title.append($("<div>ID: " + id + "</div>").addClass('title_id'));
        var $default_content = $("<div></div>");
        inner_container.append($title);
        inner_container.append($content || $default_content);
        container.append(inner_container);
        container.resizable({minWidth: 400, minHeight: 300});
        $parent.append(container);

        container.resize(function() {
            var width = container.width();
            var height = container.height();
            inner_container.css('height', height);
            inner_container.css('width', width);
            that.notifyResize(width, height);
        });

        // make it draggable
        function makeDraggable(element, handle) {
            dragObject(element[0], handle[0]);
        }
        makeDraggable(container, $title);

        this.id = function() {
            return id;
        };

        this.setContent = function($content) {
            that.$content = $content;
        };

        this.addListener = function(list) {
            listeners.push(list);
        };

        this.notifyDblClick = function() {
            $.each(listeners, function(i) {
                listeners[i].dblclick();
            });
        };

        this.notifyResize = function(w, h) {
            $.each(listeners, function(i) {
                listeners[i].resize(w, h);
            });
        };
    },
    FrameViewListener: function(list) {
        if (!list) list = {};
        return $.extend({
            dblclick: function() {},
            resize: function(w, h) {}
        }, list);
    }
});

