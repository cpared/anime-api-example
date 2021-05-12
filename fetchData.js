const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Config your database properties
// Look that you need to install dotenv as a dependency
const user = process.env.DBUSER;
const password = process.env.DBPASSWORD;
const database = process.env.DATABASE;

const DB = `mongodb+srv://${user}:${password}@cluster0.eltjt.mongodb.net/${database}?retryWrites=true&w=majority`;

// Create a database connection
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection success!'))
	.catch((err) => {
		console.log(err);
	});

// Create your database Schema
const jsonSchema = mongoose.Schema({
	id: {
		type: Number,
	},
	type: {
		type: String,
	},
	attributes: [
		{
			startDate: Date,
			endDate: Date,
			ratingRank: Number,
			popularityRank: Number,
			synopsis: String,
			status: String,
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
});

// Set schema
const Anime = mongoose.model('Anime', jsonSchema);

// Fetch data from and external font
// I made this to use mongoose in my project
const fetchData = (num) => {
	axios
		.get(`https://kitsu.io/api/edge/anime/${num}`)
		.then(async (res) => {
			let data = createJsonByReq(res.data);
			await Anime.create(data);
		})
		.catch((err) => {
			console.log(err);
		});
};

const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
};

// Insert into DB
const insertMultipleData = async () => {
	const randomList = new Map();
	const max = 1000;
	for (let i = 0; i < max; i++) {
		let randomValue = getRandomInt(max);
		while (randomList.has(randomValue)) randomValue = getRandomInt(max);
		randomList.set(randomValue, randomValue);
		await fetchData(randomValue);
	}
};

// Parse fetched data into Json database model
const createJsonByReq = (req) => {
	return {
		id: req.data.id,
		type: req.data.type,
		attributes: [
			{
				startDate: req.data.attributes.startDate,
				endDate: req.data.attributes.endDate,
				ratingRank: req.data.attributes.ratingRank,
				popularityRank: req.data.attributes.popularityRank,
				synopsis: req.data.attributes.synopsis,
				status: req.data.attributes.status,
				titles: [
					{
						en: req.data.attributes.titles.en,
						en_jp: req.data.attributes.titles.en_jp,
						ja_jp: req.data.attributes.titles.ja_jp,
					},
				],
				episodeCount: req.data.attributes.episodeCount,
				ageRatingGuide: req.data.attributes.ageRatingGuide,
			},
		],
	};
};

insertMultipleData();
