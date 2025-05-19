Ext.define('MyApp.store.riderStore', {
    extend: 'Ext.data.Store',

    //model: 'MyApp.model.locationModel',
    //alias: 'widget.poStore',

    storeId:'riderStore',
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

    remoteSort:true,

    proxy: {
        // load using HTTP
        type: 'ajax',
        url: `${myIp}/coor/summary/${util.getCookie('f_email')}`,
        // the return will be json, so lets set up a reader
        reader: {
            type: 'json'
        }
    },

    groupField: 'full_name',
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            console.log('===riderStore.js STORE PO LISTENING === store loaded w recs==' , store.data.length )
            console.log('===riderStore.js GRID PO riderGrid FIRST RECORD SELECTED ==' )
            
            Ext.getCmp('riderGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});