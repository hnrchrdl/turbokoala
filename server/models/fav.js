var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favSchema = Schema({
    userid: {
    	type: Schema.Types.ObjectId, 
        ref: 'User',
    	required: [true, 'UserId required']
    },
    updated: { type: Date, default: Date.now },
    artist: {
        type: String,
        required: [true, 'Artist required']
    },
    title: {
        type: String,
        required: [true, 'Title required']
    }

});


module.exports = mongoose.model('Fav', favSchema);