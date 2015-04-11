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

        ////////////////////////////////////////////////////////////////////////////////
        // about resizing
        var SizeState = {'initial': 1, 'resized': 2, 'minimized': 3};
        var size_state = SizeState.initial;
        var sizes = {};

        sizes[SizeState.minimized] = {'width': 400, 'height': 300};

        function resize_internal(width, height, do_update) {
            if (do_update) {
                container.css('width', width);
                container.css('height', height);
            }
            inner_container.css('height', height - $title_container.outerHeight());
            inner_container.css('width', width);
            that.notifyResize(width, height);
        }

        function resize(newstate) {
            resize_internal(sizes[newstate].width, sizes[newstate].height, true);
        }

        container.resize(function() {
            var width = container.innerWidth();
            var height = container.innerHeight();
            resize_internal(width, height, false);

            sizes[SizeState.resized] = {'width': width, 'height': height};
            size_state = SizeState.resized;
        });
        $title_container.dblclick(function() {
            switch (size_state) {
            case SizeState.initial:
                sizes[SizeState.resized] = {
                    'width': inner_container.children().prop('scrollWidth'),
                    'height': inner_container.children().prop('scrollHeight')
                };
                size_state = SizeState.minimized;
                break;
            case SizeState.resized:
                sizes[SizeState.resized] = {
                    'width': container.innerWidth(),
                    'height': container.innerHeight()
                };
                size_state = SizeState.minimized;
                break;
            case SizeState.minimized:
                size_state = SizeState.resized;
                break;
            }
            resize(size_state);
        });

        this.close = function() {
            listeners = null;
            container.remove();
        };

        // make it draggable
        function makeDraggable(element, handle) {
            dragObject(element[0], handle[0]);
            handle.hover(function() {
                $(this).css('cursor', 'move');
            }, function () {
                $(this).css('cursor', 'auto');
            });
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

