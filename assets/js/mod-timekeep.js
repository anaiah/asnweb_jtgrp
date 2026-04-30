import {
  initHrisGrid,
  initTimekeepGrid,
  initTimekeepDetailGrid,
  hrtimekeepGrid //the obj
} from './mod-hrgrid.js';

let lastSearchData = null;
let dbprofile = null;
let loginDetails = null;


//helper
//HELPER

    const getHubs =  async (loc) => {
        
        util.toggleButtonLoading('filthub','Loading Hubs...',true)
        
        const hubStoreSelect = document.getElementById('xfilter_hub'); // Get it inside the function
        const myUrl = `${myIp}/gethub/${document.getElementById('xfilter_region').value.toUpperCase()}/${loc}`
        console.log(myUrl)
        try {
            const response = await fetch( myUrl )
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const hubs = await response.json();
            const hubsArray = hubs.data

            console.log(hubs)

            //hubStoreSelect.innerHTML = '<option value="">Select Hub / DC</option>';

            hubsArray.forEach(hub => {
                const option = document.createElement('option');
                
                option.value = hub.hub; //<-- value
                option.textContent = hub.hub; //<-- content display 
                
                hubStoreSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error fetching hubs:', error);
            alert('Failed to load hub/store options. Please try again.');
        }

        util.toggleButtonLoading('filthub',"Select Hub / DC",false)

    }

    //===============open timeekeeping detailed modal
    const openTimekeepModal = ( tabulatorRowId ) => {

        console.log('firing opentimekeepmodal() of mod-timekeepjs for detailed timekeep==')
        const modalEl = document.getElementById("timekeepdetailModal");
        const bsModal = new bootstrap.Modal(modalEl);

        bsModal.show();

        // *** THIS IS THE CRUCIAL CORRECTION ***
        // Use 'tabulatorRowId' (which is the value from cell.getRow().getIndex())
        // to retrieve the RowComponent.
        const rowComponent = hrtimekeepGrid.timekeepGrid.getRow(tabulatorRowId);

        if (rowComponent) {
            const rowData = rowComponent.getData();
            console.log("Full row data found:", rowData);
            loginDetails = rowData;

            //IIMPORTANT
            console.log("Login Details for this row:", rowData.login_details);

            //set details to new grid tabulator
            hrtimekeepGrid.timekeepdetailGrid.setData(  rowData.login_details )

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

    }

    //approvetimekeeping 
    const approveTimeKeep = async ()=>{
    
        const data = timekeep.getLoginDetails().login_details;

        // 1. Extract first and last dates
        const from = data[0].xdate;
        const to = data[data.length - 1].xdate;
        const id = timekeep.getLoginDetails().id
        const region = document.getElementById('xfilter_region').value

        try {
            // 2. Send the POST request
            const response = await fetch(`${myIp}/approveTimeKeep`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    region: region,
                    id: id,
                    fromDate: from, 
                    toDate: to 
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error: ${errorText}`);
            }

            const result = await response.json();
            console.log("Success Result:", result.message);        
            alert( result.message )

        } catch (error) {
            console.error('Network error:', error);
        }

    }

    const findRegion = ( xregion ) =>{
        const aRegion = ['NCR-CMNL','NCR-CMNVA','NCR-SMNL','LUZ-NEL','LUZ-NWL','MIN'];
        const aValue  = ['cmnl','cmnva','smnl','nelu','nwlu'];

        const region = xregion
        const select = document.getElementById('xfilter_region');

        if(!select) return;

        if(select){
            // build options
            aRegion.forEach((text, i) => {
                const value = aValue[i];
                const opt = document.createElement('option');
                opt.value = value;
                opt.textContent = text;
                
                if(value === region){
                    //asn.myregion = text
                    //console.log('ur region is ',asn.myregion)
                    select.appendChild(opt);
                }
            
            });

            // set selected
            select.value = region;   // 'nelu'
        }
        
    }//end func

    //======================FIRED ONE TIME DURING LOADING OF coordinator page and 
    // DOM CONTENT LOADED modal show.bs.modal listener===========================//
    const fetchtimekeep = ( db ) =>{
        console.log('**firing fetchtimekeep() from mod-timekeep')
        dbprofile = db; // assign to outer variable for use in other functions

        const target = document.getElementById('timekeepbody');

        const url = ( db.grp_id=='08' ? 'temp-timekeep.html' : 'temp-hcoordtimekeep.html')

        fetch(`/html/${url}`)
        .then(resp => {
            if (!resp.ok) throw new Error('Network error');
            return resp.text();
        })
        .then(html => {
            target.innerHTML = html;
            console.log('body timekeep inserted success!!!') //INJECT THE TEMPLATE

            //const isCoordinator = this.value === "08";// IF CHOICE IS COORDINATOR

            document.getElementById("xfilter_date_from").disabled = false;
            document.getElementById("xfilter_date_to").disabled   = false;

            //make sure filter region auto select the region of the logged in user
            document.getElementById('xfilter_region').value = db.region.toLowerCase();

            console.log('fetchtimekeep() grp_id', db.region)

            if(db.grp_id=='08'){ //thsi line coords only
                    //======================== WE SET FILTER REGION HERE ===========
                    const sel = document.getElementById('xfilter_region');
                    const selectedValue = db.region.toLowerCase();
                    //sel.dispatchEvent(new Event('change', { bubbles: true })); ///++++++++ fire event listener

                    // set selection (will select existing option if present)
                    sel.value = selectedValue;

                    // disable all options that don't match, enable the matching one
                    for (const opt of sel.options) {
                        opt.disabled = opt.value !== selectedValue;
                    }

                    // optionally ensure the selected option is actually focused/selected
                    if (sel.value !== selectedValue) {
                        // fallback: create and select the option if it didn't exist
                        const newOpt = new Option(selectedValue, selectedValue, true, true);
                        sel.add(newOpt);
                        for (const opt of sel.options) opt.disabled = opt.value !== selectedValue;
                    }    
                                  
                //util.showPos() // show position in newempmodal based on region

                //===========FIND REGION  AND GETHUB===============
                timekeep.getFilterLocation(db.region.toLowerCase());
                
                //timekeep.getHubCoord()
            }//endif

//            //for LEAAD COORDS
                
                //filtering modal
                const region = db.region; 
                console.log('my region', region)

                let regionFile = null;

                switch (region) {
                    case "smnl":
                    case "cmnva":
                    case "cmnl":
                        regionFile = `NCR-${region}`;
                        break;

                    case "nelu":
                    case "nwlu":
                        regionFile = `LUZ-${region}`;
                        break;
                    case "min": 
                        regionFile = `${region}`;
                        break;
                    case "bicol":
                    case "smarleyte":
                        regionFile = `BSL-${region}`
                        break;
                    case "central":
                    case "bacolod":
                    case "panay":
                        regionFile =`WVIS-${region}`
                        break;       
                 }  
                

                // const el = document.getElementById('filter_region');
                // const valToSet = region.toLowerCase();

                // // Check if the option exists
                // let optionExists = [...el.options].some(opt => opt.value === valToSet);

                // if (!optionExists) {
                //     // Add the missing option
                //     const newOpt = new Option(regionFile.toUpperCase(), valToSet);
                //     el.add(newOpt);
                // }

                // // Now set it
                // el.value = valToSet;

                // console.log('getcloation ',el.value)

                // timekeep.getLocation( el.value.toUpperCase() )
                        
            //}//eif 
                        
            
            //==========hris filter action
            // //for select actions for filtering
            // document.getElementById("actionSelect").addEventListener("change", function () {
            //     const action = this.value;
            //     const form = document.getElementById("searchForm");

            //     if (!action) return;

            //     if (action === "search") {
            //         timekeep.checkform && timekeep.checkform(form);
            //     } else if (action === "timekeeping") {
            //         timekeep.printTimeKeep && timekeep.printTimeKeep();
            //     } else if (action === "masterfile") {
            //         timekeep.printMasterfile && timekeep.printMasterfile(form);
            //     }

            //     // reset back to placeholder after firing
            //     this.value = "";
            // });

            //===== ADD ANOTHER EVENT LISTENER WHEN POSITION IS CHANGED TO SHOW/HIDE HUB SELECT
            const posSelect  = document.getElementById('xfilter_position');
            const hubSelect  = document.getElementById('xfilter_hub');
            const locSelect = document.getElementById('xfilter_location');

            if (!posSelect || !hubSelect) return;

            // locSelect.addEventListener('change', () => {
            //     timekeep.getHubs( locSelect.value.toUpperCase() )

            //     console.log('location change detectd')
            
            // });


            // posSelect.addEventListener('change', () => {

            //     if (posSelect.value === '02'|| posSelect.value === '01' || posSelect.value==='10' || posSelect.value==='04') { // TRANSPORTER and teamleader and RIDER SHOW HUB SELECT
            //         hubSelect.setAttribute('required', 'required');
            //     } else {
            //         hubSelect.removeAttribute('required');
            //         hubSelect.value = ''
            //     }
            // });

            // hubSelect.addEventListener('change', () => {
            //     if (posSelect.value === '02'|| posSelect.value === '01' || posSelect.value==='10' || posSelect.value==='04') { // TRANSPORTER and teamleader and RIDER SHOW HUB SELECT
            //     }else{

            //      hubSelect.value = ''
            //         return;
            //     }
            // });

            //============== FOR DEACTIVATION LISTENER ============//
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

                    //salert( res )

                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(text || "Request failed");
                    }//eif

                    // here it's OK, read JSON
                    const data = await res.json();     // <- { success: true }

                    if (!data.success) {
                        throw new Error("Operation failed on server");
                    }//eif

                    setButtonLoading(false, originalLabel);

                    // close modal
                    const modalEl = document.getElementById("deactivateModal");
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    modal.hide();

                    //document.getElementById("search-btn").click();
                    timekeep.searchEmp()//to reload grid
                    
                    
                } catch (err) {
                    setButtonLoading(false, originalLabel);
                    errorDiv.textContent = err.message || "Error updating status";
                    errorDiv.classList.remove("d-none");
                }
            });
            //============end of deactivation listener ===========//

            
             // now init Tabulator grids
            initHrisGrid();
            initTimekeepGrid();
            initTimekeepDetailGrid();

        })
        .catch(err => {
            console.error(err);
            target.innerHTML = '<p class="text-danger">Failed to load template.</p>';
        });

    }//endfnc

    //============checkform searchForm first
    const checkform = ( whatForm ) =>{
        console.log('SEEARCHFORM FIRED!')
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
            
            timekeep.searchEmp()

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

    }//endfunc

    //========================SEARCH EMPLOYEE BASED ON FILTERS AND SET TO GRID========================//
    const searchEmp = async() => {

        console.log('===FIRED  hris.searchEmp()====')
        
        const searchForm = document.getElementById('filter-searchForm');
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

        //console.log( data.xdata)
        
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

        console.log('HRISGRID DATA ', data.xdata)
        // set data to tabular grid
        hrtimekeepGrid.hrisGrid.setData(data.xdata) 
        
        //lastSearchData = data.xdata
        //ahrisGrid.setData(data.xdata) 
    }

    //================get hub for this coordinator
    const getHubCoord = async()=>{
           
        const region = document.getElementById('xfilter_region').value

        const response = await fetch(`${myIp}/gethubcoord/${ region }/${ dbprofile.email}`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Server error' }));
            throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const json = await response.json();
        const hubs = json.data

        const select = document.getElementById('xfilter_hub')
        if (!select) return;

        // clear old options
        select.innerHTML = '<option value="">Select Hub / DC</option>';
        //console.log(data)
        // populate
        hubs.forEach(hub => {
        const opt = document.createElement('option');
        opt.value = hub.hub;      // or hub.id, or hub.hub_code
        opt.textContent = hub.hub; // or hub.description, etc.
        select.appendChild(opt);
        });

        
    }

    //=============print timekeeping from Grid========//
    const printTimeKeep = async() => {

        console.log('====FIRING timekeep.printTimeKeep()===')

        const searchForm = document.getElementById('filter-searchForm');
        const formData = new FormData(searchForm);

        // simple validation: need region at least
        if (!formData.get("xfilter_date_from")) {
            alert("Please select a starting Date Range first.");
            return false
        }

        if (!formData.get("xfilter_date_to")) {
            alert("Please select an ending Date Range.");
            return false;
        }

        // IMPORTANT: Replace with the actual route you'll create on your backend
        util.scrollsTo( 'search-result-grid')

        //bring backdisplay
        document.getElementById('search-result-grid').classList.remove('d-none');
        document.getElementById('timekeepdisplay').classList.remove('d-none');

        //==if present divs, hide===
        document.getElementById('hrisdisplay').classList.add('d-none');

        //====get region
        const selectedRegion = document.getElementById('xfilter_region').value

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

        console.log('==FIRING SEARCHEMPTIMEKEEP() mod-timekeep.js===')

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Server error' }));
            throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        console.log( '==Print Timekeeping Data==', data.xdata, data.xdata.length);
        
        if (data.xdata && data.xdata.length === 0) {
            // Data is empty, perform a full reset
            hrtimekeepGrid.timekeepGrid.clearFilter();  // Clear any active filters
            hrtimekeepGrid.timekeepGrid.clearSort();    // Clear any active sorting
            
            // --- REVISED PAGINATION RESET ---
            // Check if pagination is enabled before trying to reset the page
            if (hrtimekeepGrid.timekeepGrid.options.pagination) {
                hrtimekeepGrid.timekeepGrid.setPage(1); // Set the page to the first page
                // If you need to also reset the total number of pages displayed (e.g., pageSize)
                // you might need to re-initialize pagination or adjust pageSize manually if it's dynamic.
                // For now, setPage(1) is the core fix.
            }
            // --- END REVISED PAGINATION RESET ---

            hrtimekeepGrid.timekeepGrid.deselectRow();  // Deselect any previously selected rows

            // Finally, set the empty data. This will also trigger the "No Data" message.
            hrtimekeepGrid.timekeepGrid.setData([]);

            //document.getElementById('download-excel-btn').disabled = true

            console.log("Tabulator grid fully reset due to empty data.");
        } else {
            // Data is not empty, just update the grid
            hrtimekeepGrid.timekeepGrid.setData(data.xdata)
            util.scrollsTo('timekeepgrid')

            //document.getElementById('download-excel-btn').disabled = false

            console.log("Tabulator grid updated with new data.");
        }
    }//printtimekep

    const getLoginDetails = () => loginDetails;

    const  showPosition = () => {
        console.log("******** ShowPosition() called from mod-hrisutil.js");
        
        let posContainer = document.getElementById('posContainer');
        let posSelect = document.getElementById('jobTitle');
    
        timekeep.displayAreaLocationHub(true, posContainer, posSelect) //show area selection
    
    };
    
    //to display/not loccation / hub
    const displayAreaLocationHub= (ldisplay, container, select) => {
        //console.log('displayAreaLocationHub()', ldisplay, container, select);

        if (!container || !select) return;

        if (ldisplay) {
            container.classList.remove('d-none');
            container.classList.add('d-block');
            select.setAttribute('required', 'required');
            select.classList.remove('is-invalid');

        } else {
            container.classList.remove('d-block');
            container.classList.add('d-none');
            select.innerHTML = '<option value="" disabled selected>Select Hub / DC</option>';
            select.value = '';
            select.removeAttribute('required');
            select.classList.remove('is-invalid');
            
        }
    }

    //event fired when position changed
    const handlePositionChange=(elem)=>{
        
        util.toggleDriversLicenseValidation()
    
        console.log(' === mod-hrisutil.js position select ', elem.value)
        //hris.position = elem.value
    
        let areaContainer = document.getElementById('areaContainer');
        let areaSelect = document.getElementById('loc_area');
    
        //turn  off location and hub/store selection
        let locContainer = document.getElementById('locContainer');
        let locSelect = document.getElementById('locStore');
    
        let hubStoreContainer = document.getElementById('hubStoreContainer');
        let hubSelect = document.getElementById('hubStore'); 
    
        //fill select options for location
        timekeep.getLocation( document.getElementById('region').value)
            
        //check position if it requires location and hub/store selection
        switch(elem.value){
            
            case '07': //lead coordinator
                
                //turn on area
                
                //util.displayAreaLocationHub(true, areaContainer, areaSelect) //show area selection
                util.displayAreaLocationHub(false, locContainer, locSelect) //hide location and hub/store selection
                util.displayAreaLocationHub(false, hubStoreContainer, hubSelect) //hide location and hub/store selection
            break;
    
            case '08': //coordinator
                //util.displayAreaLocationHub(false, areaContainer, areaSelect) //show area selection
                util.displayAreaLocationHub(true, locContainer, locSelect) //hide location and hub/store selection
                util.displayAreaLocationHub(false, hubStoreContainer, hubSelect) //hide location and hub/store selection
                
            break;
            
            default:
            // case '01': //rider
            // case '02': //transporter
            // case '04': //sorter
            // case '10': //team leader
            //need location and hub/store selection
                //util.displayAreaLocationHub(false, areaContainer, areaSelect) //show area selection
                util.displayAreaLocationHub(true, locContainer, locSelect) //hide location and hub/store selection
                util.displayAreaLocationHub(true, hubStoreContainer, hubSelect) //hide location and hub/store selection
                
            //break;
    
        }
    
    }

    //=========get location based on region selection ==================//
    const getFilterLocation = async (regionSelectElement) => {
        
        console.log('***getFilterLocation() fired***', regionSelectElement)

        util.toggleButtonLoading('footer-msg','Loading Location...',true)
        const selectedRegion = regionSelectElement.value;
        
        const locSelect = document.getElementById('xfilter_location');
        
        try {
            const response = await fetch(`${myIp}/getlocation/${document.getElementById('region').value}`); // Adjust this URL as needed
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const locs = await response.json();
            const locsArray = locs.data
            
            locsArray.forEach(loc => {
                // Check all existing options values
                const isDuplicate = Array.from(locSelect.options).some(opt => opt.value === loc.location);

                if (!isDuplicate) {
                    const option = document.createElement('option');
                    option.value = loc.location;
                    option.textContent = loc.location;
                    locSelect.appendChild(option);
                }
            });

            // Call the utility function to fetch and populate
            util.toggleButtonLoading('footer-msg',null,false)

            //=========fire change event for hub loading
            if (locSelect) {
                const changeEvent = new Event('change', {
                    bubbles: true,      // Allows it to reach document.addEventListener
                    cancelable: true    // Standard practice
                });
                
                //locSelect.dispatchEvent(changeEvent);
                locSelect.dispatchEvent(new Event('change',{ bubbles: true } )); ///fire event listener

            }

            return true;

        } catch (error) {
            console.error('Error fetching hubs:', error);
            alert('Failed to load hub/store options. Please try again.');
        }
        
    }

    //to populate select with hubs
    const fetchAndPopulateHubs = async ( val) => {
        
        util.toggleButtonLoading('footer-msg','Loading Hubs...',true)
        
        let location = val|| document.getElementById('locStore').value

        const hubStoreSelect = document.getElementById('hubStore'); // Get it inside the function
        const myUrl = `${myIp}/gethub/${document.getElementById('region').value}/${location}`
        
        //console.log(myUrl)
        
        try {
            const response = await fetch(myUrl); // Adjust this URL as needed
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const hubs = await response.json();
            const hubsArray = hubs.data;

            // Get the current value before clearing
            const currentSelectedValue = hubStoreSelect.value;

            // Clear all except placeholder
            hubStoreSelect.options.length = 0;

            hubsArray.forEach(hub => {
                const option = document.createElement('option');
                option.value = hub.hub;
                option.textContent = hub.hub;
                
                // If this hub matches the one that was previously selected, mark it as selected
                if (hub.hub === currentSelectedValue) {
                    option.selected = true;
                }
                
                hubStoreSelect.appendChild(option);
            });

            //hubStoreSelect.value = ''; // Reset selection after populating
            util.toggleButtonLoading('footer-msg',null,false)
            
            return true; //signal that's done

        } catch (error) {
            console.error('Error fetching hubs:', error);
            alert('Failed to load hub/store options. Please try again.');
        }
    }

    //=========check emal duplicate ==================//
    const checkEmailDuplicate = (email) => {
        // 1. Start the Fetch call
        const region = document.getElementById('region').value || "";
        const emailInput = document.getElementById('email');

        const url = `${myIp}/checkinputemail/${encodeURIComponent(email)}/${encodeURIComponent(region.toLowerCase())}`
        console.log('endpoint ', url)
        fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json(); // 2. Parse JSON response
        })
        .then(data => {
            // 3. Handle the logic back from server
            if (data.exists) {
                console.log(`Error: Email already exists in besi_employee_${region.toLowerCase()}`);
                //emailInput.style.borderColor = "red";

                emailInput.classList.add('is-invalid')
                
                alert("This email is already registered!");
                //this.value = ''  //DONT RESET THE VALUE, LET USER DECIDE, ALSO THEY MIGHT WANT TO COPY THE EMAIL FOR REFERENCE

                //btnsave.disabled = true;
                return false;

                //util.toggleButtonLoading('i-next', null,false)

            } else {
                console.log("Email is unique!");
                
                emailInput.classList.remove('is-invalid')

                //emailInput.style.borderColor = "green";
                //btnsave.disabled = false;

                //util.toggleButtonLoading('i-next', null,false)
            }
        })
        .catch(error => {
            // 4. Catch any errors (server down, etc.)
            console.error('Fetch error:', error);
        });
    }
    
    //=======download masterfile========//
    const printMasterfile = async() =>{

        console.log( '====Firing hrisutil.printMasterfile()====')

        const form = document.getElementById("filter-searchForm");
        const fd = new FormData(form);

        // simple validation: need region at least
        if (!fd.get("xfilter_region")) {
            alert("Please select a Region first.");
            return;
        }

        if (!fd.get("xfilter_position")) {
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

            let filename = `MASTERFILE_${document.getElementById('xfilter_region').value.toUpperCase()}_${document.getElementById('xfilter_position').value}_${new Date().toISOString().slice(0,10)}.xlsx`;
            
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

    }


    /*********EXPORT FUNC */
    export const timekeep = {
        findRegion,   // same as hi: hi
        fetchtimekeep,   // same as bye: bye
        checkform,
        searchEmp,
        getHubCoord,
        printTimeKeep,
        printMasterfile,
        openTimekeepModal,
        approveTimeKeep,
        getLoginDetails,
        getFilterLocation
    };
    

    ///==================GLOBAL EVENT LISTENER FOR DYNAMICALLY 
    // GENERATED VIEW BUTTON IN TIMEKEEP GRID ===============//
    document.addEventListener('click', (e) => {
        if (e.target.matches('.view-btn')) {
            const idx = e.target.getAttribute('data-idx');
            timekeep.openTimekeepModal(idx);
        }
    });

    
    //==approve button
    document.addEventListener('click', (e) => {
        if (e.target.matches('.approve-btn')) {
            timekeep.approveTimeKeep();
        }
    });

    document.addEventListener('change', (e) => {

    //const idx = e.target.getAttribute('data-idx'); -- attribute data-dix get the index of the current row being edited
    switch (e.target.id) {
        case 'xfilter_region':
            console.log('yo filterregion fired... ')
            timekeep.getFilterLocation( document.getElementById('xfilter_region').value.toLowerCase() );
                
            break;

        case 'xfilter_location':
            timekeep.getHubCoord()
            break;

        case 'filter-actionSelect':
            const action = e.target.value;
            const form = document.getElementById("filter-searchForm");

            if (!action) return;

            if (action === "search") {
                timekeep.checkform && timekeep.checkform(form); //same as validateForm()
            } else if (action === "timekeeping") {
                timekeep.printTimeKeep && timekeep.printTimeKeep();
            } else if (action === "masterfile") {
                timekeep.printMasterfile && timekeep.printMasterfile();
            }///eif

            // reset back to placeholder after firing
            e.target.value = "";
            break;

        }
    })

    //============= EVENT LISTENER WHEN TIMEKEEP MODAL  HIDE==================//
    const timekeepModalEl = document.getElementById('timekeepModal');
    timekeepModalEl.addEventListener('show.bs.modal',  () => {
        document.getElementById('xfilter_region').value = dbprofile.region.toLowerCase()

    })


    timekeepModalEl.addEventListener('hidden.bs.modal', () => {
        // clear data in the detail grid when modal is closed   
        if (hrtimekeepGrid.hrisGrid

        ) {
            hrtimekeepGrid.hrisGrid.setData([]);
        }

        //reset form, rest div innerhtml
        let xform = document.getElementById('filter-searchForm')
        xform.reset()
        util.resetFormClass('#filter-searchForm')

        document.getElementById('search-result-grid').classList.add('d-none');
        document.getElementById('hrisdisplay').classList.add('d-none');
        document.getElementById('timekeepdisplay').classList.add('d-none');


        timekeepModalEl.querySelectorAll('select').forEach(sel => {
            // reset to first option (or set to empty string)
            sel.selectedIndex = 0;
            // or: sel.value = '';
            // optionally remove dynamically added options (keep placeholder at index 0)
            // Array.from(sel.options).slice(1).forEach(o => o.remove());
            // clear validation classes
            sel.classList.remove('is-valid','is-invalid');
        });



    });

    const myModal = document.getElementById('newempModal')
    myModal.addEventListener('hide.bs.modal', function (event) {
         const btn = document.getElementById('newemp-next-btn');
        const mode = btn.dataset.mode;
        if(mode==='edit'){
            const ctx = myModal.dataset.context;
            if (ctx === 'coords') {
                timekeep.searchEmp();
            }
            // clear context if you like
            delete myModal.dataset.context;
        }


        myModal.querySelectorAll('select').forEach(sel => {
            // reset to first option (or set to empty string)
            sel.selectedIndex = 0;
            // or: sel.value = '';
            // optionally remove dynamically added options (keep placeholder at index 0)
            // Array.from(sel.options).slice(1).forEach(o => o.remove());
            // clear validation classes
            sel.classList.remove('is-valid','is-invalid');
    });


    })
    
        
