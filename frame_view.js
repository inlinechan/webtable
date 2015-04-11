// require drag.js
jQuery.extend({
    FrameView: function($parent, id, title, $content) {
        var that = this;
        var listeners = new Array();

        // initialize
        var container = $("<div></div>").addClass('FrameView');
        var inner_container = $("<div></div>").addClass('inner');
        var $title_container = $("<div></div>").addClass('title');
        var $title =$("<span>" + title + "</span>").attr('contenteditable', 'true').click(function() { $(this).focus(); });
        var $icons = $("<div><button id=\"close\" name=\"close\" class=\"close\"></button></div>").addClass('icons');
        $icons.click(function() { that.close(); });
        $title_container.append($title);
        $title_container.append($icons);
        $title_container.append($("<div>ID: " + id + "</div>").addClass('title_id'));
        var $default_content = $("<div></div>");
        container.append($title_container);
        inner_container.append($content || $default_content);
        container.append(inner_container);
        container.resizable({minWidth: 400, minHeight: 300});
        $parent.append(container);

        container.resize(function() {
            var width = container.innerWidth();
            var height = container.innerHeight();
            inner_container.css('height', height - $title_container.outerHeight());
            inner_container.css('width', width);
            that.notifyResize(width, height);
        });

        this.close = function() {
            listeners = null;
            container.remove();
        };

        // make it draggable
        function makeDraggable(element, handle) {
            dragObject(element[0], handle[0]);
        }
        makeDraggable(container, $title_container);

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

