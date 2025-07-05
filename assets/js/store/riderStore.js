Ext.define('MyApp.store.riderStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.riderModel',
    alias: 'widget.riderStore',

    storeId:'riderStore',
    
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

    groupField: 'full_name',
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            
        }
    }//end listen				 
    
});