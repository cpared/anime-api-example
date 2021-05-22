const catchAsync = require('../utils/catchAsync');
const service = require('../service/authService');

exports.singup = catchAsync(service.singup);
exports.login = catchAsync(service.login);
exports.protect = catchAsync(service.protect);
exports.restrictTo = service.restrictTo;
