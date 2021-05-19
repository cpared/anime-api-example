exports.success = (res, statusCode, data, token = undefined) => {
	return res.status(statusCode).json({
		status: 'Success!',
		token: token,
		data: data,
	});
};

exports.fail = (res, statusCode, errMsg) => {
	return res.status(statusCode).json({
		status: 'Fail!',
		message: errMsg,
	});
};
