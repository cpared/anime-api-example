const express = require('express');
const controller = require('../controllers/animeController');

const router = express.Router();

router
	.route('/animes')
	.get(controller.getAnimes)
	.post(controller.createAnime);

router
	.route('/animes/:id')
	.get(controller.getAnimeById)
	.put(controller.updateAnime)
	.delete(controller.deleteAnime);

module.exports = router;
