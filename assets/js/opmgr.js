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
        
                        
        console.log("SPEAK()-->",voices)
        
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
            //util.Toast(`Error:, ${error}`,1000)
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
        location.href = '/jtx'
                    
    },

    //==== for mtd chart
    loadbarMTDChart: async()=>{
        console.log('loading... loadbarMTDchart()')

        await fetch(`${myIp}/headcoor/mtdlocation/${util.getCookie('f_email')}`,{
            cache: 'reload'
        })
        .then((res) => {  //promise... then 
            return res.json();
        })
        .then((xdata) => {

            console.log('mtd data==',  xdata)
            // Replace null qty with 0
            // xdata.forEach(item => {
            //     if (item.parcel_delivered === null) {
            //         item.parcel_delivered  = 0;
            //     }
            // });
            
            // // Sort the array in descending order (change to < for ascending)
            // xdata.sort((a, b) => b.parcel_delivered - a.parcel_delivered);

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
        console.log('loading... loadbarchart()')

        await fetch(`${myIp}/headcoor/topfivehub/${util.getCookie('f_email')}/${ctrans}`,{
            cache: 'reload'
        })
        .then((res) => {  //promise... then 
            return res.json();
        })
        .then((xdata) => {

            //console.log('merge',xdata.length)

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
   
    ignoreSelectionEvent:false,

    //================load data opmgr
    loadopmgrArea: async()=>{
        console.log('loading... load op mgr Area ', `${myIp}/opmgr/summary/${util.getCookie('f_email')}`)

        await fetch(`${myIp}/opmgr/summary/${util.getCookie('f_email')}`,{
            cache: 'reload'
        })
        .then((res) => {  //promise... then 
            return res.json();
        })
        .then((xdata) => {
            
            //sort here 
            xdata.sort(function(a, b) {
                var parcelDeliveredA = parseInt(a.parcel_delivered, 10);
                var parcelDeliveredB = parseInt(b.parcel_delivered, 10);
              
                if (parcelDeliveredA > parcelDeliveredB) {
                  return -1;
                }
                if (parcelDeliveredA < parcelDeliveredB) {
                  return 1;
                }
                return 0;
              });
            
              asn.allData = xdata
              
            console.log('loadopmgrArea() data->',xdata)
            asn.ctrlExt.sendData(asn.allData,'opmgrStore') //load first page
            
        
        })
        .catch((error) => {
            console.error('Error:', error)
        })
        
    }, //===end top 5

    //====execute socket io after each update from Rider
    execute:()=>{
            alert('Graph pls.')
    },


    chart1:null,
    chart2:null,

    configObj:null,
    winModal:null,

    //====FOR UPLOADING HRIS EXCEL
    showExcel: () => {
        asn.configObj = { keyboard: false }
        asn.winModal = new bootstrap.Modal(document.getElementById('hrisloadModal'), asn.configObj);

        // Show modal
        asn.winModal.show();
    },

    waitingIndicator : document.getElementById('waiting-indicator'),

    listeners:()=>{

         //for upload pdf
        const frmupload = document.getElementById('hrisuploadForm')
        frmupload.addEventListener("submit", e => {
           
            const formx = e.target;

            asn.waitingIndicator.style.display = 'block'

            fetch(`${myIp}/xlshris`, {
                //method:'GET',
                method: 'POST',
                body: new FormData(formx),
            })
            .then( (response) => {
                return response.json() // if the response is a JSON object
            })
            .then( (data) =>{
                if(data.status){
                    console.log ('CLAIMS DONE!', data )
                    util.speak(data.message)

                    // Select the form element
                    const form = document.querySelector('#hrisuploadForm'); // or use class selector

                    // Reset the form
                    form.reset();

                    util.hideModal('hrisloadModal',2000)//then close form    

                    asn.waitingIndicator.style.display = 'none'
                }
            })
            // Handle the success response object
            .catch( (error) => {
                console.log(error) // Handle the error response object
            });


            //e.preventDefault()
            console.log('===HRIS SUBMITTTTT===')
                //// keep this reference for event listener and getting value
                /////const eqptdesc = document.getElementById('eqpt_description')
                ////eqptdesc.value =  e.target.value
            
            // Prevent the default form submit
            e.preventDefault();    
        })
        //=================END FORM SUBMIT==========================//
               
    },

	//=================================== main run
	init :  () => {
        asn.getmenu(util.getCookie('grp_id')) 
        console.log('===asn.init()=== loaded!')

        asn.listeners()
        
        
        asn.speaks = (txt) =>{
            let speechsynth = new SpeechSynthesisUtterance();
            speechsynth.text = txt
            speechsynth.lang = "en-US"
            speechSynthesis.speak( speechsynth )
            
            console.log('===main.js SPEAK()');
        
        };
       

        if(util.getCookie('f_pic')!==""){
            document.getElementById('img-profile').src=`/html/assets/images/profile/${util.getCookie('f_pic')}`
        }else{
            document.getElementById('img-profile').src=`/html/assets/images/profile/engr.jpg`
        }

        let authz = []
        authz.push(util.getCookie('grp_id') )
        authz.push(util.getCookie('fname'))
        authz.push(util.getCookie('f_id'))
                
        console.log('=== authz ',authz[1], authz[2])

        //==HANDSHAKE FIRST WITH SOCKET.IO
        const userName = { token : authz[1] , emp_id: authz[2], mode: 1}//full name token
        
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

        
        asn.socket.on('loadchart', (xresult) => {
            console.log('HERES UR GRAPH DATA',xresult)

           // console.log('chart sum',asn.ctrlExt.calculateChartData(data))
            ///asn.speaks('ASN SOCKET INCOMING DATA!!!')

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
                data: xresult.map(item => item[key])
            }));

            
            const parcelData = parcel_keysToExtract.map(key => ({
                name: parcel_seriesNames[key] || key,  // Use seriesNames or the key if not found
                data: xresult.map(item => item[key])
            }));

            //================FOR  NATIONWIDE  CALCULATIONS=================
            let anationwide = []
            anationwide.push(asn.ctrlExt.calculateChartData(xresult))
            //=====================================================

            //nationwide
            document.getElementById('x-parcel').innerHTML =  util.addCommas(anationwide[0].parcel)
            document.getElementById('x-delivered').innerHTML =  util.addCommas(anationwide[0].parcel_delivered)

            if( anationwide[0].parcel_delivered < anationwide[0].parcel){
                document.getElementById('xs-delivered').classList.add('text-danger')
            }else{
                document.getElementById('xs-delivered').classList.add('text-primary')
            }
            
            document.getElementById('x-remit').innerHTML =  util.formatNumber(anationwide[0].amount_remitted)

            console.log('<<<<<<<total amt vs remit>>>>>',anationwide[0].amount, anationwide[0].amount_remitted)
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

            //**************** RELOAD THE  GRIDS========= */
            asn.ctrlExt.listenRegion()

            asn.ctrlExt.listenLocation()

            asn.ctrlExt.listenRider()
           
            console.log('=====CHARTDATA=====',attendanceData, parcelData)
        })

        asn.socket.on('connect', () => {
            console.log('Connected to Socket.IO server using:', asn.socket.io.engine.transport.name); // Check the transport
        });

        asn.socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        //title chart
        document.getElementById('region').innerHTML= util.strDate() + '<br>(Registered v. Reported)'
        document.getElementById('nationwide').innerHTML= util.strDate() + '<br>(For Delivery v. Delivered)'
        document.getElementById('xlabel').innerHTML= `<b>${util.strDate()} <br>(Nationwide Summary Performance)</b>`
        
        console.log('===asn.init() praise God! Loading JTX group ?v=6 ===')

        document.getElementById('h5title').innerHTML= util.strDate() + ' (Daily Performance)'

        
	}//END init

} //======================= end admin obj==========//

Ext.onReady(function(){
    console.log('ext on ready....')
    Ext.tip.QuickTipManager.init();

    asn.appExt = MyApp.app ; //get instance of Ext.application MyApp.app
    
    // Get the controller
    asn.ctrlExt = asn.appExt.getController('opmgrController');

    //listen main region grid
    asn.ctrlExt.listenRegion()

    asn.ctrlExt.listenLocation()

    asn.ctrlExt.listenRider()
    
    //lodchart first  REgional performance    
    asn.ctrlExt.loadCurrentRegionChart('attendance-chart', 'chart1')

    setTimeout(() => {
        asn.ctrlExt.loadCurrentRegionChart('parcel-chart', 'chart2')
    }, 1000)
   
    //===LOAD INITIAL CHART
    asn.ctrlExt.loadinitialChart()
      
    window.scrollTo(0,0);
    asn.init() //instantiate now

})