const ApiError = require('../utils/appError');

/** Error Handling Functions */
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

const handleCastErrorDB = (err) => {
	return new ApiError(`Invalid ${err.path}: ${err.value}.`, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.match(/(["'])(\\?.)*?\1/)[0];
	return new ApiError(
		`Duplicate field value: ${value}. Please use another value!`,
		400,
	);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	return new ApiError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handleJWTError = () => {
	return new ApiError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
	return new ApiError('Your token has expired! Please log in again.', 401);
};

/** Export Global Function */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'fail!';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };
		const message = err.message;

		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(message);
		if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
		sendErrorProd(err, res);
	}
};
