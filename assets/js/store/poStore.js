Ext.define('MyApp.store.poStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.PO',
    //alias: 'widget.poStore',

    storeId:'poStore',
    groupField: 'po_number',
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            console.log('===STORE PO LISTENING === store loaded w recs==' , store.data.length )
            console.log('===GRID PO poGrid FIRST RECORD SELECTED ==' )
            
            Ext.getCmp('poGrid').getSelectionModel().select(0);

        }
    }//end listen				 
    
});