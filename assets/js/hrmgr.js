    const mainContainer = document.getElementById('main');
    const sidebar = document.getElementById('sidebar');
    
    let sidebarOpen = false;

    
    const  sales = {

        toggleSidebar : () => {
            if (sidebarOpen) {
                // Collapse sidebar
                sidebar.style.left = '-250px';
                mainContainer.classList.remove('sidebar-open');
                sidebarOpen = false;
            } else {
                // Open sidebar
                sidebar.style.left = '0';
                mainContainer.classList.add('sidebar-open');
                sidebarOpen = true;
            }
        },

        //===new project posting
        //new site posting 
        newsitePost:async function(frm,modal,url="",xdata={}){
                      
            await fetch(url,{
                method:'POST',
                body: xdata
            })
            .then((response) => {  //promise... then 
                return response.json();
            })
            .then((data) => {
                if(data.success){

                    util.speak(data.voice); //speak about success

                    const btn = document.getElementById('save-btn')
                    btn.innerHTML = 'Save';
                    btn.disabled = false;

                    //reset  form
                    // Select the form element
                    const form = document.querySelector('#projectForm'); // or use class selector

                    // Reset the form
                    form.reset();

                    sales.projectModal.hide() //hide data entry

                    console.log('data saved....',data.info)

                }else{
                    util.speak(data.voice)
                    
                    return
                }//eif
                
            })
            .catch((error) => {
            // util.Toast(`Error:, ${error.message}`,1000)
            console.error('Error:', error)
            })
        
        },
     
        //INCLUDE LISTENER
        listeners:()=>{
            document.getElementById('menuBtn').onclick = sales.toggleSidebar;

            document.getElementById('sidebar').onclick = sales.toggleSidebar;

            // Add event listeners to links
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.onclick = () => {
                // Collapse sidebar when link clicked
                sales.toggleSidebar();

                // Optionally, you can add actions for navigation here
                };
            });
         },

        formatDate: (ts) =>{
            const date = new Date(ts);
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            const year = date.getFullYear();
            return `${month}-${day}-${year}`;
        },

        //====== GET PROJECT ======//
        getProjects: async () => {
            const response = await fetch(`${myIp}/getallmyprojects/${owner.full_name}`)
            const data = await response.json()
            console.log('projects====',data)

           let statusMap = [
            { label: "Site Sourcing", color: "warning" },
            { label: "Site Negotiation", color: "success", },
            { label: "Site Secured", color: "success" },
            { label: "Opened", color: "primary" },
            ];

            const tbody = document.getElementById('projectTableBody');
            tbody.innerHTML = ''; // clear existing content

            data.forEach(xdata => {
                const tr = document.createElement("tr");

                // Create the select element
                const select = document.createElement('select');
                select.classList.add('form-select'); // Add Bootstrap class for styling
                select.dataset.projectId = xdata.id; // Store project ID for later use

                // Populate the select options
                statusMap.forEach((status, index) => {
                    const option = document.createElement('option');
                    option.value = index + 1; // Store the index + 1 as the value (matching your database)
                    option.text = status.label;
                    if (xdata.status === index + 1) {
                        option.selected = true; // Select the option matching the current status
                    }
                    select.appendChild(option);
                });

                // Event listener for select change (you'll need to implement updateStatus)
                select.addEventListener('change', function() {
                    const projectId = this.dataset.projectId;
                    const newStatus = this.value;

                    const selectoption = this.options[this.selectedIndex]
                    const selectedText = selectoption.text;

                    console.log(projectId,newStatus,selectedText)

                    //***************** CALL UPDATE STATUS */
                    sales.updateStatus(projectId, newStatus, selectedText); // Call your updateStatus function
                });


                // <a href="javascript:sales.getCompetitors('${xdata.id}','${xdata.latitude}','${xdata.longitude}')" class="show-on-map-link">Show on Map</a>
                
                // Create the table cells
                tr.innerHTML = `
                <td width="200px">${xdata.name} <br>
                    <span class="proj-class">${xdata.project_code}</span><br>
                </td>
                <td width="300px">${xdata.address}</td>
                <td>${xdata.owner}</td>
                <td>${sales.formatDate(xdata.created_at)}</td>
                `;

                // Create the select cell
                const selectTd = document.createElement('td');
                selectTd.appendChild(select);
                tr.appendChild(selectTd);

                tbody.appendChild(tr);
            });

            sales.configObj = { keyboard: false, backdrop:'static' }
            sales.projectlistModal = new bootstrap.Modal(document.getElementById('projectlistModal'),sales.configObj);

            // Show modal
            sales.projectlistModal.show();

        }, //====END GETPROJECTS
        
        //======UPDATE STATUS =====//
        updateStatus : (projectId, newStatus, retStatus) => {
            // Send an API request to update the status
            fetch(`${myIp}/updatemyprojects/${projectId}/${newStatus}`,{ // Replace with your API endpoint
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })
             .then((response) => {  //promise... then 
                return response.json();
            })
            .then(data => {
                if (data.status) {
                    console.log(`Project ${projectId} status updated to ${newStatus}`);
                    // Optionally, update the UI to reflect the new status
                    util.speak(`Project successfully updated to ${retStatus}`)
                } else {
                    console.error(`Failed to update project ${projectId} status:`, response.status);
                    // Display an error message to the user
                }
            })
            .catch(error => {
                console.error('Error updating project status:', error);
                // Display an error message to the user
            });
        },

        
        //====GLOBAL VARS====//
        configObj:null,
        projectModal:null,

        projectlistModal : null,
        dataEntryModal: null,
        
        socket:null,
        nuProjData: [],  //===global array to hold new  site info

        waitingIndicator : document.getElementById('waiting-indicator'),

        //=========WHEN  USER  CCLICKS ON MAP=====//
        getLocationData:async(lat, lon)=>{ //get reverse geocoding, elevation
            const response = await fetch(`${myIp}/geocode/${lat}/${lon}`)
            const data = await response.json()
            
            sales.nuProjData = data
            util.newMapData = data.xdata

            console.log( 'data ko ',data )

            //***************** */ Pin competitors first
            gjson.mygeojson( sales.nuProjData,lat,lon)
            //********************** */

            //console.log(`====competitors====`,  data.xdata)


            //=========TAKE OUT MUN CARLO PERO IBALIK MO  ITO FOR PROJECT MODAL
            // document.getElementById('elevationField').value = `${data.elevation.toFixed(2)}`
            // document.getElementById('addressField').value = data.address; // suppose you have such an input
            // document.getElementById('cityField').value = data.city;
            
            // document.getElementById('latField').value = lat 
            // document.getElementById('lonField').value = lon 
            
            // document.getElementById('projectName').focus();
        
        },

        ///show postiion of rider
        showPosition: (position) => { 
            
            console.log('GETTING POSITION ',position.coords.latitude, position.coords.longitude )
            
            let obj={}
            obj.lat = position.coords.latitude
            obj.lon = position.coords.longitude

            //===================================
                sales.waitingIndicator.style.display = 'block'
                sales.getLocationData( obj.lat, obj.lon)
            //===================================

        },

        getHubLocation:()=>{

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition( sales.showPosition );
            }else{
            alert('PLEASE TURN-ON YOUR PHONE LOCATION OR GPS')
            return false
            }
        },

        siteSelect:(nval)=>{
            if(nval!==""){
                document.getElementById('search-btn').disabled =  false            
            }else{
                document.getElementById('search-btn').disabled =  true
            }
        },

        //=====aedc
        getSite:async(nSite)=>{

            sales.myToast('Getting Site',2000)

            const response = await fetch(`${myIp}/aedc/getsite/${nSite}`)
            const data = await response.json()

            console.log('data ', data)

            aedcData.setData( data ) //===FILL  GRID DATA

            document.getElementById('h6-txt').innerHTML=`${data[1].project_site}`

            console.log(`get site ${nSite}, emittting socket....`)

            //session storage
            sessionStorage.setItem('project_site',`${nSite}`)

        },

        scrollToTop:()=> {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Optional: Adds a smooth scrolling animation
            });
        },

        //===aedc
        newEntry:(xID, cName, cPhone, cMethod)=>{
            console.log('house id', xID)
            
            sales.configObj = { keyboard: false, backdrop:'static' }
            sales.dataEntryModal = new bootstrap.Modal(document.getElementById('dataEntryModal'),sales.configObj);

            // Show modal
            sales.dataEntryModal.show();

            document.getElementById('house_id').value = xID
            document.getElementById('method_id').value = cMethod
            document.getElementById('customer').value = ( cName=="" ? "" : cName)
            document.getElementById('cellphone').value = ( cName=="" ? "" : cPhone)

            
        },

                    
        //aedc new site posting 
        newHousePost:async function(frm,modal,url="",xdata={}){
                      
            await fetch(url,{
                method:'POST',

                 headers: {
                'Content-Type': 'application/json',
                },

                body: JSON.stringify(xdata)

            })
            .then((response) => {  //promise... then 
                return response.json();
            })
            .then((data) => {
                if(data.success){

                    util.speak(data.voice); //speak about success

                    const btn = document.getElementById('savedata-btn')
                    btn.innerHTML = 'Save';
                    btn.disabled = false;

                    //reset  form
                    // Select the form element
                    const form = document.querySelector('#dataEntryForm'); // or use class selector

                    // Reset the form
                    form.reset();

                    sales.dataEntryModal.hide() //hide data entry

                    //refresh grid
                    sales.getSite( sessionStorage.getItem('project_site'))
                    
                    console.log('data saved....')

                    sales.getmtdPerformance() // update chart
                    
                    //=====emit to socket
                    sales.socket.emit('sendToMgr', data)
                    console.log( '===EMIT sendToMgr===')
                }else{
                    util.speak(data.voice)
                    
                    return
                }//eif
                
            })
            .catch((error) => {
            // util.Toast(`Error:, ${error.message}`,1000)
            console.error('Error:', error)
            })
        
        },

        //===aedc for monthly chart
        getmtdPerformance: async()=>{

            util.speak('Loading chart...!')
            
            await fetch(`${myIp}/aedc/mtdperformance`,{
                cache:'reload'
            })
            .then( (res) => res.json() )

            .then( (results)  => {

                console.log('mtd data ',results )

                sales.loadChart( results )//load dta results to map

                const series = [
                    { name: "Reserved", data: [] },
                    { name: "Sold", data: [] }
                ];
                
                results.forEach(item => {
                    series[0].data.push(parseInt(item.reserved));
                    series[1].data.push(parseInt(item.sold));
                });

                sales.chart1.updateSeries(series);

                let xcat = []
            
                //PUSH THE SDO'S NAME JOM,SHE,LOUIE
                results.forEach(item => {
                    if (!xcat.includes(item.owner_name.trim())) {
                        xcat.push(item.owner_name.trim());
                    }
                });

                console.log(xcat)
                sales.chart1.updateOptions({ 
                    xaxis: { categories: xcat }
                });

            })	
            .catch((error) => {
                //util.Toast(`Error:, ${error}`,1000)
                console.error('Error:', error)
            })    
        
        },

        chart1:null,

        //load chart
        loadChart: ()=>{
            console.log('loading from  controller  chart.....')
           
            //let colors = ['#0277bd', '#00838f', '#00695c', '#2e7d32','#558b2f','#9e9d24','#ff8f00','#d84315'];
            let colors = [ '#0277bd','#d84315',  '#2e7d32','#ff8f00']
                    
            // Fisher-Yates shuffle
            // for (let i = colors.length - 1; i > 0; i--) {
            //     const j = Math.floor(Math.random() * (i + 1));
            //     [colors[i], colors[j]] = [colors[j], colors[i]]; // swap elements
            // }//endfor   

            // Map data
           

           // console.log('categories',categories)


            var options = {
                series:[], 
                colors:colors,
                chart: {
                    type: 'bar',
                    height: 350,
                    width: 400,
                    redrawOnParentResize: false,
                    redrawOnWindowResize: false,
                            
                },
                
                plotOptions: {
                    bar: {
                        dataLabels: {
                            position: 'top',
                            //orientation:'vertical'
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
                    offsetY:-20,
                    style: {
                        fontSize: "12px",
                        colors: ["#d84315","#00695c"]
                    },
                
                },
                
                stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
                },
                xaxis: {
                    categories: [],

                    title: {
                        text: 'Location Status',
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
                        text: '',
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
    
            } //end options
        
            sales.chart1 = new ApexCharts(document.querySelector("#myChart"), options);
            sales.chart1.render();

        },//====== end loadChart()
        
        myToast:(msg, nTime)=>{
            
            document.getElementById('txtmsg').innerHTML = msg
            
            sales.waitingIndicator.style.display = 'block';
            setTimeout(()=> { 
               sales.waitingIndicator.style.display ='none' 
            }, nTime  )
        },

        //INIT 
        init : () =>{
        
            let db = localStorage  //get localstoreage

            owner =  JSON.parse(db.getItem('profile'))  //get profile

           // util.Toasted(`Welcome ${owner.full_name}`,2000,false) //Welcome Message
            sales.myToast( `Welcome ${owner.full_name}`,2600 )

            document.getElementById('profile_pic').src = `./assets/images/profile/${owner.pic}`

            let authz = []
            authz.push( owner.grp_id )
            authz.push( owner.full_name)
            
            //console.log(authz[1])

            //==HANDSHAKE FIRST WITH SOCKET.IO
            const userName = { token : authz[1] , mode: owner.grp_id}//full name token

            sales.socket = io.connect(`${myIp}`, {
                //withCredentials: true,
                transports: ['websocket', 'polling'], // Same as server
                upgrade: true, // Ensure WebSocket upgrade is attempted
                rememberTransport: false, //Don't keep transport after refresh
                query:`userName=${JSON.stringify(userName)}`
                // extraHeaders: {
                //   "osndp-header": "osndp"
                // }
            });//========================initiate socket handshake ================

            sales.socket.on('connect', () => {
                console.log('Connected to AEDC Socket.IO server using:', sales.socket.io.engine.transport.name); // Check the transport
            });

            sales.socket.on('disconnect', () => {
                console.log('Disconnected from AEDC Socket.IO server');
            });
           //==============================================END  SOCKET ==========================//
           
            util.loadFormValidation('#searchForm')
            util.loadFormValidation('#dataEntryForm')
            
            document.getElementById('search-btn').disabled =  true
           
            sales.scrollToTop()

            sales.getmtdPerformance() // load chart

        }


    }//===end obj

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });    
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('=======DOM CONTENT LOADED=====')
        sales.init()
        sales.listeners()

        /* TAKE OUT MUNA KEYBOARD DETECT*/

        ///disable  rightclck
        document.onkeydown = function(e) {
            if(e.keyCode == 123) {  // F12
                return false;
            }
            if(e.ctrlKey && e.shiftKey && e.keyCode == 73) {  // Ctrl+Shift+I
                return false;
            }
            if(e.ctrlKey && e.shiftKey && e.keyCode == 74) {  // Ctrl+Shift+J
                return false;
            }
            if(e.ctrlKey && e.keyCode == 85) { // Ctrl+U
                return false;
            }
        }
        
    })
   
   
    
    