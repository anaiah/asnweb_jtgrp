Ext.define('MyApp.store.opmgrStore', {
    extend: 'Ext.data.Store',

    //model: 'MyApp.model.locationModel',
    //alias: 'widget.poStore',

    storeId:'opmgrStore',
    fields: [
        //{name: 'projectId', type: 'int'},
        {name: 'region', type: 'string'},
        {name: 'area', type: 'string'},
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
        url: `${myIp}/opmgr/summary/${util.getCookie('f_email')}`,
        // the return will be json, so lets set up a reader
        reader: {
            type: 'json'
        }
    },

    groupField: 'region',
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'load':(store)=>{
            var sm = Ext.getCmp('opmgrGrid').getSelectionModel();
            if (store.getCount() > 0 && !sm.hasSelection()) {
            
                sm.select(0);
            
                console.log('===opmgrStore.js onLoad() STORE PO LISTENING === store loaded w recs==' , store.data.length )
                console.log('===opmgrStore.js onLoad() GRID opmgr REGIONAL FIRST RECORD SELECTED ==' )
            
            }
        },
        'datachanged':(store,e)=>{ //this is triggered by store.loadData(array)
            
            //Ext.getCmp('opmgrGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});