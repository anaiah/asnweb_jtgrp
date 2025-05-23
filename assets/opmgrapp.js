


 
 //load ext
Ext.application({
    name: 'MyApp',
    appFolder: '/html/assets/js',

    // ... other configs ...
    requires: [
        'MyApp.overrides.GroupingSummary',  // <---- ADD THIS LINE
        'MyApp.overrides.SelectionModel',  // <---- ADD THIS LINE
        
    ],

    models: ['opmgrModel'],
    stores: 
    [
        'opmgrStore',
        // 'coordStore',
        // 'headStore',
        // 'opmgrStore'
    ],

    controllers:
    [   
        'coordController',
        // 'headCtrl',
        // 'opmgrCtrl',
    ],

    // Launch method - called when app is ready
    launch: function() {
        
        console.log('====Ext.app 4.2 Launch() ====',)
        MyApp.app = this    

        
        var locGrid = Ext.create('MyApp.view.opmgrGrid', {
            renderTo: 'region-grid',
            width: 500,
            height: 300
        });

        
        // then load the store
        /*
        var rideGrid = Ext.create('MyApp.view.riderGrid', {
            renderTo: 'rider_grid',
            width: 500,
            height: 400
        });
        */
    },
});
