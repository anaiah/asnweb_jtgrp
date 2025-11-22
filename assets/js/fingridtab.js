
// Create Tabulator on DOM element with id "table"
var financeGrid = new Tabulator("#finance-grid", {
    //ajaxURL: "http://192.168.38.221:10000/gridmonthlytransaction/1", // URL of your API endpoint
    height: "360px", // height of table

    layout:'fitColumns',

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
            title:'Name',
            field:'full_name',
            width:250,
            formatter:"html", 
            headerHozAlign:"center", 
            resizable:false,
            formatter:(cell)=>{
                return `${cell.getData().full_name}<br> 
                ${cell.getData().email}<br>
                ${cell.getData().besi_id}`
            }
        },

        { title: "OCW #", 
            field: "ocw_id", 
            width:120,
            resizable:false,
            formatter:"html", 
            headerSort:false, 
            headerHozAlign:"center"
        },
        { title: "JMS #", 
            field: "jms_id", 
            width:120,
            resizable:false,
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

