Ext.define('MyApp.store.clientStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.Client',
    //alias: 'widget.poStore',

    storeId:'clientStore',
    //autoLoad: true,
    
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            console.log('===STORE CLIENT LISTENING === store loaded w recs==' , store.data.length )
            
        }
    }//end listen				 
    
});