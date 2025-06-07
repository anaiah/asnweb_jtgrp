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

    getimagename:()=>{
        document.getElementById('serial_image').value = document.getElementById('client_po').value
    },
   
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
    //=======check file size before upload
    //for now acceptable is 2mb max
    checkFileSize:()=>{
        const fi = document.getElementById('ff_uploaded_file');
        // Check if any file is selected.
        if (fi.files.length > 0) {
            for (let i = 0; i <= fi.files.length - 1; i++) {

                const fsize = fi.files.item(i).size;
                const file = Math.round((fsize / 1024));
                // The size of the file.
                if (file >= 1000) { // 1Mb
                    const btnupload = document.getElementById('remittance_upload_btn')
                    btnupload.disabled = true

                    util.Toasted(`File too Big ${file}Mb, pls select a smaller in file size!`,4000,false);
                    
                    fi.value=null
                    //go bottom page
                    util.scrollsTo('ff_blindspot')

                    return false;

                }else{
                    
                    document.getElementById('ff_size').innerHTML=""//reset
                    const btnupload = document.getElementById('remittance_upload_btn')
                    btnupload.disabled = false
                }
                /* turn off display of filesize */
                ///document.getElementById('size').innerHTML ='<b>'+ file + '</b> KB';
                
            }
        }
    },

    //======main func get all Claims per person =====
    getClaims: async (emp_id, emp_name)=>{
        console.log('==running getClaims()')
        
        await fetch(`${myIp}/getclaims/${emp_id}/${emp_name}/3/${nPage}`,{
            cache:'reload'
        })
        .then(res => res.text() )

        .then(text => {	
        
            util.scrollsTo('current_projects')
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
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
        
        if(emp_id===null || emp_id ===""){
            asn.speaks('The system detects that you have an Empty ID, Please Login again')
            location.href = './'
        }//endif

        xparam = `/${util.getCookie('f_region')}/${emp_id}/${util.getCookie('f_email')}`    
        
        await fetch(`${myIp}/gridmonthlytransaction/${emp_id}`,{
            cache:'reload'
        })
        .then( (res) => res.json() )

        .then( (results)  => {

            console.log('mydata ',results )

            asn.allData = results //get  data

            //replace with 
           // gridMonth.setData( results )
            ////// take ot muna  asn.ctrlExt.loadData(results)
            asn.ctrlExt.loadPage( asn.currentPage ) //load first page
                    
            //get chart
            asn.getPieChart(util.getCookie('f_dbId'))

        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },


    // loadPage: (page)=> {

    //     var start = (page - 1) * asn.pageSize;
    //     var end = start + asn.pageSize;
    //     var pageData = asn.allData.slice(start, end);
        
    //     asn.sendData( pageData );
        
    //     asn.currentPage = page;

    //     asn.updatePageInfo() //refresh

    //     console.log('==current page==', asn.currentPage)
    //     // Optionally update UI components (like a paging toolbar)
    //     // and disable/enable buttons based on page
    //     // For example:
    //     // Ext.getCmp('prevBtn').setDisabled(page === 1);
    //     // Ext.getCmp('nextBtn').setDisabled(end >= allData.length);
    // },

    // updatePageInfo:()=> {
        
    //         var start = ( asn.currentPage - 1) * asn.pageSize + 1;
    //         var end = Math.min(asn.currentPage * asn.pageSize, asn.allData.length);

        
    //     Ext.getCmp('pageInfo').setText('Showing ' + start + ' - ' + end + ' of ' + asn.allData.length);
    // },

    // //== load po store / grid
    // sendData:(ydata)=>{
    //     console.log('myController.js===== after getpo, loadPO',ydata.length)

    //     if(ydata) { // if data  not null
    //         //====LOAD PO FOR APPROVAL====
    //         const storeInstance = Ext.data.StoreManager.lookup('monthlyStore')
    //         //storeInstance.removeAll();

    //         storeInstance.loadData(ydata ) //load ARRAY OF DATA
            
    //         //asn.ctrlExt.updatePageInfo()

    //         if (storeInstance) {
    //             // Get an array of all records
    //             var records = storeInstance.getRange();

    //             // Loop through records
    //             Ext.each(records, function(record) {
    //                 //console.log('tutssa',record.get('po_number'), record.get('invoice_number'));
    //             });

    //         } else{
    //             console.log('boge')
    //         }//eif
            
    //     }//eif poData is not null
    // },

    saveobjfrm:null,

    //===save to localstorage
    saveToLogin:async(url="",xdata={})=>{
        
        if (asn.currentAudio) {
            asn.currentAudio.pause();
            asn.currentAudio.currentTime = 0; // Reset to the beginning
        }

        let newdb = asn.db.getItem('myCart')

        if(!newdb){ //FIRST DATA ENTRY

            const url = `${myIp}/savetologin/${util.getCookie('f_id')}`
            
            //=== save as login
            await fetch(url,{
                method:'POST',
                cache:'reload',
                headers: {
                    "Content-Type": "application/json",
                },
            
                body: JSON.stringify(xdata)
            })
            .then((response) => {  //promise... then 
                return response.json();
            })
            .then( (data) => {
                
                if(data.success == "fail"){
        
                    asn.speaks(data.msg)
                    
                    asn.db.removeItem('myCart')

                    util.hideModal('dataEntryModal',2000)    
        
                    return false;

                }else{
                    //set mycart localstorage
                    asn.db.setItem('myCart', JSON.stringify(asn.saveobjfrm))
            
                    const mydata = data.data
                    console.log('***%%%%%%%%%% FROM NODEJS SAVELOGIN() TRIGGER SOCKET EMIT*****', mydata)
                    asn.socket.emit('sendtoOpMgr', mydata)

                }
                
            })    
            .catch((error) => {
                alert(`Error:, ${error}`)
                //asn.speaks()
                console.error('Error:', error)
            })    
        
        //2ND DATA ENTRY
        }else{ //===if with prev record get prev rec and add

            let finaldb = JSON.parse( newdb ) //get all value of old local storage

            finaldb.f_parcel = parseInt(finaldb.f_parcel) + parseInt( xdata.f_parcel)
            //finaldb.f_amount = parseFloat(finaldb.f_amount) + parseFloat( objfrm.f_amount)

            asn.db.setItem('myCart', JSON.stringify(finaldb))
        }
         
        // const badge = document.getElementById('bell-badge')
        // badge.innerHTML = 'With Entry'

        if(asn.db.getItem('myCart')){
            asn.speaks('Local Storage Successfully Saved!!!') //speak
            util.Toasted('Local Storage Successfully Saved!!!',3000,false)//alert
            util.hideModal('dataEntryModal',2000)    
        }
            
    },

    //====rider  save transaction / save remittance
    saveTransaction:async function(url="",xdata={}){

        asn.speaks('Saving Transaction to Database, Please Wait!!!')
                            
        await fetch(url,{
            method:'POST',
            cache:'reload',
            headers: {
                "Content-Type": "application/json",
            },
            
            body: JSON.stringify(xdata)
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then( (data) => {

            const xdata = data.data
            console.log('***%%%%%%%%%% FROM NODEJS SAVETRANSACTION() TRIGGER SOCKET EMIT *****', xdata)
            
            if(data.success=="ok")
                {
                console.log( '+++++ saveTransaction()++++')

                //change form action for posting the Image receipt
                document.getElementById('remittanceUploadForm').action=`${myIp}/postimage/${document.getElementById('ff_transnumber').value}`

                xmsg = "<i class='fa fa-spinner fa-pulse' ></i>  Uploading Receipt, please wait!!!"
                util.Toasted( xmsg, 3000, false)
                
                //asn.speaks("Transaction Saved");

                //everytime save notify opmgr
                asn.socket.emit('sendtoOpMgr', xdata)

                asn.db.removeItem('myCart') //delete myCart in localDB after final remittance
                
                //===update also chart and monthly performance card
                asn.piedata.length = 0  //reset


                asn.getMonthlyTransaction(util.getCookie('f_id'))

                //===== click submit button of Upload Form
                const remuploadbtn = document.getElementById('remittance_upload_btn')
                remuploadbtn.click()

            }else{
                asn.speaks('DATABASE ERROR! PLEASE CHECK!')
            }
           
        })  
        .catch((error) => {
            util.Toasted(`Error:, ${error}`,2000,false)
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
                //asn.speaks("Loading Chart...")
                
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
        asn.db.removeItem('logged') //clear record of  being  logged 
        
        //asn.db.removeItem('myCart')//remove transaction localdb
        
        location.href = './'
                    
    },


    //  //===========GETMENU==========
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


            //listener to click sidebar
            asn.collapz()
    
            return true;
            
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },
    //==========END  GETMENU
    
    currentAudio:null,

    //==========play mp3
    playAudio: (audioPath) =>  {
      // Stop any currently playing audio
      if (asn.currentAudio) {
        asn.currentAudio.pause();
        asn.currentAudio.currentTime = 0; // Reset to the beginning
      }

      // Create and play the new audio
      asn.currentAudio = new Audio(audioPath);
      asn.currentAudio.play()
        .then(() => {
          console.log("Audio playing:", audioPath);
        })
        .catch(error => {
          console.error("Audio playback failed:", error);
        });
    },

    appExt:null,
    ctrlExt:null,

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

        /*
        asn.socket.on('toboss', (oMsg) => {
            let xmsg = []
            
            xmsg.push( oMsg )
            console.warn('====== MESSAGE FROM  MARS RECEIVED ======', xmsg)


            asn.speaks('TOTAL LOGGED IN IS...  ' + xmsg[0].total, ' RIDER IS...' + xmsg[0].rider )
            console.log('====== MESSAGE FROM  MARS RECEIVED ======', xmsg, xmsg[0].total, ' RIDER ', xmsg[0].rider)
            ///// temporarily out   osndp.fetchBadgeData()// update badges
        
        })
        */
        asn.socket.on('graph', (data) => {
            console.log('HERES UR GRAPH DATA', data)

        })
        asn.socket.on('connect', () => {
            console.log('Connected to Socket.IO server using:', asn.socket.io.engine.transport.name); // Check the transport
        });

        asn.socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });
       

        //load the form to validate
        util.loadFormValidation('#newempForm')
        
        util.loadFormValidation('#dataEntryForm')
        util.loadFormValidation('#remittanceForm')

       // util.loadFormValidation('#remitttanceUploadForm')
        
        //load listeners
        util.modalListeners('claimsModal')
        util.modalListeners('newempModal')
        util.modalListeners('dataEntryModal')
        util.modalListeners('remittanceModal')

        //
        if(typeof util.getCookie('f_id') === 'undefined' || util.getCookie('f_id')===null || util.getCookie('f_id') === ""){
            alert('ERROR, PLEASE ADVISE COORDINATOR TO CONTACT ASIANOW TECHNICAL SUPPORT TEAM!')
            return false
        }else{
            asn.getMonthlyTransaction(util.getCookie('f_id'))
        }

         if(!asn.db.getItem('myCart')){ //if initial no cart data thenshow.. if with  cart. dont show
            util.modalShow('dataEntryModal') // show initial data entry modal
        }else{  // else, if  there's a present cart and notdeleted, rider shud  close
            
            // util.translate({
            //     xmsg: `May Pending ka pala, paki-out sa paggamit ng Remittance entry!!!`,
            //     runwhat: () => {
            //         util.modalShow('remittanceModal')
            //     }
            // });

        }

        //============ PREPARE LISTENERS FOR AUDIO TO PLAY  detect listen if upload reeceipt is clickeed
        // document.getElementById('ff_uploaded_file').addEventListener('click', function(event) {
        //     // const selectedFile = event.target.files[0];

        //     // if (selectedFile) {
        //     //     console.log("File selected:", selectedFile.name);
        //     //     // You can add more code here to handle the selected file
        //     // } else {
        //     //     console.log("No file selected.");
        //     // }
        // });

        // Add focus event listeners to the input fields
        document.getElementById('f_parcel').addEventListener('click', function() {//hub_qty
            const audioPath = this.getAttribute('data-audio');
            asn.playAudio(audioPath);
        });

        document.getElementById('f_amount').addEventListener('focus', function() {
            const audioPath = this.getAttribute('data-audio');
            asn.playAudio(audioPath);
        });

        document.getElementById('ff_amount').addEventListener('focus', function() {
            const audioPath = this.getAttribute('data-audio');
            asn.playAudio(audioPath);
        });

        document.getElementById('ff_uploaded_file').addEventListener('click', function() {
            const audioPath = this.getAttribute('data-audio');
            asn.playAudio(audioPath);
        });
        console.log('===asn.init() praise God! Loading JTX RIDER GROUP ?v=7 ===')

	}//END init

} //======================= end admin obj==========//

Ext.onReady(function(){
    console.log('ext on ready....')
    Ext.tip.QuickTipManager.init();

    asn.appExt = MyApp.app ; //get instance of Ext.application MyApp.app

    // Get the controller
    asn.ctrlExt = asn.appExt.getController('riderController');
       
    
    //osndp.Bubbl
    window.scrollTo(0,0);

    asn.init() //instantiate now

})
