


 
 //load ext
Ext.application({
    name: 'MyApp',
    appFolder: '/html/assets/js',

    // ... other configs ...
    requires: [
        'MyApp.overrides.GroupingSummary',  // <---- ADD THIS LINE
        'MyApp.overrides.SelectionModel',  // <---- ADD THIS LINE
        'MyApp.view.opmgrLocationGrid',  // <---- ADD THIS LINE
        
    ],

    models: ['opmgrModel','opmgrLocModel'],
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

        //make container later
        Ext.define('MyApp.view.OpmgrContainer', {
            extend: 'Ext.panel.Panel',
            alias: 'widget.opmgrcontainer',
            layout: 'fit',
            height:300,
            items: [
                {
                    //xtype: 'opmgrLocationGrid'
                    xtype:'opmgrlocationgrid'
                }
            ],
            renderTo: 'location-grid'
        }); 
       
        Ext.create('MyApp.view.OpmgrContainer');
        
        
        //make container later
        Ext.define('MyApp.view.OpmgrRiderContainer', {
            extend: 'Ext.panel.Panel',
            alias: 'widget.opmgrridercontainer',
            layout: 'border',
            height:300,
            items: [
                {
                    region: 'west',
                    xtype: 'grid',
                    height:300, // or use flex with layout like 'hbox'
                    title: 'Left Grid',
                    //store: yourLeftStore,
                    columns: [/* columns */
                        {
                            text:'col1'
                        }

                    ]
                },
                {
                    region: 'east',
                    xtype: 'grid',
                    height:300,
                    title: 'Right Grid',
                    //store: yourRightStore,
                    columns: [
                        /* columns */
                        {
                            text:'col2'
                        }
                    ]
                }
            ],
            renderTo: 'rider-grid'
        }); 

        Ext.create('MyApp.view.OpmgrRiderContainer');

    }, //==== END LAUNCH EXTJS

});
