var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
    text:     { type: String},
    date:     { type: Date},
    email:    {type: String}
});
var Note = mongoose.model('Note', NoteSchema);

module.exports.create = function (note, email, callback) {
    var note = new Note({text: note, email:email, date: new Date()});
    note.save(callback);
};

module.exports.getNotes = function (email, callback) {
    Note.find({email:email}, function (error, notes) {
        if (error) {
            callback(error);
        } else {
            callback(null, notes);
        }
    });
};

module.exports.deleteAll = function (email, callback) {
    Note.remove({email:email}, function (error) {
        callback(error);
    });
};

module.exports.delete = function (id, callback) {
    Note.findByIdAndRemove(id, callback);
};

module.exports.getNote = function (id, callback) {
    Note.findById(id, callback);
};