Ext.define('MyApp.model.PO', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'po_number', type: 'string'},
        {name: 'invoice_number', type: 'string'},
        {name: 'qty', type: 'int'},
        {name: 'total', type: 'float'},
        {name: 'eqpt_no', type: 'string'},
        {name: 'serial', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'transaction', type: 'string'},
        {name: 'po_date', type: 'string'},
        {name: 'remarks', type: 'string'},
        {name: 'avatarurl', type: 'string'},
        {name: 'client', type: 'string'},
        {name: 'company', type: 'string'}
        
        
    ]

});