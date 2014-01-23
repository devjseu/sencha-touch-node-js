var Direct = require('../application/Direct'),
    async = require('async'),
    DXUser = new Direct('User'),
    User = DXUser.get('models').User;

/**
 * @param record
 * @param callback
 * Helper for save each record
 * separately
 */
function saveItem(record, callback) {
    var item,
        id = record._id;
    delete record._id;
    item = User(record);
    item.save(function (err, _record) {
        if (err) {
            err.clientId = id;
            callback(false, err);
        } else {
            record.clientId = id;
            record._id = _record._id;
            callback(false, record);
        }
    });
}

/**
 * @param record
 * @param callback
 * Helper for update each record
 * separately
 */
function updateItem(record, callback) {
    var id = record._id;

    delete record._id;
    User.update({"_id": id}, { $set: record}, {upsert: false}, function (err) {
        if (err) {
            err._id = id;
            callback(false, err);
        }
        else {
            record._id = id;
            callback(false, record);
        }
    });
}

/**
 * @param record
 * @param callback
 * Helper for destroy each record
 * separately
 */
function destroyItem(record, callback) {
    User.remove({"_id": record._id}, function (err) {
        if (!err) {
            callback({success: true});
        }
        else {
            callback({success: false});
        }
    });
}

DXUser.api({
    read: function (params, callback) {
        // if we pass an id it's means that we want to
        // get only one record
        if (params._id) {
            User.find({'_id': params._id}, function (err, records) {
                callback({success: true, User: records, total: records.length});
            });
            // in other case
        } else {
            var limit = params.limit,
                skip = params.start ? params.start - 1 : null,
                filters = {};
            // if filters exists
            if (params.filter) {
                // join them in one object
                params.filter.map(function (filter) {
                    filters[filter.property] = filter.value;
                });
            }
            // build query
            User.find(filters)
                .limit(limit)
                .skip(skip)
                // and execute them
                .exec(function (err, records) {
                    // run query to get count
                    User.count().exec(function (err, count) {
                        callback({success: true, User: records, total: count});
                    });
                });
        }
    },
    create: function (params, callback) {
        var _params = params instanceof Array ? params : [params];

        async.map(_params, saveItem, function (err, results) {
            callback({success: true, User: results});
        });
    },
    update: function (params, callback) {
        var _params = params instanceof Array ? params : [params];

        async.map(_params, updateItem, function (err, results) {
            callback({success: true, User: results});
        });
    },
    destroy: function (params, callback) {
        var _params = params instanceof Array ? params : [params];

        async.map(_params, destroyItem, function (err, results) {
            callback({success: true, User: results});
        });
    },
    isEmailUnique: function (params, callback) {
        var User = this.get('models').User;

        User.where('email', params).count(
            function (err, count) {
                if (err) throw err;
                callback({success: count < 1});
            }
        );
    }
});

module.exports = DXUser.expose();