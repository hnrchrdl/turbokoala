var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    email: {
    	type: String,
    	required: [true, 'Email required'],
    	unique: true
    },
    name: {
    	type:String,
    	required: [true, 'name required']
    },
    password: {
    	type: String,
    	required: [true, 'password required']
    },
    options: Schema.Types.Mixed,
    connection: {
    	host: String,
    	port: Number,
    	pw: String,
    	stream: String
    }

});

userSchema.methods.validatePassword = function (password) {
	if(password === this.password) {
		return true;
	}
	return false;
}


module.exports = mongoose.model('User', userSchema);