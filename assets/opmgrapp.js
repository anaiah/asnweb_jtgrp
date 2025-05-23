 // Ext.Loader.setConfig(...);  // If you have Ext.Loader config, it goes BEFORE this
Ext.define('MyApp.overrides.GroupingSummary', {
    override: 'Ext.grid.feature.GroupingSummary',
    init: function() {
        console.log('MyApp.overrides.GroupingSummary is being applied!');
        this.callParent(arguments);
    },
    generateSummaryData: function(groupName, records, generateEmpty) {
        console.log('generateSummaryData called for group:', groupName);
        console.log('Records:', records);
        var summary = this.callParent(arguments);
        console.log('Summary:', summary);
        return summary;
    }
});

Ext.define('MyApp.overrides.SelectionModel', {
    override: 'Ext.selection.Model',
    select: function(records, keepExisting, suppressEvent) {
        console.log('Ext.selection.Model.select called with:', records, keepExisting, suppressEvent);
        this.callParent(arguments); // Call the original method
    }
});
 
 //load ext
Ext.application({
    name: 'MyApp',
    appFolder: '/html/assets/js',
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
