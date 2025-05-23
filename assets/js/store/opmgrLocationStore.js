Ext.define('MyApp.store.opmgrLocationStore', {
    extend: 'Ext.data.Store',
    alias: 'store.opmgrlocationstore',
    storeId: 'opmgrLocationStore',
    model: 'MyApp.model.opmgrLocModel',  // set your model here
    listeners: {
        'load': function(store, records, successful, operation, eOpts) {
            console.log('===location loading opmgr store loaded w recs==', store.data.length);
            if (records.length > 0) {
                console.log('First Record Data:', records[0].getData());  // <-- Inspect first record
            }
        }
    }
});