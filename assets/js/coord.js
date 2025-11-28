/*

author : Carlo O. Dominguez

*/

//
//speech synthesis

const asn = {
	
    offset: 0,

    shopCart: [],
    
    //online version socket.io
    //socket:io.connect("https://osndp.onrender.com"),

    socket:null,

    //=========================START VOICE SYNTHESIS ===============
    getVoice: async () => {
                
        voices = synth.getVoices()
        console.log( 'GETVOICE()')
                
        voices.every(value => {
            if(value.name.indexOf("English")>-1){
                console.log( "main.js bingo!-->",value.name, value.lang )
                
            }
        })
        
    },//end func getvoice

    //speak method
    speak:(theMsg)=> {
                        
        console.log("SPEAK()")
        
        // If the speech mode is on we dont want to load
        // another speech
        if(synth.speaking) {
            //alert('Already speaking....');
            return;
        }	

        const speakText = new SpeechSynthesisUtterance(theMsg);

        // When the speaking is ended this method is fired
        speakText.onend = e => {
            //synth.resume();
            console.log('Speaking is done!');
        };
        
        // When any error occurs this method is fired
        speakText.error = e=> {
            console.error('Error occurred...');
        };

        // Checking which voices has been chosen from the selection
        // and setting the voice to the chosen voice
        
        
        voices.forEach(voice => {
            if(voice.name.indexOf("English")>-1){	
                ///// take out bring back later, 
                //console.log("speaking voice is ",voice.name)
                speakText.voice = voice
                
            }
            
        });

        // Setting the rate and pitch of the voice
        speakText.rate = 1
        speakText.pitch = 1

        // Finally calling the speech function that enables speech
        synth.speak(speakText)

        synth.cancel()

    },//end func speak	
    //=======================END VOICE SYNTHESIS==========

    //===check file exist in server
    fileExists:async (url, )=> {
        const configObj = { keyboard: false, backdrop:'static' }
        const ximagemodal =  new bootstrap.Modal(document.getElementById('imageModal'),configObj);
        const imageModalEl = document.getElementById('imageModal')
        let pdfprev = document.getElementById('pdf_iframe')

        console.log('=====osndp.fileExists()===',url)
        await fetch( `https://localhost:10000/fileexist/${url}`)
        .then(response => { 
            return response.json()
        })
        .then( (data)=>{
            if (data.status) { 
                console.log("File exists"); 
                pdfprev.src =`https://vantaztic.com/osndp/${url}`
                ximagemodal.show()
                pdfprev.width = window.innerWidth
    
            } else { 
                console.log("File does not exist"); 
                alert('ERROR, FILE NOT FOUND!')
                //document.getElementById('pdf-modal-body').innerHTML=""
                //osndp.alertMsg('File not Found!','danger','pdf-modal-body')
                ximagemodal.hide()
                pdfprev.src = ""
            } 
        }) 
        .catch(error => { 
            console.log("An error occurred: ", error); 
        })
        
        imageModalEl.addEventListener('hide.bs.modal', function (event) {
            pdfprev.src += '';
        })
         
    },

    //=== FOR POPULATING DROPDOWN SELECT
    populate:async ( selectElement, department )=>{
        console.log( 'osndp.populate() ')
        osndp.removeOptions( selectElement) //restart

        let xurl
                
        switch(department){
            case "design":
                xurl = `https://localhost:10000/getProjectOwner/design` 
            break
            case "engineer":
                xurl = `https://localhost:10000/getProjectOwner/engineer` 
            break
        }


        await fetch( xurl )
        .then(response => { 
            return response.json()
        })
        .then( (data)=>{
            console.log('populate',data)

            let option = document.createElement("option")
            option.setAttribute('value', "")
            option.setAttribute('selected','selected')
              
            let optionText = document.createTextNode( "-- Pls Select --" )
            option.appendChild(optionText)
            
            selectElement.appendChild(option)
            
            for (let key in data.result) {
                let option = document.createElement("option")
                option.setAttribute('value', data.result[key].full_name.toUpperCase())
              
                let optionText = document.createTextNode( data.result[key].full_name.toUpperCase() )
                option.appendChild(optionText)
              
                selectElement.appendChild(option)
            }

            selectElement.focus()
        
        }) 
        .catch(error => { 
            console.log("An error occurred: ", error); 
        })        

    },
    
    removeOptions: (selectElement) => {
        var i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
           selectElement.remove(i);
        }
    },

    //===========for socket.io
    getMsg:()=>{
        console.log( '====getMsg()=== ')
        
        /*
        osndp.socket.on('sales', (oMsg) => {
            let xmsg = JSON.parse(oMsg)

            util.speak( xmsg.msg )

            ///// temporarily out   osndp.fetchBadgeData()// update badges
        
        })
          */  
        
    },
    notif:(msg,xclear)=>{
        if(!xclear){
            document.getElementById('p-notif').innerHTML = `<i id='i-notif' class='fa fa-spinner fa-pulse' ></i>
            &nbsp;<span id='s-notif'>${msg}</span>`
        }else{
            document.getElementById('p-notif').innerHTML = ""
        }
        
    },

    speaks:null,
    
    collapz: () => {
        console.log('Setting up collapse...');
        const links = document.querySelectorAll('#sidebarnav a');
        console.log('Links found:', links.length);
        
        console.log('Window width:', window.innerWidth);
                

        links.forEach(function(link) {
          link.addEventListener('click', function(e) {
            e.preventDefault();
      
            const hrefAttr = this.getAttribute('href');

            if (hrefAttr.startsWith('#')) {
                // Handle in-page anchor
                document.querySelector(hrefAttr).scrollIntoView({ behavior: 'smooth' });
            } else if (hrefAttr.startsWith('javascript:')) {
                // Extract and call the function
                // const funcName = hrefAttr.substring('javascript:'.length);
                // window[funcName]();
                // Extract the code after 'javascript:'
                const jsCode = hrefAttr.substring('javascript:'.length).trim();
                    
                // If the code is a function call like util.goNow()
                // or just an expression, you can use Function constructor:

                try {
                    // Create a new Function and execute it safely
                    new Function(jsCode)();
                } catch (err) {
                    console.error('Error executing JavaScript from href:', err);
                }


                //window.eval(hrefAttr)
            }

            if (window.innerWidth < 1200) {
              const toggleBtn = document.getElementById('sidebarCollapse');
              if (toggleBtn) {
                console.log('Clicking sidebarCollapse button');
                toggleBtn.click();
              } else {
                console.log('No sidebarCollapse element found');
                // fallback: manually hide sidebar
              }
            }
          });
        });
    },

    allData:[],
    pageSize:15,
    currentPage:1,

    //==========get monthly  transaction for riders/transporters ====//
    getMonthlyTransaction:async( emp_id ) =>{
        
        //xparam = `/${util.getCookie('f_region')}/${emp_id}/${util.getCookie('f_email')}`    
        
        await fetch(`${myIp}/coor/summary/${util.getCookie('f_email')}`,{
            cache:'reload'
        })
        .then( (res) => res.json() )

        .then( (results)  => {

            console.log('mydata ',results )

            asn.allData = results //get  data

            //replace with 
           // gridMonth.setData( results )
            ////// take ot muna  asn.ctrlExt.loadData(results)
            //asn.ctrlExt.loadPage( asn.currentPage ) //load first page
                    
            //get chart
            ///asn.getPieChart(util.getCookie('f_dbId'))

        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },
    
    piedata:[],// array to hold data

    //===== get data for pie chart====//
    getPieChart: async(empid) =>{

        console.log('===firing getPieChart()===')
        await fetch(`${myIp}/getpiedata/${empid}`,{
            cache:'reload'
        })
        .then( (res) => res.json() )
        .then( (data) => {

            //console.log(data.data[0].delivered_pct, data.data[0].undelivered_pct )
            if(!data.data[0]){
                console.log('==NO DATA FOR PIECHART==')
                
            }else{
                asn.piedata.push( parseInt( data.data[0].delivered_pct) )
                asn.piedata.push( parseInt( data.data[0].undelivered_pct) )
                asn.pieChart() //render piechart
                asn.speaks("Loading Chart...")
            }

            return
            
        })  
        .catch((error) => {
            //zonked.notif('','p-notif',true)
            //util.flog(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },
    
    //===== pie chart
    pieChart: async() => {
        window.ApexCharts && (new ApexCharts(document.getElementById('piechart'), {
            chart: {
              type: "donut",
              fontFamily: 'inherit',
              height: 240,
              sparkline: {
                enabled: true
              },
              animations: {
                enabled: true
              },
            },
            dataLabels: {
                enabled: true
              },
            fill: {
                type: 'gradient',
            },/*
            fill: {
              opacity: 1,
            },*/
            series: asn.piedata ,
            labels: ["Delivered %", "Undelivered %"],
            tooltip: {
              theme: 'dark'
            },
            grid: {
              strokeDashArray: 4,
            },

            title: {
                text: 'Performance Chart'
            },

            //colors: [tabler.getColor("primary"), tabler.getColor("primary", 0.8), tabler.getColor("primary", 0.6), tabler.getColor("gray-300")],
            
            legend: {
              show: true,
              position: 'right',
              offsetY: 12,
              markers: {
                width: 10,  
                height: 10,
                radius: 100,
              },
              itemMargin: {
                horizontal: 8,
                vertical: 8
              },
            },
            tooltip: {
              fillSeriesColor: false
            },
          })).render();
    },

    db: window.localStorage, //instantiate localstorage

    logout:()=>{
        asn.db.removeItem('myCart')//remove transaction localdb
        location.href = './' 
                    
    },

    //==== for mtd chart
    loadbarMTDChart: async()=>{
        console.log('loading... loadbarMTDchart()')

        await fetch(`${myIp}/coor/mtdlocation/${util.getCookie('f_email')}`,{
            cache: 'reload'
        })
        .then((res) => {  //promise... then 
            return res.json();
        })
        .then((xdata) => {

            console.log('mtd data==',  xdata)
           
            // // Replace null qty with 0
            // xdata.forEach(item => {
            //     if (item.parcel_delivered === null) {
            //         item.parcel_delivered  = 0;
            //     }
            // });
            
            // Sort the array in descending order (change to < for ascending)
            //xdata.sort((a, b) => b.parcel_delivered - a.parcel_delivered);

            //asc order sample
            //xdata.sort((a, b) => a.qty - b.qty);

            let colors = ['#0277bd', '#00838f   ', '#00695c', '#2e7d32','#558b2f','#9e9d24','#ff8f00','#d84315'];
            let mtdchart

            // Fisher-Yates shuffle
            for (let i = colors.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [colors[i], colors[j]] = [colors[j], colors[i]]; // swap elements
            }//endfor   

            var options = {
                series: [{
                    //name: 'Initial Deliveries', // ADD A NAME HERE - IMPORTANT
                    //data: [2,2,3]
                }],

                colors: colors,
                chart: {
                    type: 'bar',
                    height: 250,
                    redrawOnParentResize: false,
                    redrawOnWindowResize: false,
                    width: 400,

                },
                //tooltip
                tooltip: {
                    enabled: true,
                    shared: false,
                    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                      const val = series[seriesIndex][dataPointIndex];
                      const cat = w.globals.labels[dataPointIndex];
                      return `<div style="background:#fff;padding:10px;border-radius:8px;">${cat}: ${val}</div>`;
                    }
                },
                plotOptions: {
                    bar: {
                    borderRadius: 4,
                    borderRadiusApplication: 'end',
                    horizontal: true,
                    columnWidth: '30%' // Thinner bars
                    
                    }
                },
                dataLabels: {
                    enabled: true
                },
                xaxis: {
                    categories: [],
                    title: {
                        text: 'PARCEL SUCCESSFULLY DELIVERED',
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
                        text: 'LOCATION',
                        style: {
                            fontSize: '10px',
                            fontWeight: 'bold',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            color: '#6699ff' // set your desired color
                        }
                    }    
                },

            };//end options

            let series_data=[]
            let category_data=[]

            xdata.forEach( item  => {
                if(item.location){
                    category_data.push(item.location )
                    series_data.push( (! item.parcel_delivered ? 0 : parseInt(item.parcel_delivered)) )
                }
                        
             });

            options.series[0].data = series_data

            //console.log( 'series[0]', options.series[0].data )
            options.xaxis.categories = category_data
             //console.log( options.xaxis.categories)

            mtdchart = new ApexCharts(document.querySelector('#mtd-chart'), options);
            mtdchart.render();
     
        })
        .catch((error) => {
            console.error('Error:', error)
        })
        
    },

    //===for top 5 chart
    loadbarChart: async( ctrans )=>{
        console.log('loading loadbarchart()')

        await fetch(`${myIp}/coor/topfivehub/${util.getCookie('f_email')}/${ctrans}`,{
            cache: 'reload'
        })
        .then((res) => {  //promise... then 
            return res.json();
        })
        .then((data) => {

            const xdata = data

            //console.log(`TOP   ${JSON.stringify(xdata)})`)

            //const mergedData = ''dash.mergeFinalData(xdata.xdata, cTrans );
            //const mergedData = asn.mergeFinalData(xdata.xdata, cTrans );
            
            //let colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5'];
            let colors = ['#0277bd', '#00838f   ', '#00695c', '#2e7d32','#558b2f','#9e9d24','#ff8f00','#d84315'];
            let chart

            // Fisher-Yates shuffle
            for (let i = colors.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [colors[i], colors[j]] = [colors[j], colors[i]]; // swap elements
            }//endfor   

            var options = {
                series: [{
                    //name: 'Initial Deliveries', // ADD A NAME HERE - IMPORTANT
                    //data: [2,2,3]
                }],

                colors: colors,
                chart: {
                    type: 'bar',
                    height: 250,
                    redrawOnParentResize: false,
                    redrawOnWindowResize: false,
                    width: 400,

                },
                //tooltip
                tooltip: {
                    enabled: true,
                    shared: false,
                    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                      const val = series[seriesIndex][dataPointIndex];
                      const cat = w.globals.labels[dataPointIndex];
                      return `<div style="background:#fff;padding:10px;border-radius:8px;">${cat}: ${val}</div>`;
                    }
                },
                plotOptions: {
                    bar: {
                    borderRadius: 4,
                    borderRadiusApplication: 'end',
                    horizontal: true,
                    columnWidth: '30%' // Thinner bars
                    
                    }
                },
                dataLabels: {
                    enabled: true
                },
                xaxis: {
                    categories: ['me,','imee','irene'],
                    title: {
                        text: 'PARCEL SUCCESSFULLY DELIVERED',
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
                        text: (ctrans=="hub"?"HUB":"RIDER"),
                        style: {
                            fontSize: '10px',
                            fontWeight: 'bold',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            color: '#6699ff' // set your desired color
                        }
                    }    
                },

            };//end options

            let series_data=[]
            let category_data=[]

            xdata.forEach( item  => {
                if(ctrans=="rider"){
                    if(item.xname){
                        category_data.push(item.xname )
                        series_data.push( (! item.parcel_delivered ? 0 : parseInt(item.parcel_delivered)) )
                    }
                
                }else{
                    category_data.push( item.hub)
                    series_data.push( (! item.parcel_delivered ? 0 : parseInt(item.parcel_delivered)) )
                }//EIF    
            });

            //console.log('category data chart ', category_data)
            options.series[0].data = series_data

            options.xaxis.categories = category_data
            
            chart = new ApexCharts(document.querySelector((ctrans=="hub"?"#hub-chart":"#rider-chart")), options);
            chart.render();
     
        })
        .catch((error) => {
            console.error('Error:', error)
        })
        
    }, //===end top 5

    appExt:null,
    ctrlExt:null,

     //===========GETMENU==========
     getmenu: async(grp_id) =>{
        console.log('=====FIRING ggetmenu()==========')
        await fetch(`${myIp}/menu/${grp_id}`,{
            cache:'reload'
        })
        .then( (res)  => res.json() )
        .then( (data) => {	

            var xdata = []
            
            xdata.push(data)
            console.log(xdata)
            
            const ul = document.getElementById('sidebarnav'); // Get the <ul> or <ol>

            //remove all elements of UL
            while (ul.firstChild) {
              ul.removeChild(ul.firstChild);
            }
              
            xdata[0].forEach(info => {  
              
                const li = document.createElement('li'); // Create a new <li>
                li.classList.add("nav-small-cap")

                const ii =  document.createElement('i')
                ii.classList.add("fs-10")
                
                li.appendChild( ii )

                const span =  document.createElement('span')
                span.textContent = info.menu
                span.classList.add('hide-menu')  
                //span.appendChild(ii)
                
                li.appendChild(span)

                ul.appendChild(li); // Append the <li> to the list
              
                //var subdata = JSON.parse(info.list)
                //console.log( info )
                var aList = []
                // //loop submenu
                aList.push( JSON.parse(info.list) )
                console.log( "yo", info.list  )
                    
                aList[0].forEach(xmenu => {  
                    // //=================== submenu
                    const li2 = document.createElement('li'); // Create a new <li>
                    li2.classList.add("sidebar-item")
                    
                    const span1 =  document.createElement('span')
                    const i2 =  document.createElement('i')
                    i2.classList.add("ti",`${xmenu.icon}`)
                    span1.appendChild(i2)

                    const span2 =  document.createElement('span')
                    span2.classList.add('hide-menu')  
                    span2.textContent = `${xmenu.sub}`

                    const aa = document.createElement('a'); // Create a new <li>
                    aa.classList.add("sidebar-link")

                    aa.appendChild(  span1 )
                    aa.appendChild(  span2 )

                    aa.href = xmenu.href
                    
                    li2.appendChild(aa)
                    
                    ul.appendChild(li2); // Append the <li> to the list                    
            
                })//===end subdata
    
            })//end foreach

            asn.collapz()//invoke one time
            
            return true;
            
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },
    //==========END  GETMENU
    ctrl:null,

    configObj:null,
    winModal:null,

    showLoginModal:()=>{
            asn.configObj = { keyboard: false }
            asn.winModal = new bootstrap.Modal(document.getElementById('universalMessageModal'), asn.configObj);

            // Show modal
            asn.winModal.show();
    },

    getTimeKeeping: async( )=>{
        console.log( asn.userProfile.id, asn.userProfile.besi_id, asn.userProfile.region )
        const employeeBesiId = asn.userProfile.besi_id; // Get this from your page's context
        const employeeRegion = asn.userProfile.region; // Get this from your page's context (VERY IMPORTANT!)

        // Optional: If the new page has date pickers and wants a specific range
        const pageDateFrom = '2025-10-15';
        const pageDateTo = '2025-10-20';

        const filtersToSend = {
            filter_id: employeeBesiId,
            filter_region: employeeRegion,
            // filter_date_from: pageDateFrom, // Only include if user specifies
            // filter_date_to: pageDateTo      // Only include if user specifies
        };

        fetch(`${myIp}/searchempTimeKeep`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(filtersToSend).toString(),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.xdata.length > 0) {
                const employeeDetails = data.xdata[0]; // Assuming besi_id is unique, you get one employee
                console.log("Employee Details for new page:", employeeDetails);

                //map new obj
                const enrichedLoginDetails = (employeeDetails.login_details || []).map(detail => ({
                    ...detail, // Keep all existing properties (xdate, login, logout, etc.)
                    besi_id: employeeDetails.besi_id,      // Add employee's besi_id
                    full_name: employeeDetails.full_name   // Add employee's full_name
                }));
                // --- END NEW/UPDATED CODE BLOCK ---

                 // Set the enriched data for your coorddetailGrid
                coorddetailGrid.setData(enrichedLoginDetails);
        
            } else {

                // Data is empty, perform a full reset
                coorddetailGrid.clearFilter();  // Clear any active filters
                coorddetailGrid.clearSort();    // Clear any active sorting
               
               // --- REVISED PAGINATION RESET ---
                // Check if pagination is enabled before trying to reset the page
                if (coorddetailGrid.options.pagination) {
                    coorddetailGrid.setPage(1); // Set the page to the first page
                    // If you need to also reset the total number of pages displayed (e.g., pageSize)
                    // you might need to re-initialize pagination or adjust pageSize manually if it's dynamic.
                    // For now, setPage(1) is the core fix.
                }
                // --- END REVISED PAGINATION RESET ---

                coorddetailGrid.deselectRow();  // Deselect any previously selected rows

                // Finally, set the empty data. This will also trigger the "No Data" message.
                coorddetailGrid.setData([]);

                console.error("Could not fetch details for employee:", employeeBesiId, data.msg);
                util.Toasted(`Could not fetch details for employee: ${employeeBesiId}`)
            }
        })
        .catch(error => {
            console.error("Error fetching employee details:", error);
        });
    },

    //===time in/  time out
    logtime: async(param)=>{
            console.log(param)
            
            const now = new Date(); console.log(now)
            const todayDate = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
            const currentTimeFormatted = now.toTimeString().split(' ')[0]; // "HH:MM:SS" (24-hour format)
            const timestampForBackend = now.toISOString(); // Full ISO timestamp for backend storage

            const userId = asn.userProfile.id 

            // 2. Prepare FormData for the backend request
            // This FormData object is specifically for the timekeeping endpoint.
            const formDataForTimekeep = new FormData();
            formDataForTimekeep.append('user_id', userId);
            formDataForTimekeep.append('region', asn.userProfile.region);
            formDataForTimekeep.append('timestamp', timestampForBackend); // Send full timestamp to backend
            formDataForTimekeep.append('action_type', param); // 'login' or 'logout'

            // --- HOW TO CONSOLE.LOG FormData CONTENTS ---
            console.log("--- Inspecting formDataForTimekeep ---");
            for (let pair of formDataForTimekeep.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            console.log("------------------------------------");

            try{
                const response = await fetch(`${myIp}/timekeep`, {
                    method: 'POST',
                    body: formDataForTimekeep

                    /* do this so no uplod.none() in multer
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: 'Apple', quantity: 5 })
                    */
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Server error' }));
                    throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`);
                }

                const data = await response.json();

                if(data.success){

                    util.Toasted(data.msg,2000,false)
                    asn.speak(data.msg)

                }

            }  catch (error) {
                console.error('Timekeeping process failed:', error);
                util.Toasted('Error!'+error,2000,false)

                //showMessageModal('Error', `Failed to ${param} time: ${error.message || 'An unknown error occurred.'}`, [{text: 'OK', class: 'btn-danger', dismiss: true}]);
            } finally {
                // 5. Close the initial dialog (the one with "Time In / Time Out" buttons)
                if (asn.winModal) {
                    asn.winModal.hide();
                }
            }
    },

    userProfile: JSON.parse(localStorage.getItem('profile')),  //get profile,

    openMissingEntryModal : (
        encodedBesiId,
        encodedXdate,
        encodedEmployeeName,
        encodedLoginTime,
        encodedLogoutTime
    ) => {
        const besiId = decodeURIComponent(encodedBesiId);
        const xdate = decodeURIComponent(encodedXdate);
        const employeeName = decodeURIComponent(encodedEmployeeName);
        
        // Decode and convert "null" string back to actual null
        const loginTime = decodeURIComponent(encodedLoginTime) === 'null' ? null : decodeURIComponent(encodedLoginTime);
        const logoutTime = decodeURIComponent(encodedLogoutTime) === 'null' ? null : decodeURIComponent(encodedLogoutTime);

        // Get references to modal form elements
        const modalLoginTimeInput = document.getElementById('modalLoginTime');
        const modalLogoutTimeInput = document.getElementById('modalLogoutTime');
        const modalNotesSelect = document.getElementById('modalNotesSelect'); // Get reference to the select dropdown

        // Populate modal basic fields
        document.getElementById('modalEmployeeName').innerText = employeeName;
        document.getElementById('modalMissingDate').innerText = xdate;
        document.getElementById('modalBesiId').value = besiId;
        document.getElementById('modalEntryDate').value = xdate;

        // Conditional Logic for Login/Logout Inputs (unchanged)
        if (loginTime === null && logoutTime === null) {
            modalLoginTimeInput.value = '';
            modalLoginTimeInput.disabled = false;
            modalLogoutTimeInput.value = '';
            modalLogoutTimeInput.disabled = false;
        } else if (loginTime !== null && logoutTime === null) {
            modalLoginTimeInput.value = loginTime;
            modalLoginTimeInput.disabled = true;
            modalLogoutTimeInput.value = '';
            modalLogoutTimeInput.disabled = false;
        } else {
            modalLoginTimeInput.value = loginTime || '';
            modalLoginTimeInput.disabled = (loginTime !== null);
            modalLogoutTimeInput.value = logoutTime || '';
            modalLogoutTimeInput.disabled = (logoutTime !== null);
        }

        // Reset the dropdown to its default blank option
        modalNotesSelect.value = ''; 

        // Show the modal (assuming Bootstrap 5)
        var missingEntryModal = new bootstrap.Modal(document.getElementById('missingEntryModal'));
        missingEntryModal.show();
    },


	//==,= main run
	init :  () => {
      
        /*
        voice first
        */
        // define variable to store voices globally
        let availableVoices = [];

        let loadVoices = () => {
            availableVoices = speechSynthesis.getVoices();
            // console.log('Voices loaded:', availableVoices);
        }

        speechSynthesis.addEventListener('voiceschanged', loadVoices);

        loadVoices()

        asn.speaks= (txt) => {
            console.log('Attempting to speak:', txt);
            
            // Cancel any ongoing speech
            speechSynthesis.cancel();

            let utter = new SpeechSynthesisUtterance(txt);
            utter.lang = 'en-GB';

            // Choose voice or default
            const voice = availableVoices.find(v => v.lang === 'en-GB' && v.name.toLowerCase().includes('english male'));
            
             if (voice) {
                console.log('voice is ',voice)
                utter.voice = voice;
            } else {
                console.log('Preferred voice not found');
            }
            
            speechSynthesis.speak(utter);
        }

        asn.speaks('Welcome to Better Edge Apps')

        asn.getmenu(util.getCookie('grp_id')) 
        
        console.log('===asn.init()=== loaded!')
        
        if(util.getCookie('f_pic')!==""||util.getCookie('f_pic')== null){
            document.getElementById('img-profile').src=`/html/assets/images/profile/${util.getCookie('f_pic')}`
        }else{
            document.getElementById('img-profile').src=`/html/assets/images/profile/engr.jpg`
        }

        let authz = []
        authz.push(util.getCookie('grp_id') )
        authz.push(util.getCookie('fname'))
        
        console.log(authz[1])

        //==HANDSHAKE FIRST WITH SOCKET.IO
        const userName = { token : authz[1] , mode: 1}//full name token

        asn.socket = io.connect(`${myIp}`, {
            //withCredentials: true,
            transports: ['websocket', 'polling'], // Same as server
            upgrade: true, // Ensure WebSocket upgrade is attempted
            rememberTransport: false, //Don't keep transport after refresh
            query:`userName=${JSON.stringify(userName)}`
            // extraHeaders: {
            //   "osndp-header": "osndp"
            // }
        });//========================initiate socket handshake ================
        asn.socket.on('connect', () => {
            console.log('Connected to Socket.IO server using:', asn.socket.io.engine.transport.name); // Check the transport
        });

        asn.socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });
        //===load mtd-chart
        asn.loadbarMTDChart()

        //==load grid month, rider month
        asn.loadbarChart('hub')

        //===load top5
        setTimeout(() => {
            asn.loadbarChart('rider');
        }, 1000)
    
        console.log('===loadbarchart()===')
        console.log('===asn.init() praise God! Loading JTX group ?v=6 ===', )
        
	}//END init

} //======================= end admin obj==========//

Ext.onReady(function(){
    console.log('ext on ready....')
    Ext.tip.QuickTipManager.init();

    asn.appExt = MyApp.app ; //get instance of Ext.application MyApp.app
    
    // Get the controller
    asn.ctrlExt = asn.appExt.getController('coordController');
    
    asn.ctrlExt.listenviewReady()
    
    asn.ctrlExt.listencoordLocation('')
    asn.ctrlExt.listencoordRider()
        
    window.scrollTo(0,0);
    asn.init() //instantiate now
})


document.addEventListener('DOMContentLoaded', () => {
    // Get a reference to your modal's HTML element
    const universalMessageModalElement = document.getElementById('universalMessageModal');

    universalMessageModalElement.addEventListener('shown.bs.modal', (event) => {
        console.log('show dialog');
    });

    document.getElementById('h5title').innerHTML = util.strDate() + ' (Daily Performance)';
    document.getElementById('h5tophubtitle').innerHTML = util.strDate() + ' (Daily Location Performance)';

    asn.getTimeKeeping(); // *********** RETRIEVE TIMEKEEP RECORD *********

    // --- Submit Missing Entry Button Logic (REFACTORED) ---
    const submitMissingEntryBtn = document.getElementById('submitMissingEntryBtn');
    if (submitMissingEntryBtn) {
        submitMissingEntryBtn.addEventListener('click', async function() {
            const userId = asn.userProfile.id; // Assuming asn.userProfile.id is available
            const besiId = document.getElementById('modalBesiId').value;
            const entryDate = document.getElementById('modalEntryDate').value; // 'MM-DD-YY' format from the modal
            let loginTimeInput = document.getElementById('modalLoginTime').value; // 'HH:MM'
            let logoutTimeInput = document.getElementById('modalLogoutTime').value; // 'HH:MM'
            const notes = document.getElementById('modalNotesSelect').value; // Get value from select

            // --- CRITICAL FRONTEND VALIDATION & NULL HANDLING ---

            // 1. Convert empty input strings to null for consistency, and trim whitespace
            const loginTime = loginTimeInput.trim() === '' ? null : loginTimeInput.trim();
            const logoutTime = logoutTimeInput.trim() === '' ? null : logoutTimeInput.trim();

            // 2. Basic validation: At least one time must be entered
            if (!loginTime && !logoutTime) {
                util.Toasted("Please enter at least a Login Time or Logout Time.", 3000, true); // Assuming util.Toasted can show errors
                return;
            }

            // 3. Validation: Select a reason
            if (!notes) {
                util.Toasted("Please select a reason for the missing entry.", 3000, true);
                return;
            }

            // 4. Validation: Cannot have a Logout without a Login
            if (!loginTime && logoutTime) {
                util.Toasted("Cannot record a Logout Time without a Login Time.", 3000, true);
                return;
            }

            // 5. Validation: Login must be before Logout (if both are provided)
            let submitLoginTimeFull = null;
            let submitLogoutTimeFull = null;

            if (loginTime && logoutTime) {
                // Helper to convert MM-DD-YY to YYYY-MM-DD
                const convertMMDDYYtoYYYYMMDD = (mmddyy) => {
                    if (!mmddyy) return null;
                    const parts = mmddyy.split('-'); // ["MM", "DD", "YY"]
                    const year = (parseInt(parts[2], 10) < 50 ? '20' : '19') + parts[2]; // Assumes 2-digit year
                    return `${year}-${parts[0]}-${parts[1]}`;
                };
                const entryDateYYYYMMDD = convertMMDDYYtoYYYYMMDD(entryDate);

                // Construct full Date objects for comparison
                const loginDateTime = new Date(`${entryDateYYYYMMDD}T${loginTime}:00`); // Using T for ISO format
                const logoutDateTime = new Date(`${entryDateYYYYMMDD}T${logoutTime}:00`); // Using T for ISO format

                // Check for invalid date parsing (e.g., malformed time input)
                if (isNaN(loginDateTime.getTime()) || isNaN(logoutDateTime.getTime())) {
                    util.Toasted("Invalid time format entered. Please use HH:MM.", 3000, true);
                    return;
                }

                if (logoutDateTime <= loginDateTime) {
                    util.Toasted("Logout Time must be after Login Time.", 3000, true);
                    return;
                }
                
                // If validation passes, set the full datetime strings for submission
                submitLoginTimeFull = `${entryDateYYYYMMDD} ${loginTime}:00`;
                submitLogoutTimeFull = `${entryDateYYYYMMDD} ${logoutTime}:00`;

            } else {
                // If only login is provided (and logout is null, due to previous validation)
                const convertMMDDYYtoYYYYMMDD = (mmddyy) => { /* ... (same helper as above) ... */ }; // Redefine or move to global scope
                const entryDateYYYYMMDD = convertMMDDYYtoYYYYMMDD(entryDate);
                submitLoginTimeFull = loginTime ? `${entryDateYYYYMMDD} ${loginTime}:00` : null;
                submitLogoutTimeFull = logoutTime ? `${entryDateYYYYMMDD} ${logoutTime}:00` : null;
            }
            // --- END CRITICAL FRONTEND VALIDATION & NULL HANDLING ---

            // The object to send to the backend
            const payload = {
                user_id: userId, // Assuming this is the current user making the correction
                besi_id: besiId, // The besi_id of the employee whose entry is being corrected
                entry_date: convertMMDDYYtoYYYYMMDD(entryDate), // Send as YYYY-MM-DD
                login_time: submitLoginTimeFull, // Already YYYY-MM-DD HH:MM:SS or null
                logout_time: submitLogoutTimeFull, // Already YYYY-MM-DD HH:MM:SS or null
                reason: notes // The selected reason
            };

            console.log("Submitting missing entry with payload:", payload);

            try {
                const response = await fetch(`${myIp}/recordMissingTimeEntry`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();

                if (data.success) {
                    asn.getTimeKeeping(); // Refresh grid
                    util.Toasted("Missing entry recorded successfully!", 3000, false);
                    var missingEntryModal = bootstrap.Modal.getInstance(document.getElementById('missingEntryModal'));
                    if (missingEntryModal) missingEntryModal.hide();

                } else {
                    util.Toasted("Error recording entry: " + (data.message || "Unknown error"), 3000, true);
                }
            } catch (error) {
                console.error("Error submitting missing entry:", error);
                util.Toasted("An error occurred while submitting. Please try again.", 3000, true);
            }
        });
    }

});

