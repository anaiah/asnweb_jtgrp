Ext.define('MyApp.model.riderModel', {
    extend: 'Ext.data.Model',
    fields: [
        //{name: 'projectId', type: 'int'},
        {name: 'id', type: 'int'},
        {name: 'full_name', type: 'string'},
        {name: 'emp_id', type: 'int'},
        {name: 'hub', type: 'string'},
        {name: 'qty', type: 'int'},
        {name: 'actual_qty', type: 'int'},
        {name: 'amt', type: 'float'},
        {name: 'actual_amount', type: 'float'},
        {name: 'delivered_pct', type: 'float'},
        {name: 'undelivered_pct', type: 'float'},
        {name: 'transactions', type: 'int'},
        // {name: 'cost', type: 'float'},
        // {name: 'due', type: 'date', dateFormat:'m/d/Y'}
    ],

})