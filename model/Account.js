var crypto = require('crypto');
var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
    email:     { type: String, unique: true },
    password:  { type: String },
    name:      { type: String }
});
var Account = mongoose.model('Account', AccountSchema);


module.exports.login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    Account.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
        callback(doc);
    });
};


module.exports.register = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    console.log('Registering ' + email);
    var user = new Account({
        email: email,
        password: shaSum.digest('hex')
    });
    user.save(callback);
    console.log('Save command was sent');
}


module.exports.changePassword = function(accountId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    Account.update({_id:accountId}, {$set: {password:hashedPassword}},{upsert:false},
        function changePasswordCallback(err) {
            console.log('Change password done for account ' + accountId);
        });
};


module.exports.forgotPassword = function(email, resetPasswordUrl, callback) {
    var user = Account.findOne({email: email}, function findAccount(err, doc){
        if (err) {
            // Email address is not a valid user
            callback(false);
        } else {
            var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
            resetPasswordUrl += '?account=' + doc._id;
            smtpTransport.sendMail({
                from: 'thisapp@example.com',
                to: doc.email,
                subject: 'SocialNet Password Request',
                text: 'Click here to reset your password: ' + resetPasswordUrl
            }, function forgotPasswordResult(err) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        }
    });
};


module.exports.findById = function(accountId, callback) {
    Account.findOne({_id:accountId}, function(err,doc) {
        callback(doc);
    });
}

var registerCallback = function(err) {
    if (err) {
        return console.log(err);
    }
    return console.log('Account was created');
};
