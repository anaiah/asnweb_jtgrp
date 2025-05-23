Ext.define('MyApp.model.opmgrModel', {
    extend: 'Ext.data.Model',
    fields: [
        //{name: 'projectId', type: 'int'},
        {name: 'region', type: 'string'},
        {name: 'area', type: 'string'},
        {name: 'parcel', type: 'int'},
        {name: 'amount', type: 'float'},
        {name: 'parcel_delivered', type: 'int'},
        {name: 'amount_remitted', type: 'float'},
        {name: 'qty_pct', type: 'int'},
        // {name: 'cost', type: 'float'},
        // {name: 'due', type: 'date', dateFormat:'m/d/Y'}
    ],
})