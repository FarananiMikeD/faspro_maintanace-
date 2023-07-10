// class APIFeatures {
//     constructor(query, queryString) {
//         this.query = query;
//         this.queryString = queryString;
//     }

//     filter() {
//         const queryObj = { ...this.queryString };
//         const excludedFields = ['page', 'sort', 'limit', 'fields'];
//         excludedFields.forEach(el => delete queryObj[el]);

//         // 1B) Advanced filtering
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//         this.query = this.query.find(JSON.parse(queryStr));

//         return this;
//     }

//     sort() {
//         if (this.queryString.sort) {
//             const sortBy = this.queryString.sort.split(',').join(' ');
//             this.query = this.query.sort(sortBy);
//         } else {
//             this.query = this.query.sort('-createdAt');
//         }

//         return this;
//     }

//     limitFields() {
//         if (this.queryString.fields) {
//             const fields = this.queryString.fields.split(',').join(' ');
//             this.query = this.query.select(fields);
//         } else {
//             this.query = this.query.select('-__v');
//         }

//         return this;
//     }

//     paginate() {
//         const page = this.queryString.page * 1 || 1;
//         const limit = this.queryString.limit * 1 || 100;
//         const skip = (page - 1) * limit;

//         this.query = this.query.skip(skip).limit(limit);

//         return this;
//     }
// }
// module.exports = APIFeatures;






//* chatGPT
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    search() {
        if (this.queryString.search) {
            const searchObj = {};
            const searchKeys = Object.keys(this.query.schema.obj).filter(
                (key) => key !== '__v'
            );
            searchKeys.forEach((key) => {
                searchObj[key] = {
                    $regex: this.queryString.search,
                    $options: 'i',
                };
            });

            this.query = this.query.find(searchObj);
        }

        return this;
    }


    populate() {
        if (this.queryString.populate) {
            const populateFields = this.queryString.populate.split(',').join(' ');
            this.query = this.query.populate(populateFields);
        }

        return this;
    }

    aggregate() {
        if (this.queryString.aggregate) {
            const aggregateObj = JSON.parse(this.queryString.aggregate);
            this.query = this.query.aggregate(aggregateObj);
        }

        return this;
    }
}

module.exports = APIFeatures;
