module.exports = function (app) {
    app.post('/game/dropbones', function(req, res) {
        var choice = parseInt(req.param('choice'));
        console.log('user choice is ' + choice);

        if (isNaN(choice) || !(choice >= 1 && choice <= 3)) {
            res.send(400);
            return;
        }

        var dropResult = dropBones();
        var gameResult = choice == dropResult;

        console.log('drop result is ' + dropResult);
        console.log('game result is ' + gameResult);


        res.send(200, {result:gameResult});

    });
};

var min = 0, max = 3;

function dropBones() {
    return Math.ceil(Math.random()*(max-min));
}