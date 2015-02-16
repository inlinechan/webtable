jQuery.extend({
    Table: function(table_id, name) {
        var that = this;
        var id = table_id;

        var model = new $.Model(name);
        var view = new $.TableView($("#parent"), id);
        var controller = new $.TableController(model, view);

        this.setHeader = function(header) {
            view.setHeader(header);
        };

        this.length = function() {
            model.length();
        };

        this.append = function(row) {
            model.append(row);
        };

        this.addView = function(view) {
            controller.addView(view);
        };
    }
});
