var converter = new Markdown.Converter();

var current_workbook = null;
var selected_cell = null;
var workbooks = 0;

function nota_bene_init() {
	$(function() {
        console.log( "Initializing Nota Bene...");
        initialize_toolbar();
        MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});

        list_workbooks();
	});
}

function list_workbooks() {
    var workbook = $( '#workbook');
    workbook.empty();
    workbook.append( $("<h1>Workbooks</h1>"));
    current_workbook = null; // TODO: if current_workbook is about to be overwritten, there should be a warning if it is dirty.
    var workbooks = fetch_workbooks_list();
    var ul = $("<ul></ul>");
    workbook.append( ul);
    for ( var i = 0; i < workbooks.length; i ++) {
        var link = $("<a class='button' style='width: 50%; margin-bottom: 2px;' href='#' data-workbook_id='" +  workbooks[ i][ "id"] + "'>" + workbooks[ i][ 'name'] + "</a><br/ >");
        link.click( function(e) {
            e.preventDefault();
            var id = e.target.dataset[ 'workbook_id'];
            load_workbook( id);
        });
        ul.append( link);
    }    
}

function new_workbook() {
    clear_workbook();
    current_workbook = create_new_workbook();
    create_workbook_name();
}

function create_new_workbook() {
    workbooks ++;
    result = {};
    result[ 'cell_number'] = 0;
    result[ 'name'] = "Workbook" + workbooks;
    return result;
}

function create_workbook_name() {
    var workbook_name = $( "<div id='workbook_name'></div>");
    $( "#workbook").append( workbook_name);
    workbook_name.html( current_workbook[ 'name']);
    workbook_name.click( function( e) {
        e.target.contentEditable = true;
    });
    workbook_name.blur( function( e) {
        e.target.contentEditable = false;
        current_workbook[ 'name'] = $( '#workbook_name').html();
    });
}

function initialize_toolbar() {
    var toolbar = $( '#toolbar');

    // new wookbook
    var button = $("<a href='#' title='Create a new workbook' class='button full-button icon add'>New workbook</a><br />");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        new_workbook();
    });
    
    // list workbooks button.
    button = $("<a href='#' title='List workbooks' class='button full-button icon arrowdown'>List workbooks</a><br />");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        list_workbooks();
    });

    toolbar.append( $( "<div style='width: 100%; height: 5px;'/>"));

    // save workbook button.
    button = $("<a href='#' title='Save workbook' class='button full-button icon arrowup'>Save workbook</a><br />");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        var result = save_current_workbook();
        if ( result[ 'error']) {
            console.log( result[ 'message']);
        } else {
            current_workbook[ 'id'] = result[ 'message'];
        }
    });

    toolbar.append( $( "<div style='width: 100%; height: 5px;'/>"));

    // increase workbook fontsize
    var button = $("<a href='#' title='Add new code cell' class='button half-button icon arrowup'>Font</a>");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        change_workbook_fontsize( 1);
    });

    // decrease workbook fontsize
    var button = $("<a href='#' title='Add new code cell' class='button half-button icon arrowdown'>Font</a><br />");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        change_workbook_fontsize( -1);
    });


    toolbar.append( $( "<div style='width: 100%; height: 5px;'/>"));

    // add new code cell.
    var button = $("<a href='#' title='Add new code cell' class='button full-button icon settings'>Add code</a><br />");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        create_code_cell();
    });
    
    // new code text cell button.
    button = $("<a href='#' title='Add new annotation cell' class='button full-button icon comment'>Add annotation</a><br />");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        add_text_cell();
    });

    // new delete button.
    button = $("<a href='#' title='Delete selected cell' class='button full-button danger icon trash'>Delete selected cell</a><br />");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        if (selected_cell != null) {
            var result = confirm( "Delete the selected cell?");
            if ( result) {
                $( selected_cell.cell).remove();
                selected_cell = null;
            }
        }
    });

    toolbar.append( $( "<div style='width: 100%; height: 5px;'/>"));

    // clear output.
    button = $("<a href='#' title='Clear output' class='button full-button danger icon remove'>Clear output</a><br />");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        clear_output();
    });

    // execute workbook.
    button = $("<a href='#' title='Execute workbook' class='button full-button icon reload'>Execute workbook</a><br />");
    toolbar.append( button);
    button.click( function(e) {
        e.preventDefault();
        execute_workbook();
    });

    toolbar.append( $("<p style='font-family: Arial, Helvetica, sans-serif; font-size: 8pt;'>Shift-Enter executes code.</p>"));
    toolbar.append($( "<div style='text-align: center; width: 100%; padding-top: 25px;'><table width='100%'><tr><td><img src='img/clojure.png'/><br /><img src='img/duke.jpeg'/></td><td><img src='img/lisplogo_warning.png'/></td></tr></table></div>"));
}

function change_workbook_fontsize( change) {
    var workbook = $( '#workbook');

    var current_font_size = parseInt( workbook.css( 'font-size'));
    workbook.css( 'font-size', current_font_size + change);

    var code_cells = $( '.code-cell');
    for ( var i = 0; i < code_cells.length; i ++) {
        change_fontsize( code_cells[ i], change);
    }
}

function change_fontsize( item, change) {
    var item = $( item);
    var current_font_size = parseInt( item.css( 'font-size'));
    item.css( 'font-size', current_font_size + change);
}

function code_cell_html( id) {
    var result = "<div id='cell-" + id + "' class='cell code-cell'>";
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
    var result = "<div id='cell-" + id + "' class='cell text-cell'>";
//    result += "   <div class='text-cell'>";
    result += "        <div class='text-editor' style='display: block;'>";
    result += "           <textarea></textarea>";
    result += "       </div>";
    result += "       <div class='text-renderer' tabindex='-1' style='display: none;'>";
    result += "           <span>Enter HTML/LaTeX here</span>";
    result += "        </div>";
 //   result += "   </div>";
    result += "</div>";
    return result;
}

function make_new_cell_id( workbook) {
    workbook[ 'cell_number'] += 1;
    return workbook[ 'cell_number'];
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

function extract_cell_id( cell) {
    var id = cell.id;
    id = id.substring( id.indexOf( "-") + 1, id.length);
    return id;
}

function add_text_cell() {
    var cell = create_text_cell()[ 0];
    var id = extract_cell_id( cell);
    var editor = extract_editor_from_cell( cell);
    editor.focus();
    make_cell_active( id, "text", cell);
}

function create_text_cell() {
    var id = make_new_cell_id( current_workbook)

    var cell = $( text_cell_html( id));
    cell.click( function( e) {
        edit_text_cell( id);
        make_cell_active( id, "text", this);
    });
    $( '#workbook').append( cell);
    var textarea = $( '#cell-' + id + ' textarea')[ 0];
    var editor = CodeMirror.fromTextArea( textarea, {
        mode: "markdown",
        lineWrapping: true,
        onBlur: function (cm, e) {
            save_text_cell( id);
        }
    });
    textarea[ 'editor'] = editor;
    return cell;
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
    var id = make_new_cell_id( current_workbook)

    var cell = $( code_cell_html( id));
    cell.click( function(e) {
        make_cell_active( id, "code", this);
    });
    $( '#workbook').append( cell);
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
    editor[ 'execute_value'] = function() {
        evaluate_code( id);
    }
    textarea[ 'editor'] = editor;
    editor.focus();
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

function extract_editor_from_cell( cell) {
    return $( "textarea", $( cell))[ 0][ 'editor'];
}

function save_current_workbook() {
    var result = null;
    $.ajax({
        url: "save.json",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify( serialize_workbook( current_workbook)),
        async: false,
        type: "POST",
        success: function(res) { 
            result = res;
        }
    });
    return result;
}

function load_workbook( id) {
    var result = null;
    $.ajax({
        url: "load.json/" + id,
        async: false,
        success: function(res) { 
            result = res;
        }
    });
    deserialize_workbook( result);
    $( "#workbook").click();
}

function fetch_workbooks_list() {
    var result = null;
    $.ajax({
        url: "list.json",
        async: false,
        success: function(res) { 
            result = res;
        }
    });
    return result;    
}

// TODO: this needs to "reset" the REPL on the server side.
function clear_output() {
    var cells = $( ".cell");
    for ( var i = 0; i < cells.length; i ++) {
        if ( $(cells[ i]).hasClass( "code-cell")) {
            $( ".out-prompt", cells[ i]).empty();
            $( ".out", cells[ i]).empty();
        }
    }
}

function execute_workbook() {
    var cells = $( ".code-cell");
    for ( var i = 0; i < cells.length; i ++) {
        var editor = extract_editor_from_cell( cells[ i]);

        editor[ 'execute_value']();
    }
}

function serialize_workbook( workbook) {
    var content = [];
    var cells = $( ".cell");
    for ( var i = 0; i < cells.length; i ++) {
        var serialized_cell = {};
        serialized_cell[ 'type'] = ($(cells[ i]).hasClass( "code-cell")) ? "code" : "text";
        serialized_cell[ 'content'] = extract_editor_from_cell( cells[ i]).getValue();
        content.push( serialized_cell);
    }
    workbook[ 'name'] = $("#workbook_name").html();
    workbook[ 'content'] = content;
    return workbook;
}

function clear_workbook() {
    $( "#workbook").empty();
}

function deserialize_workbook( workbook) {
    clear_workbook();
    current_workbook = workbook;
    create_workbook_name();
    workbook[ 'cell_number'] = 0;
    var content = workbook[ 'content'];
    for ( var i = 0; i < content.length; i ++) {
        var cell = content[ i];
        var cell_type = cell.type;
        var cell_content = cell.content;
        if ( cell_type == 'code') {
            cell = create_code_cell();
            var editor = extract_editor_from_cell( cell);
            editor.setValue( cell_content);
        } else {
            cell = create_text_cell();
            var id = extract_cell_id( cell[ 0]);
            var editor = extract_editor_from_cell( cell);
            editor.setValue( cell_content);
            save_text_cell( id);
        }
        $( editor).blur();
    }
    return workbook;
}
