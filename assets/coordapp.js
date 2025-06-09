 //load ext
Ext.application({
    name: 'MyApp',
    appFolder: '/html/assets/js',
    
    //appFolder: 'assets/js',
    
    models: ['opmgrModel','riderModel', 'locationModel','monthlyModel'], //monthlyModel is  for Calendargrid
    
    // ... other configs ...
    requires: [
        'MyApp.overrides.GroupingSummary',  // <---- ADD THIS LINE
        'MyApp.overrides.SelectionModel',  // <---- ADD THIS LINE
        'MyApp.view.locationGrid',  // <---- ADD THIS LINE
        'MyApp.view.riderGrid',  // <---- ADD THIS LINE
        'MyApp.view.opmgrcalendarGrid',  // <---- ADD THIS LINE
        'MyApp.view.MyWindow',  // <---- ADD THIS LINE
    ],

    stores: 
    [
        'locationStore',
        'riderStore',
        'opmgrcalendarStore',

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

        var locGrid = Ext.create('MyApp.view.locationGrid', {
            renderTo: 'location-grid',
            width: 500,
            height: 300
        });
        var rideGrid = Ext.create('MyApp.view.riderGrid', {
            renderTo: 'rider-grid',
            width: 500,
            height: 250
        });
        var calendarGrid = Ext.create('MyApp.view.opmgrcalendarGrid', {
            renderTo: 'calendar-grid',
            width: 500,
            height: 300
        });

       
        //win.show(); // or just call show() in code, then center()

    },
});
