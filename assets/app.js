  //load ext
        Ext.application({
            name: 'MyApp',
            appFolder: '/html/assets/js',
            models: ['monthlyModel'],
            stores: 
            [
                'monthlyStore',
                'coordStore',
                'headStore',
                'opmgrStore'
            ],

            controllers:
            [   
                'myController',
                'coordCtrl',
                'headCtrl',
                'opmgrCtrl',
            ],
        
            // Launch method - called when app is ready
            launch: function() {
                
                console.log('====Ext.app 4.2 Launch() ====y',)
                MyApp.app = this

                var myPanel = Ext.create('MyApp.view.mainPanel', {
                    renderTo: 'grid_month',
                    width: 600,
                    height: 400
                });
            },

            test:(obj)=>{
                //console.log('success', obj)
                const myarg = []
                myarg.push( obj  )

                //var store = Ext.getStore('poStore');
                var storeInstance = Ext.data.StoreManager.lookup('poStore')

                storeInstance.loadData(myarg)

                //storeInstance.load()

                console.log(storeInstance)

                if (storeInstance) {
                    // Get an array of all records
                    var records = storeInstance.getRange();
                
                    // Loop through records
                    Ext.each(records, function(record) {
                        console.log('tutssa',record.get('po_number'), record.get('invoice_number'));
                    });
                } else{
                    console.log('boge')
                }

            }
        });
