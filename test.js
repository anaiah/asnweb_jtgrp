    import {
        Grid,h,
        html
    } from "https://unpkg.com/gridjs?module";

    const gridx ={
        gridMonthly: async()=>{
            
            var xgrid = new gridjs.Grid({
                columns: [
                    {
                        name: "Date",
                        formatter: (cell_date) => html(`<b>${cell_date}</b>`)
                    },
                    {
                        name: "Parcel",
                        width:90,
                        formatter: (cell_parcel) => html(`${cell_parcel}`)
                    },
                    {
                        name: "Delivered",
                        width:110,
                        formatter: (cell_delivered) => html(`${cell_delivered}`)
                    }, 
                    {
                        name: "Amount",
                        width:110,
                        formatter: (cell_amount) => html(`${cell_amount}`),
                        attributes: (cell) => {
                            // add these attributes to the td elements only
                            if (cell) { 
                                return {
                                //'data-cell-content':cell,
                                //'onclick': () => alert(cell),
                                'style': 'text-align: right',
                                };
                            }
                        }
                    },
                    {
                        name: "Remitted",
                        formatter: (cell_remitted) => html(`${cell_remitted}`),
                        attributes: (cell) => {
                            // add these attributes to the td elements only
                            if (cell) { 
                                return {
                                //'data-cell-content': cell,
                                //'onclick': () => alert(cell),
                                'style': 'text-align: right',
                                };
                            }
                        }
                    }
                ],
                
                height: '500px',
                fixedHeader : true,
                resizable: true,

                pagination: {
                    limit: 15
                },
                server: {
                    url: 'http://192.168.203.221:10000/gridmonthlytransaction/1',
                    then: data => data.map(card => [card.Dates, card.parcel, card.delivered, card.total_amount, card.amount_remitted])
                } ,

                style: {
                
                    th: {
                     'color': '#000',
                    'border-bottom': '3px solid #ccc',
                    'text-align':'center'
                    },

                },//end stle

                //localize
                language:{
                    'pagination': {
                        'previous': '<img src="right-arrow.png">',
                        'next': '>>',
                        'showing': '😃 Displaying',
                        'results': () => 'Records'
                    }
                }
                
            })

            document.getElementById("grid_month").innerHTML = ""
            xgrid.render(document.getElementById("grid_month"));

        },

    }

    gridx.gridMonthly()
