const User = require('../models/userModel');
const ApiError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
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
		role: req.body.role,
	});

	const token = signToken(newUser.id);

	newUser.password = undefined;
	res.status(201).json({
		status: 'Success!',
		token: token,
		user: newUser,
	});
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ApiError('Please provide email and password!', 400));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new ApiError('Invalid email or password', 401));
	}

	const token = signToken(user._id);

	res.status(200).json({
		status: 'Success!',
		token: token,
	});
};

exports.protect = async (req, res, next) => {
	// 1) Validate if token was sent
	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith('Bearer')
	) {
		next(new ApiError('You are not authorize for the request', 401));
	}
	const token = req.headers.authorization.split(' ')[1];

	if (!token) {
		next(
			new ApiError('You are not logged in! Please log in to get access.', 401),
		);
	}

	// 2) Validate if token belongs to an existing user
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const currentUser = await User.findById(decoded.id);

	if (!currentUser) {
		next(
			new ApiError('The user belonging to this token does no longer exist', 401),
		);
	}

	// 4) Check if user changed password after the token was issued
	console.log(currentUser.changedPasswordAfter(decoded.iat));
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new ApiError('User recently changed password! Please log in again.', 401),
		);
	}

	req.user = currentUser;
	next();
};

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		console.log(req.headers.token);
		if (!roles.includes(req.user.role)) {
			next(new ApiError('You do not have permission to perform this action', 403));
		}
		next();
	};
};
