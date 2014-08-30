var userMoney = 100;

function victory(isSuccess) {
    if (isSuccess) {
        userMoney = userMoney * 1.05;
        document.getElementById('victor').innerHTML="Победа. Счет увеличился на 5%.<br /> Теперь у вас " + userMoney + " рублей";
        document.getElementById('victor2').innerHTML="Еще разок?";

    } else {
        userMoney = userMoney * 0.95;
        document.getElementById('victor').innerHTML="Вы проиграли. Денег стало на 5% меньше.<br /> Теперь у вас " + userMoney + " рублей";
        document.getElementById('victor2').innerHTML="Еще разок?";
    }
}

$('.btnSelect').click(function (event) {
    $('.btnSelect').prop('disabled', true);

    $.post('/game/dropbones', {choice: $(this).data('choice')})
        .done(function(response) {
            console.log('result is ' + response.result);
            victory(response.result);
        })
        .error(function (request) {
            console.log('looser!!');
        })
        .always(function() {
            $('.btnSelect').prop('disabled', false);
        });
});
