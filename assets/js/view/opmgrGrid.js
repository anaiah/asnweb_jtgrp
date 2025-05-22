Ext.define('MyApp.view.opmgrGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.opmgrGrid',
    id: 'opmgrGrid',
    title: 'Operation Management Summary',
    store: Ext.data.StoreManager.lookup('opmgrStore'), // your storeId
    width: 700,
    height: 400,
    columns: [
        { text: 'Region', dataIndex: 'region', flex: 1 },
        { text: 'Area', dataIndex: 'area', flex: 1 },
        { text: 'Parcel', dataIndex: 'parcel', width: 80 },
        { text: 'Amount', dataIndex: 'amount', width: 100, renderer: Ext.util.Format.usMoney },
        { text: 'Delivered', dataIndex: 'parcel_delivered', width: 80 },
        { text: 'Remitted', dataIndex: 'amount_remitted', width: 100, renderer: Ext.util.Format.usMoney },
        { text: '% Qty', dataIndex: 'qty_pct', width: 80, renderer: function(value) { return Ext.Number.toFixed(value * 100, 1) + '%'; } }
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
