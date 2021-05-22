require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

//Catch every programing error and stop the app
process.on('uncaughtException', (err) => {
	console.log(err);
	process.exit(1);
});

const port = process.env.PORT;
const user = process.env.DBUSER;
const password = process.env.DBPASSWORD;
const database = process.env.DATABASE;

const DB = `mongodb+srv://${user}:${password}@cluster0.eltjt.mongodb.net/${database}?retryWrites=true&w=majority`;

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection success!'));

const server = app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});
