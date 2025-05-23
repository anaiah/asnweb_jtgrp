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
            var sm = Ext.getCmp('opmgrGrid').getSelectionModel();
            if (store.getCount() > 0 && !sm.hasSelection()) {
            
                //sm.select(0);
            
                console.log('===opmgrStore.js onLoad() STORE PO LISTENING === store loaded w recs==' , store.data.length )
                console.log('===opmgrStore.js onLoad() GRID opmgr REGIONAL FIRST RECORD SELECTED ==' )
            
            }
        },
        'datachanged':(store,e)=>{ //this is triggered by store.loadData(array)
            
            //Ext.getCmp('opmgrGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});