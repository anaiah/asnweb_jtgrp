import { timekeep } from './mod-timekeep.js';


// mod-hrgrid.js
let hrisGrid = null;
let timekeepGrid = null;
let timekeepdetailGrid = null;

// init functions – call these AFTER the divs exist in the DOM

export function initHrisGrid() {
    const el = document.getElementById('hrisgrid');
    if (!el) {
        console.error('#hrisgrid not found');
        return null;
    }

    // Create Tabulator on DOM element with id "table"
    hrisGrid = new Tabulator("#hrisgrid", {
        //ajaxURL: "http://192.168.38.221:10000/gridmonthlytransaction/1", // URL of your API endpoint
        //height: "360px", // height of table
        height:"fitData",
        layout:'fitColumns',

        ajaxLoader: true, // default is true
        ajaxLoaderLoading: "Loading data...",

        htmlOutputConfig:{
            formatCells: true
        },

        placeholder: 'No Record Selected!',
        
        // rowFormatter:function(row){
        //     if(row.getData().status !== "Available"){
        //         row.getElement().style.backgroundColor = "#f0b1ad"; //mark rows with age greater than or equal to 18 as successful;
        //     }
        // },

        columns: [ // Define Table Columns
            {
                title:'ID',
                field:"id",
                width:'50'
            },
            {
                title: 'Name',
                field: 'full_name',
                width: 350,
                headerHozAlign: "center",
                resizable: false,
                formatter: (cell) => {

                    const profile = JSON.parse(localStorage.getItem('profile'))  //get profileowner =  JSON.parse(db.getItem('profile'))  //get profile
                    const data = cell.getData();
                    
                    let xlabel = "";
                    let action = "";

                    let mname = ( data.middle_name ? data.middle_name.toUpperCase() : "N/A")
                    //let hub = ( data.hub ? data.hub.toUpperCase()  : '( NO HUB )' )

                    switch (data.active) {
                    case 1:
                        xlabel = "Deactivate";
                        action = "deactivate";
                        break;
                    case 0:
                    case 2:
                        xlabel = "Reactivate";
                        action = "reactivate";
                        break;
                    }

                    return `
                    <b>${data.full_name}</b><br>
                    ( ${mname} )<br>
                    ${data.phone}<br>
                    ${data.email}<br>
                    ${data.emp_id}<br>
                    <button type="button"
                            class="btn btn-warning btn-sm btn-status-change"
                            data-action="${action}">
                        ${xlabel}
                    </button>
                    <button type="button"
                            class="btn btn-info btn-sm btn-status-change"
                            (${profile.grp_id}=='08'? disabled : null )
                            data-action="view">
                        View Requirements
                    </button>
                    <button type="button"
                            class="btn btn-success btn-sm btn-status-change"
                            (${profile.grp_id}=='08'? disabled : null )
                            data-action="printcontract">
                        Print Contract
                    </button>
                    `;
                },

                cellClick: (e, cell) => {
                    if (!e.target.classList.contains("btn-status-change")) return;

                    const rowData = cell.getData();
                    const action  = e.target.getAttribute("data-action"); // deactivate / reactivate / view
                    const empId   = rowData.emp_id;
                    const email = rowData.email;
                    const region = document.getElementById('filter_region').value

                    switch( action ){
                        case "view":
                            hris.openViewRequirementsModal(empId, rowData, region.toLowerCase() );
                            return;
                        break;
                            
                        case "printcontract":
                            console.log(rowData)
                            hris.fullname = rowData.full_name;
                            hris.address = rowData.full_address;
                            hris.position = rowData.position;
                            hris.dateHired = hrtimekeepGrid.toLocalTime( rowData.hire_date)
                            console.log( hris.fullname, hris.address, hris.position, hris.dateHired,region)

                            console.log('1. speak: Printing...');
                            util.speak('Printing...');
                            
                            util.printPdf( empId, rowData.full_name , region )
                            return;
                        break;

                    }//endsw

                    
                    // existing deactivate/reactivate logic below
                    const empIdInput   = document.getElementById("deactEmpId");
                    const emailInput   = document.getElementById("deactEmail");
                    const codeInput    = document.getElementById("deactCode");
                    const reasonInput  = document.getElementById("deactReason");
                    const modalTitle   = document.querySelector("#deactivateModal .modal-title");
                    const btnConfirm   = document.getElementById("btnConfirmDeactivate");
                    const reasonLabel  = document.getElementById("reasonLabel");

                    empIdInput.value = empId;
                    emailInput.value = email;

                    // region from emp_id
                    let code = "";
                    if (empId) {
                        const parts = empId.split("-");
                        if (parts.length >= 2) code = parts[1];
                    }
                    codeInput.value = code;

                    reasonInput.value = "";
                    btnConfirm.dataset.action = action;

                    if (action === "deactivate") {
                        modalTitle.textContent = "Deactivate Employee";
                        btnConfirm.textContent = "Deactivate";
                        reasonLabel.textContent = "Reason for deactivating";
                    } else {
                        modalTitle.textContent = "Reactivate Employee";
                        btnConfirm.textContent = "Reactivate";
                        reasonLabel.textContent = "Reason for reactivating";
                    }

                    const modal = new bootstrap.Modal(document.getElementById("deactivateModal"));
                    modal.show();
                },
            },

            
            { title: "HUB", 
                field: "hub", 
                width:120,
                resizable:false,
                formatter:"html", 
                headerSort:false, 
                headerHozAlign:"center"
            },

            { title: "Emp Status", 
                field: "employment_status", 
                width:120,
                resizable:false,
                formatter:"html", 
                headerSort:false, 
                headerHozAlign:"center"
            },

            { title: "Hire Date", 
                field: "hire_date", 
                width:120,
                resizable:false,
                formatter:"html", 
                headerSort:false, 
                headerHozAlign:"center",
                formatter: (cell) => {
                    const value = cell.getValue();
                    if (!value) return "";
                    return hrtimekeepGrid.toLocalTime(value);   // adjust object name as needed
                },
            },

            { title: "Active", 
                field: "active", 
                width:120,
                resizable:false,
                formatter:"html", 
                headerSort:false, 
                headerHozAlign:"center",
                hozAlign:'center',
                formatter:(cell)=>{
                    switch(cell.getData().active ){
                        case 1:
                            return "Yes"
                            break
                        case 2:
                        case 0:
                            return 'Deactivated'
                            break
                        
                    }//
                    
                }
            },

            { title: "Reason", 
                field: "deactivation_reason", 
                width:120,
                resizable:false,
                formatter:"html", 
                headerSort:false, 
                headerHozAlign:"left",
                cssClass:"wrap"
            },

            { title: "Address", 
                field: "full_address", 
                width:200,
                resizable:true,
                formatter:"html", 
                headerSort:false, 
                headerHozAlign:"left",
                cssClass:"wrap"
            },
        ],

        locale:"en-us",
        langs:{
            "en-us":{
                "pagination":{
                    "page_size":"Page Size", //label for the page size select element
                    "first":"<i class='ti ti-player-skip-back-filled'></i>", //text for the first page button
                    "first_title":"First Page", //tooltip text for the first page button
                    "last":"<i class='ti ti-player-skip-forward-filled'></i>",
                    "last_title":"Last Page",
                    "prev":"Prev",
                    "prev_title":"Prev Page",
                    "next":"Next",
                    "next_title":"Next Page",
                },
            }
        },
        
        pagination:true, //enable pagination
        //paginationElement: document.getElementById('grid_pagination'),
        paginationMode:"local", //enable remote pagination
        paginationSize: 10, //optional parameter to request a certain number of rows per page
        // paginationCounter:function(pageSize, currentRow, currentPage, totalRows, totalPages){
        //     return `<i class='ti ti-database-search'></i>&nbsp;Showing ${pageSize}  rows of ${totalRows} total`;
        // }
    });

    return hrisGrid;
}

export function initTimekeepGrid() {
    const el = document.getElementById('timekeepgrid');
    if (!el) {
        console.error('#timekeepgrid not found');
        return null;
    }

    // Create Tabulator on DOM element with id "table"
    timekeepGrid = new Tabulator("#timekeepgrid", {

        //ajaxURL: "http://192.168.38.221:10000/gridmonthlytransaction/1", // URL of your API endpoint
        height: "360px", // height of table

        layout:'fitColumns',

        ajaxLoader: true, // default is true
        ajaxLoaderLoading: "Loading data...",

        htmlOutputConfig:{
            formatCells: true
        },

        // *** THIS IS THE IMPORTANT PART ***
        rowClick:function(e, row){ //e - the click event object, row - row component
            console.log("Row clicked!");

            // Example: Show an alert with some row data
            alert("You clicked on row: " + row.getData().name + " (ID: " + row.getIndex() + ")");

            // You can also access specific cell data from the row
            // console.log("Value of 'age' in clicked row:", row.getData().age);
        },

        placeholder: 'No Record Selected!',
        
        // rowFormatter:function(row){
        //     if(row.getData().status !== "Available"){
        //         row.getElement().style.backgroundColor = "#f0b1ad"; //mark rows with age greater than or equal to 18 as successful;
        //     }
        // },

        columns: [ // Define Table Columns
            {
                title:'ID',
                field:"id",
                width:'50'
            },
            {
                title:'Name',
                field:'full_name',
                width:250,
                formatter:"html", 
                headerHozAlign:"center", 
                resizable:false,
                formatter:(cell)=>{
                    // Get the full row data
                    const rowData = cell.getData();
                    
                    const rowIdx = cell.getRow().getIndex(); // Get the RowComponent 

                    const besiId = rowData.besi_id; // Assuming besi_id is unique per row

                    // return `<b>${rowData.full_name}</b><br>
                    //         ${rowData.emp_status}<br>
                    //         ${rowData.email}<br>
                    //         ${rowData.besi_id}<br>
                    //         <button class='btn-primary btn-sm btn' onclick="timekeep.openTimekeepModal('${rowIdx}')">View Timekeeping Details</button>
                    //         ( ${rowData.timekeep_approved} ==1 ? 'Approved' : 'Pending')
                    //         `;
                            return `
    <div class="p-1">
        <b>${rowData.full_name}</b><br>
        <small class="text-muted">${rowData.emp_status} | ${rowData.besi_id}</small><br>
        <small class="d-block mb-2">${rowData.email}</small>
        
        <div class="d-flex align-items-center gap-2">
            <button class='btn btn-primary btn-sm flex-grow-1' 
                    style="border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                    onclick="timekeep.openTimekeepModal('${rowIdx}')">
                View Details
            </button>
            <span class="badge rounded-pill ${rowData.timekeep_approved == 1 ? 'bg-success' : 'bg-warning text-dark'}" 
                  style="height: fit-content; padding: 6px 10px;">
                ${rowData.timekeep_approved == 1 ? '✔' : '●'}
            </span>
        </div>
    </div>
`;


                            // ^^^ Pass the unique ID as a string ^^^
                }
            },

            
            { title: "DAYS WORKED", 
                field: "total_worked_days", 
                width:120,
                resizable:false,
                hozAlign:'center',
                headerSort:false, 
                headerHozAlign:"center",
                mutator: (value) => {
                    if (value == null || value === "") return value;
                    const num = Number(value);
                    if (Number.isNaN(num)) return value;
                    return Number(num.toFixed(2));  // 41.57 as a proper number
                },
                //formatter: "number",
                //formatterParams: { precision: 2 },
            },

            { title: "TOTAL HRS", 
                field: "total_worked_hours", 
                width:120,
                resizable:false,
                hozAlign:'right',
                headerSort:false, 
                headerHozAlign:"center",
                mutator: (value) => {
                    if (value == null || value === "") return value;
                    const num = Number(value);
                    if (Number.isNaN(num)) return value;
                    return Number(num.toFixed(2));  // 41.57 as a proper number
                },
                //formatter: "number",
                //formatterParams: { precision: 2 },
            },
            
            { title: "TOTAL LATE",
                field: "total_late_hours", 
                width:120,
                resizable:false,
                hozAlign:'right',
                mutator: (value) => {
                    if (value == null || value === "") return value;
                    const num = Number(value);
                    if (Number.isNaN(num)) return value;
                    return Number(num.toFixed(2));  // 41.57 as a proper number
                },
                //formatter: "number",
                //formatterParams: { precision: 2 },
                headerSort:false, 
                headerHozAlign:"center"
            },

            { title: "TOTAL OT",
                field: "total_overtime_hours", 
                width:120,
                resizable:false,
                hozAlign:'right',
                mutator: (value) => {
                    if (value == null || value === "") return value;
                    const num = Number(value);
                    if (Number.isNaN(num)) return value;
                    return Number(num.toFixed(2));  // 41.57 as a proper number
                },
                //formatter: "number",
                //formatterParams: { precision: 2 },
                headerSort:false, 
                headerHozAlign:"center"
            },

        ],

        locale:"en-us",
        langs:{
            "en-us":{
                "pagination":{
                    "page_size":"Page Size", //label for the page size select element
                    "first":"<i class='ti ti-player-skip-back-filled'></i>", //text for the first page button
                    "first_title":"First Page", //tooltip text for the first page button
                    "last":"<i class='ti ti-player-skip-forward-filled'></i>",
                    "last_title":"Last Page",
                    "prev":"Prev",
                    "prev_title":"Prev Page",
                    "next":"Next",
                    "next_title":"Next Page",
                },
            }
        },
        
        pagination:true, //enable pagination
        //paginationElement: document.getElementById('grid_pagination'),
        paginationMode:"local", //enable remote pagination
        paginationSize: 10, //optional parameter to request a certain number of rows per page
        // paginationCounter:function(pageSize, currentRow, currentPage, totalRows, totalPages){
        //     return `<i class='ti ti-database-search'></i>&nbsp;Showing ${pageSize}  rows of ${totalRows} total`;
        // }
    });

    return timekeepGrid;
}

export function initTimekeepDetailGrid() {
    const el = document.getElementById('timekeepTable');
    if (!el) {
        console.error('#timekeepTable not found');
        return null;
    }

    // detailed
    // 
    timekeepdetailGrid = new Tabulator("#timekeepTable", {
        //ajaxURL: "http://192.168.38.221:10000/gridmonthlytransaction/1", // URL of your API endpoint
        height: "360px", // height of table

        layout:'fitColumns',
        
        ajaxLoader: true, // default is true
        ajaxLoaderLoading: "Loading data...",

        htmlOutputConfig:{
            formatCells: true
        },

        placeholder: 'No Record Selected!',
        
        rowFormatter:function(row){
            if(row.getData().for_approval === 3){
                row.getElement().style.backgroundColor = "#f0b1ad"; //mark rows with age greater than or equal to 18 as successful;
            }else{

            }
        },

        columns: [ // Define Table Columns
            {
                title:'DATE',
                field:"xdate",
                width:'100'
            },
            {
                title:'IN',
                field:'login',
                width:120,
                formatter:"html", 
                headerHozAlign:"center", 
                resizable:false,
                formatter: (cell) => {
                    const v = cell.getValue();
                    if (v === null || v === undefined || v === "" || cell.getData().total_hours === 0) {
                    return "<span class='text-muted'>**No work**</span>";
                    }
                    return v; // or escape/format as needed
                },
            },

            {
                title:'OUT',
                field:'logout',
                width:120,
                formatter:"html", 
                headerHozAlign:"center", 
                resizable:false,
                formatter: (cell) => {
                    const v = cell.getValue();
                    if (v === null || v === undefined || v === "" || cell.getData().total_hours === 0) {
                    return "<span class='text-muted'>**No work**</span>";
                    }
                    return v; // or escape/format as needed
                },
            },

            { title: "TOTAL", 
                field: "total_hours", 
                width:100,
                resizable:false,
                mutator: (value) => {
                    if (value == null || value === "") return value;
                    const num = Number(value);
                    if (Number.isNaN(num)) return value;
                    return Number(num.toFixed(2));  // 41.57 as a proper number
                },
                hozAlign:'right',
                headerSort:false, 
                headerHozAlign:"center"
            },
            { title: "LATE", 
                field: "late_hours", 
                width:100,
                resizable:false,
                mutator: (value) => {
                    if (value == null || value === "") return value;
                    const num = Number(value);
                    if (Number.isNaN(num)) return value;
                    return Number(num.toFixed(2));  // 41.57 as a proper number
                },
                hozAlign:'right',
                headerSort:false, 
                headerHozAlign:"center"
            },
            { title: "OT",
                field: "ot_hours", 
                width:100,
                resizable:false,
                hozAlign:'right',
                mutator: (value) => {
                    if (value == null || value === "") return value;
                    const num = Number(value);
                    if (Number.isNaN(num)) return value;
                    return Number(num.toFixed(2));  // 41.57 as a proper number
                },
                headerSort:false, 
                headerHozAlign:"center"
            },
            {
                title: "REASON",
                field: "reason", 
                width:150,
                resizable:false,
                hozAlign:'left',
                formatter:"html",
            },
            {
                title: "FOR APPROVAL",
                field: "for_approval", 
                width:150,
                resizable:false,
                hozAlign:'left',
                formatter:"html",
                formatter:(cell)=>{
                    switch(cell.getData().for_approval ){
                        case 1:
                            return "Yes"
                            break
                        case 3:
                            return "Rejected"
                            break
                        case 0:
                            return 'No'
                            break
                        
                    }//
                    
                }

            },
            {
                title: "ACTIONS",
                field: "for_approval",
                headerHozAlign:"center",
                width:140,
                hozAlign: "center",
                formatter: (cell) => {
                    const value = cell.getValue();   // for_approval
                    const row   = cell.getData();

                    // only show select if for_approval == 1
                    if (value != 1) return "";

                    const selectId = `approve_${row.id}`; // unique per row

                    return `
                    <select class="form-select form-select-sm"
                            id="${selectId}"
                            data-id="${row.id}"
                            onchange="hris.timekeepApprove(this.id, this.value)">
                        <option value="2">Select Approval</option>
                        <option value="0">Approve</option>
                        <option value="3">Reject</option>
                    </select>
                    `;
                                
                },
                cellClick: (e, cell) => {
                    // we will handle change via event listener (see below)
                },
            }

        ],

        locale:"en-us",
        langs:{
            "en-us":{
                "pagination":{
                    "page_size":"Page Size", //label for the page size select element
                    "first":"<i class='ti ti-player-skip-back-filled'></i>", //text for the first page button
                    "first_title":"First Page", //tooltip text for the first page button
                    "last":"<i class='ti ti-player-skip-forward-filled'></i>",
                    "last_title":"Last Page",
                    "prev":"Prev",
                    "prev_title":"Prev Page",
                    "next":"Next",
                    "next_title":"Next Page",
                },
            }
        },
        
        pagination:true, //enable pagination
        //paginationElement: document.getElementById('grid_pagination'),
        paginationMode:"local", //enable remote pagination
        paginationSize: 10, //optional parameter to request a certain number of rows per page
        // paginationCounter:function(pageSize, currentRow, currentPage, totalRows, totalPages){
        //     return `<i class='ti ti-database-search'></i>&nbsp;Showing ${pageSize}  rows of ${totalRows} total`;
        // }
    });

    return timekeepdetailGrid;
}

// convert utc to localtime eg Mar 23 2026
const toLocalTime = ( iso ) =>{
    const d = new Date(iso);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const result =
    `${months[d.getUTCMonth()]} ` +      // Mar
    `${d.getUTCDate()} ` +               // 23
    `${d.getUTCFullYear()}`;             // 2026

    return result; // "Mar 23 2026"
}


// optional: export an object with getters, if you like the "hrtimekeepGrid" name
export const hrtimekeepGrid = {
  toLocalTime,
  get hrisGrid() { return hrisGrid; },
  get timekeepGrid() { return timekeepGrid; },
  get timekeepdetailGrid() { return timekeepdetailGrid; }
};



