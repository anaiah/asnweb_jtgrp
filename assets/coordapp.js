Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.form.field.Number',
    'Ext.form.field.Date',
    'Ext.tip.QuickTipManager'
]);
  
  //load ext
        Ext.application({
            name: 'MyApp',
            appFolder: '/html/assets/js',
            //models: ['monthlyModel'],
            stores: 
            [
                'locationStore',
                'riderStore'
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

                var locGrid = Ext.create('MyApp.view.locationGrid', {
                    renderTo: 'grid_month',
                    width: 500,
                    height: 300
                });
                var rideGrid = Ext.create('MyApp.view.riderGrid', {
                    renderTo: 'rider_grid',
                    width: 500,
                    height: 400
                });

            },
        });
