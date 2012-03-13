function nota_bene_init() {
	$(function() {
        console.log( "Initializing Nota Bene...");
        $( ".active-code textarea").keydown( eval_listener);
	});
}

function eval_listener( e) {
    if ( e.shiftKey && e.keyCode == 13) {
        eval();
        e.preventDefault();
    }
}

function eval() {
    var expr = $( '.active-code textarea').val();
    if ( expr != "") {
        var data = eval_clojure( expr);
        console.log( data);
        if ( data.error) {
            var html = html_escape( data.message);
            add_results( html);
        } else {
            var html = html_escape( data.result);
            console.log( html);
            add_results( html);
            add_code();
        }
    }
}

function add_results( results) {
    $( ".active-results").removeClass( "active-results").addClass( "inactive-results");
    var last_row = $( '#notebook tr:last');
    last_row.after( "<tr class='active-results'><td><div>" + results + "</div></td></tr>");
}

function add_code() {
    var old_editor = $( ".active-code textarea");
    old_editor.keydown( null);
    var row = $(".active-code");
    row.removeClass( "active-code").addClass( "inactive-code");
    var last_row = $( '#notebook tr:last');
    last_row.after( "<tr class='active-code'><td><textarea></textarea></td></tr>");
    var new_editor = $( ".active-code textarea");
    new_editor.keydown( eval_listener);
    new_editor.focus();
}

function eval_clojure( code) {
    var data;
    $.ajax({
        url: "eval.json",
        data: { expr : code },
        async: false,
        success: function(res) { data = res; }
    });
    return data;
}

function html_escape(val) {
    var result = val;
    result = result.replace(/[<]/g, "&lt;");
    result = result.replace(/[>]/g, "&gt;");
    result = result.replace(/\n/g, "<br/>");
    return result;
}
