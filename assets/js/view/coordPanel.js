
Ext.define('MyApp.view.coordPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.coordPanel',
    id:'coordPanel',
    // layout: {
    //     type: 'border',
    //     align: 'stretch'
    // },
    layout:'hbox',
    frame:true,
    border:true,
    //renderTo:'grid_month',
    items: [
        {
            region: 'west',
            xtype: 'gridpanel',
            id:'locationGrid',
            title: 'Location',
            height:'100%',
            //minWidth:300,
            //layout:'fit',
            store: Ext.data.StoreManager.lookup('locationStore'),

            border:true,
            flex:1,
            viewConfig: {
                stripeRows: true,
                loadingText:'Loading Please Wait!',
                emptyText:'No Records Found!!!',
    
                //apply row css
                getRowClass: function(record) { 

                    if(record.get('location')){
                        //return "row-class shadow"
                    }else{

                    }
                    //return record.get('clone') =="1" ? 'clone-row' : null; 
                }, 

                listeners: {
                    viewready: function(view) {
                        console.log('HUB grid viewready');
                        /*                           
                        store.sort([
                            { property: 'qty_pct', direction: 'DESC' },
                           
                            { property: 'location', direction: 'ASC' },
                            { property: 'hub', direction: 'ASC' },
                            
                        ]);
                        */
                        //load the store now
                        this.store.load()
    
                       
                    }//end viewready
                }//end listeners viewconfig
            },    
            listeners:{
                afterrender: function(grid) {
                    /*
                    console.log('aferrender',grid.id)
                    var view = grid.getView();
                    // For example, add a class to all group headers
                    view.el.select('.x-grid-group-hd').each(function(el) {
                        el.addCls('xgrpheader');
                    });
                    */
                },
            
                cellmousedown: function(view, cell, cellIdx, record, row, rowIdx, eOpts){
                      console.log( record.get("location"))      
                },
                selectionchange: function(model, records ) {
                
                    console.log('hub grid selectionchange() fired')
                    // if(records[0]){ tanggal muna
                    //     var idx = this.getStore().indexOf(records[0]);
                    //     hub_search = this.getStore().getAt(idx).get('hub')
    
                    //     rider_store.removeAll();
    
                    //     // To change the URL dynamically
                    //     var proxy = rider_store.getProxy();
                    //     proxy.url =  `${myIp}/coor/ridersummary/${hub_search}`;
    
                    //     // or use `sorters` array directly
                    //     //rider_store.sort('delivered_pct', 'DESC');          
                        
                        
                    //     // If you need to reload data from the new URL
                    //     //store.sort('yourField', 'ASC'); // set the sorting
                    //     rider_store.load({
                    //         callback: function() {
                    //             // After loading, refresh the view
                    //             Ext.getCmp('rider-grid').getView().refresh();
                    //         }
                    //     });
              
                    //     console.log( this.getStore().getAt(idx).get('hub') )
    
                    // }//eif
                }//end selectionchange
                
            },
            features: [{
                id: 'group',
                ftype: 'groupingsummary',
                groupHeaderTpl: `<span class=xgrpheader>{name}</span>`,
                //groupHeaderTpl: new Ext.XTemplate('<tpl for=".">', '<input type="button" value={name}></div>', '</tpl>'),
                hideGroupedHeader: true,
                enableGroupingMenu: false,
                collapsible:false
            }],
            columns: [ /* your columns */ 
                {
                    text: 'Hub',
                    //flex: 1,
                    width:185,
                    tdCls: 'task',
                    //dont lock muna locked:true,
                    menuDisabled:true,
                    sortable:false,
                    dataIndex: 'hub',
                    hideable: false,
                    renderer: function(value, meta, record) {
                        meta.tdCls = 'font10';
                        return value;
                        //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                        //return value;
                    },
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        //console.log(dataIndex)
                        return ((value === 0 || value > 1) ?`( ${value} Hubs )` : `( 1 Hub )`);
                    }
                }, 
                {
                    header: 'Location',
                    width: 180,
                    sortable: false,
                    menuDisabled:true,
                    dataIndex: 'location',
                    renderer: function(value, meta) {
                        console.log( 'hey',meta)
                        meta.tdCls='font10'
                        return `${value}`
                        //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                        //return value;
                    }
                }, 
                {
                    header: '%',
                    width: 50,
                    sortable: false,
                    menuDisabled:true,
                    //renderer: Ext.util.Format.usMoney,
                    //summaryRenderer: Ext.util.Format.usMoney,
                    align:'right',
                    dataIndex: 'qty_pct',
                    //summaryType: 'sum',
                    field: {
                        xtype: 'numberfield'
                    },
                    renderer: function(value, meta, record) {
                        meta.tdCls = 'font7'
                        return `${value} %`
                        //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                        //return value;
                    },
                    summaryRenderer:(value,summaryData,dataIndex)=>{
                        //return util.addCommas(value)
                    },
                },
                {
                    header: 'Qty',
                    menuDisabled:true,
                    sortable:false,
                    width: 85,
                    //sortable: true,
                    //renderer: Ext.util.Format.usMoney,
                    //summaryRenderer: Ext.util.Format.usMoney,
                    align:'right',
                    dataIndex: 'parcel',
                    summaryType: 'sum',
                    field: {
                        xtype: 'numberfield'
                    },
                    renderer: function(value, meta, record) {
                        meta.tdCls = 'font7'
        
                        return util.addCommas(value)
                    },
                    summaryRenderer:(value,summaryData,dataIndex)=>{
                        return `<b>${util.addCommas(value)}</b>`
                    },
                },
                {
                    header: 'Delivered',
                    menuDisabled:true,
                    width: 85,
                    sortable: false,
                    align:'right',
                    dataIndex: 'parcel_delivered',
                    summaryType: 'sum',
                    field: {
                        xtype: 'numberfield'
                    },
                    renderer: function(value, meta, record) {
                        meta.tdCls = 'font7'
                        return util.addCommas(value)
                    },
                    summaryRenderer:(value,summaryData,dataIndex)=>{
                        return `<b>${util.addCommas(value)}</b>`
                    },
                },
                {
                    header: 'Amount',
                    width: 130,
                    menuDisabled:true,
                    sortable: false,
                    dataIndex: 'amount_remitted',
                    align:'right',
                    summaryType: 'sum',
                    field: {
                        xtype: 'numberfield'
                    },
                    renderer: function(value, meta, record) {
                        meta.tdCls = 'font7'
                        return util.addCommas(value)
                    },
                    summaryRenderer:(value,summaryData,dataIndex)=>{
                        return `<b>${util.addCommas(value)}</b>`
                    },
                }, 
                {
                    header: 'Remitted',
                    width: 130,
                    sortable: false,
                    menuDisabled:true,
                    dataIndex: 'amount',
                    align:'right',
                    summaryType: 'sum',
                    field: {
                        xtype: 'numberfield'
                    },
                    renderer: function(value, meta, record) {
                        meta.tdCls = 'font7'
                        return util.addCommas(value)
                    },
                    summaryRenderer:(value,summaryData,dataIndex)=>{
                        return `<b>${util.addCommas(value)}</b>`
                    },
                },
               
            ], //end columns
            
            
            // other configs
    
           
        },//take  out east grid for now

      
        // {
        //     region: 'east',
        //     xtype: 'grid',
        //     title: 'Client',
        //     store: '', // Your other store
        //     border:true,
        //     height:'100%',
        //     columns: [
        //         { text: 'Code', dataIndex: 'code', width: 100 },
        //         { text: 'Description', dataIndex: 'desc', flex: 1 }
        //     ],
        //     width: 300,
        //     //split: true,
        //     //collapsible: true
        // }
    ], //end items panel

    
});