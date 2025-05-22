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

	//==,= main run
	init :  () => {
        asn.getmenu(util.getCookie('grp_id')) 
        console.log('===asn.init()=== loaded!')

        asn.speaks = (txt) =>{
            let speechsynth = new SpeechSynthesisUtterance();
            speechsynth.text = txt
            speechsynth.lang = "en-US"
            speechSynthesis.speak( speechsynth )
        };    

        console.log('main.js SPEAK()')
        asn.speaks(  util.getCookie('f_voice')) //==FIRST welcome GREETING HERE ===
        
        if(util.getCookie('f_pic')!==""){
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

        asn.socket = io.connect(`${myIp}`, {            //withCredentials: true,
            query:`userName=${JSON.stringify(userName)}`
            // extraHeaders: {
            //   "osndp-header": "osndp"
            // }
        });//========================initiate socket handshake ================
        
        /*
        //===load mtd-chart
        asn.loadbarMTDChart()

        //==load grid month, rider month
        asn.loadbarChart('hub')

        //===load top5
        setTimeout(() => {
            asn.loadbarChart('rider');
        }, 1000)

        console.log('===loadbarchart()===')
        */
        console.log('===asn.init() praise God! Loading JTX group ?v=6 ===')


        //call grid load
        var grid = Ext.getCmp('opmgrGrid')

        grid.getSelectionModel().on('selectionchange', (model, records) => {
            if (asn.ignoreSelectionEvent) return;
      
            console.log('selectionchange fired');
      
            if (records.length === 0) {
              asn.ignoreSelectionEvent = true;
              if (model.getStore().getCount() > 0) {
                //model.select(0);
              }
              asn.ignoreSelectionEvent = false;
            }
          });

	}//END init

} //======================= end admin obj==========//

Ext.onReady(function(){
    console.log('ext on ready....')
    Ext.tip.QuickTipManager.init();

    asn.appExt = MyApp.app ; //get instance of Ext.application MyApp.app
    
    // Get the controller
    asn.ctrlExt = asn.appExt.getController('coordController');
   
})

//osndp.Bubbl
window.scrollTo(0,0);
asn.init() //instantiate now



  
