// Webtable is to show tabular data in plot form as well as table.
// Copyright (C) 2015  Hyungchan Kim <inlinechan@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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

        // http://stackoverflow.com/a/14027188/2229134
        $title.on('focus', function() {
            var $this = $(this);
            $this.data('before', $this.html());
            return $this;
        }).on('blur keyup paste', function() {
            var $this = $(this);
            if ($this.data('before') !== $this.html()) {
                $this.data('before', $this.html());
                $this.trigger('change');
            }
            return $this;
        });
        $title.change(function() {
            if (/^\s*$/.test($title.html()))
                $title.html("Untitled");

            that.notifyTitleChange($title.html());
        });

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
            // http://mdqinc.com/blog/2013/01/css3-transforms-vs-jquery-draggable/
            $(container).draggable({
                handle: handle,
                start: function() {
                    /* Temporarily revert the transform so drag and dropping works as expected */
                    var parentRect = $(this).parent()[0].getBoundingClientRect();
                    var rect = this.getBoundingClientRect();
                    $(this).css('transition', 'all 0 ease 0');
                    $(this).css('transform', 'none');
                    $(this).css('left', rect['left']-parentRect['left']);
                },
                stop: function() {
                }
            });
            handle.hover(function() {
                $(this).css('cursor', 'move');
            }, function () {
                $(this).css('cursor', 'auto');
            });
        }
        makeDraggable(container, $title_container);

        this.addContextMenu = function(selector, callback, items) {
            var _selector = selector || '.FrameView .title';
            var _callback = callback || function(key, options) {
                var m = "clicked: " + key;
                console.log(m);
            };
            var _items = items || {
                "edit": {name: "Edit", icon: "edit"},
                "cut": {name: "Cut", icon: "cut"},
                "copy": {name: "Copy", icon: "copy"},
                "paste": {name: "Paste", icon: "paste"},
                "delete": {name: "Delete", icon: "delete"},
                "sep1": "---------",
                "quit": {name: "Quit", icon: "quit"}
            };
            $.contextMenu({
                selector: _selector,
                callback: _callback,
                items: _items
            });
        };
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
            $.each(listeners, function(i, e) {
                e.dblclick();
            });
        };

        this.notifyResize = function(w, h) {
            $.each(listeners, function(i, e) {
                e.resize(w, h);
            });
        };

        this.notifyTitleChange = function(title) {
            $.each(listeners, function(i, e) {
                e.titleChanged(title);
            });
        };
    },
    FrameViewListener: function(list) {
        if (!list) list = {};
        return $.extend({
            dblclick: function() {},
            resize: function(w, h) {},
            titleChanged: function(title) {}
        }, list);
    }
});

