Ext.define('MyApp.store.opmgrcalendarStore', {
    extend: 'Ext.data.Store',

    model: 'MyApp.model.monthlyModel',
    //alias: 'widget.poStore',

    storeId:'opmgrcalendarStore',
    
    //groupField: 'po_number',
    //autoLoad: true,
    //data:[{po_number:'', invoice_number:''}], //blank
    
    listeners: {
        'datachanged':(store,e)=>{
            console.log('opmgrcalendarStore.js STORE LISTENING === store loaded w recs==' , store.data.length )
            
        }
    }//end listen				 
    
});