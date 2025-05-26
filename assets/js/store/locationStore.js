Ext.define('MyApp.store.locationStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.locationModel',
    //alias: 'widget.poStore',

    storeId:'locationStore',
    
    remoteSort:true,

    proxy: {
        // load using HTTP
        type: 'ajax',
        //url: `${myIp}/coor/summary/${util.getCookie('f_email')}`,
        // the return will be json, so lets set up a reader
        reader: {
            type: 'json'
        }
    },

    groupField: 'location',
    autoLoad: false,

    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            //console.lo
            //console.log('===locationStore.js STORE PO LISTENING === store loaded w recs==' , store.data.length )
            console.log('===locationStore.js locationGrid FIRST RECORD SELECTED ==' )
            
           // Ext.getCmp('locationGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});