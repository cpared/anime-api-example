const ApiFeatures = require('../utils/apiFeatures');
const Anime = require('../models/animeModel');
const response = require('../models/response');
const ApiError = require('../utils/appError');

// eslint-disable-next-line no-unused-vars
exports.getAllAnimes = async (req, res, next) => {
	const apiFeatures = new ApiFeatures(Anime.find(), req.params)
		.sort()
		.filter()
		.limitFields()
		.paginate();
	const animeData = await apiFeatures.getData();
	response.success(res, 200, animeData);
};

exports.getAnimeById = async (req, res, next) => {
	const apiFeatures = new ApiFeatures(Anime.findById(req.params.id), req.params);

	const animeData = await apiFeatures.getData();
	if (!animeData) return next(new ApiError(`Id not found`, 404));
	response.success(res, 200, animeData);
};

// eslint-disable-next-line no-unused-vars
module.createAnime = async (req, res, next) => {
	const animeData = await Anime.create(req.body);
	response.success(res, 201, animeData);
};

// eslint-disable-next-line no-unused-vars
module.updateAnime = async (req, res, next) => {
	const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	response.success(res, 200, anime);
};

module.deleteAnime = async (req, res, next) => {
	const anime = await Anime.findByIdAndDelete(req.params.id);

	if (!anime) return next(new ApiError(`Id not found`, 404));
	response.success(res, 204, anime);
};
