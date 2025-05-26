


 
 //load ext
Ext.application({
    name: 'MyApp',
    //appFolder: 'assets/js',
    appFolder: '/html/assets/js',//<-- bringbak when uploading

    // ... other configs ...
    requires: [
        'MyApp.overrides.GroupingSummary',  // <---- ADD THIS LINE
        'MyApp.overrides.SelectionModel',  // <---- ADD THIS LINE
        'MyApp.view.opmgrLocationGrid',  // <---- ADD THIS LINE
        'MyApp.view.opmgrRiderGrid',  // <---- ADD THIS LINE
        'MyApp.view.opmgrcalendarGrid',  // <---- ADD THIS LINE
        
    ],

    models: ['opmgrModel','opmgrLocModel','riderModel', 'monthlyModel'],
    stores: 
    [
        'opmgrStore',
        'opmgrLocationStore',
        'opmgrRiderStore',
        'opmgrcalendarStore',
        // 'coordStore',
        // 'headStore',
        // 'opmgrStore'
    ],

    controllers:
    [   
        'opmgrController',
        // 'headCtrl',
        // 'opmgrCtrl',
    ],

    // Launch method - called when app is ready
    launch: function() {
        
        console.log('====Ext.app 4.2 Launch() ====',)
        MyApp.app = this    

        var regiongrid = Ext.create('MyApp.view.opmgrGrid', {
            renderTo: 'region-grid',
            title:'Regional Performance Summary',
            width: 500,
            height: 300
        });

        var locgrid = Ext.create('MyApp.view.opmgrLocationGrid', {
            renderTo: 'location-grid',
            title:'&nbsp;',
            width: 500,
            height: 300
        });

        var ridergrid = Ext.create('MyApp.view.opmgrRiderGrid', {
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


        /*
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
            //border:true,
            width:500,
            height:600,
            items: [
                {
                    region: 'center',
                    xtype: 'opmgrridergrid',
                    split:true,
                    height:300,
                    width:300,
                   
                },
                {
                    region: 'south',
                    xtype: 'opmgrcalendargrid',
                    height:300,
                    width:300
                }
            ],
            renderTo: 'rider-grid'
        }); 

        Ext.create('MyApp.view.OpmgrRiderContainer');
        */

    }, //==== END LAUNCH EXTJS

});
