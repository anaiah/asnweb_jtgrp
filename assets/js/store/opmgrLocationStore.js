Ext.define('MyApp.store.opmgrLocationStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.opmgrLocModel',
    //alias: 'widget.poStore',

    storeId:'opmgrLocationStore',
    

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
        'load':(store,e)=>{
            //Ext.getCmp('opmgrLocationGrid').getView().refresh(); // <---- Try this
            console.log('===location loading opmgr store loaded w recs==' , store.data.length )
            // console.log('===locationStore.js GRID PO locationGrid FIRST RECORD SELECTED ==' )
            
            Ext.getCmp('opmgrLocationGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});