const catchAsync = require('../utils/catchAsync');
const service = require('../service/authService');

exports.singup = catchAsync(service.singup);
