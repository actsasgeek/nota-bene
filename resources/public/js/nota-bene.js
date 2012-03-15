var converter = new Markdown.Converter();

var cell_number = 0;
var selected_cell = null;

function nota_bene_init() {
	$(function() {
        console.log( "Initializing Nota Bene...");
        initialize_toolbar();
        MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
	});
}

function initialize_toolbar() {
    var toolbar = $( '#toolbar');
    toolbar.jScroll();
    // new code cell button.
    var button = $("<input type='button' name='{}' value='{}' title='Insert a new code cell.'/>");
    toolbar.append( button);
    button.click( function(e) {
        create_code_cell();
    });

    // new code text cell button.
    button = $("<input type='button' name='T' value='T' title='Insert a new text cell.'/>");
    toolbar.append( button);
    button.click( function(e) {
        create_text_cell();
    });

    // new delete button.
    button = $("<input type='button' name='X' value='X' title='Delete selected cell.'/>");
    toolbar.append( button);
    button.click( function() {
        if (selected_cell != null) {
            var result = confirm( "Delete the selected cell?");
            if ( result) {
                $( selected_cell.cell).remove();
                selected_cell = null;
            }
        }
    });
}

function code_cell_html( id) {
    var result = "<div id='cell-" + id + "' class='cell'>";
    result += "<div class='cell-row'>";
    result += "      <div class='in-prompt'><span>In:</span></div>";
    result += "       <div class='in'>";
    result += "           <textarea></textarea>";
    result += "       </div>";
    result += "   </div>";
    result += "   <div class='cell-row'>";
    result += "       <div class='blank'/><div class='blank'/>";
    result += "   </div>";
    result += "    <div class='cell-row'>";
    result += "        <div class='out-prompt'></div>";
    result += "        <div class='out'></div>";
    result += "    </div>";
    result += "</div>";
    return result;
}

function text_cell_html( id) {
    var result = "<div id='cell-" + id + "' class='text-cell-main'>";
    result += "   <div class='text-cell'>";
    result += "        <div class='text-editor' style='display: block;'>";
    result += "           <textarea></textarea>";
    result += "       </div>";
    result += "       <div class='text-renderer' tabindex='-1' style='display: none;'>";
    result += "           <span>Enter HTML/LaTeX here</span>";
    result += "        </div>";
    result += "   </div>";
    result += "</div>";
    return result;
}

function make_new_cell_id() {
    cell_number ++;
    return cell_number;
}

function make_cell_active( id, type, current_cell) {
    if ( selected_cell != null) {
        $( selected_cell.cell).removeClass( "active-cell");
        if ( selected_cell.type == "code") {
            $( selected_cell.cell).addClass( "inactive-cell");
        }
    }
    selected_cell = { type: type, cell: current_cell};
    $('#cell-' + id).removeClass( "inactive-cell").addClass( "active-cell");
}

function create_text_cell() {
    var id = make_new_cell_id()

    var cell = $( text_cell_html( id));
    cell.click( function( e) {
        edit_text_cell( id);
        make_cell_active( id, "text", this);
    });
    $( '#notebook').append( cell);
    var textarea = $( '#cell-' + id + ' textarea')[ 0];
    console.log( textarea);
    var editor = CodeMirror.fromTextArea( textarea, {
        mode: "markdown",
        lineWrapping: true,
        onBlur: function (cm, e) {
            save_text_cell( id);
        }
    });
    textarea[ 'editor'] = editor;
    make_cell_active( id, "text", this);
    editor.focus();
}

function edit_text_cell( id) {
    var textarea = $( '#cell-' + id + ' textarea')[ 0];
    var editor = textarea[ 'editor'];
    $('#cell-' + id + ' .text-renderer').attr( "style", "display: none;");
    $('#cell-' + id + ' .text-editor').attr( "style", "display: block;");
    editor.focus();
}

function save_text_cell( id) {
    var textarea = $( '#cell-' + id + ' textarea')[ 0];
    var editor = textarea[ 'editor'];
    var html = editor.getValue();
    if (html.replace(/^\s+|\s+$/g, '') === "") {
        html = "Enter Markdown or LaTeX Math";
    }
    $('#cell-' + id).removeClass( "active-cell");
    $('#cell-' + id + ' .text-editor').attr( "style", "display: none;");
    $('#cell-' + id + ' .text-renderer').html( converter.makeHtml( html)).attr( "style", "display: block;");
    MathJax.Hub.Queue([ "Typeset",MathJax.Hub]);
}

function create_code_cell() {
    var id = make_new_cell_id()

    var cell = $( code_cell_html( id));
    cell.click( function(e) {
        make_cell_active( id, "code", this);
    });
    $( '#notebook').append( cell);
    var textarea = $( "#cell-" + id + " textarea")[ 0];
    var editor = CodeMirror.fromTextArea( textarea, {
//        lineNumbers: true,
        mode: "clojure",
        theme: "neat",
        matchBrackets: true,
        indentUnit: 4,
        extraKeys: {
            "Shift-Enter": function(cm) {
                evaluate_code( id);
            }
        }
    });
    textarea[ 'editor'] = editor;
    return cell;
}

function evaluate_code( id) {
    var textarea = $( "#cell-" + id + " textarea")[ 0];
    var editor = textarea[ 'editor'];
    var expr = editor.getValue();
    if ( expr != "") {
        var data = eval_clojure( expr);
        var html = "";
        if ( data.error) {
            html = html_escape( data.message);
        } else {
            html = html_escape( data.result);
        }
        $( "#cell-" + id + " .out-prompt").html( "Out:");
        $( "#cell-" + id + " .out").html( html);
    }
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
