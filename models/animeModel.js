const mongoose = require('mongoose');

const animeSchema = mongoose.Schema(
	{
		id: {
			type: Number,
			require: true,
			unique: true,
		},
		type: {
			type: String,
			required: true,
		},
		attributes: [
			{
				startDate: Date,
				endDate: Date,
				ratingRank: Number,
				popularityRank: Number,
				synopsis: String,
				status: {
					type: String,
					enum: ['Finished', 'Airing'],
				},
				titles: [
					{
						en: String,
						en_jp: String,
						ja_jp: String,
					},
				],
				episodeCount: Number,
				ageRatingGuide: String,
			},
		],
	},
	{ versionKey: false }
);

const Anime = mongoose.model(
	'Anime',
	animeSchema
);

animeSchema.pre('validate', function (next) {
	if (this.startDate > this.endDate) {
		this.invalidate(
			'startDate',
			'Start date must be less than end date.',
			this.startDate
		);
	}
	next();
});

module.exports = Anime;
