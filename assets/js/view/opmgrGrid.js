
Ext.define('MyApp.view.opmgrGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.opmgrgrid',

    id: 'opmgrGrid',
    //title: 'Area Performance Summary',
    store: 'opmgrStore',//Ext.data.StoreManager.lookup('opmgrStore'), // your storeId
    width: 500,
    height: 300,
    
    cls: 'centered-headers-grid',
    
    // features: [ {
    //     ftype: 'summary'
    // }],
    features: [{
        id: 'xgroup',
        ftype: 'groupingsummary',
        groupHeaderTpl: `<i class='ti ti-map-pin'></i>&nbsp;<span class=xgrpheader>{name} REGION</span>`,
        hideGroupedHeader: true,
        enableGroupingMenu: false,
        collapsible:false
    }],
    columns: [
        { 
            text: 'Region', 
            dataIndex: 'region',
            width:150,
            sortable:false,
            hideable:false,
            menuDisabled:true,
        },
        { 
            text: 'Area', 
            dataIndex: 'area', 
            width:150,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            renderer: (value)=> { 
                return `&nbsp;&nbsp;&nbsp;${value}` 
            },
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
              
            }//end viewready
        }//end listeners viewconfig
    },
    //renderTo: Ext.getBody() // or your container
});
