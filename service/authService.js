const User = require('../models/userModel');
const response = require('../models/response');

// eslint-disable-next-line no-unused-vars
exports.singup = async (req, res, next) => {
	const newUser = await User.create(req.body);

	response.success(res, 201, newUser);
};
