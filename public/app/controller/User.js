Ext.define('TutsApp.controller.User', {
    extend: 'Ext.app.Controller',
    config: {
        stores: [
            'TutsApp.store.Users'
        ],
        refs: {
            refreshButton: '[itemId=list-refresh]',
            addButton: '[itemId=add]',
            form: '[itemId=form]',
            list: '[itemId=user-list]'
        },
        control: {
            refreshButton: {
                tap: 'onRefresh'
            },
            addButton: {
                tap: 'onAdd'
            }
        }
    },
    launch: function () {
        this.callParent(arguments);
    },
    /**
     * get list store
     * @returns {Store}
     */
    getListStore: function () {
        return this.getList().getStore();
    },
    /**
     * refresh list view
     */
    onRefresh: function () {
        this.getListStore().load();
    },
    /**
     * add new records
     */
    onAdd: function () {
        var me = this,
            values = me.getForm().getValues(),
            users = me.getListStore(),
            user = users.getModel(),
            data = "",
            errors,
            instance;
        // create new instance of model
        // with data from form
        instance = user.create(values);
        // validate it
        errors = instance.validate();
        if (instance.isValid()) {
            // if all data are valid
            user.isEmailUnique(values.email, function (result) {
                // check if email is unique
                if(result.success){
                    // if yes add to store
                    users.add(values);
                    users.sync();
                }else{
                    // or display error message
                    data = "Email should be unique";
                    Ext.Msg.alert("Validation Failed", data);
                }
            });
        } else {
            // if errors occurred show
            // alert with description
            errors.each(function (item) {
                data = data + item.getField() + ' - ' + item.getMessage() + '<br>';
            });
            Ext.Msg.alert("Validation Failed", data);
        }
    }
});

