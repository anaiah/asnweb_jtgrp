Ext.define('MyApp.view.opmgrGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.opmgrGrid',
    id: 'opmgrGrid',
    title: 'Operation Management Summary',
    store: Ext.data.StoreManager.lookup('opmgrStore'), // your storeId
    width: 700,
    height: 400,

    plugins: [{
        ptype: 'gridsummary'
    }],

    columns: [
        { text: 'Region', dataIndex: 'region', flex: 1 },
        { text: 'Area', dataIndex: 'area', flex: 1 },
        { text: 'Parcel', dataIndex: 'parcel', width: 80, 
        summaryType: 'sum', 
        renderer: Ext.util.Format.numberRenderer('0') 
        },
        { text: 'Amount', dataIndex: 'amount', width: 100, 
        summaryType: 'sum', 
        renderer: Ext.util.Format.usMoney
        },
        { text: 'Delivered', dataIndex: 'parcel_delivered', width: 80, 
        summaryType: 'sum'
        },
        { text: 'Remitted', dataIndex: 'amount_remitted', width: 100, 
        summaryType: 'sum',
        renderer: Ext.util.Format.usMoney
        },
        { text: '% Qty', dataIndex: 'qty_pct', width: 80,
        renderer: function(value) { return Ext.Number.toFixed(value * 100, 1) + '%'; },
        summaryType: function(records, field) {
            // For custom summary, e.g., average
            var total = 0;
            var count = 0;
            Ext.each(records, function(r) {
                var val = r.get(field);
                if (Ext.isNumber(val)) {
                    total += val;
                    count++;
                }
            });
            return count > 0 ? Ext.Number.toFixed(total / count, 2) : 0;
        }
        }
    ],

    viewConfig: {
        stripeRows: true,
        emptyText: 'No data available',

        listeners: {
            viewready: function(view) {
                console.log('HUB locaion grid viewready');
                /*                           
                store.sort([
                    { property: 'qty_pct', direction: 'DESC' },
                   
                    { property: 'location', direction: 'ASC' },
                    { property: 'hub', direction: 'ASC' },
                    
                ]);
                */
                //load the store now
                this.getStore().load()

            }//end viewready
        }//end listeners viewconfig
    },
    //renderTo: Ext.getBody() // or your container
});
