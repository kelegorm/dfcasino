$("#openSignUpFormButton").click(function (event){
    $("#openSignUpFormButton").addClass("hide");
    $('#protoInput').addClass('hide');
    $("#signUpForm").removeClass("hide");
});

$("#signUpForm").submit(function(event) {
    event.preventDefault();

    $('#signUpButton').prop('disabled', true);

    $.post('/signup', $(this).serialize())
        .done(function () {
            window.location.href = '/app.html';
            $('#errorDisplay').html('').addClass('hide');
        }).fail(function (request) {
            var error = request.responseText || 'Unknown error';
            $('#errorDisplay').html(request.responseText).removeClass('hide');
        })
        .always(function() {
            $('#signUpButton').prop('disabled', false);
        });
});