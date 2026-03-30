/*author : Carlo O. Dominguez*/

import {  initEmpDetailGrid, emptkGrid } from './mod-emptkgrid.js';

const emp = {
	
    socket:null,
    
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
    
    db: window.localStorage, //instantiate localstorage

    logout:()=>{
        emp.db.removeItem('myCart')//remove transaction localdb
        location.href = './' 
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

            emp.collapz()//invoke one time
            
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
            emp.configObj = { keyboard: false }
            emp.winModal = new bootstrap.Modal(document.getElementById('universalMessageModal'), emp.configObj);

            // Show modal
            emp.winModal.show();
    },

    //THIS FUNCTION IS AVAILABLE IF USER IS USING besi = betteredge.html new onesubmitMissingEntryBtn
    getTimeKeeping: async( )=>{

        console.log( 'hey getTimeKeeping() ', emp.userProfile.id, emp.userProfile.besi_id, emp.userProfile.region )

        const employeeBesiId = emp.userProfile.besi_id; // Get this from your page's context
        const employeeRegion = emp.userProfile.region; // Get this from your page's context (VERY IMPORTANT!)

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
                emptkGrid.empdetailGrid.setData(enrichedLoginDetails);
        
            } else {

                // Data is empty, perform a full reset
                emptkGrid.empdetailGrid.clearFilter();  // Clear any active filters
                emptkGrid.empdetailGrid.clearSort();    // Clear any active sorting
               
               // --- REVISED PAGINATION RESET ---
                // Check if pagination is enabled before trying to reset the page
                if (emptkGrid.empdetailGrid.options.pagination) {
                    emptkGrid.empdetailGrid.setPage(1); // Set the page to the first page
                    // If you need to also reset the total number of pages displayed (e.g., pageSize)
                    // you might need to re-initialize pagination or adjust pageSize manually if it's dynamic.
                    // For now, setPage(1) is the core fix.
                }
                // --- END REVISED PAGINATION RESET ---

                emptkGrid.empdetailGrid.deselectRow();  // Deselect any previously selected rows

                // Finally, set the empty data. This will also trigger the "No Data" message.
                emptkGrid.empdetailGrid.setData([]);

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

            const userId = emp.userProfile.id 

            // 2. Prepare FormData for the backend request
            // This FormData object is specifically for the timekeeping endpoint.
            const formDataForTimekeep = new FormData();
            formDataForTimekeep.append('user_id', userId);
            formDataForTimekeep.append('region', emp.userProfile.region);
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
                    util.speak(data.msg)

                    //update also thhe grid after timein/out
                    emp.getTimeKeeping()
                }

            }  catch (error) {
                console.error('Timekeeping process failed:', error);
                util.Toasted('Error!'+error,2000,false)

                //showMessageModal('Error', `Failed to ${param} time: ${error.message || 'An unknown error occurred.'}`, [{text: 'OK', class: 'btn-danger', dismiss: true}]);
            } finally {
                // 5. Close the initial dialog (the one with "Time In / Time Out" buttons)
                if (emp.winModal) {
                    emp.winModal.hide();
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

    dbprofile: null,

	//==,= main run
	init :  () => {
        
        emp.dbprofile = JSON.parse(localStorage.getItem('profile'));
        
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

        emp.socket = io.connect(`${myIp}`, {
            //withCredentials: true,
            transports: ['websocket', 'polling'], // Same as server
            upgrade: true, // Ensure WebSocket upgrade is attempted
            rememberTransport: false, //Don't keep transport after refresh
            query:`userName=${JSON.stringify(userName)}`
            // extraHeaders: {
            //   "osndp-header": "osndp"
            // }
        });//========================initiate socket handshake ================
        emp.socket.on('connect', () => {
            console.log('Connected to Socket.IO server using:', emp.socket.io.engine.transport.name); // Check the transport
        });

        emp.socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        console.log('===emp.init() praise God! Loading JTX group ?v=6 ===', )
        
	}//END init

} //======================= end admin obj==========//

window.scrollTo(0,0);
emp.init() //instantiate now

window.emp = emp //for debugging only, remove in production

/******************** DOMCONTENT LOADED LISTENER  */
document.addEventListener('DOMContentLoaded', () => {

    console.log('====DOMContentLoaded for coordinator====')

    // Get a reference to your modal's HTML element //TIMEIN OUT MODAL
    const universalMessageModalElement = document.getElementById('universalMessageModal');
    universalMessageModalElement.addEventListener('shown.bs.modal', (event) => {
        console.log('show dialog');
    });

    initEmpDetailGrid(); // Initialize the employee detail grid (formerly coorddetailGrid) when the DOM is ready


    emp.getmenu(emp.userProfile.grp_id) // *********** RETRIEVE MENU *********

    emp.getTimeKeeping(); // *********** RETRIEVE TIMEKEEP RECORD *********

    // --- Submit Missing Entry Button Logic (REFACTORED) ---
    const submitMissingEntryBtn = document.getElementById('submitMissingEntryBtn');
    
    if (submitMissingEntryBtn) {
        submitMissingEntryBtn.addEventListener('click', async function() {
            const userId = emp.userProfile.id; // Assuming emp.userProfile.id is available
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
                    
                    emp.getTimeKeeping(); // Refresh grid

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

