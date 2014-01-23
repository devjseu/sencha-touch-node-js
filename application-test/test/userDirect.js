var nconf = require('nconf'),
    mongoose = require('mongoose'),
    User = require('../../application/model/User'),
    DirectUser = require('../../direct/DXUser.js'),
    users,
    user,
    conf,
    id,
    n = 0,
    userNumber20;
// load db config
nconf.env().file({ file: 'config.json'});
console.log('test');
conf = nconf.get("MongooseConfig");

User.remove({}, function (err) {
});

// called before each test
exports.setUp = function (callback) {
    console.log('set up');
    mongoose.connect(conf.dbPath + conf.db + 'Test');
    callback();
//clear table
};

// called after each test
exports.tearDown = function (callback) {
    callback();
    mongoose.disconnect();
    console.log('disconnect');
};

/**
 * Generate unique string
 * @returns {string}
 */
function uniqueString() {
    var text = "",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        i;
    for (i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text + n++;
}

//create
exports.createOne = function (test) {
    console.log('testing createOne');
    test.expect(2);
    DirectUser.create({
        _id: 0,
        email: 'user@test.com',
        firstName: 'First',
        lastName: 'Last',
        password: '2342j323h4'
    }, function (response) {
        test.ok(response.success, "Cant create User");
        test.equal(response.User.length, 1, "User not created");
        user = response.User[0];
        test.done();
    });
};

exports.createMoreThanOne = function (test) {
    console.log('testing createMoreThanOne');
    var params = [],
        len = Math.floor((Math.random() * 70) + 30),
        i;
    for (i = 0; i < len; i++) {
        params.push({
            _id: i + 1,
            email: uniqueString() + '@test.com',
            firstName: 'Temporary',
            lastName: 'Person',
            password: '2342j323h429'
        });
    }
    DirectUser.create(
        params,
        function (response) {
            test.ok(response.User.length > 1, "Cant create Users");
            users = response.User;
            test.done();
        });
};
//read
exports.readById = function (test) {
    console.log('testing readById');
    test.expect(2);
    DirectUser.read({_id: user._id},
        function (response) {
            test.ok(response.success, "Cant read user with id " + user._id);
            test.equal(response.User.length, 1, "Number of returned models different than expected");
            test.done();
        });
};
//
exports.readAll = function (test) {
    console.log('testing readAll');
    test.expect(3);
    DirectUser.read({},
        function (response) {
            test.ok(response.success, "Cant read users");
            test.ok(users.length + 1 === response.total, "Total number of rows should be equal users in array");
            test.ok(response.User.length > 1, "Number of returned models different than expected");
            test.done();
        });
};
//
exports.readAllWithLimit = function (test) {
    console.log('testing readAllWithLimit');
    test.expect(3);
    DirectUser.read({
            limit: 20
        },
        function (response) {
            test.ok(response.success, "Cant read users");
            test.equal(response.User.length, 20, "Total number of rows should be equal users in array");
            test.ok(response.User.length > 1, "Number of returned models different than expected");
            userNumber20 = response.User[19];
            test.done();
        });
};
//
exports.readAllWithStart = function (test) {
    console.log('testing readAllWithLimit');
    test.expect(3);
    DirectUser.read({
            start: 20,
            limit: 1
        },
        function (response) {
            test.ok(response.success, "Cant read users");
            test.equal(response.User[0].email, userNumber20.email, "Email should be the same");
            test.equal(response.User.length, 1, "Number of returned models different than expected");
            test.done();
        });
};
//
exports.readWithOneFilter = function (test) {
    console.log('testing readWithOneFilter');
    test.expect(2);
    DirectUser.read({
            filter: [
                {
                    property: 'firstName',
                    value: 'First'
                }
            ]
        },
        function (response) {
            test.ok(response.success, "Cant read users");
            console.log('readWithOneFilter: Number of returned models ' + response.User.length);
            test.equal(response.User.length, 1, "Number of returned models different than expected");
            test.done();
        });
};
//
exports.readWithMultipleFilters = function (test) {
    console.log('testing readWithMultipleFilters');
    test.expect(2);
    DirectUser.read({
            filter: [
                {
                    property: 'email',
                    value: 'user@test.com'
                },
                {
                    property: 'lastName',
                    value: 'Last'
                }
            ]
        },
        function (response) {
            test.ok(response.success, "Cant read users");
            console.log('readWithMultipleFilters: Number of returned models ' + response.User.length);
            test.equal(response.User.length, 1, "Number of returned models different than expected");
            test.done();
        });
};
////update
exports.editOneUser = function (test) {
    console.log('testing editOneUser');
    DirectUser.update({
        _id: user._id,
        firstName: 'EditTest'
    }, function (response) {
        test.ok(response.success);
        test.done();
    });
};
//
exports.editMultipleUsers = function (test) {
    console.log('testing editMultipleUsers');
    var modifiedUsers = [];
    for (var i = 0, l = users.length; i < l; i++) {
        modifiedUsers.push({
            _id: users[i]._id,
            firstName: uniqueString()
        });
    }
    DirectUser.update(modifiedUsers, function (response) {
        test.ok(response.success);
        test.done();
    });
};
//////custom
exports.emailShouldBeUnique = function (test) {
    console.log('testing emailShouldBeUnique');
    DirectUser.isEmailUnique(uniqueString() + "@test.com",
        function (response) {
            test.ok(response.success, "Email should be unique but seems to be duplicated");
            test.done();
        });
};
//
exports.emailShouldBeDuplicated = function (test) {
    console.log('testing emailShouldBeDuplicated');
    DirectUser.isEmailUnique("user@test.com",
        function (response) {
            test.ok(!response.success, "Email should be duplicated but seems to be unique");
            test.done();
        });
};
////destroy
exports.destroyOneUser = function (test) {
    console.log('testing destroyOneUser');
    test.expect(1);
    DirectUser.destroy([
        {
            id: user._id
        }
    ], function (result) {
        test.ok(result.success, "Cant remove record");
        test.done();
    });
};

exports.destroyMultipleUsers = function (test) {
    console.log('testing destroyMultipleUsers');
    test.expect(1);
    DirectUser.destroy(users, function (response) {
        test.ok(response.success, "Cant remove records");
        test.done();
    });
};