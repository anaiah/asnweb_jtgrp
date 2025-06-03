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
    addCommas: (nStr)=> {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
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
            console.log('***%%%%%%%%%% INITIAL CHART FROM NODEJS and INITIAL  CHART LOAD*****', xdata)
            
            asn.speaks('INCOMING INITIAL DATA!!!')

            const attendance_keysToExtract = ['reg', 'logged']; // add coluumns here 'parcel__delivered', Array of keys to extract
            const parcel_keysToExtract = ['parcel', 'parcel_delivered']

            const attendance_seriesNames = {
                reg: 'Registered',
                logged: 'Reported',
                //parcel_delivered: 'Delivered'
            };

            const parcel_seriesNames = {
                parcel: 'Parcel',
                parcel_delivered: 'Delivered',
                //parcel_delivered: 'Delivered'
            };

            const attendanceData = attendance_keysToExtract.map(key => ({
                name: attendance_seriesNames[key] || key,  // Use seriesNames or the key if not found
                data: xdata.map(item => item[key])
            }));
            
            const parcelData = parcel_keysToExtract.map(key => ({
                name: parcel_seriesNames[key] || key,  // Use seriesNames or the key if not found
                data: xdata.map(item => item[key])
            }));

            let anationwide = []
            anationwide.push(asn.ctrlExt.calculateChartData(xdata))
            
            document.getElementById('x-parcel').innerHTML = util.addCommas(parseFloat(anationwide[0].parcel))
            document.getElementById('x-delivered').innerHTML =  util.addCommas(parseFloat(anationwide[0].parcel_delivered))
            
            if( anationwide[0].parcel_delivered < anationwide[0].parcel){
                document.getElementById('xs-delivered').classList.add('text-danger')
            }else{
                document.getElementById('xs-delivered').classList.add('text-primary')
            }
            
            console.log('<<<<<<<total amt vs remit>>>>>',anationwide[0].amount, anationwide[0].amount_remitted)
            
            document.getElementById('x-remit').innerHTML =  util.formatNumber(anationwide[0].amount_remitted) //turns number to M  or K

            const variance = anationwide[0].amount - anationwide[0].amount_remitted
            
            if( anationwide[0].amount_remitted < anationwide[0].amount){
                document.getElementById('x-variance').classList.add('text-danger')
            }
            document.getElementById('x-variance').innerHTML =  util.formatNumber(variance)
            
             //UPDATE CHART
            asn.ctrlExt.updateChart(attendanceData, 'chart1')
        
            //UPDATE NEXTCHART AFTER 1SEC
            setTimeout(() => {
                asn.ctrlExt.updateChart(parcelData, 'chart2')
            }, 1000)
        
            setTimeout(() => {
                const audio  = new Audio('/html/beep.ogg')
                audio.play().catch(error => {
                    console.error("Audio playback failed:", error);
                });
            }, 0); // Delay of 1000 milliseconds (1 second)
                
            //document.getElementById('result').textContent = data.result; // Display the result
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    updateChart:(nuData,xchart)=>{

        //this to convert value of a key to number
        // const newSeries2 = nuData.map(item => parseInt(item.attendance_pct, 10));
        console.log('updating chart... ', nuData )
        
        asn.speaks('INCOMING DATA!!!')

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
                dataLabels: {
                    //position: 'top',
                    orientation:'vertical'
                }
            }
        },
        
        dataLabels: {
            enabled: true,
            dropShadow: {
                enabled: true,
                left: 1,
                top: 1,
                opacity: 0.5
            },
            formatter: function (val) {
                if (val >= 1000000) {
                    return (val / 1000000).toFixed(1) + 'M';
                } else if (val >= 1000) {
                    return (val / 1000).toFixed(1) + 'K';
                }
                
                return val;
            },
            // style: {
            //     cssClass: 'vertical-label' // optional, for more control
            // },
            // offsetX: 0,// or try negative or positive to move labels
            // offsetY: 0
        },
        // plotOptions: {
        //   bar: {
        //     horizontal: false,
        //     columnWidth: '55%',
        //     borderRadius: 5,
        //     borderRadiusApplication: 'end'
        //   },
        // },
        // dataLabels: {
        //     enabled: true,
        //     useHTML: true,
        //     formatter: function (val) {
        //         return '<div style="display:inline-block; transform: rotate(90deg); white-space: nowrap;">' + val + '</div>';
        //     },
        //     style: {
        //         fontSize: '12px'
        //     },
        //     offsetY: -20 // Adjust as needed
        //     },
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