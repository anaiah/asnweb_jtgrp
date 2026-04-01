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
            if(document.getElementById('menuBtn')){
                document.getElementById('menuBtn').onclick = hris.toggleSidebar;
            }

            if(document.getElementById('sidebar')){
                document.getElementById('sidebar').onclick = hris.toggleSidebar;
            }
            
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

        gonow:true,

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
        
        //checkform first
        checkform:( whatForm ) =>{
            let formIsValid = true;
            
            // Get all elements within the form that have the 'required' attribute
            const requiredElements = whatForm.querySelectorAll('[required]');

            requiredElements.forEach(function(element) {
                // Clear previous validation classes
                element.classList.remove('is-invalid');
                element.classList.remove('is-valid');

                // Check if the element is blank
                if (element.value.trim() === '' || (element.tagName === 'SELECT' && element.value === '')) {
                    element.classList.add('is-invalid');
                    formIsValid = false;
                } else {
                    element.classList.add('is-valid');
                }
            });

            if (formIsValid) {
                // If the form is valid, you can now collect the data and do something with it.
                // Using FormData is a convenient way to get all form values by their 'name' attribute.
                const formData = new FormData(whatForm);
                
                hris.searchEmp()

                // const selectedService = formData.get('service'); // Uses the 'name' attribute
                // const selectedSegment = formData.get('segment'); // Uses the 'name' attribute
                // const countValue = formData.get('count');       // Uses the 'name' attribute

                // console.log('Data Submitted via check(whatForm):');
                // console.log('Service:', selectedService);
                // console.log('Segment:', selectedSegment);
                // console.log('Count:', countValue);

                //alert(`Data for Service: "${selectedService}", Segment: "${selectedSegment}" with Count: "${countValue}" submitted successfully!`);
                
                //dataInputModal.hide(); // Close modal after submission
                //whatForm.reset();     // Clear form

                return true; // Indicate success
            } else {
                // If validation fails, just alert or show a general message
                util.Toasted('Please fill in all required fields.',3000,false);
                return false; // Indicate failure
            }

        },
        
        //================== print masterfile ===========//
        printMasterfile: async() =>{

            console.log( '====Firing hris.printMasterfile()====')

            const form = document.getElementById("searchForm");
            const fd = new FormData(form);

            // simple validation: need region at least
            if (!fd.get("filter_region")) {
                alert("Please select a Region first.");
                return;
            }

            if (!fd.get("filter_position")) {
                alert("Please select a Position.");
                return;
            }

            try {

                util.toggleButtonLoading("print-masterfile-btn", "Downloading...", true);
        
                const res = await fetch(`${myIp}/printmasterfile`, {
                    method: "POST",
                    body: fd, // FormData -> multipart/form-data
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Failed to generate masterfile");
                }

                let filename = `MASTERFILE_${document.getElementById('filter_region').value.toUpperCase()}_${document.getElementById('filter_position').value}_${new Date().toISOString().slice(0,10)}.xlsx`;
                
                const contentDisposition = res.headers.get('Content-Disposition');
                
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename\*?=['"]?([^"']+)['"]?$/i);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = decodeURIComponent(filenameMatch[1].replace(/utf-8''/i, ''));
                    }
                }

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                //msg user
                util.speak('Master file downloaded successfully!!!')

                // Turn OFF loading: restore original icon + text
                util.toggleButtonLoading("print-masterfile-btn", null, false);

            } catch (err) {
                alert(err.message || "Error downloading masterfile");
            }


        },

        //==================search filter=======
        searchEmp: async() => {

            console.log('===FIRED  hris.searchEmp()====')
            
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
            
            const dateDiv = document.getElementById('datediv');
            
             // New button reference
            if(data.xdata.length>0){
                //dateDiv.classList.remove('d-none')
            //    printTimekeepingBtn.classList.remove('d-none')
            }else{
                //dateDiv.classList.add('d-none')
              //  printTimekeepingBtn.classList.add('d-none')
                
            }

            //console.log( hrisGrid)
            //bring backdisplay
            document.getElementById('search-result-grid').classList.remove('d-none');
            document.getElementById('hrisdisplay').classList.remove('d-none');
            document.getElementById('timekeepdisplay').classList.add('d-none');

            util.scrollsTo( 'hrisdisplay')

            // set data to tabular grid
            hrisGrid.setData(data.xdata) 
        },

        //=============print timekeeping from Grid========//
        printTimeKeep: async() => {

            console.log('====FIRING hris.printTimeKeep()===')

            // IMPORTANT: Replace with the actual route you'll create on your backend
            util.scrollsTo( 'search-result-grid')

            //bring backdisplay
            document.getElementById('search-result-grid').classList.remove('d-none');
            document.getElementById('timekeepdisplay').classList.remove('d-none');

            //==if present divs, hide===
            document.getElementById('search-result-grid').classList.remove('d-none');
            document.getElementById('hrisdisplay').classList.add('d-none');

            const searchForm = document.getElementById('searchForm');
            const formData = new FormData(searchForm);

            // simple validation: need region at least
            if (!formData.get("filter_date_from")) {
                alert("Please select a starting Date Range first.");
                return false
            }

            if (!formData.get("filter_date_to")) {
                alert("Please select an ending Date Range.");
                return false;
            }

            //====get region
            hris.selectedRegion = document.getElementById('filter_region').value


            // --- HOW TO INSPECT FormData CONTENTS ---
            console.log("--- Inspecting FormData ---");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            console.log("-------------------------");
            
            // --- END INSPECTION ---
        
            const response = await fetch(`${myIp}/searchempTimeKeep`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Server error' }));
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const data = await response.json();

            console.log( data.xdata, data.xdata.length)
            
            if (data.xdata && data.xdata.length === 0) {
                // Data is empty, perform a full reset
                timekeepGrid.clearFilter();  // Clear any active filters
                timekeepGrid.clearSort();    // Clear any active sorting
               
               // --- REVISED PAGINATION RESET ---
                // Check if pagination is enabled before trying to reset the page
                if (timekeepGrid.options.pagination) {
                    timekeepGrid.setPage(1); // Set the page to the first page
                    // If you need to also reset the total number of pages displayed (e.g., pageSize)
                    // you might need to re-initialize pagination or adjust pageSize manually if it's dynamic.
                    // For now, setPage(1) is the core fix.
                }
                // --- END REVISED PAGINATION RESET ---

                timekeepGrid.deselectRow();  // Deselect any previously selected rows

                // Finally, set the empty data. This will also trigger the "No Data" message.
                timekeepGrid.setData([]);

                //document.getElementById('download-excel-btn').disabled = true

                console.log("Tabulator grid fully reset due to empty data.");
            } else {
                // Data is not empty, just update the grid
                timekeepGrid.setData(data.xdata)
                util.scrollsTo('timekeepgrid')

                //document.getElementById('download-excel-btn').disabled = false

                console.log("Tabulator grid updated with new data.");
            }

        },

        //===============open timeekeeping detailed modal
        openTimekeepModal: ( tabulatorRowId ) => {

            const modalEl = document.getElementById("timekeepModal");
            const bsModal = new bootstrap.Modal(modalEl);

            bsModal.show();

            // *** THIS IS THE CRUCIAL CORRECTION ***
            // Use 'tabulatorRowId' (which is the value from cell.getRow().getIndex())
            // to retrieve the RowComponent.
            const rowComponent = timekeepGrid.getRow(tabulatorRowId);

            if (rowComponent) {
                const rowData = rowComponent.getData();
                console.log("Full row data found:", rowData);
                console.log("Login Details for this row:", rowData.login_details);

                //set details to new grid tabulator
                timekeepdetailGrid.setData(  rowData.login_details )

                // Now you have the login_details array, you can do whatever you need with it
                if (rowData.login_details && rowData.login_details.length > 0) {
                    let detailsHtml = "<ul>";
                    rowData.login_details.forEach(detail => {
                        detailsHtml += `<li>Date: ${detail.xdate}, Login: ${detail.login}, Logout: ${detail.logout}</li>`;
                    });
                    detailsHtml += "</ul>";

                    // For demonstration, using alert. You'd typically update a DOM element here.
                    //alert(`Login details for ${rowData.full_name}:\n` + detailsHtml.replace(/<[^>]*>?/gm, ''));

                } else {
                    //alert(`No login details found for ${rowData.full_name} for the selected period.`);
                }

            } else {
                console.warn("Row component not found in Tabulator using its ID:", tabulatorRowId);
                alert("Could not find employee details using internal table ID.");
            }

        },
        
        selectedRegion: null,

        //======== timekeepdetailGrid ======
        timekeepApprove: async (selectId, value)=>{
            // ignore placeholder //"select approval" text display in dropdown
            if (value === "2") return;

            const select = document.getElementById(selectId);

            if (!select) return;

            const recordId = select.dataset.id;  // from data-id

            try {
                const res = await fetch(`${myIp}/approveTimeCorrection/${encodeURIComponent(recordId)}/${hris.selectedRegion}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision: value }), // "1" approve, "0" reject
                });

                const data = await res.json();
                if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update");
                }

                //close modal
                util.hideModal('timekeepModal',100)//then close form
                hris.printTimeKeep()    

                // refresh grid
                // if (timekeepdetailGrid) {
                // timekeepdetailGrid.replaceData();   // or setData(...) depending on your config
                // }
            } catch (err) {
                alert(err.message || "Error updating");
                // reset select if needed
                select.value = "2";
            }
        },

        //================DOWNLOAD TIMEKEEPING XLS======//
        //-- timekeeping
        downloadTimekeepXls: async () => { // <--- Add 'event' parameter
            
            // IMPORTANT: Replace with the actual route you'll create on your backend
            const backendRoute = `${myIp}/download-grid-data-xls`;

            //====GET DATA FROM FIRST GRID===//
            const gridData = timekeepGrid.getData(); // This gets ALL data in the table, including any filters applied.

            if (!gridData || gridData.length === 0) {
                alert('No data available in the grid to download.');
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = originalBtnText;
                return;
            }

            try {

                util.toggleButtonLoading("downloadTimekeepBtn", "Downloading...", true);
        
                const response = await fetch(backendRoute, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer YOUR_AUTH_TOKEN', // If needed
                    },
                    body: JSON.stringify(gridData ),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
                }

                const blob = await response.blob();

                let filename = `TIMEKEEPING_${document.getElementById('filter_region').value.toUpperCase()}_${document.getElementById('filter_position').value}_${new Date().toISOString().slice(0,10)}.xlsx`;
                
                const contentDisposition = response.headers.get('Content-Disposition');

                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename\*?=['"]?([^"']+)['"]?$/i);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = decodeURIComponent(filenameMatch[1].replace(/utf-8''/i, ''));
                    }
                }

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;

                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                console.log(`File "${filename}" downloaded successfully.`);
                util.Toasted(`File downloaded successfully.`,3000,false)
               
                // alert(`Report "${filename}" downloaded successfully!`); // Optional user feedback

            } catch (error) {
                console.error('Error downloading grid data:', error);
                alert(`Failed to download report: ${error.message}. Please try again.`);
            } finally {
                 util.toggleButtonLoading("downloadTimekeepBtn", null, false);

            }
        },

        xlshris:()=>{
            //for upload pdf
            const frmupload = document.getElementById('hrisuploadForm')
            
                util.Toasted('Uploading, please wait!!!',3000,false)
                    util.speak('Uploading, please wait!!!')
               
                //hris.waitingIndicator.style.display = 'block'

                fetch(`${myIp}/xlshris`, {
                    //method:'GET',
                    method: 'POST',
                    body: new FormData(frmupload),
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

                        //fhris.waitingIndicator.style.display = 'none'
                    }
                })
                // Handle the success response object
                .catch( (error) => {
                    console.log(error) // Handle the error response object
                });

                //e.preventDefault()
                console.log('===HRIS SUBMITTTTT===')
                
            //=================END FORM SUBMIT==========================//
        
        },

        // open requirements/pictures
        openViewRequirementsModal: (empId, rowData, region) => {
            let regionFile;
            console.log('**region** ',region)
            switch (region) {
                case "smnl":
                case "cmnva":
                case "cmnl":
                    regionFile = `ncr_${region}_emp`;
                    break;

                case "nelu":
                case "nwlu":
                    regionFile = `luz_${region}_emp`;
                    break;
                case "min": 
                    regionFile = `${region}_emp`;
                    break;    


            }

            const baseUrl   = `https://asianowapp.com/html/${regionFile}/`;
            const infoDiv   = document.getElementById("viewReqInfo");
            const imagesDiv = document.getElementById("viewReqImages");

            infoDiv.textContent = `Employee: ${rowData.full_name} (${empId})`;
            imagesDiv.innerHTML = "";

            const files = [
                { label: "User Photo",          prefix: "USER_" },
                { label: "Signature Specimen",  prefix: "SPECIMEN_" },
                { label: "GCash",               prefix: "GCASH_" },
                { label: "Barangay Clearance",  prefix: "BGY_" },
                { label: "Police Clearance",    prefix: "POLICE_" },
                { label: "Driver's License",    prefix: "DRIVER_" },
            ];

            const exts = [".jpg", ".png", ".gif"];

            files.forEach(file => {
                const col = document.createElement("div");
                col.className = "col-12 col-sm-6 col-md-4";

                const imgId = `img_${file.prefix}${empId}_${Math.random().toString(36).slice(2)}`;

                col.innerHTML = `
                <div class="card h-100">
                    <img id="${imgId}" class="card-img-top" alt="${file.label}"
                        style="object-fit: contain; max-height: 220px;">
                    <div class="card-body p-2 no-img-msg" style="display:none;">
                    <div class="small text-muted">No image found for<br>${file.label}</div>
                    </div>
                    <div class="card-body p-2">
                    <div class="small fw-semibold">${file.label}</div>
                    </div>
                </div>
                `;

                imagesDiv.appendChild(col);

                const imgEl = col.querySelector(`#${CSS.escape(imgId)}`);
                const noImgDiv = col.querySelector(".no-img-msg");

                const baseName = `${file.prefix}${empId}`;
                let idx = 0;

                const tryNextExt = () => {
                if (idx >= exts.length) {
                    // All tried, show “no image”
                    imgEl.style.display = "none";
                    noImgDiv.style.display = "block";
                    return;
                }

                const url = baseUrl + encodeURIComponent(baseName + exts[idx]);
                idx++;

                imgEl.onerror = tryNextExt;
                imgEl.onload = () => {
                    // Found one, make sure image is visible and message hidden
                    imgEl.style.display = "block";
                    noImgDiv.style.display = "none";
                };
                imgEl.src = url;
                };

                // start with .jpg, then .png, then .gif
                tryNextExt();
            });

            const modal = new bootstrap.Modal(document.getElementById("viewReqModal"));
            modal.show();
        },

        // convert utc to localtime eg Mar 23 2026
        toLocalTime : ( iso ) =>{
            const d = new Date(iso);

            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

            const result =
            `${months[d.getUTCMonth()]} ` +      // Mar
            `${d.getUTCDate()} ` +               // 23
            `${d.getUTCFullYear()}`;             // 2026

            return result; // "Mar 23 2026"
        },

        position:null,
        address:null,
        fullname:null,
        dateHired:null,

        //==================INIT 
        init : () =>{
        
            let db = localStorage  //get localstoreage
            owner =  JSON.parse(db.getItem('profile'))  //get profile
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {

                    console.log('===HRIS OPERATIONS DOMCONTENTLOADED ==')
                    
                    util.modalListeners('newempModal')
                    util.modalListeners('dataPrivacySignatureModal')

                    hris.getmenu(owner.grp_id) //get menu if dom loaded

                    hris.listeners()//leftside bar onclick listeners
                                
                    // Get references to all relevant DOM elements
                    const addy1Input = document.getElementById('addy1');
                    const addy2Input = document.getElementById('addy2');
                    const barangayInput = document.getElementById('bgy');
                    const cityInput = document.getElementById('city');
                    const fullAddressTextarea = document.getElementById('address');

                    // Function to update the full address textarea
                    function updateFullAddress() {
                        const addressParts = [];

                        // Add parts only if they have a non-empty value after trimming whitespace
                        if (addy1Input.value.trim()) {
                            addressParts.push(addy1Input.value.trim());
                        }
                        if (addy2Input.value.trim()) {
                            addressParts.push(addy2Input.value.trim());
                        }
                        if (barangayInput.value.trim()) {
                            addressParts.push(` Bgy. ${barangayInput.value.trim()}`);
                        }
                        if (cityInput.value.trim()) {
                            addressParts.push(cityInput.value.trim());
                        }

                        // Join the parts with a newline character for multi-line display
                        fullAddressTextarea.value = addressParts.join(', ').toUpperCase() //addressParts.join('\n');
                        hris.address = fullAddressTextarea.value

                    }

                    // Attach the 'input' event listener to each address field
                    // The 'input' event fires whenever the value of an <input> or <textarea> element has been changed
                    addy1Input.addEventListener('input', updateFullAddress);
                    addy2Input.addEventListener('input', updateFullAddress);
                    barangayInput.addEventListener('input', updateFullAddress);
                    cityInput.addEventListener('input', updateFullAddress);

                    // Optional: Call the function once on page load
                    // This is useful if the form fields might be pre-filled when the page loads (e.g., for editing an existing record)
                    updateFullAddress();

                    // Get references to all relevant DOM elements
                    const lastNameInput = document.getElementById('lastName');
                    const firstNameInput = document.getElementById('firstName');
                    const middleNameInput = document.getElementById('middleName');
                    const nameSuffixSelect = document.getElementById('nameSuffix');
                    const fullNameTextarea = document.getElementById('fullName');

                    // Function to update the full name textarea
                    function updateFullName() {
                        // Get trimmed values from inputs and select
                        const lastName = lastNameInput.value.trim();
                        const firstName = firstNameInput.value.trim();
                        const middleName = middleNameInput.value.trim();
                        const suffix = nameSuffixSelect.value.trim();

                        let formattedName = '';

                        // 1. Start with Last Name
                        if (lastName) {
                            formattedName += lastName;
                        }

                        // 2. Add First Name
                        if (firstName) {
                            if (formattedName) { // Only add comma if last name exists
                                formattedName += ', ';
                            }
                            formattedName += firstName;
                        }

                        // 3. Add Middle Initial (with a space before it)
                        if (middleName) {
                            const middleInitial = middleName.charAt(0).toUpperCase() + '.';
                            if (formattedName) { // Only add space if some name part already exists
                                formattedName += ' ';
                            }
                            formattedName += middleInitial;
                        }

                        // 4. Add Suffix (with a comma and space before it)
                        if (suffix) {
                            if (formattedName) { // Only add comma and space if some name part already exists
                                formattedName += ', '; // <-- CHANGED THIS LINE
                            }
                            formattedName += suffix;
                        }

                        // Update the textarea
                        fullNameTextarea.value = formattedName;
                        hris.fullname = firstName.toUpperCase() + ' ' + middleName.toUpperCase() + ' ' + lastName.toUpperCase() + ' ' + suffix.toUpperCase() 
                    }

                    // Attach 'input' event listeners to text fields for real-time updates
                    lastNameInput.addEventListener('input', updateFullName);
                    firstNameInput.addEventListener('input', updateFullName);
                    middleNameInput.addEventListener('input', updateFullName);

                    // Attach 'change' event listener to the select dropdown
                    nameSuffixSelect.addEventListener('change', updateFullName);

                    // Optional: Call the function once on page load
                    updateFullName();

                    //===============FOR DEACTIVATION ===================//
                    const btn = document.getElementById("btnConfirmDeactivate");
                    const errorDiv = document.getElementById("deactError");

                    function setButtonLoading(isLoading, labelWhenDone) {
                        if (isLoading) {
                            btn.disabled = true;
                            btn.innerHTML = `
                            <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Saving...
                            `;
                        } else {
                            btn.disabled = false;
                            btn.textContent = labelWhenDone;
                        }
                    }

                    btn.addEventListener("click", async () => {
                        const empid  = document.getElementById("deactEmpId").value;
                        const email = document.getElementById("deactEmail").value;
                        const region = document.getElementById("deactCode").value;
                        const reason = document.getElementById("deactReason").value.trim();
                        const action = btn.dataset.action; // "deactivate" or "reactivate"

                        errorDiv.classList.add("d-none");
                        errorDiv.textContent = "";

                        // Require reason only for deactivate
                        if (action === "deactivate" && !reason) {
                            errorDiv.textContent = "Reason is required for deactivation.";
                            errorDiv.classList.remove("d-none");
                            return;
                        }

                        const originalLabel = action === "deactivate" ? "Deactivate" : "Reactivate";
                        setButtonLoading(true, originalLabel);

                        try {
                            const res = await fetch(`${myIp}/employee/status`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ empid, region, reason, action }),
                            });

                            if (!res.ok) {
                            const text = await res.text();
                            throw new Error(text || "Request failed");
                            }

                            setButtonLoading(false, originalLabel);

                            // close modal
                            const modalEl = document.getElementById("deactivateModal");
                            const modal = bootstrap.Modal.getInstance(modalEl);
                            modal.hide();

                            document.getElementById("search-btn").click();
                            
                            // refresh table
                            table.replaceData();
                        } catch (err) {
                            setButtonLoading(false, originalLabel);
                            errorDiv.textContent = err.message || "Error updating status";
                            errorDiv.classList.remove("d-none");
                        }
                    });

                    //=============position dropdown listener
                    document.getElementById("filter_position").addEventListener("change", function () {
                        
                        const isCoordinator = this.value === "08";// IF CHOICE IS COORDINATOR

                        document.getElementById("filter_date_from").disabled = !isCoordinator;
                        document.getElementById("filter_date_to").disabled   = !isCoordinator;

                        //document.getElementById("applyFilterBtn").disabled   = !isCoordinator;

                        const actionSelect  = document.getElementById("actionSelect");
                        const optTimekeep   = document.getElementById("optTimekeeping");

                        // enable/disable option
                        optTimekeep.disabled = !isCoordinator;

                        // if currently selected and now invalid, reset select
                        if (!isCoordinator && actionSelect.value === "timekeeping") {
                            actionSelect.value = "";
                        }
                        if(!isCoordinator){

                            //bring backdisplay
                            document.getElementById('search-result-grid').classList.add('d-none');
                            document.getElementById('timekeepdisplay').classList.add('d-none');

                            // Data is empty, perform a full reset
                            timekeepGrid.clearFilter();  // Clear any active filters
                            timekeepGrid.clearSort();    // Clear any active sorting
                        
                        // --- REVISED PAGINATION RESET ---
                            // Check if pagination is enabled before trying to reset the page
                            if (timekeepGrid.options.pagination) {
                                timekeepGrid.setPage(1); // Set the page to the first page
                                // If you need to also reset the total number of pages displayed (e.g., pageSize)
                                // you might need to re-initialize pagination or adjust pageSize manually if it's dynamic.
                                // For now, setPage(1) is the core fix.
                            }
                            // --- END REVISED PAGINATION RESET ---

                            timekeepGrid.deselectRow();  // Deselect any previously selected rows

                            // Finally, set the empty data. This will also trigger the "No Data" message.
                            timekeepGrid.setData([]);
                        }
                    });


                    //for select actions for filtering
                    document.getElementById("actionSelect").addEventListener("change", function () {
                        const action = this.value;
                        const form = document.getElementById("searchForm");

                        if (!action) return;

                        if (action === "search") {
                            hris.checkform && hris.checkform(form);
                        } else if (action === "timekeeping") {
                            hris.printTimeKeep && hris.printTimeKeep();
                        } else if (action === "masterfile") {
                            hris.printMasterfile && hris.printMasterfile(form);
                        }

                        // reset back to placeholder after firing
                        this.value = "";
                    });
                
                })//end dom onload

                document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });

            } else {
                // DOMContentLoaded already fired
                console.log('domcontent fired');
            }

            console.log('hris.init() has fired=======')
            
            util.loadFormValidation('#searchForm')
            
            //console.log('==HHURRAY===',owner)
            // util.Toasted(`Welcome ${owner.full_name}`,2000,false) //Welcome Message
            
            //hris.myToast( `Welcome ${owner.fullname}`,2600 )

            document.getElementById('img-profile').src = `../html/assets/images/profile/${owner.pic}`

            let authz = []
            authz.push( owner.id )
            authz.push( owner.fname)
            authz.push(owner.grp_id )
            
            //console.log(authz[1])

            //==HANDSHAKE FIRST WITH SOCKET.IO
            const userName = { token : authz[1] , emp_id: authz[0], mode: authz[2]}//full name token

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
                console.log('Connected to BETTER EDGE Socket.IO server using:', hris.socket.io.engine.transport.name); // Check the transport
            });

            hris.socket.on('disconnect', () => {
                console.log('Disconnected from BETTER EDGE Socket.IO server');
            });
           //==============================================END  SOCKET ==========================//
           
            util.loadFormValidation('#newempForm')
            util.loadFormValidation('#hrisuploadForm')
            
            //document.getElementById('search-btn').disabled =  true
           
            hris.scrollToTop()

            util.modalListeners('newempModal')
            util.modalListeners('hrisloadModal')

            
        }    
    }//===end obj

    window.hris = hris
    
    hris.init()

    //============== DONT PUT DOMCONTENTLOADED EVENT HERE, ITS ALREDDY IN HR.HTML
    
