


 
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
        'opmgrLocationStore'
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

 
        Ext.define('MyApp.view.OpmgrLocGrid', {
            extend: 'Ext.grid.Panel',
            alias: 'widget.opmgrlocgrid',
            title: 'Opmgr Grid',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'data1', 'data2'],
                data: [
                    { name: 'Record 1', data1: 10, data2: 20 },
                    { name: 'Record 2', data1: 30, data2: 40 }
                ]
            }),
            columns: [
                { text: 'Name', dataIndex: 'name', flex: 1 },
                { text: 'Data 1', dataIndex: 'data1', flex: 1 },
                { text: 'Data 2', dataIndex: 'data2', flex: 1 }
            ],
            height: 400
        });


        //make container later
        Ext.define('MyApp.view.OpmgrContainer', {
            extend: 'Ext.panel.Panel',
            alias: 'widget.opmgrcontainer',
            layout: 'fit',
            items: [
                {
                    //xtype: 'opmgrLocationGrid'
                    xtype:'opmgrlocationgrid'
                }
            ],
            renderTo: 'location-grid'
        });

       
        Ext.create('MyApp.view.OpmgrContainer');
        
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
