Ext.define('MyApp.store.headareaStore', {
    extend: 'Ext.data.Store',

    //model: 'MyApp.model.locationModel',
    //alias: 'widget.poStore',

    storeId:'headareaStore',
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

    remoteSort:true,

    proxy: {
        // load using HTTP
        type: 'ajax',
        url: `${myIp}/headcoor/summary/${util.getCookie('f_email')}`,
        // the return will be json, so lets set up a reader
        reader: {
            type: 'json'
        }
    },

    groupField: 'area',
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            console.log('===headareaStore.js STORE PO LISTENING === store loaded w recs==' , store.data.length )
            console.log('===headareaStore.js GRID PO headareaGrid FIRST RECORD SELECTED ==' )
            
            Ext.getCmp('headareaGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});