
const myIp = "https://asn-jtgrp-api.onrender.com" 
//const myIp = "http://192.168.214.221:10000"

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.form.field.Number',
    'Ext.form.field.Date',
    'Ext.tip.QuickTipManager'
]);
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.form.field.Number',
    'Ext.form.field.Date',
    'Ext.tip.QuickTipManager'
]);

Ext.define('Task', {
    extend: 'Ext.data.Model',
    idProperty: 'taskId',
    fields: [
        //{name: 'projectId', type: 'int'},
        {name: 'coordinator', type: 'string'},
        {name: 'location', type: 'string'},
        {name: 'hub', type: 'string'},
        {name: 'parcel', type: 'int'},
        {name: 'amount', type: 'float'},
        {name: 'parcel_delivered', type: 'int'},
        {name: 'amount_remitted', type: 'float'},
        {name: 'qty_pct', type: 'float'},
        // {name: 'cost', type: 'float'},
        // {name: 'due', type: 'date', dateFormat:'m/d/Y'}
    ]
});

Ext.define('Rider', {
    extend: 'Ext.data.Model',
    idProperty: 'RiderId',
    fields: [
        //{name: 'projectId', type: 'int'},
        {name: 'id', type: 'int'},
        {name: 'full_name', type: 'string'},
        {name: 'emp_id', type: 'int'},
        {name: 'hub', type: 'string'},
        {name: 'qty', type: 'int'},
        {name: 'actual_qty', type: 'int'},
        {name: 'amt', type: 'float'},
        {name: 'actual_amount', type: 'float'},
        {name: 'delivered_pct', type: 'float'},
        {name: 'undelivered_pct', type: 'float'},
        {name: 'transactions', type: 'int'},
        // {name: 'cost', type: 'float'},
        // {name: 'due', type: 'date', dateFormat:'m/d/Y'}
    ]
});

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var grid, riderGrid, store, rider_store, hub_search
var win

Ext.onReady(function(){
    
    Ext.tip.QuickTipManager.init();

    //============PREPARE STORES============//
    store = Ext.create('Ext.data.Store', {
        model: 'Task',         
        storeId:'hubStore',
        groupField: 'location',
        autoLoad: false,
        
        proxy: {
            // load using HTTP
            type: 'ajax',
            url: `${myIp}/coor/summary`,
            // the return will be json, so lets set up a reader
            reader: {
                type: 'json'
            }
        },

        listeners: {
            'load': function(records, operation, success){
                if(this.getCount()>0){
                    console.log('==store loaded w recs==')
                    Ext.getCmp('hub-grid').getSelectionModel().select(0);
                    
                }//eif
            }//end onload
        }//end listen				 

    })
    
    //rider store
    rider_store = Ext.create('Ext.data.Store', {
        model: 'Rider',         
        storeId:'riderStore',
        groupField: 'full_name',
        autoLoad: false,
        remoteSort:true,

        proxy: {
            // load using HTTP
            type: 'ajax',
            url: `${myIp}/coor/ridersummary/${hub_search}`,
            // the return will be json, so lets set up a reader
            reader: {
                type: 'json'
            }
        },

        listeners: {
            'load': function(records, operation, success){
                if(this.getCount()>0){
                    console.log('== rider store loaded w recs==')
                    Ext.getCmp('rider-grid').getSelectionModel().select(0);
                    
                }//eif
            }//end onload
        }//end listen				 

    })


    //=============PREPARE VIEWPORT=========//
    win = Ext.create('Ext.panel.Panel', {
        width: 600,
        height: 600,
        //maximized:true,
        //layout: 'border',
        renderTo: 'grid_rider', // or your container
        frame:true,
        flex:1,
        listeners:{
        minWidth:400,
        },

        layout: {
            type: 'border',
            align: 'stretch'
        },
        items: [
            {   // Center Grid
                region: 'center',
                xtype: 'gridpanel',
                id:'hub-grid',
                title: 'Hub/Location',
                //minWidth:300,
                //layout:'fit',
                store: Ext.data.StoreManager.lookup('hubStore'),
                border:true,
                flex:1,
                viewConfig: {
                    stripeRows: true,
                    loadingText:'Loading Please Wait!',
                    emptyText:'No Records Found!!!',
        
                    listeners: {
                        viewready: function(view) {
                            console.log('grid viewready');
                            //load the store now
                            store.load()
        
                        }//end viewready
                    }//end listeners viewconfig
                },    
                listeners:{
                    cellmousedown: function(view, cell, cellIdx, record, row, rowIdx, eOpts){
                          console.log( record.get("location"))      
                    },
                    selectionchange: function(model, records ) {
                    
                        if(records[0]){
                            var idx = this.getStore().indexOf(records[0]);
                            hub_search = this.getStore().getAt(idx).get('hub')
        
                            rider_store.removeAll();
        
                            // To change the URL dynamically
                            var proxy = rider_store.getProxy();
                            proxy.url =  `${myIp}/coor/ridersummary/${hub_search}`;
        
                            // or use `sorters` array directly
                            //rider_store.sort('delivered_pct', 'DESC');          
                            
                            
                            // If you need to reload data from the new URL
                            //store.sort('yourField', 'ASC'); // set the sorting
                            rider_store.load({
                                callback: function() {
                                    // After loading, refresh the view
                                    Ext.getCmp('rider-grid').getView().refresh();
                                }
                            });
        
                                              
                            console.log( this.getStore().getAt(idx).get('hub') )
        
                        }//eif
                    }//end selectionchange
                    
                },
                features: [{
                    id: 'group',
                    ftype: 'groupingsummary',
                    groupHeaderTpl: '<font color=blue   >{name}</font>',
                    //groupHeaderTpl: new Ext.XTemplate('<tpl for=".">', '<input type="button" value={name}></div>', '</tpl>'),
                    hideGroupedHeader: true,
                    enableGroupingMenu: false
                }],
                columns: [ /* your columns */ 
                    {
                        text: 'Hub',
                        //flex: 1,
                        width:200,
                        tdCls: 'task',
                        locked:true,
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
                            return value
                            //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                            //return value;
                        }
                    }, 

                    {
                        header: 'Qty',
                        menuDisabled:true,
                        sortable:false,
                        width: 100,
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
            
                            return addCommas(value)
                            //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                            //return value;
                        },
                        summaryRenderer:(value,summaryData,dataIndex)=>{
                            return addCommas(value)
                        },
                    },
                    {
                        header: 'Delivered',
                        menuDisabled:true,
                        width: 100,
                        sortable: false,
                        //renderer: Ext.util.Format.usMoney,
                        //summaryRenderer: Ext.util.Format.usMoney,
                        align:'right',
                        dataIndex: 'parcel_delivered',
                        summaryType: 'sum',
                        field: {
                            xtype: 'numberfield'
                        },
                        renderer: function(value, meta, record) {
                            meta.tdCls = 'font7'
                            return addCommas(value)
                        },
                        summaryRenderer:(value,summaryData,dataIndex)=>{
                            return( value )
                        },
                    },
                    {
                        header: 'Amount',
                        width: 130,
                        menuDisabled:true,
                        sortable: false,
                        //renderer: Ext.util.Format.usMoney,
                        //summaryRenderer: Ext.util.Format.usMoney,
                        dataIndex: 'amount_remitted',
                        align:'right',
                        summaryType: 'sum',
                        field: {
                            xtype: 'numberfield'
                        },
                        renderer: function(value, meta, record) {
                            meta.tdCls = 'font7'
                            return addCommas(value)
                        },
                    }, 
                    {
                        header: 'Remitted',
                        width: 130,
                        sortable: false,
                        menuDisabled:true,
                        //renderer: Ext.util.Format.usMoney,
                        //summaryRenderer: Ext.util.Format.usMoney,
                        dataIndex: 'amount',
                        align:'right',
                        summaryType: 'sum',
                        field: {
                            xtype: 'numberfield'
                        },
                        renderer: function(value, meta, record) {
                            meta.tdCls = 'font7'
                            return addCommas(value)
                        },
                    },
                    {
                        header: '%',
                        width: 70,
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
                            //return addCommas(value)
                        },
                    },
                ], //end columns
                
                
                // other configs
            },
            {   // Container for West and East grids at South
                region: 'south',
                xtype: 'container',
                height: 250,
            
                layout: 'hbox',
                items: [
                    {   // West Grid
                        xtype: 'gridpanel',
                        title: 'Riders Info',
                        id:    'rider-grid',
                        flex: 1,
                        store: Ext.data.StoreManager.lookup('riderStore'),
                        frame:true,
                        height:'100%',
                        width:400,
                        store: Ext.data.StoreManager.lookup('riderStore'),  //store.storeID
                        //plugins: [cellEditing],  /* takeout editing */

                        viewConfig: {
                            stripeRows: true,
                            loadingText:'Loading Please Wait!',
                            emptyText:'No Records Found!!!',

                            listeners: {
                                viewready: function(view) {
                                    console.log('riders grid viewready');

                                
                                }//end viewready
                            }//end listeners viewconfig
                        },    

                        listeners:{
                            cellmousedown: function(view, cell, cellIdx, record, row, rowIdx, eOpts){
                                //console.log( record.get("location"))      
                            },
                            selectionchange: function(model, records ) {
                                
                            console.log('===ridersGrid selectionchange()===')
                            /*
                                if(records[0]){
                                    var idx = this.getStore().indexOf(records[0]);
                                    console.log( this.getStore().getAt(idx).get('hub') )
                                }//eif
                                */
                            }//end selectionchange
                            
                        },

                        // features: [{
                        //     id: 'group',
                        //     ftype: 'groupingsummary',
                        //     groupHeaderTpl: '<font color=blue   >{name}</font>',
                        //     //groupHeaderTpl: new Ext.XTemplate('<tpl for=".">', '<input type="button" value={name}></div>', '</tpl>'),
                        //     hideGroupedHeader: true,
                        //     enableGroupingMenu: false
                        // }],
                        
                        columns: [/*
                            {
                                text: 'Working Day(s)',
                                //flex: 1,
                                width:200,
                                menuDisabled:true,
                                //tdCls: 'task',
                                sortable: true,
                                dataIndex: 'transactions',
                                hideable: false,
                                renderer: function(value, meta, record) {
                                    meta.tdCls = 'font10';
                                    return ((value === 0 || value > 1) ?`( ${value} Days )` : `( 1 Day )`);
                                    //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                                    //return value;
                                },
                                //summaryType: 'count',
                                // summaryRenderer: function(value, summaryData, dataIndex) {
                                //     //console.log(dataIndex)
                                //     return ((value === 0 || value > 1) ?`( ${value} Days )` : `( 1 Day )`);
                                // }
                            },*/
                            {
                                header: 'Name',
                                width: 180,
                                sortable: false,
                                menuDisabled:true,
                                dataIndex: 'full_name',
                                renderer: function(value, meta) {
                                   // console.log( 'hey',meta)
                                    meta.tdCls='font10g'
                                    return value
                                    //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                                    //return value;
                                }
                            },{
                                header: 'Performance',
                                width: 85,
                                sortable: true,
                                menuDisabled:true,
                                //renderer: Ext.util.Format.usMoney,
                                //summaryRenderer: Ext.util.Format.usMoney,
                                align:'center',
                                dataIndex: 'delivered_pct',
                                sortable:false,
                                //summaryType: 'sum',
                                field: {
                                    xtype: 'numberfield'
                                },
                                renderer: function(value, meta, record) {
                                    meta.tdCls = 'font10g'
                    
                                    return `${value} %`
                                    //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                                    //return value;
                                }
                            },
                        ],
                    },
                    {   // East Grid
                        xtype: 'gridpanel',
                        title: 'East Grid',
                        flex: 1,
                        store: null,
                        height:'100%',
                        width:200,
                        frame:true,
                        columns: [ /* your columns */ ],
                    }
                ]//end items in south region
            }
        ]//end items main
    });

    
})//end onread

window.addEventListener('resize', function(event) {
    // Code to execute when the window is resized
    console.log('Window resized');

    const container = document.getElementById('grid_rider');
    const width = container.offsetWidth;
    //console.log('Container width changed:', width);
    if(width>500){
        win.doLayout()

    }
    
  });
