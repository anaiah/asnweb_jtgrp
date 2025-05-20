  //load ext
        Ext.application({
            name: 'MyApp',
            appFolder: '/html/assets/js',
            models: ['monthlyModel'],
            stores: 
            [
                'monthlyStore',
                // 'coordStore',
                // 'headStore',
                // 'opmgrStore'
            ],

            controllers:
            [   
                'riderController',
                // 'coordCtrl',
                // 'headCtrl',
                // 'opmgrCtrl',
            ],
        
            // Launch method - called when app is ready
            launch: function() {
                
                console.log('====Ext.app 4.2 Launch()RiderApp ====',)
                MyApp.app = this

                var myPanel = Ext.create('riderApp.view.mainPanel', {
                    renderTo: 'grid_month',
                    width: 600,
                    height: 400
                });

            },

        });
