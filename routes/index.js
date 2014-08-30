module.exports = function (app) {

    var secure = require('secure.me')();
    function isUser(req, res, next){
        if (req.hasOwnProperty("session") && req.session.loggedIn ) {
            return next();
        } else {
            res.redirect('/signin');
            //res.send(403);
        }
    }

    function freeAccess(req, res, next){
        // setup guest user
        return next();
    }

    app.access = {
        free:freeAccess,
        isUser: isUser
    };

    secure.setMiddlewares([app.access.free]);
    secure.setDefault(app.access.isUser);

    secure.secureRoutes(app);


    app.get('/', app.access.free, function (req, res) {
        if (req.hasOwnProperty("session") && req.session.loggedIn ) {
            res.redirect('/app.html');
        } else {
            res.redirect("/index.html");
        }
    });

    app.get('/signin', app.access.free, function (req, res) {
        if (req.hasOwnProperty("session") && req.session.loggedIn ) {
            res.redirect('/app.html');
            return;
        }

        res.render('signin', {title: 'Notter - Sing in'});
    });

    app.get('/signout', app.access.free, function (req, res) {
        if (req.session) {
            req.session.destroy();
        }

        res.redirect('/');
    });

    //app.get('/app', function (req, res) {
    //    var email = req.session.email;
    //    res.render('app', {email:email, title: 'Notter'});
    //});

    require('./user')(app);
    require('./game')(app);
    //require('./note')(app);
};