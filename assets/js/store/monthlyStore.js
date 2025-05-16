Ext.define('MyApp.store.monthlyStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.monthlyModel',
    //alias: 'widget.poStore',

    storeId:'monthlyStore',
    pageSize:15,
    //groupField: 'po_number',
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            console.log('===monthlyStore.js STORE PO LISTENING === store loaded w recs==' , store.data.length )
            console.log('===monthlyStore.js GRID PO monthlyGrid FIRST RECORD SELECTED ==' )
            
            Ext.getCmp('monthlyGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});