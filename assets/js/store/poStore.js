Ext.define('MyApp.store.monthlyStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.monthlyModel',
    //alias: 'widget.poStore',

    storeId:'monthlyStore',
    //groupField: 'po_number',
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            console.log('===poStore.js STORE PO LISTENING === store loaded w recs==' , store.data.length )
            console.log('===poStore.js GRID PO monthlyGrid FIRST RECORD SELECTED ==' )
            
            Ext.getCmp('monthlyGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});