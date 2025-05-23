Ext.define('MyApp.overrides.SelectionModel', {
    override: 'Ext.selection.Model',
    select: function(records, keepExisting, suppressEvent) {
        console.log('Ext.selection.Model.select called with:', records, keepExisting, suppressEvent);
        this.callParent(arguments); // Call the original method
    }
});

Ext.define('MyApp.view.opmgrGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.opmgrGrid',
    id: 'opmgrGrid',
    title: 'Operation Management Summary',
    store: Ext.data.StoreManager.lookup('opmgrStore'), // your storeId
    width: 500,
    height: 300,

    // features: [ {
    //     ftype: 'summary'
    // }],
    features: [{
        id: 'xgroup',
        ftype: 'groupingsummary',
        groupHeaderTpl: `{name}`,
        hideGroupedHeader: true,
        enableGroupingMenu: false,
        collapsible:false
    }],
    columns: [
        { 
            text: 'Region', 
            dataIndex: 'region',
            width:150 
        },
        { 
            text: 'Area', 
            dataIndex: 'area', 
            width:150 
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
            summaryType: 'sum', 
            //renderer: Ext.util.Format.numberRenderer('0') 
        },
        {   text: 'Delivered',  
            dataIndex: 'parcel_delivered', 
            width: 120, 
            summaryType: 'sum',
            //enderer: Ext.util.Format.numberRenderer('0') 
        },
        { 
            text: 'Amount', 
            dataIndex: 'amount', 
            width: 150, 
            summaryType: 'sum', 
            //renderer: Ext.util.Format.usMoney
        },
       
        {   
            text: 'Remitted', 
            dataIndex: 'amount_remitted', 
            width: 150, 
            summaryType: 'sum',
            //renderer: Ext.util.Format.usMoney
        },
        
    ],

    viewConfig: {
        //stripeRows: true,
        emptyText: 'No data available',
        preserveScrollOnRefresh: true,
        listeners: {
            viewready: function(view) {
                console.log('HUB locaion grid viewready');

                // Select the first row after the grid has been rendered
                var grid = Ext.getCmp('opmgrGrid');
                if (grid.getStore().getCount() > 0) {
                    grid.getSelectionModel().select(0);
                }
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
