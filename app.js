const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

app = express();
app.use(express.json());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.all('*', (req, res, next) => {
	next(
		new AppError(
			`Route ${req.originalUrl} not found`
		),
		404
	);
});

app.use(errorHandler);

module.exports = app;