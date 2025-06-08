  //load ext

        Ext.application({
            name: 'xApp',
            // appFolder: '/html/assets/js',
            appFolder: '/assets/js',
  
             requires: [
                'xApp.view.MyWindow',  // <---- ADD THIS LINE
        
            ],
            // Launch method - called when app is ready
            launch: function() {
                
                //const myIp = "http://192.168.62.221:10000"
        
                console.log('====Ext.app 4.2 Launch()RiderApp ====',)
                xApp.app = this

                //var win = Ext.create('xApp.view.MyWindow',{
               //     renderTo:'xtable'
               // });
                Ext.create('xApp.view.MyWindow')

                console.log('Window created:');
                
                            
            },//end on launch

        });
