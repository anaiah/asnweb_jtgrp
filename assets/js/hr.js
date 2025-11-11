    const mainContainer = document.getElementById('main');
    const sidebar = document.getElementById('sidebar');
    
    let sidebarOpen = false;

    
    const  hris = {

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

      
        //INCLUDE LISTENER
        listeners:()=>{
            document.getElementById('menuBtn').onclick = hris.toggleSidebar;

            document.getElementById('sidebar').onclick = hris.toggleSidebar;

            // Add event listeners to links
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.onclick = () => {
                // Collapse sidebar when link clicked
                hris.toggleSidebar();

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

        
        //====GLOBAL VARS====//
        configObj:null,
        projectModal:null,

        projectlistModal : null,
        dataEntryModal: null,
        
        socket:null,
        nuProjData: [],  //===global array to hold new  site info

        waitingIndicator : document.getElementById('waiting-indicator'),

        scrollToTop:()=> {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Optional: Adds a smooth scrolling animation
            });
        },

        winModal:null,

        //====FOR UPLOADING HRIS EXCEL
        showExcel: () => {
            hris.configObj = { keyboard: false }
            hris.winModal = new bootstrap.Modal(document.getElementById('hrisloadModal'), hris.configObj);

            // Show modal
            hris.winModal.show();
        },

        
        myToast:(msg, nTime)=>{
            
            document.getElementById('txtmsg').innerHTML = msg
            
            //hris.waitingIndicator.style.display = 'block';
            const dataLoader = document.getElementById('dataLoader');

            dataLoader.classList.remove('d-none'); // Show spinne
            
            setTimeout(()=> { 
                dataLoader.classList.add('d-none'); // Hide spinner
            }, nTime  )
        },

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


                //listener to click sidebar
                hris.collapz()
        
                return true;
                
            })	
            .catch((error) => {
                //util.Toast(`Error:, ${error}`,1000)
                console.error('Error:', error)
            })    
        },
        //==========END  GETMENU
        

        //==================search filter=======
        searchEmp: async() => {
            
            const searchForm = document.getElementById('searchForm');
            const formData = new FormData(searchForm);

            // --- HOW TO INSPECT FormData CONTENTS ---
            console.log("--- Inspecting FormData ---");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            console.log("-------------------------");
            
            // --- END INSPECTION ---
        
            const response = await fetch(`${myIp}/searchemp`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Server error' }));
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const data = await response.json();

            console.log( data.xdata)
            
            console.log( hrisGrid)
            hrisGrid.setData(data.xdata)
        },

        hrlistener:()=>{
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

        //==================INIT 
        init : () =>{
        
            util.loadFormValidation('#searchForm')


            hris.getmenu(util.getCookie('grp_id')) 

            let db = localStorage  //get localstoreage

            owner =  JSON.parse(db.getItem('profile'))  //get profile
            //console.log('==HHURRAY===',owner)
            // util.Toasted(`Welcome ${owner.full_name}`,2000,false) //Welcome Message
            
            //hris.myToast( `Welcome ${owner.fullname}`,2600 )

            document.getElementById('img-profile').src = `../html/assets/images/profile/${owner.pic}`

            let authz = []
            authz.push( owner.grp_id )
            authz.push( owner.fullname)
            
            //console.log(authz[1])

            //==HANDSHAKE FIRST WITH SOCKET.IO
            const userName = { token : authz[1] , mode: owner.grp_id}//full name token

            hris.socket = io.connect(`${myIp}`, {
                //withCredentials: true,
                transports: ['websocket', 'polling'], // Same as server
                upgrade: true, // Ensure WebSocket upgrade is attempted
                rememberTransport: false, //Don't keep transport after refresh
                query:`userName=${JSON.stringify(userName)}`
                // extraHeaders: {
                //   "osndp-header": "osndp"
                // }
            });//========================initiate socket handshake ================

            hris.socket.on('connect', () => {
                console.log('Connected to AEDC Socket.IO server using:', hris.socket.io.engine.transport.name); // Check the transport
            });

            hris.socket.on('disconnect', () => {
                console.log('Disconnected from AEDC Socket.IO server');
            });
           //==============================================END  SOCKET ==========================//
           
            util.loadFormValidation('#newempForm')
            util.loadFormValidation('#hrisuploadForm')
            
            //document.getElementById('search-btn').disabled =  true
           
            hris.scrollToTop()

            util.modalListeners('newempModal')
            util.modalListeners('hrisloadModal')

            hris.listeners()
            hris.hrlistener()
        }    
    }//===end obj

    hris.init();
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });    
    
    document.addEventListener('DOMContentLoaded', function() {

        hris.init()
        //hris.listeners()

        console.log('DOM CONTENT loaded')
        
    });



   
    
    