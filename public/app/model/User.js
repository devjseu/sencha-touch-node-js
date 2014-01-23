Ext.define('TutsApp.model.User', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: '_id',
        fields: [
            {
                name: 'firstName'
            },
            {
                name: 'lastName'
            },
            {
                name: 'email'
            },
            {
                name: 'password'
            },
            {
                name: '_id'
            },
            {
                name: 'createdAt',
                defaultValue: +new Date(),
                convert: function (value) {
                    return new Date(value);
                }
            }
        ],
        validations: [
            {type: 'presence', field: 'firstName'},
            {type: 'length', field: 'firstName', min: 5},
            {type: 'presence', field: 'lastName'},
            {type: 'presence', field: 'password'},
            {type: 'length', field: 'password', min: 7},
            {type: 'presence', field: 'email'},
            {type: 'format', field: 'email', matcher: /[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/}
        ],
        proxy: {
            type: 'direct',
            api: {
                create: 'ExtRemote.DXUser.create',
                read: 'ExtRemote.DXUser.read',
                update: 'ExtRemote.DXUser.update',
                destroy: 'ExtRemote.DXUser.destroy'
            },
            reader: {
                type: 'json',
                rootProperty: 'User'
            }
        }
    },
    statics: {
        isEmailUnique : function (value, callback) {
            ExtRemote.DXUser.isEmailUnique(value, callback);
        }
    }
});
