jQuery.extend({
    Toolbar: function(webtable) {
        var collector = [];
        var that = this;
        var _webtable = webtable;
        var connect_btn_id = '#connect';
        var save_btn_id = '#save';
        var uri_input_id = '#uri';

        this.uri = function() {
            return $(uri_input_id).prop('value');
        };

        var button_listener = $.WebTableListener({
            onopen: function(event, socket) {
                $(connect_btn_id).removeClass('connect').addClass('disconnect');
                $(uri_input_id).prop('disabled', true);
            },
            onclose: function(event, socket) {
                $(connect_btn_id).removeClass('disconnect').addClass('connect');
                $(uri_input_id).prop('disabled', false);
            },
            onmessage: function(msg) {
                collector.push(msg);
                if (collector.length > 0)
                    $(save_btn_id).prop('disabled', false);
            }
        });
        _webtable.addListener(button_listener);

        $(connect_btn_id).click(function() {
            if ($(connect_btn_id).hasClass('connect'))
                _webtable.connect($(uri_input_id).prop('value'));
            else
                _webtable.disconnect();
        });

        $(save_btn_id).click(function() {
            if (collector.length > 0) {
                var data = "";
                collector.forEach(function(e, i, ar) {
                    data += e + ',\n';
                });
            }
            var MIME_TYPE = 'application/json';
            var bb = new Blob([data], {type: MIME_TYPE});
            var a = document.createElement('a');
            var date = new Date();
            a.id = 'download';
            var date_detail = date.toString().split(/[ \t]/).splice(0, 5).join('_').replace(/[ \t:]+/g, '_');
            a.download = 'webtable_' +  date_detail + '.txt';
            a.href = window.URL.createObjectURL(bb);
            a.textContent = 'Download ready';
            a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
            a.style.display = 'none';
            $('#session').append(a);

            var cleanUp = function(a) {
                a.textContent = 'Downloaded';

                // Need a small delay for the revokeObjectURL to work properly.
                setTimeout(function() {
                    window.URL.revokeObjectURL(a.href);
                    $('#session a').remove();
                }, 500);
            };

            a.onclick = function(e) {
                cleanUp(this);
            };
            a.click();
        });

        $(function() {
            console.log('document ready');
            function handleLoad(evt) {
                $('.FrameView').remove();
                var file = evt.target.files[0];

                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        var webtable = new $.WebTable();
                        var lines = e.target.result.split(',\n');
                        lines.forEach(function(elem, i, ar) {
                            if (elem.length > 0)
                                webtable.append(elem);
                        });
                    };
                })(file);
                reader.readAsText(file);
            }
            $('#load').on('change', handleLoad);
        });
    }
});
