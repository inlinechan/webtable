// require drag.js
jQuery.extend({
    FrameView: function($parent, id, title, $content) {
        var that = this;
        var listeners = new Array();

        // initialize
        var container = $("<div></div>").addClass('FrameView');
        var $title = $("<div>" + title + "</div>").addClass('title');
        $title.append($("<div>ID: " + id + "</div>").addClass('title_id'));
        var $default_content = $("<div></div>");
        container.append($title);
        container.append($content || $default_content);
        $parent.append(container);

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
    },
    FrameViewListener: function(list) {
        if (!list) list = {};
        return $.extend({
            dblclick: function() {}
        }, list);
    }
});
