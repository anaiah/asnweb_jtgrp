
// Create Tabulator on DOM element with id "table"
var financeGrid = new Tabulator("#finance-grid", {
    //ajaxURL: "http://192.168.38.221:10000/gridmonthlytransaction/1", // URL of your API endpoint
    height: "360px", // height of table

    layout:'fitColumns',

    htmlOutputConfig:{
        formatCells: true
    },

    // *** THIS IS THE IMPORTANT PART ***
    rowClick:function(e, row){ //e - the click event object, row - row component
        console.log("Row clicked!");
        //console.log("Clicked row data:", row.getData().login_details); // Get the data for the clicked row
        //console.log("Clicked row ID:", row.getIndex()); // Get the ID (from 'id' field by default)
        //console.log("Clicked row DOM element:", row.getElement()); // Get the DOM element for the row

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

                return `${rowData.full_name}<br>
                        ${rowData.email}<br>
                        ${rowData.besi_id}<br>
                        <button class='btn-primary btn-sm btn' onclick="finance.viewer('${besiId}','${rowIdx}')">View Details</button>`;
                        // ^^^ Pass the unique ID as a string ^^^
            }
        },

        { title: "TOTAL HRS", 
            field: "total_worked_hours", 
            width:120,
            resizable:false,
            formatter:"html", 
            hozAlign:'right',
            headerSort:false, 
            headerHozAlign:"center"
        },
        
        { title: "TOTAL LATE",
            field: "total_late_hours", 
            width:120,
            resizable:false,
            hozAlign:'right',
            formatter:"html", 
            headerSort:false, 
            headerHozAlign:"center"
        },

        { title: "TOTAL OT",
            field: "total_overtime_hours", 
            width:120,
            resizable:false,
            hozAlign:'right',
            formatter:"html", 
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

