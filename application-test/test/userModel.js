var nconf = require('nconf'),
    mongoose = require('mongoose'),
    User = require('../../application/model/User'),
    conf,
    id;
// load db config
nconf.env().file({ file: 'config.json'});
conf = nconf.get("MongooseConfig");

User.remove({}, function (err) {
});

// call before each test
exports.setUp = function (callback) {
    // connect to a test database
    mongoose.connect(conf.dbPath + conf.db + 'Test');
    callback();
//clear table
};

// call after each test
exports.tearDown = function (callback) {
    // disconnect from db
    mongoose.disconnect();
    callback();
};

exports.create = function (test) {
    console.log('running create user test');
    // tell nodeunit  how many assertion
    // should expect
    test.expect(2);
    var item = new User({
        email: 'sebakpl@test.com',
        firstName: 'First',
        lastName: 'Last',
        password: '2342j323h4'
    });
    //save model
    item.save(function (err, record) {
        if (!err) {
            // check if record was created (first assertion)
            test.ok(record, "Record was not created");
            id = record._id;
        }
        // check if any error occurred (second assertion)
        test.ifError(err);
        // finish test
        test.done();
    });
};

exports.read = function (test) {
    console.log('running read user test');
    test.expect(3);
    User.find({}, function (err, records) {
        if (!err) {
            console.log('results' + records);
            test.ok(records, "Response was empty");
            // check if we have only one record
            test.equal(records.length, 1);
        } else {
            console.log('error' + err);
        }
        test.ifError(err);
        test.done();
    });
};

exports.update = function (test) {
    console.log('running update user test');
    test.expect(3);
    User.update({"_id": id}, {
        firstName: 'First2'
    }, {upsert: false}, function (err, numberAffected, raw) {
        if (!err) {
            console.log('id of document: ' + id);
            test.ok(raw.ok, 'Update failed');
            test.equal(numberAffected, 1, 'Exactly one record should be updated');
        } else {
            console.log('error' + err);
        }
        test.ifError(err);
        test.done();
    });
};

exports.destroy = function (test) {
    test.expect(2);
    console.log('running destroy user test');
    User.remove({"_id": id}, function (err) {
        if (!err) {
            console.log('object destroyed');
            test.ok(true);
        } else {
            test.ok(false, "Document not destroyed");
            console.log('error ' + err);
        }
        test.ifError(err);
        test.done();
    });
};
