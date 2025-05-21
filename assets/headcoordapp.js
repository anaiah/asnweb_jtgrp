 //load ext
Ext.application({
    name: 'MyApp',
    appFolder: '/html/assets/js',
    //models: ['monthlyModel'],
    stores: 
    [
        'headareaStore',
        // 'coordStore',
        // 'headStore',
        // 'opmgrStore'
    ],

    controllers:
    [   
        'coordController',
        // 'coordCtrl',
        // 'headCtrl',
        // 'opmgrCtrl',
    ],

    // Launch method - called when app is ready
    launch: function() {
        
        console.log('====Ext.app 4.2 Launch() ====',)
        MyApp.app = this    

        
        var locGrid = Ext.create('MyApp.view.headareaGrid', {
            renderTo: 'area-grid',
            width: 500,
            height: 300
        });
        /*
        var rideGrid = Ext.create('MyApp.view.riderGrid', {
            renderTo: 'rider_grid',
            width: 500,
            height: 400
        });
        */
    },
});
