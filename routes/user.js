var nodemailer = require('nodemailer');
var Account = require('../model/Account');

var smtpTransport;

initMail();

module.exports = function (app) {
    function writeUserSession(req, email) {
        req.session.loggedIn = true;
        req.session.email = email;
    }

    app.post('/signin', app.access.free, function(req, res) {
        var email = req.param('email', null);
        var password = req.param('password', null);
        if ( null == email || email.length < 1 || null == password || password.length < 1 ) {
            res.send(400);
            return;
        }
        console.log('POST signin:: validated');
        Account.login(email, password, function(success) {
            if ( !success ) {
                console.log('login was failed:' + success);
                res.send(401, "Wrong login or password");
                return;
            }
            console.log('login was successful');
            writeUserSession(req, email);
            res.send(200);
        });
    });

    app.post('/signup', app.access.free, function(req, res) {
        var email = req.param('email', null);
        var password = req.param('password', null);
        var proto = req.param('proto', 'default');
        if ( null == email || null == password || proto !== '') {
            res.send(400);
            return;
        }
        console.log('signup params validated');

        Account.register(email, password, function(error) {
            if (error) {
                console.log(error);
                res.send(400, 'Unknown error');
            } else {
                console.log('User ' + email + ' was registered');
                sendRegistrationMail(email, password, function (error, response) {
                    if(error){
                        console.log('mail send error: ' + error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }
                });

                Account.login(email, password, function (success) {
                    if (!success) {
                        console.log('auth was failed');
                    }
                    writeUserSession(req, email);
                    res.send('200');
                });
                console.log('sended');
            }
        });
    });
};

function initMail() {
    //TODO setup your mail transport
    smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "",
            pass: ""
        }
    });
}

function sendRegistrationMail(email, password, callback) {
    //TODO comment next 2 rows after you setup mail transport
    callback(false, {message: 'empty'});
    return;

    var mailOptions = {
        from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
        to: email, // list of receivers
        subject: "Hello from Notter!", // Subject line
        text: "Hi! You was registered in Notter!\nYour credentials is:\nemail: " + email + '\npassword: ' + password + "\n\n Now we don't remember your original password.\nWe don't use your email for spam." // plaintext body
//                    html: "<b>Hello world ✔</b>" // html body
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
        callback(error, response);

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}