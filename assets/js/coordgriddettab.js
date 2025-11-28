// This helper function converts MM-DD-YY to YYYY-MM-DD for comparison
function convertMMDDYYtoYYYYMMDD(mmddyy) {
    if (!mmddyy) return '';
    const parts = mmddyy.split('-'); // ["MM", "DD", "YY"]
    const year = (parseInt(parts[2], 10) < 50 ? '20' : '19') + parts[2]; // Assumes 2-digit year
    return `${year}-${parts[0]}-${parts[1]}`;
}



    // Define today's date in YYYY-MM-DD format for consistent comparison
    const today = new Date();
    const todayYYYYMMDD = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    // ... (definition of financeGrid and loginDetailsGrid) ...


    // Create Tabulator on DOM element with id "coord-detail-grid"
    var coorddetailGrid = new Tabulator("#coord-detail-grid", {
        height: "360px", // height of table
        layout: 'fitColumns',
        htmlOutputConfig: {
            formatCells: true
        },
        placeholder: 'No Record Selected!',

        // rowFormatter: function(row) {
        //     if (row.getData().total_hours > 0) {
        //         row.getElement().style.backgroundColor = "#f0b1ad"; // This seems to be marking rows with production as red, confirm if intended
        //     }
        // },

        columns: [ // Define Table Columns
            {
                title: 'DATE',
                field: "xdate",
                width: '100'
            },
            {
                title: 'IN',
                field: 'login',
                width: 120,
                formatter: "html",
                headerHozAlign: "center",
                resizable: false,
                hozAlign:'center',
                formatter: (cell) => {
                    const rowData = cell.getData();
                    const entryDateYYYYMMDD = convertMMDDYYtoYYYYMMDD(rowData.xdate); // Get comparable date

                    if (rowData.login === null) { // Use '=== null' for backend-sent nulls
                        // If no login and date is today or in the past
                        if (entryDateYYYYMMDD <= todayYYYYMMDD) {
                            return `<span class='font10p'>** NO LOGIN **</span>`;
                        } else {
                            // If no login and date is in the future
                            return ''; // Don't put anything
                        }
                    } else {
                        return rowData.login;
                    }
                }
            },
            {
                title: 'OUT',
                field: 'logout',
                width: 120,
                formatter: "html",
                headerHozAlign: "center",
                hozAlign:'center',
                resizable: false,
                formatter: (cell) => {
                    const rowData = cell.getData();
                    const entryDateYYYYMMDD = convertMMDDYYtoYYYYMMDD(rowData.xdate); // Get comparable date

                    if (rowData.logout === null) { // Use '=== null' for backend-sent nulls
                        // If no logout and date is today or in the past
                        if (entryDateYYYYMMDD <= todayYYYYMMDD) {
                            return `<span class='font10p'>** NO LOGOUT **</span>`;
                        } else {
                            // If no logout and date is in the future
                            return ''; // Don't put anything
                        }
                    } else {
                        return rowData.logout;
                    }
                }
            },
            {
                title: "TOTAL",
                field: "total_hours",
                width: 75,
                resizable: false,
                formatter: "html",
                hozAlign: 'right',
                headerSort: false,
                headerHozAlign: "center"
            },
            {
                title: "LATE", // Reminder: 'late_hours' is not currently provided by the backend we built.
                field: "late_hours", // If this field is always null, it will display as empty.
                width: 55,
                resizable: false,
                formatter: "html",
                hozAlign: 'right',
                headerSort: false,
                headerHozAlign: "center"
            },
            {
                title: "OT",
                field: "ot_hours",
                width: 55,
                resizable: false,
                formatter: "html",
                hozAlign: 'right',
                headerSort: false,
                headerHozAlign: "center"
            },

            // Inside coorddetailGrid's columns array:
            {
                title: "Action",
                width: 100,
                hozAlign: "center",
                headerSort: false,
                resizable: false,
                formatter: (cell) => {
                    const rowData = cell.getData();
                    const entryDateYYYYMMDD = convertMMDDYYtoYYYYMMDD(rowData.xdate);
                    const today = new Date(); // Need today's date here for comparison
                    const todayYYYYMMDD = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;


                    const missingLogoutPastOrPresent = (rowData.login !== null && rowData.logout === null && entryDateYYYYMMDD <= todayYYYYMMDD);
                    const missingBothPastOrPresent = (rowData.login === null && rowData.logout === null && entryDateYYYYMMDD <= todayYYYYMMDD);

                    if (missingLogoutPastOrPresent || missingBothPastOrPresent) {
                        const besiId = rowData.besi_id;
                        const employeeName = rowData.full_name;
                        const xdate = rowData.xdate;
                        const loginTime = rowData.login;    // <--- GET LOGIN TIME
                        const logoutTime = rowData.logout;  // <--- GET LOGOUT TIME

                        return `<button class="btn btn-warning btn-sm"
                                        onclick="asn.openMissingEntryModal(
                                            '${encodeURIComponent(besiId)}',
                                            '${encodeURIComponent(xdate)}',
                                            '${encodeURIComponent(employeeName)}',
                                            '${encodeURIComponent(loginTime || 'null')}',  // Pass 'null' string if actual null
                                            '${encodeURIComponent(logoutTime || 'null')}'  // Pass 'null' string if actual null
                                        )">
                                        Correction
                                </button>`;
                    } else {
                        return '';
                    }
                }
            },
        ],

        locale: "en-us",
        langs: {
            "en-us": {
                "pagination": {
                    "page_size": "Page Size",
                    "first": "<i class='ti ti-player-skip-back-filled'></i>",
                    "first_title": "First Page",
                    "last": "<i class='ti ti-player-skip-forward-filled'></i>",
                    "last_title": "Last Page",
                    "prev": "Prev",
                    "prev_title": "Prev Page",
                    "next": "Next",
                    "next_title": "Next Page",
                },
            }
        },

        pagination: true,
        paginationMode: "local",
        paginationSize: 10,
    });

    // ... (rest of your DOMContentLoaded code, e.g., fetchAndSetCoordDetailGridData) ...

