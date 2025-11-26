
// Create Tabulator on DOM element with id "table"
var financedetailGrid = new Tabulator("#finance-detail-grid", {
    //ajaxURL: "http://192.168.38.221:10000/gridmonthlytransaction/1", // URL of your API endpoint
    height: "360px", // height of table

    layout:'fitColumns',

    htmlOutputConfig:{
        formatCells: true
    },

    placeholder: 'No Record Selected!',
    
    rowFormatter:function(row){
        if(row.getData().total_hours > 0){
            row.getElement().style.backgroundColor = "#f0b1ad"; //mark rows with age greater than or equal to 18 as successful;
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
        },
        {
            title:'OUT',
            field:'logout',
            width:120,
            formatter:"html", 
            headerHozAlign:"center", 
            resizable:false,
        },


        { title: "TOTAL", 
            field: "total_hours", 
            width:100,
            resizable:false,
            formatter:"html", 
            hozAlign:'right',
            headerSort:false, 
            headerHozAlign:"center"
        },
         { title: "LATE", 
            field: "late_hours", 
            width:100,
            resizable:false,
            formatter:"html", 
            hozAlign:'right',
            headerSort:false, 
            headerHozAlign:"center"
        },
        { title: "OT",
            field: "ot_hours", 
            width:100,
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

