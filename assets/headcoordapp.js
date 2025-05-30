 //load ext
Ext.application({
    name: 'MyApp',
    appFolder: '/html/assets/js',
    //appFolder: 'assets/js',
    
    models: ['opmgrModel','riderModel', 'locationModel','monthlyModel','areaModel'], //monthlyModel is  for Calendargrid
    
    // ... other configs ...
    requires: [
        'MyApp.overrides.GroupingSummary',  // <---- ADD THIS LINE
        'MyApp.overrides.SelectionModel',  // <---- ADD THIS LINE
        'MyApp.view.locationGrid',  // <---- ADD THIS LINE
        'MyApp.view.riderGrid',  // <---- ADD THIS LINE
        'MyApp.view.opmgrcalendarGrid',  // <---- ADD THIS LINE
    ],

    stores: 
    [
        'locationStore',
        'riderStore',
        'opmgrcalendarStore',
        'headareaStore'

        // 'coordStore',
        // 'headStore',
        // 'opmgrStore'
    ],

    controllers:
    [   
        'MyApp.controller.coordController',
        // 'coordCtrl',
        // 'headCtrl',
        // 'opmgrCtrl',
    ],


    // Launch method - called when app is ready
    launch: function() {
        
        console.log('====Ext.app 4.2 Launch() ====',)
        MyApp.app = this    

        
        var areaGrid = Ext.create('MyApp.view.headareaGrid', {
            renderTo: 'area-grid',
            width: 500,
            height: 300
        });

        var locGrid = Ext.create('MyApp.view.locationGrid', {
            renderTo: 'location-grid',
            width: 500,
            height: 300
        });

        var ridergrid = Ext.create('MyApp.view.riderGrid', {
            renderTo: 'rider-grid',
            //title:'Regional Performance Summary',
            width: 500,
            height: 200
        });

        var calendargrid = Ext.create('MyApp.view.opmgrcalendarGrid', {
            renderTo: 'calendar-grid',
            //title:'Regional Performance Summary',
            width: 500,
            height: 300
        });

    },
});
