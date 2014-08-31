var Account = require('../model/Account');

module.exports = function (app) {
    app.post('/game/dropbones', function(req, res) {
        var choice = parseInt(req.param('choice'));

        if (isNaN(choice) || !(choice >= 1 && choice <= 3)) {
            res.send(400);
            return;
        }

        var dropResult = dropBones();
        var gameResult = choice == dropResult;

        var ert = (gameResult) ? 1.05 : .95;

        var email = req.session.email;
        Account.changeMoney(email, ert, function (error, doc) {
            if (!error) {
                res.send(200, {result:gameResult, balance:doc.balance});
            } else {
                console.log(error);
                res.send(400);
            }
        });
    });
};

var min = 0, max = 3;

function dropBones() {
    return Math.ceil(Math.random()*(max-min));
}