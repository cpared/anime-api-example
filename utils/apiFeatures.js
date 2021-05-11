class ApiFeatures {
	constructor(query, queryStr) {
		this.query = query;
		this.queryStr = queryStr;
	}

	getData() {
		return this.query;
	}

	sort() {
		if (this.queryStr.sort) {
			const sortBy = this.queryStr.sort
				.split(',')
				.join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}
		return this;
	}

	filter() {
		let queryObj = { ...this.queryStr };

		const filterElements = [
			'sort',
			'page',
			'limit',
			'fields',
		];

		filterElements.forEach((element) => {
			delete queryObj[element];
		});

		//REGULAR EXPRESSION
		queryObj = JSON.stringify(queryObj).replace(
			/\b(ld|lde|gt|gte)\b/g,
			(match) => `$${match}`
		);

		this.query = this.query.find(
			JSON.parse(queryObj)
		);

		return this;
	}

	limitFields() {
		if (this.queryStr.fields) {
			const fields = this.queryStr.fields
				.split(',')
				.join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}

	paginate() {
		// convert into Integer or 1 as a default value
		const page = this.query.page * 1 || 1;
		const limit = this.query.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query
			.skip(skip)
			.limit(limit);
		return this;
	}
}

module.exports = ApiFeatures;
