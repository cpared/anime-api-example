const catchAsync = require('../utils/catchAsync');
const service = require('../service/service');

exports.getAnimes = catchAsync(
	service.getAllAnimes
);

exports.getAnimeById = catchAsync(
	service.getAnimeById
);

exports.createAnime = catchAsync(
	service.createAnime
);

exports.updateAnime = catchAsync(
	service.updateAnime
);

exports.deleteAnime = catchAsync(
	service.deleteAnime
);
