Ext.define('TutsApp.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.form.Panel',
        'Ext.dataview.List',
        'Ext.field.Password'
    ],
    config: {
        layout: {
            type: 'fit'
        },
        items: [
            {
                xtype: 'container',
                layout: {
                    type: 'vbox'
                },
                scrollable: true,
                items: [
                    {
                        // our form
                        xtype: 'formpanel',
                        itemId : 'form',
                        height: 220,
                        items : [
                            {
                                xtype : 'textfield',
                                label: 'Name:',
                                name : 'firstName'
                            },
                            {
                                xtype : 'textfield',
                                label: 'Surname:',
                                name : 'lastName'
                            },
                            {
                                xtype : 'textfield',
                                label: 'Email:',
                                name : 'email'
                            },
                            {
                                xtype : 'passwordfield',
                                label: 'Password:',
                                name : 'password'
                            },
                            {
                                xtype : 'button',
                                padding: 0,
                                text : 'add',
                                itemId: 'add'
                            }
                        ]
                    },
                    {
                        //and list view
                        xtype: 'list',
                        itemId: 'user-list',
                        minHeight: 350,
                        flex: 1,
                        itemTpl: [
                            '<div>{firstName} {lastName} ({email})</div>'
                        ],
                        store: 'UsersStore',
                        items: [
                            {
                                xtype: 'toolbar',
                                cls: 'portrait',
                                docked: 'bottom',
                                layout: {
                                    align: 'center',
                                    pack: 'center',
                                    type: 'hbox'
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        text: 'Refresh',
                                        itemId: 'list-refresh'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
