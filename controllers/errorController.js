const sendErrorProd = (err, res) => {
	// Operational, trusted error: send message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});

		// Programming or other unknown error: don't leak error details
	} else {
		// 1) Log error
		console.error('ERROR 💥', err);

		// 2) Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'fail!';

	if (process.env.NODE_ENV === 'production') {
		sendErrorProd(err, res);
	} else {
		sendErrorDev(err, res);
	}
};