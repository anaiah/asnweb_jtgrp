Ext.define('MyApp.store.opmgrRiderStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.riderModel',
    alias: 'store.opmgrriderstore',

    storeId:'opmgrRiderStore',
    
    //remoteSort:true,

    proxy: {
        // load using HTTP
        type: 'ajax',
        //url: `${myIp}/coor/ridersummary/${hub_search}`,
        // the return will be json, so lets set up a reader
        reader: {
            type: 'json'
        }
    },

    //groupField: 'full_name',
    autoLoad: false,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
      'load': function(store, records, successful, operation, eOpts) {
            console.log('===rider loading opmgr store loaded w recs==', store.data.length);
            if (records.length > 0) {
                console.log('Rider First Record Data:', records[0].getData());  // <-- Inspect first record
            }
        }
    }//end listen				 
    
});