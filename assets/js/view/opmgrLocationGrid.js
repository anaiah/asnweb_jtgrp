
// Ext.define('MyApp.view.opmgrLocationGrid', {
//     extend: 'Ext.grid.Panel',
//     alias: 'widget.opmgrlocationgrid',
//     id:'opmgrLocationGrid',
//     //cls: 'centered-headers-grid',
//     height:400,
//     width:500,
//     //store: Ext.data.StoreManager.lookup('opmgrLocationStore'), // your storeId
//     store:'opmgrLocationStore',
//     columns: [
//         { text: 'Location',  dataIndex: 'location' },  //  Matches model
//         { text: 'Hub',       dataIndex: 'hub' },       //  Matches model
//         { text: 'Parcel',    dataIndex: 'parcel', align: 'right' },    // Matches model
//         { text: 'Amount',    dataIndex: 'amount', align: 'right', renderer: Ext.util.Format.usMoney },  // Matches model
//         { text: 'Delivered', dataIndex: 'parcel_delivered', align: 'right' }, // Matches model
//         { text: 'Remitted',  dataIndex: 'amount_remitted', align: 'right', renderer: Ext.util.Format.usMoney }   // Matches model
//     ],
//     // ... other config ...
// });

Ext.define('MyApp.view.opmgrLocationGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.opmgrlocationgrid',
    id: 'opmgrLocationGrid',
    title: 'Location Summary',
    cls: 'centered-headers-grid',
    store: 'opmgrLocationStore', // your storeId
    //width: 500,
    height: 300,
    cls: 'centered-headers-grid',
    
    // features: [ {
    //     ftype: 'summary'
    // // }],
    features: [{
        id: 'ygroup',
        ftype: 'groupingsummary',
        groupHeaderTpl: `<span class=xgrpheader>{name}</span>`,
        hideGroupedHeader: true,
        enableGroupingMenu: false,
        collapsible:false
    }],
    columns: [
        { 
            text: '', 
            dataIndex: 'location',
            width:150,
            sortable:false,
            hideable:false,
            menuDisabled:true,
         },
        { 
            text: 'Hub', 
            dataIndex: 'hub', 
            width:150,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            
            summaryRenderer: function(value, summaryData, dataIndex) {
                return `<b>Total :</b>`;
            }
            
        },
        // { text: '% Qty', dataIndex: 'qty_pct', width: 80,
        //     renderer: function(value) { return value + '%'; },
        //     summaryType: function(records, field) {
        //         // For custom summary, e.g., average
        //         var total = 0;
        //         var count = 0;
        //         Ext.each(records, function(r) {
        //             var val = r.get(field);
        //             if (Ext.isNumber(val)) {
        //                 total += val;
        //                 count++;
        //             }
        //         });

        //         //return count > 0 ? Ext.Number.toFixed(total / count, 2) : 0;
        //     }
        //     },
        { 
            text: 'Parcel', 
            dataIndex: 'parcel', 
            width: 120, 
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'right',       // Align the column values to the right
            headerAlign: 'center',
            summaryType: 'sum', 
            renderer: (value)=> { 
                return util.addCommas(value) 
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value)}</b>`
            }, 
        },
        {   text: 'Delivered',  
            dataIndex: 'parcel_delivered', 
            width: 120, 
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'right',       // Align the column values to the right
            headerAlign: 'center',
            summaryType: 'sum',
            renderer: (value)=> { 
                return util.addCommas(value) 
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value)}</b>`
            },
        },
        { 
            text: 'Amount', 
            dataIndex: 'amount', 
            width: 150, 
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'right',       // Align the column values to the right
            headerAlign: 'center',
            summaryType: 'sum', 
            renderer: (value)=> { 
                return util.addCommas(value.toFixed(2)) 
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value.toFixed(2))}</b>`
            },
        },
       
        {   
            text: 'Remitted', 
            dataIndex: 'amount_remitted', 
            width: 150, 
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'right',       // Align the column values to the right
            headerAlign: 'center',
            summaryType: 'sum',
            renderer: (value)=> { 
                return util.addCommas(value.toFixed(2)) 
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value.toFixed(2))}</b>`
            },
        },
        
    ],

    viewConfig: {
        //stripeRows: true,
        emptyText: 'No data available',
        preserveScrollOnRefresh: true,
        listeners: {
            viewready: function(view) {
                
                // // Select the first row after the grid has been rendered
                // var grid = Ext.getCmp('opmgrGrid');
                // var xstore = grid.getStore()
                // console.log('===viewRead loaded === store loaded w recs==' , xstore.data.length )

                // if (xstore.getCount() > 0) {
                    
                //     grid.getSelectionModel().select(0);
                
                // }
                /*                           
                store.sort([
                    { property: 'qty_pct', direction: 'DESC' },
                   
                    { property: 'location', direction: 'ASC' },
                    { property: 'hub', direction: 'ASC' },
                    
                ]);
                */
                //load the store now
                //this.getStore().load()

            }//end viewready
        }//end listeners viewconfig
    },
    //renderTo: Ext.getBody() // or your container
});
