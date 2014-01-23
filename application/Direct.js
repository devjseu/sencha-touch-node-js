var Base = require('./Base');

var Direct = Base.extend(function (model) {
    var models = {};
    Array.prototype.forEach.call(arguments, function (arg) {
        if (typeof arg === 'string') {
            models[arg] = require('../application/model/' + arg);
        } else {
            throw Error("Model name is not a string");
        }
    });
    this.set('models', models);
});

/**
 *
 * @param scope
 * @param directApi
 * @returns {Function}
 */
Direct.prototype.resolve = function (scope, directApi) {
    return function (params, callback) {
        directApi.apply(scope, arguments);
    };
};

/**
 * Set api method
 * @param api
 */
Direct.prototype.api = function (api) {
    var me = this,
        _api = {},
        key,
        func;
    for (key in api) {
        if (api.hasOwnProperty(key)) {
            func = me.resolve(me, api[key]);
            _api[key] = func;
        }
    }
    this.set('api', _api);
};

/**
 * Expose api
 * @returns {*}
 */
Direct.prototype.expose = function () {
    return this.get('api');
};
module.exports = Direct;