Ext.define('MyApp.store.opmgrStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.opmgrModel',
    //alias: 'widget.poStore',

    storeId:'opmgrStore',
    

    remoteSort:true,
    /*
    proxy: {
        // load using HTTP
        type: 'ajax',
        url: `${myIp}/opmgr/summary/${util.getCookie('f_email')}`,
        // the return will be json, so lets set up a reader
        reader: {
            type: 'json'
        }
    },
    */

    groupField: 'region',
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'load':(store)=>{
             //   console.log('===opmgrStore.js onLoad() STORE PO LISTENING === store loaded w recs==' , store.data.length )
           
        },
        'datachanged':(store,e)=>{ //this is triggered by store.loadData(array)
            
           // console.log('===opmgrStore.js dataChanged() STORE PO LISTENING === store loaded w recs==' , store.data.length )
           
            //Ext.getCmp('opmgrGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});