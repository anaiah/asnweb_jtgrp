Ext.define('MyApp.model.areaModel', {
    extend: 'Ext.data.Model',
    
    fields: [
        //{name: 'projectId', type: 'int'},
        {name: 'coordinator', type: 'string'},
        {name: 'area', type: 'string'},
        {name: 'location', type: 'string'},
        {name: 'hub', type: 'string'},
        {name: 'parcel', type: 'int'},
        {name: 'amount', type: 'float'},
        {name: 'parcel_delivered', type: 'int'},
        {name: 'amount_remitted', type: 'float'},
        {name: 'qty_pct', type: 'float'},
        // {name: 'cost', type: 'float'},
        // {name: 'due', type: 'date', dateFormat:'m/d/Y'}
    ],


})