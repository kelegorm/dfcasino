var Note = require('../model/Note');

module.exports = function (app) {

    app.get('/notes', function (req, res) {
        var email = req.session.email;

        Note.getNotes(email, function (error, notes) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(notes);
            }
        });
    });

    app.get('/note/:id', app.access.free, function (req, res) {
        var nodeId = req.param('id', null);
        if (null == nodeId) {
            return res.send(400);
        }

        Note.getNote(nodeId, function(error, doc) {
            if (error) {
                console.log('GET note/:id - error: ' + error);
                return res.send(500);
            }

            res.render('note', doc);
        });
    });

    app.post('/notes/deleteAll', function (req, res) {
        var confirmed = req.param('confirmed', 'no');
        if (confirmed !== 'yes') {
            res.send(400);
            return;
        }

        var email = req.session.email;
        console.log('POST notes/deleteAll - validated');

        Note.deleteAll(email, function (error) {
            if (error) {
                res.send(500, error);
                console.log('POST notes/deleteAll - error: ' + error);
            } else {
                res.send(200);
                console.log('POST notes/deleteAll - ok');
            }
        });
    });

    app.post('/note', function(req, res) {
        var text = req.param('text', null);
        if ( null == text || text.length < 1 ) {
            res.send(400);
            return;
        }

        console.log('POST note - validated');

        var email = req.session.email;
        Note.create(text, email, function(error) {
            if (error) {
                console.log("note creating error:" + text);
                res.send(401, "note creating error");
                return;
            }
            res.send(200);
        });
    });

    app.del('/note/:id', function (req, res) {
        var nodeId = req.param('id', null);
        if (null == nodeId) {
            return res.send(400);
        }

        Note.delete(nodeId, function(error) {
            if (error) {
                console.log('DELETE note/:id - error: ' + error);
                res.send(500);
            } else {
                res.send(200);
            }
        });
    });
};