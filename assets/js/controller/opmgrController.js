Ext.define('MyApp.controller.opmgrController', {
    extend: 'Ext.app.Controller',

    init: function() {
        // initialization code
        //this.loadChartData()

    },
    
    scrollsTo:(grid)=>{
        console.log('scrolling')
        var gridView = grid.getView();  // grid is a reference to your Ext.grid.Panel
        var gridBody = gridView.getEl();

        console.log('GridView:', gridView); // Check this
        console.log('GridBody:', gridBody);   // Check this
    
        if (grid && gridView && gridBody) {  // Simplified check
            util.scrollsTo( gridBody)
        } else {
            console.warn('Grid, grid view, or grid body element is not available.');
        }

    },
    //coord,
    listencoordLocation:()=>{
        console.log('listenCoordLocation() opmgrController.js fird===')
       
        var locgrid = Ext.ComponentQuery.query('locationgrid')[0] //load alias

        locgrid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {
            if (selected.length > 0) {

                //scrollto location-grid
                util.scrollsTo('rider-grid')

                var record = selected[0];
                var locValue = record.get('hub');

                console.log('Selected Location:', locValue);

                //SET TITLE
                Ext.getCmp('riderGrid').setTitle( locValue ) 
                
                // Get the store
                var riderstore = locgrid.getStore();
                riderstore.removeAll();
            
                // Make an AJAX request to get the data from the server
                Ext.Ajax.request({
                    url: `${myIp}/coor/ridersummary/${locValue}`,
                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        var data = json.data || json; // if data is wrapped or not

                        riderstore.loadData(data);
                        
                        console.log('RIDER Data loaded successfully');
                    },
                    failure: function(response) {
                        console.error('Failed to load data');
                        Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
                    }
                });
                
                // record.suspendEvents(); // Prevent events while setting the value
                // record.resumeEvents();  // Re-enable events
            
            }//====end if
        });

    },

   //opmgr
   listenRegion:()=>{
        console.log('listenRegion() opmgrController.js fird===')
        //call Maiin Area grid load
        const grid = Ext.ComponentQuery.query('opmgrgrid')[0]

        if(grid){

            if(grid.view.rendered){
            
                Ext.Ajax.request({
                    
                    url: `${myIp}/opmgr/summary/${util.getCookie('f_email')}`,
        
                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        var data = json.data || json; // if data is wrapped or not
            
                        var areaStore = grid.getStore()
                        areaStore.removeAll()

                        areaStore.loadData(data);
                        
                        console.log('Region Data loaded successfully');
                    },
                    failure: function(response) {
                        console.error('Failed to load data');
                        Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
                    }
                }); //end ajax

                //load listener selectionchange
                grid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {
        
                    if (selected.length > 0) {

                        //scrollto location-grid
                        util.scrollsTo('location-grid')
                    
                        var record = selected[0];
                        var areaValue = record.get('area');
        
                        console.log('Selected Area:', areaValue);
        
                        //SET TITLE
                        Ext.getCmp('opmgrLocationGrid').setTitle("Location Performance for " + areaValue) 
                        var opmgrlocstore = Ext.getCmp('opmgrLocationGrid').getStore();
                        opmgrlocstore.removeAll();
                    
                        // Make an AJAX request to get the data from the server
                        Ext.Ajax.request({
                            url: `${myIp}/opmgr/opmgrlocation/${areaValue}`,
                            success: function(response) {
                                var json = Ext.decode(response.responseText);
                                var data = json.data || json; // if data is wrapped or not
                                
                                opmgrlocstore.loadData(data);
        
                                console.log('location Data loaded successfully');
                            },
                            failure: function(response) {
                                console.error('Failed to load data');
                                Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
                            }
                        });
                    
                    }//====end if
                });

            }//eif viewready
        }//eif grid
    
    },
    //opmgr
    listenLocation:()=>{
        console.log('listenLocation() opmgrController.js fird===')
       
        //call Location / hub Grid
        //var locgrid = Ext.getCmp('opmgrLocationGrid')
        var locgrid = Ext.ComponentQuery.query('opmgrlocationgrid')[0] //load alias
        
        if(locgrid.view.rendered){
            //SET TITLE
            Ext.getCmp('opmgrcalendarGrid').setTitle('&nbsp;' ) 
            
            // Get the store
            //var opmgrlocstore = Ext.data.StoreManager.lookup('opmgrLocationStore');
            var opmgrcalendarstore = Ext.getCmp('opmgrcalendarGrid').getStore();
            opmgrcalendarstore.removeAll();

        }//eif

        locgrid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {
            if (selected.length > 0) {

                Ext.getCmp('opmgrcalendarGrid').setTitle('&nbsp;' ) 
            
                // Get the store
                //var opmgrlocstore = Ext.data.StoreManager.lookup('opmgrLocationStore');
                var opmgrcalendarstore = Ext.getCmp('opmgrcalendarGrid').getStore();
                opmgrcalendarstore.removeAll();

                //scrollto location-grid
                util.scrollsTo('rider-grid')

                var record = selected[0];
                var locValue = record.get('hub');

                console.log('Selected Location:', locValue);

                //SET TITLE
                Ext.getCmp('opmgrRiderGrid').setTitle( locValue ) 
                
                // Get the store
                //var opmgrlocstore = Ext.data.StoreManager.lookup('opmgrLocationStore');
                var opmgrriderstore = Ext.getCmp('opmgrRiderGrid').getStore();
                opmgrriderstore.removeAll();
            
                // Make an AJAX request to get the data from the server
                Ext.Ajax.request({
                    url: `${myIp}/coor/ridersummary/${locValue}`,
                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        var data = json.data || json; // if data is wrapped or not
                        opmgrriderstore.loadData(data);
                        // var data = Ext.decode(response.responseText) ; // Decode the JSON data
                        

                        // console.log( 'rider data...',data)
                        // //var opmgrlocstore = Ext.data.StoreManager.lookup('opmgrLocationStore');
                        // opmgrriderstore.loadData(data); // Load the data into the store

                        console.log('RIDER Data loaded successfully');
                    },
                    failure: function(response) {
                        console.error('Failed to load data');
                        Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
                    }
                });
                
                // record.suspendEvents(); // Prevent events while setting the value
                // record.resumeEvents();  // Re-enable events
            }else{
                // No row is selected (clear the store)
                //var opmgrlocstore = Ext.getCmp('opmgrLocationGrid').getStore();
                //opmgrlocstore.removeAll();
            
            }//====end if
        });

    },
    //opmgr
    listenRider:()=>{
        console.log('===listenRider() opmgrcontroller.js===')
        
        var ridergrid = Ext.ComponentQuery.query('opmgrridergrid')[0] //load alias
        
        //viewonreaady
        if(ridergrid.view.rendered){
            //SET TITLE
            Ext.getCmp('opmgrcalendarGrid').setTitle('&nbsp;' ) 
            
            // Get the store
            //var opmgrlocstore = Ext.data.StoreManager.lookup('opmgrLocationStore');
            var opmgrcalendarstore = Ext.getCmp('opmgrcalendarGrid').getStore();
            opmgrcalendarstore.removeAll();
    
        
        }
        ridergrid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {

            if (selected.length > 0) {

                //scrollto location-grid
                util.scrollsTo('calendar-grid')

                var record = selected[0];
                var empidValue = record.get('emp_id');

                console.log('Selected Employee ID:', empidValue);

                //SET TITLE
                Ext.getCmp('opmgrcalendarGrid').setTitle( `${record.get('full_name')}, ${record.get('transactions')} Working Day(s)`) 
                
                // Get the store
                //var opmgrlocstore = Ext.data.StoreManager.lookup('opmgrLocationStore');
                var opmgrcalendarstore = Ext.getCmp('opmgrcalendarGrid').getStore();
                opmgrcalendarstore.removeAll();
            
                // Make an AJAX request to get the data from the server
                Ext.Ajax.request({
                    
                    url: `${myIp}/gridmonthlytransaction/${empidValue}`,

                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        var data = json.data || json; // if data is wrapped or not
                        
                        opmgrcalendarstore.loadData(data);
                        
                        console.log('calendar Data loaded successfully===',  data);
                    },
                    failure: function(response) {
                        console.error('Failed to load data');
                        Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
                    }
                });
                
                // record.suspendEvents(); // Prevent events while setting the value
                // record.resumeEvents();  // Re-enable events
            }else{
                // No row is selected (clear the store)
                //var opmgrlocstore = Ext.getCmp('opmgrLocationGrid').getStore();
                //opmgrlocstore.removeAll();
            
            }//====end if        
        })
    },
    
    loadPage: (page)=> {

        var start = (page - 1) * asn.pageSize;
        var end = start + asn.pageSize;
        var pageData = asn.allData.slice(start, end);
        
        asn.ctrlExt.sendData( pageData, 'opmgrStore' );
        
        asn.currentPage = page;

       /// asn.ctrlExt.updatePageInfo() //refresh

        console.log('==current page==', asn.currentPage)
        // Optionally update UI components (like a paging toolbar)
        // and disable/enable buttons based on page
        // For example:
        // Ext.getCmp('prevBtn').setDisabled(page === 1);
        // Ext.getCmp('nextBtn').setDisabled(end >= allData.length);
    },

    updatePageInfo:()=> {
        
            var start = ( asn.currentPage - 1) * asn.pageSize + 1;
            var end = Math.min(asn.currentPage * asn.pageSize, asn.allData.length);

        //off muna page bar
        //Ext.getCmp('pageInfo').setText('Showing ' + start + ' - ' + end + ' of ' + asn.allData.length);
    },

    //== load po store / grid
    sendData:(ydata, whatStore)=>{
        console.log('ccoordController.js===== after getpo, loadPO',ydata.length)

        if(ydata) { // if data  not null

            //sort
            //ydata.sort((a, b) => b.parcel_delivered - a.parcel_delivered);

            const storeInstance = Ext.data.StoreManager.lookup(whatStore)
            //storeInstance.removeAll();

            storeInstance.loadData(ydata ) //load ARRAY OF DATA
            
            //asn.ctrlExt.updatePageInfo()

            if (storeInstance) {
                // Get an array of all records
                var records = storeInstance.getRange();

                // Loop through records
                Ext.each(records, function(record) {
                    //console.log('tutssa',record.get('po_number'), record.get('invoice_number'));
                });

            } else{
                console.log('boge')
            }//eif
            
        }//eif poData is not null
    },

    // Your custom function
    checkImage:(imageSrc)=> {
        return new Promise((resolve, reject)=> {
        
        const img = new Image();
        let result

        img.onload = () => {
            result = true; // Image loaded successfully
        };
      
        img.onerror = () => {
            result = false; // Image failed to load
        };

        img.src = imageSrc;
        
        resolve(result)

        })
    },
      
});