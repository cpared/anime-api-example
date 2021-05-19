const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const validator = require('validator');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		minLength: [5, 'name must be at least with 5 letters'],
		maxLength: [30, 'name can not be more than 30 letters'],
		required: [true, 'name must be setted'],
		unique: true,
	},
	email: {
		type: String,
		validate: {
			// validator: [validator.isEmail, 'Invalid email']
			validator: emailValidator,
			message: 'Invalid Email',
		},
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		minLength: [8, 'password must have at least 8 letters'],
		validate: {
			validator: passwordValidator,
			message: 'Invalid passowrd',
		},
		required: [true, 'password must be set'],
		select: false, //not shown when select is call
	},
	passwordConfirm: {
		type: String,
		required: [true, 'please confirm your password'],
		validate: {
			validator: function (pwdConfirm) {
				return pwdConfirm === this.password;
			},
			message: 'Password does not match',
		},
	},
	photo: {
		type: String,
	},
});

/** Validators */
function emailValidator(email) {
	const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
	return emailRegex.test(email);
}

function passwordValidator(password) {
	const insecureRegex = /^[a-z]/;
	// const strongRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
	return insecureRegex.test(password);
}

/** Middleware */
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	// 12 is the number of complex encrypt, if we set more than that, the cpu will wait more to encrypt it
	this.password = await bcrypt.hash(this.password, 12);

	// We don't want to persiste the password confirmation to our database
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function(password, currentPassword) {
	return await bcrypt.compare(password, currentPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
