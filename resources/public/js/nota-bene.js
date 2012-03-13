function nota_bene_init() {
	$(function() {
	    $('#eval').click( eval);
	});
}

function eval() {
    var expr = $( '#expr').val();
    if ( expr != "") {
        var data = eval_clojure( expr);
        console.log( data);
        if ( data.error) {
            var html = html_escape( data.message);
            $( '#results').html( html);
        } else {
            var html = html_escape( data.result);
            console.log( html);
            $( '#results').html( html);
        }
    }
}

function eval_clojure(code) {
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
