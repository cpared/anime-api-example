const User = require('../models/userModel');
const response = require('../models/response');
const ApiError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const singToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

// eslint-disable-next-line no-unused-vars
exports.singup = async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = singToken(newUser.id);

	response.success(res, 201, newUser, token);
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select('+password');
	const confirm = await user.correctPassword(password, user.password);

	if (!user || !confirm) {
		return next(new ApiError('Invalid email or password', 401));
	}

	const token = singToken(user._id);

	res.status(200).json({
		status: 'Success!',
		token: token,
	});
};
