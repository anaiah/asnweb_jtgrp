Ext.define('MyApp.controller.coordController', {
    extend: 'Ext.app.Controller',
 
    init: function() {
        // initialization code
        //this.loadChartData()
      var me = this  
    },
    //static member
	statics:{
		ex: this
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
   
    showWindow:()=>{
        var win = Ext.create('MyApp.view.MyWindow', {
            autoShow: false, // create but don't show
            //closeAction: 'hide'
        });
        win.show()
    
    },
    //head
    areaReset:()=>{
        //reset rider / calendar /location as well
        //RESET RIDDER
        const arearidergrid = Ext.ComponentQuery.query('ridergrid')[0] //load alias
        arearidergrid.setTitle('RIDER INFO')
        const areariderstore = arearidergrid.getStore();
        areariderstore.removeAll();

        //reset location
        const locationgrid = Ext.ComponentQuery.query('locationgrid')[0] //load alias
        locationgrid.setTitle('LOCATION')
        const locationstore = locationgrid.getStore();
        locationstore.removeAll();
     
        
    },

    opmgrReset:()=>{
         //RESET RIDDER
         const arearidergrid = Ext.ComponentQuery.query('opmgrridergrid')[0] //load alias
         arearidergrid.setTitle('RIDER INFO')
         const areariderstore = arearidergrid.getStore();
         areariderstore.removeAll();
        //reset calendar
        const calendargrid = Ext.ComponentQuery.query('opmgrcalendargrid')[0] //load alias
        calendargrid.setTitle('&nbsp;');
        const opmgrcalendarstore = calendar.getStore();
        opmgrcalendarstore.removeAll();
        //reset location
        const locationgrid = Ext.ComponentQuery.query('opmgrlocationgrid')[0] //load alias
        locationgrid.setTitle('LOCATION')
        const locationstore = locationgrid.getStore();
        locationstore.removeAll();
    },

    //head//first to fire
    listenviewreadyArea:()=>{
        console.log('firing listenviewReadyArea() coordcontroller.js')
    
        var areagrid = Ext.ComponentQuery.query('headareagrid')[0] //load alias
        var areastore = areagrid.getStore()
        
        if (areagrid) {

            if (areagrid.view.rendered) {
                console.warn("The View Is already rendered!");
                
                Ext.Ajax.request({
                    
                    url: `${myIp}/headcoor/summary/${util.getCookie('f_email')}`,
        
                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        var data = json.data || json; // if data is wrapped or not
                        
                        areastore.loadData(data);
                        
                        console.log('ArEA Data loaded successfully');
                    },
                    failure: function(response) {
                        console.error('Failed to load data');
                        Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
                    }
                }); //end ajax

            
                //==============if selectionchanged
                areagrid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {
                    console.warn( 'areaGrid() selectionchange fired!!!')
                    
                    const locationgrid = Ext.ComponentQuery.query('locationgrid')[0] //load alias
                    const locationstore = locationgrid.getStore();
                    locationstore.removeAll();
        
                    if (selected.length > 0) {

                        //reset
                        asn.ctrlExt.areaReset()
                        
                        //scrollto location-grid
                        util.scrollsTo('location-grid')
        
                        var record = selected[0];
                        var locValue = record.get('location');
        
                        console.log('Selected Location:', locValue);
                                
                        // Make an AJAX request to get the data from the server
                        Ext.Ajax.request({
                            
                            url: `${myIp}/headcoor/lochub/${util.getCookie('f_email')}/${locValue}`,
                            
                            success: function(response) {
                                var json = Ext.decode(response.responseText);
                                var data = json.data || json; // if data is wrapped or not
        
                                console.log('LOCATION HUB==', data)
                                locationgrid.setTitle('LOCATION '+ locValue)
                                locationstore.loadData(data);
                                
                                console.log('LOCATION Data loaded successfully');
                            },
                            failure: function(response) {
                                console.error('Failed to load data');
                                Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
                            }
                        });
                    
                    }//====end if
        
                })

            }//EIF

        } else {
            console.warn('Area grid not found with alias "areagrid"');
        }
    },
    //coord,
    listenviewReady:()=>{
        console.log('firing listenviewReady() coordcontroller.js')
    
        var arealocgrid = Ext.ComponentQuery.query('locationgrid')[0] //load alias
        var arealocstore = arealocgrid.getStore()
        
        //asn.ctrlExt.callme()
        
        //console.log('locgrid',locgrid)
        if (arealocgrid) {

            if (arealocgrid.view.rendered) {
                console.warn("The View lOCATION Is already rendered!");
                
                Ext.Ajax.request({
                    url: `${myIp}/coor/summary/${util.getCookie('f_email')}`,

                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        var data = json.data || json; // if data is wrapped or not
                        //console.log('DATA LOCATION ', data)

                        arealocstore.loadData(data);
                        
                        console.log('LOCATION Data loaded successfully');
                    },
                    failure: function(response) {
                        console.error('Failed to load data');
                        Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
                    }
                }); //end ajax
            

                //load selection change locationgrid
                arealocgrid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {
                    console.log('LOCATION  GRID, CHANGED SELECTION, REST RIDERS')

                   
                })
            }//EIF    

        } else {
            console.warn('Location grid not found with alias "locationgrid"');
        }
    },

    //coord,
    listencoordLocation:()=>{
        console.log('listenCoordLocation() coordController.js fird===')
       
        const locgrid = Ext.ComponentQuery.query('locationgrid')[0] //load alias

        locgrid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {
            if (selected.length > 0) {

                //scrollto location-grid
                util.scrollsTo('rider-grid')

                var record = selected[0];
                var locValue = record.get('hub');

                console.log('Selected Location:', locValue);

                const ridergrid = Ext.ComponentQuery.query('ridergrid')[0] //load alias
                
                //SET TITLE
                ridergrid.setTitle( locValue + ' RIDERS v1' ) 
                
                // Get the store
                const riderstore = ridergrid.getStore();
                riderstore.removeAll();
            
                // Make an AJAX request to get the data from the server
                Ext.Ajax.request({
                    
                    url: `${myIp}/coor/ridersummary/${locValue}`,
                    
                    success: function(response) {
                        var json = Ext.decode(response.responseText);
                        var data = json.data || json; // if data is wrapped or not
                        console.log('rider array data', data)
                        riderstore.loadData(data);
                         
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

    //COORD
    listencoordRider:()=>{
    
        console.log('===listencoordRider() coordcontroller.js===')
        
        const ridergrid = Ext.ComponentQuery.query('ridergrid')[0] //load alias
        
        ridergrid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {

            //reset calendar
            Ext.getCmp('opmgrcalendarGrid').setTitle('&nbsp;');
            var opmgrcalendarstore = Ext.getCmp('opmgrcalendarGrid').getStore();
            opmgrcalendarstore.removeAll();
            
            if (selected.length > 0) {

                //scrollto location-grid
                util.scrollsTo('calendar-grid')

                var record = selected[0];
                var empidValue = record.get('emp_id');

                console.log('Selected Employee ID:', empidValue);

                //SET TITLE
                Ext.getCmp('opmgrcalendarGrid').setTitle( `${record.get('full_name')}, ${record.get('transactions')} Working Day(s)`) 
                                
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
            
            }//====end if        
        })
    },

  
    //opmgr
    // listenLocation:()=>{
    //     console.log('listenLocation() opmgrController.js fird===')
       
    //     //call Location / hub Grid
    //     //var locgrid = Ext.getCmp('opmgrLocationGrid')
    //     var locgrid = Ext.ComponentQuery.query('opmgrlocationgrid')[0] //load alias
        
    //     locgrid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {
        
    //         if (selected.length > 0) {

    //             console.log('hey locgrid location  ().change')
             

    //             //rider
    //             Ext.getCmp('riderGrid').setTitle('&nbsp;')
    //             var opmgrriderstore = Ext.getCmp('riderGrid').getStore();
    //             opmgrriderstore.removeAll();
         
    //             //scrollto location-grid
    //             util.scrollsTo('rider-grid')

    //             var record = selected[0];
    //             var locValue = record.get('hub');

    //             console.log('Selected Location:', locValue);

    //             //SET TITLE
    //             Ext.getCmp('riderGrid').setTitle( locValue ) 
                
    //             // Get the store
    //             //var opmgrlocstore = Ext.data.StoreManager.lookup('opmgrLocationStore');
              
    //             // Make an AJAX request to get the data from the server
    //             Ext.Ajax.request({
    //                 url: `${myIp}/coor/ridersummary/${locValue}`,
    //                 success: function(response) {
    //                     var json = Ext.decode(response.responseText);
    //                     var data = json.data || json; // if data is wrapped or not
                        
    //                     opmgrriderstore.loadData(data);

    //                     console.log('RIDER Data loaded successfully');
    //                 },
    //                 failure: function(response) {
    //                     console.error('Failed to load data');
    //                     Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
    //                 }
    //             });
            
    //         }//====end if
    //     });

    // },

    // //opmgr
    // listenRider:()=>{
    //     console.log('===listenRider() opmgrcontroller.js===')
        
    //     var ridergrid = Ext.ComponentQuery.query('ridergrid')[0] //load alias
        
    //     ridergrid.getSelectionModel().on('selectionchange', function(sm, selected, eOpts) {

             
    //         //reset calendar
    //         Ext.getCmp('opmgrcalendarGrid').setTitle('&nbsp;');
    //         var opmgrcalendarstore = Ext.getCmp('opmgrcalendarGrid').getStore();
    //         opmgrcalendarstore.removeAll();
          
    //         if (selected.length > 0) {

    //             //scrollto location-grid
    //             util.scrollsTo('calendar-grid')

    //             var record = selected[0];
    //             var empidValue = record.get('emp_id');

    //             console.log('Selected Employee ID:', empidValue);

    //             //SET TITLE
    //             Ext.getCmp('opmgrcalendarGrid').setTitle( `${record.get('full_name')}, ${record.get('transactions')} Working Day(s)`) 
                
    //             // Make an AJAX request to get the data from the server
    //             Ext.Ajax.request({
                    
    //                 url: `${myIp}/gridmonthlytransaction/${empidValue}`,

    //                 success: function(response) {
    //                     var json = Ext.decode(response.responseText);
    //                     var data = json.data || json; // if data is wrapped or not
                        
    //                     opmgrcalendarstore.loadData(data);
                        
    //                     console.log('calendar Data loaded successfully===',  data);
    //                 },
    //                 failure: function(response) {
    //                     console.error('Failed to load data');
    //                     Ext.Msg.alert('Error', 'Failed to load data. Please try again.');
    //                 }
    //             });
                
    //             // record.suspendEvents(); // Prevent events while setting the value
    //             // record.resumeEvents();  // Re-enable events
    //         }else{
                
    //             // No row is selected (clear the store)
    //             //var opmgrlocstore = Ext.getCmp('opmgrLocationGrid').getStore();
    //             //opmgrlocstore.removeAll();
            
    //         }//====end if        
    //     })
    // },
    
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