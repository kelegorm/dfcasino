
function updateDisplay(isSuccess, balance) {
    if (isSuccess) {
        document.getElementById('victor').innerHTML="Победа. Счет увеличился на 5%.<br /> Теперь у вас " + balance + " рублей";
        document.getElementById('victor2').innerHTML="Еще разок?";

    } else {
        document.getElementById('victor').innerHTML="Вы проиграли. Денег стало на 5% меньше.<br /> Теперь у вас " + balance + " рублей";
        document.getElementById('victor2').innerHTML="Еще разок?";
    }
}

$('.btnSelect').click(function (event) {
    $('.btnSelect').prop('disabled', true);

    $.post('/game/dropbones', {choice: $(this).data('choice')})
        .done(function(response) {
            console.log('result is ' + response.result);
            updateDisplay(response.result, response.balance);
        })
        .error(function (request) {
            console.log('looser!!');
        })
        .always(function() {
            $('.btnSelect').prop('disabled', false);
        });
});
