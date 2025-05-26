Ext.define('MyApp.store.headareaStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.areaModel',
    //alias: 'widget.poStore',

    storeId:'headareaStore',
    
    remoteSort:true,

    proxy: {
        // load using HTTP
        type: 'ajax',
        //url: `${myIp}/headcoor/summary/${util.getCookie('f_email')}`,
        // the return will be json, so lets set up a reader
        reader: {
            type: 'json'
        }
    },

    groupField: 'area',
    autoLoad: false,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            //console.log('===headareaStore.js STORE PO LISTENING === store loaded w recs==' , store.data.length )
            //console.log('===headareaStore.js GRID PO headareaGrid FIRST RECORD SELECTED ==' )
            
            ///Ext.getCmp('headareaGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});