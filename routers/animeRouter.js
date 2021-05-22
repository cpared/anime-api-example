const express = require('express');
const controller = require('../controllers/animeController');
const authController = require('../controllers/authController');

const router = express.Router();

router
	.route('/')
	.get(authController.protect, controller.getAnimes)
	.post(controller.createAnime);

router
	.route('/:id')
	.get(controller.getAnimeById)
	.put(controller.updateAnime)
	.delete(authController.protect, authController.restrictTo('admin'), controller.deleteAnime);

module.exports = router;
