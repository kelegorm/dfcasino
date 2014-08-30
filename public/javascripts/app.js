$(document).ready(function () {
    refreshNotes();
});

$("#addNoteModal").on("show.bs.modal", function () {
    $("#nodeForm")[0].reset();
});

$("#addNoteModal").on("shown.bs.modal", function () {
    $("#noteTextArea").focus();
});

$("#noteTextArea").keydown(function(event) {
    if (event.which == 13 && (event.ctrlKey||event.metaKey)) {
        event.preventDefault();
        $("#createNoteButton").click();
        return false;
    }
    return true;
});

$("#createNoteButton").click(function() {
    $.post('/note', {text:$("#noteTextArea").val()}, function () {
        refreshNotes();
    });
});

$("#deleteAllButton").click(function() {
    $.post('/notes/deleteAll', {confirmed:'yes'}, function () {
        refreshNotes();
    });
});

//$('button.deleteNodeButton').click(function () {
//    console.log('this: ' + $(this));
//});

var refreshNotes = function () {
    $.getJSON('/notes', function (data) {
        var notes = data;

        if (notes && notes.length > 0) {
            notes.sort(dateSortFunction);
            var objects = '';
            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                note.date = new Date(note.date);

                var str = getNodeHTML(note);
                objects += str;
            }

            $('#emptyDisplay').addClass('hide');
            $('#notesContainer').html(objects);

            $('button.deleteNodeButton').click(function () {
                console.log('this: ' + $(this).data('id'));
                var dataId = $(this).data('id');
                $.ajax({
                    url: '/note/' + dataId,
                    type: 'DELETE',
                    success: function () {
                        refreshNotes();
                    }
                });
            });
        } else {
            $('#notesContainer').html('');
            $('#emptyDisplay').removeClass('hide');
        }

    });
};

function getNodeHTML(note) {
    return '<div class="note">'
            + '<div class="container">'
                + '<div class="row ">'
                    + '<div class="col-md-2 text-muted">'
                        + getReadableDate(note.date)
                    + '</div>'
                    + '<div class="col-md-8">'
                        + note.text
                    + '</div>'
                    + '<div class="col-md-2 hidable">'
                        + '<div class="pull-right btn-toolbar">'
                            + '<a class="btn btn-info" href="' + '/note/' + note._id + '">'
                                + '<span class="glyphicon glyphicon-link"></span> Share'
                            + '</a>'
                            + '<button class="btn btn-danger deleteNodeButton" data-id="' + note._id + '">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</button>'
                        + '</div>'
                    + '</div>'
                + '</div>'
            + '</div>'
        + '</div>';
};