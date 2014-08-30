// Submit new advice
$('#signinForm').submit(function (event) {
    event.preventDefault();

    $('#btnSubmit').prop('disabled', true);

    $.post('/signin', $(this).serialize())
        .done(function() {
            $('#errorDisplay').html('').addClass('hide');
            window.location.href = '/app.html';
        })
        .error(function (request) {
            var error = request.responseText || 'Unknown error';
            $('#errorDisplay').html(request.responseText).removeClass('hide');
        })
        .always(function() {
            $('#btnSubmit').prop('disabled', false);
        });
});