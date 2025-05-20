Ext.define('MyApp.model.monthlyModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'delivered', type: 'int'},
        {name: 'parcel', type: 'int'},
        {name: 'total_amount', type: 'float'},
        {name: 'amount_remitted', type: 'float'},
        {name: 'remarks', type: 'string'},
        {name: 'Dates', type: 'string'}
    ]
})