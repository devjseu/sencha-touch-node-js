/*jslint node: true */
/*
 The MIT License (MIT)

 Copyright (c) 2013 Sebastian Widelak

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


 */
"use strict";
function Base() {
    this.set('listeners', {});
    this.set('suspendEvents', false);
    this.bindMethods.apply(this, arguments);
    this.init.apply(this, arguments);
}

/**
 * abstract method
 */
Base.prototype.init = function () {
};

/**
 * abstract method
 */
Base.prototype.initConfig = function () {
};

/**
 * binds custom methods from config object to class instance
 */
Base.prototype.bindMethods = function (initOpts) {
    for (var property in initOpts) {
        if (initOpts.hasOwnProperty(property) && typeof initOpts[property] === 'function') {
            this[property] = initOpts[property].bind(this);
        }
    }
};

/**
 *
 * @param property
 * @param value
 * @returns {*}
 */
Base.prototype.set = function (property, value) {
    var p = "_" + property,
        oldVal = this[p];
    if (value !== oldVal) {
        this[p] = value;
        this.fireEvent(property + 'Change', this, value, oldVal);
    }
    return this;
};

/**
 *
 * @param property
 * @returns {*}
 */
Base.prototype.get = function (property) {
    return this["_" + property];
};

/**
 * fire event
 * @param evName
 * @returns {boolean}
 */
Base.prototype.fireEvent = function (evName /** param1, ... */) {
    if (!this._suspendEvents)
        return true;
    var ret = true, shift = Array.prototype.shift;
    shift.call(arguments);
    for (var i = 0, li = this._listeners[evName] || [], len = li.length; i < len; i++) {
        if (ret) {
            ret = li[i].call(shift.apply(arguments), arguments);
        }
    }
    return ret;
};

/**
 * fire event
 * @param evName
 * @param callback
 * @returns {this}
 */
Base.prototype.addListener = function (evName, callback) {
    var listeners = this._listeners[evName] || [];
    listeners.push(callback);
    this._listeners[evName] = listeners;
    return this;
};

/**
 * add callback to property change event
 * @param property
 * @param callback
 * @returns {this}
 */
Base.prototype.onChange = function (property, callback) {
    this.addListener(property + 'Change', callback);
    return this;
};

/**
 *
 * unbind callback
 * @param property
 * @param callback
 * @returns {this}
 */
Base.prototype.unbindOnChange = function (property, callback) {
    var listeners = this._listeners[property + 'Change'] || [];
    for (var i = 0, len = listeners.length; i < len; i++) {
        if (listeners[i] === callback) {
            listeners.splice(i, 1);
        }
    }
    this._listeners[property + 'Change'] = listeners;
    return this;
};

/**
 * suspend all events
 * @param {Boolean} suspend
 */
Base.prototype.suspendEvents = function (suspend) {
    suspend = suspend || true;
    this.set('suspendEvents', suspend);
};

/**
 * extend passed function
 * @static
 * @param Func
 * @returns {Function}
 */
Base.extend = function (Func) {
    var Parent = this,
        Class = function () {
            Func.prototype.constructor.apply(this, arguments);
        };
    for (var method in Parent.prototype) {
        if (Parent.prototype.hasOwnProperty(method)) {
            Class.prototype[method] = Parent.prototype[method];
        }
    }
    Class.extend = Base.extend;
    return Class;
};
module.exports = Base;