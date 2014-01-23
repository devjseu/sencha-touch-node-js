Ext.define('TutsApp.store.Users', {
    extend: 'Ext.data.Store',

    requires: [
        'TutsApp.model.User'
    ],

    config: {
        autoLoad: false,
        autoSync: false,
        model: 'TutsApp.model.User',
        storeId: 'UsersStore',
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
    }
});