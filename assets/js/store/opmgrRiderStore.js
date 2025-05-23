Ext.define('MyApp.store.opmgrRiderStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.riderModel',
    alias: 'widget.opmgrRiderStore',

    storeId:'opmgrRiderStore',
    
    remoteSort:true,

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
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            console.log('===riderStore.js STORE PO LISTENING === store loaded w recs==' , store.data.length )
            console.log('===riderStore.js GRID PO riderGrid FIRST RECORD SELECTED ==' )
            Ext.getCmp('locationGrid').setLoading(false)
            Ext.getCmp('riderGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});