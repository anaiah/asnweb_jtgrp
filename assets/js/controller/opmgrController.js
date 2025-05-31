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
    calculateChartData:(data)=>{
        const keysToSum = ['reg', 'logged', 'parcel', 'amount', 'amount_remitted', 'parcel_delivered'];
        const totalSums = {};

        for (const key of keysToSum) {
            totalSums[key] = data.reduce((sum, item) => {
                const value = Number(item[key] || 0); // Use 0 if the key doesn't exist
                if (isNaN(value)) {
                    console.warn(`Invalid value for key "${key}" in item:`, item);
                    return sum; // Skip this value
                }
                return sum + value;
            }, 0); // Initial sum is 0
        }

        return totalSums;

    },
    
    loadinitialChart:()=>{
        const url = `${myIp}/initialchart`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
            const xdata = data.data
            console.log('***%%%%%%%%%%  INITIAL DATA FROM NODEJS*****', xdata)
            asn.socket.emit('sendtoOpMgr', xdata)
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    updateChart:(nuData,xchart)=>{

        //this to convert value of a key to number
        // const newSeries2 = nuData.map(item => parseInt(item.attendance_pct, 10));
        console.log('updating chart... ', nuData )
        //const newLabels2 = newData2.map(item => item.region);
        if(xchart=="chart1"){
            asn.chart1.updateSeries(nuData);
     
        }else{
            asn.chart2.updateSeries(nuData);
     
        }
        
    },
    loadCurrentRegionChart:(chartarea, xChart )=>{

        console.log('loading from  controller  chart.....')
        let val, chart

        if(chartarea=='attendance-chart'){
            val = [
                {
                    name:"Registered",
                    data:[0,0,0,0]
                },
                {
                    name:"Reported",
                    data:[0,0,0,0]
                },         
            ]
                
        }else{
            val = [
                {
                    name:"Parcel",
                    data:[0,0,0,0]
                },
                {
                    name:"Delivered",
                    data:[0,0,0,0]
                },         
            ]

        }//if

        let colors = ['#0277bd', '#00838f   ', '#00695c', '#2e7d32','#558b2f','#9e9d24','#ff8f00','#d84315'];
        
        // Fisher-Yates shuffle
        for (let i = colors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]]; // swap elements
        }//endfor   


        var options = {
          series:val, 
          colors:colors,
          chart: {
            type: 'bar',
            height: 350,
            width: 380,
            redrawOnParentResize: false,
            redrawOnWindowResize: false,
                    
        },

        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
          },
        },
        dataLabels: {
          enabled: true,
          
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
                categories: ['BSL','CENTRAL VISAYAS','NCR','PANAY'],
                title: {
                    text: 'REGION',
                    style: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        color: '#6699ff' // set your desired color
                    }
                }
        },
        yaxis: {
            title: {
                text: 'STATUS',
                style: {
                    fontSize: '10px',
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    color: '#6699ff' // set your desired color
                }
            }    
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val 
            }
          }
        }
        };

        if(xChart=="chart1"){
            asn.chart1 = new ApexCharts(document.querySelector("#attendance-chart"), options);
            asn.chart1.render();

        }else{
            asn.chart2 = new ApexCharts(document.querySelector("#parcel-chart"), options);
            asn.chart2.render();

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