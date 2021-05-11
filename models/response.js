exports.success = (res, statusCode, data) => {
	return res.status(statusCode).json({
		status: 'Success!',
		data: data,
	});
};

exports.fail = (res, statusCode, errMsg) => {
	return res.status(statusCode).json({
		status: 'Fail!',
		message: errMsg,
	});
};
