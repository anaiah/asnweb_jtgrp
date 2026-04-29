const tester = () => {
    console.log("Tester function called from mod-hrisutil.js");
};

const  showPosition = () => {
    console.log("******** ShowPosition() called from mod-hrisutil.js");
    
    let posContainer = document.getElementById('posContainer');
    let posSelect = document.getElementById('jobTitle');

    hrisutil.displayAreaLocationHub(true, posContainer, posSelect) //show area selection

};

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
        //hubStoreSelect.options.length = 0;

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

        
    //check position if it requires location and hub/store selection
    switch(elem.value){
        
        case '07': //lead coordinator
            
            //turn on area
            
            //util.displayAreaLocationHub(true, areaContainer, areaSelect) //show area selection
            locSelect.value = '' //reset location and hub/store selection
            hubSelect.value = '' //reset location and hub/store selection
            util.displayAreaLocationHub(false, locContainer, locSelect) //hide location and hub/store selection
            util.displayAreaLocationHub(false, hubStoreContainer, hubSelect) //hide location and hub/store selection
        break;

        case '08': //coordinator
            //util.displayAreaLocationHub(false, areaContainer, areaSelect) //show area selection
             
            hubSelect.value = '' //reset location and hub/store selection
            util.displayAreaLocationHub(true, locContainer, locSelect) //hide location and hub/store selection
            util.displayAreaLocationHub(false, hubStoreContainer, hubSelect) //hide location and hub/store selection
            
        break;
        
        default:
            console.log('goes here the usual groups that require loc/hub')
            hrisutil.getLocation(document.getElementById('region'));

        // case '01': //rider
        // case '02': //transporter
        // case '04': //sorter
        // case '10': //team leader
        
            util.displayAreaLocationHub(true,  locContainer, locSelect) //hide location and hub/store selection
            util.displayAreaLocationHub(true, hubStoreContainer, hubSelect) //hide location and hub/store selection
            
        //break;

    }

}

//=========get location based on region selection ==================//
const getLocation = async (regionSelectElement) => {
    
    console.log('***getLocation() fired***')

    util.toggleButtonLoading('footer-msg','Loading Location...',true)
    const selectedRegion = regionSelectElement.value;
    
    const locContainer = document.getElementById('locContainer'); 
    const locSelect = document.getElementById('locStore');
    
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

        // //=========fire change event for hub loading
        if (locSelect) {
            const changeEvent = new Event('change', {
                bubbles: true,      // Allows it to reach document.addEventListener
                cancelable: true    // Standard practice
            });
            
            locSelect.dispatchEvent(changeEvent);
        }

        return true;

    } catch (error) {
        console.error('Error fetching hubs:', error);
        alert('Failed to load hub/store options. Please try again.');
    }

    
}
//to display/not loccation / hub
const displayAreaLocationHub= (ldisplay, container, select) => {
    console.log('displayAreaLocationHub()', ldisplay, container, select, select.id);

    if (!container || !select) return;

    // if(select.id === 'locStore' && ldisplay){
    //     hrisutil.getLocation(document.getElementById('region'));
    //     console.log( 'fired getlocation() ')
    // }else{
    //     console.log('yeh wetn here ', select.id)
    // }

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

//checkform first
const checkform = (whatForm) => {
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
        
        hrisutil.searchEmp() //call here

        return true; // Indicate success
    
    } else {
        // If validation fails, just alert or show a general message
        util.Toasted('Please fill in all required fields.',3000,false);
        return false; // Indicate failure
    }

}

//=======download masterfile========//
const printMasterfile = async() =>{

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

}

//==== search employee =======//
const searchEmp = async() => {

    console.log('===FIRED  hrisutil.searchEmp()====')
    
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

    //bring backdisplay
    document.getElementById('search-result-grid').classList.remove('d-none');
    
    document.getElementById('hrisdisplay').classList.remove('d-none');

    document.getElementById('timekeepdisplay').classList.add('d-none');

    util.scrollsTo( 'hrisdisplay')

    // set data to tabular grid
    hrisGrid.setData(data.xdata) 
}

//===== FOR PRINTING TIMEKEEPING ======//
const printTimeKeep = async() => {

    console.log('====FIRING hrisutil.printTimeKeep()===')

    // IMPORTANT: Replace with the actual route you'll create on your backend
    util.scrollsTo( 'search-result-grid')
    
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

        //bring backdisplay
    document.getElementById('search-result-grid').classList.remove('d-none');
    document.getElementById('timekeepdisplay').classList.remove('d-none');

    //==if present divs, hide===
    //document.getElementById('search-result-grid').classList.remove('d-none');
    document.getElementById('hrisdisplay').classList.add('d-none');

    // --- HOW TO INSPECT FormData CONTENTS ---
    console.log("--- Inspecting FormData ---");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    console.log("-------------------------");
    
    // --- END INSPECTION ---
    // endpoint: /searchempTimeKeep() to download timekeep xlsx
    const response = await fetch(`${myIp}/searchempTimeKeep`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    console.log( 'timekeepGrid data:', data.xdata, data.xdata.length)
    
    if (data.xdata && data.xdata.length === 0) {
        // Data is empty, perform a full reset
        timekeepGrid.clearFilter();  // Clear any active filters
        timekeepGrid.clearSort();    // Clear any active sorting
        
        // --- REVISED PAGINATION RESET ---
        // Check if pagination is enabled before tryfing to reset the page
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
        timekeepGrid.setData([]);

        timekeepGrid.setData(data.xdata)
        util.scrollsTo('timekeepgrid')

        //document.getElementById('download-excel-btn').disabled = false

        console.log("Tabulator grid updated with new data.");
    }

}

//================DOWNLOAD TIMEKEEPING XLS======//
        //-- timekeeping
const downloadTimekeepXls = async () => { // <--- Add 'event' parameter
    console.log('===FIRING hrisutil.downloadTimekeepXls()===')

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
}

//======================== STTART EXPORT ========================//
export const hrisutil = {
    showPosition,
    displayAreaLocationHub,
    handlePositionChange,
    checkEmailDuplicate,
    fetchAndPopulateHubs,
    getLocation,
    checkform,
    printMasterfile,
    printTimeKeep,
    searchEmp,
    downloadTimekeepXls
};

