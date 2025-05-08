const myIp = "https://asn-jtgrp-api.onrender.com" 
//const myIp = "http://192.168.214.221:10000"

Ext.define(null, {
    override: 'Ext.data.Store'

    ,sort: function(sorters, direction, where, doSort) {
        var me = this,
            sorter,
            newSorters;

        if (Ext.isArray(sorters)) {
            doSort = where;
            where = direction;
            newSorters = sorters;
        }
        else if (Ext.isObject(sorters)) {
            doSort = where;
            where = direction;
            newSorters = [sorters];
        }
        else if (Ext.isString(sorters)) {
            sorter = me.sorters.get(sorters);

            if (!sorter) {
                sorter = {
                    property : sorters,
                    direction: direction
                };
                newSorters = [sorter];
            }
            else if (direction === undefined) {
                sorter.toggle();
            }
            else {
                sorter.setDirection(direction);
            }
        }

        if (newSorters && newSorters.length) {
            newSorters = me.decodeSorters(newSorters);
            if (Ext.isString(where)) {
                if (where === 'prepend') {
                    // <code from 4.2.1>
                    // me.sorters.insert(0, newSorters);
                    // </code from 4.2.1>

                    // <code from 4.2.0>
                    sorters = me.sorters.clone().items;

                    me.sorters.clear();
                    me.sorters.addAll(newSorters);
                    me.sorters.addAll(sorters);
                    // </code from 4.2.0>
                }
                else {
                    me.sorters.addAll(newSorters);
                }
            }
            else {
                me.sorters.clear();
                me.sorters.addAll(newSorters);
            }
        }

        if (doSort !== false) {
            me.fireEvent('beforesort', me, newSorters);
            me.onBeforeSort(newSorters);

            sorters = me.sorters.items;
            if (sorters.length) {

                me.doSort(me.generateComparator());
            }
        }
    }
});

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

    //  fetch( `http://192.168.5.221:10000/summary`)
    //     .then(response => { 
    //         return response.json()
    //     })
    //     .then( (data)=>{
    //         console.log(data)

    //         var xdata = data
    //     }) 
    //     .catch(error => { 
    //         console.log("An error occurred: ", error); 
    //     })


var grid, riderGrid, store, rider_store, hub_search

Ext.onReady(function(){
    
    Ext.tip.QuickTipManager.init();

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
                    grid.getSelectionModel().select(0);
                    
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
                    grid.getSelectionModel().select(0);
                    
                }//eif
            }//end onload
        }//end listen				 

    })


    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });

    var showSummary = true;

    //hub GRID
    grid = Ext.create('Ext.grid.Panel', {
        width: 800,
        height: 250,
        frame: true,
        title: `<i class="ti ti-user-plus" style="left:0px;font-color:red;font-size:25px;"></i>&nbsp;&nbsp;Summary Per Location`,
       //f iconCls: 'icon-grid',
        //renderTo: 'grid_month',
        store: Ext.data.StoreManager.lookup('hubStore'),
        //plugins: [cellEditing],  /* takeout editing */
        layout:'fit',

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
                    rider_store.sort('delivered_pct', 'DESC');          
                    
                    
                    // If you need to reload data from the new URL
                    rider_store.load();

                    riderGrid.bindStore( rider_store )

                    riderGrid.getView().refresh();
                    
                    console.log( this.getStore().getAt(idx).get('hub') )

                }//eif
            }//end selectionchange
            
        },
        // dockedItems: [
        //     {
        //     dock: 'top',
        //     xtype: 'toolbar',
        //     items: [
        //         // {
        //         // tooltip: 'Toggle the visibility of the summary row',
        //         // text: 'Toggle Summary',
        //         // enableToggle: true,
        //         // pressed: true,
        //         // handler: function(){
        //         //     var view = grid.getView();
        //         //     showSummary = !showSummary;
        //         //     view.getFeature('group').toggleSummaryRow(showSummary);
        //         //     view.refresh();
        //         // }
        //     ]
        // }],
        features: [{
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl: '<font color=blue   >{name}</font>',
            //groupHeaderTpl: new Ext.XTemplate('<tpl for=".">', '<input type="button" value={name}></div>', '</tpl>'),
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
        columns: [{
            text: 'Hub',
            //flex: 1,
            width:200,
            tdCls: 'task',
            sortable: true,
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
        }, {
            header: 'Location',
            width: 180,
            sortable: false,
            dataIndex: 'location',
            renderer: function(value, meta) {
                console.log( 'hey',meta)
                meta.tdCls='font10'
                return value
                //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                //return value;
            }
        }, /*{
            header: 'Due Date',
            width: 80,
            sortable: true,
            dataIndex: 'due',
            summaryType: 'max',
            renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            summaryRenderer: Ext.util.Format.dateRenderer('m/d/Y'),
            field: {
                xtype: 'datefield'
            }
        }, {
            header: 'Estimate',
            width: 75,
            sortable: true,
            dataIndex: 'estimate',
            summaryType: 'sum',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                return value + ' hours';
            },
            summaryRenderer: function(value, summaryData, dataIndex) {
                return value + ' hours';
            },
            field: {
                xtype: 'numberfield'
            }
        },*/ {
            header: 'Qty',
            width: 100,
            sortable: true,
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
            width: 100,
            sortable: true,
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
        /* {
            id: 'cost',
            header: 'Cost',
            width: 75,
            sortable: false,
            groupable: false,
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return Ext.util.Format.usMoney(record.get('estimate') * record.get('rate'));
            },
            dataIndex: 'cost',
            summaryType: function(records){
                var i = 0,
                    length = records.length,
                    total = 0,
                    record;

                for (; i < length; ++i) {
                    record = records[i];
                    total += record.get('estimate') * record.get('rate');
                }
                return total;
            },
            summaryRenderer: Ext.util.Format.usMoney
        }*/
       ],//endcolumn

       //region:'north',
       border:false,
       //split:true,
    
    }); //==end grid

    // var summaryRow = grid.getView().getFeature(0); 
    // styleObj = {
    // 'background-color': '#c4f185'  
    // };
    // summaryRow.view.el.setStyle(styleObj);


    //RIDER GRID
    riderGrid = Ext.create('Ext.grid.Panel', {
        //region:'west',
        split:true, 
        width:400,
        height: 700,
        remoteSort:true,
        layout:'fit',
        id: '_riderGrid',
        frame: true,
       // title: `<i class="ti ti-user-plus" style="left:0px;font-color:red;font-size:25px;"></i>&nbsp;&nbsp;Summary Per Location`,
       // iconCls: 'icon-grid',
        //renderTo: 'grid_month',
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
        features: [{
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl: '<font color=blue   >{name}</font>',
            //groupHeaderTpl: new Ext.XTemplate('<tpl for=".">', '<input type="button" value={name}></div>', '</tpl>'),
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
        columns: [{
            text: 'Working Day(s)',
            //flex: 1,
            width:200,
            //tdCls: 'task',
            sortable: true,
            dataIndex: 'transactions',
            hideable: false,
            renderer: function(value, meta, record) {
                meta.tdCls = 'font10';
                return value;
                //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                //return value;
            },
            //summaryType: 'count',
            // summaryRenderer: function(value, summaryData, dataIndex) {
            //     //console.log(dataIndex)
            //     return ((value === 0 || value > 1) ?`( ${value} Days )` : `( 1 Day )`);
            // }
        }, {
            header: '',
            width: 180,
            sortable: false,
            dataIndex: 'full_name',
            renderer: function(value, meta) {
               // console.log( 'hey',meta)
                meta.tdCls='font10'
                return value
                //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                //return value;
            }
        }, /*{
            header: 'Due Date',
            width: 80,
            sortable: true,
            dataIndex: 'due',
            summaryType: 'max',
            renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            summaryRenderer: Ext.util.Format.dateRenderer('m/d/Y'),
            field: {
                xtype: 'datefield'
            }
        }, {
            header: 'Estimate',
            width: 75,
            sortable: true,
            dataIndex: 'estimate',
            summaryType: 'sum',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                return value + ' hours';
            },
            summaryRenderer: function(value, summaryData, dataIndex) {
                return value + ' hours';
            },
            field: {
                xtype: 'numberfield'
            }
        },*/ {
            header: 'Performance',
            width: 100,
            sortable: true,
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
        // {
        //     header: 'Delivered',
        //     width: 100,
        //     sortable: false,
        //     //renderer: Ext.util.Format.usMoney,
        //     //summaryRenderer: Ext.util.Format.usMoney,
        //     align:'right',
        //     dataIndex: 'parcel_delivered',
        //     summaryType: 'sum',
        //     field: {
        //         xtype: 'numberfield'
        //     },
        //     renderer: function(value, meta, record) {
        //         meta.tdCls = 'font7'
        //         return addCommas(value)
        //     },
        //     summaryRenderer:(value,summaryData,dataIndex)=>{
        //         return( value )
        //     },
        // },
        // {
        //     header: 'Amount',
        //     width: 130,
        //     sortable: false,
        //     //renderer: Ext.util.Format.usMoney,
        //     //summaryRenderer: Ext.util.Format.usMoney,
        //     dataIndex: 'amount_remitted',
        //     align:'right',
        //     summaryType: 'sum',
        //     field: {
        //         xtype: 'numberfield'
        //     },
        //     renderer: function(value, meta, record) {
        //         meta.tdCls = 'font7'
        //         return addCommas(value)
        //     },
        // }, 
        // {
        //     header: 'Remitted',
        //     width: 130,
        //     sortable: false,
        //     //renderer: Ext.util.Format.usMoney,
        //     //summaryRenderer: Ext.util.Format.usMoney,
        //     dataIndex: 'amount',
        //     align:'right',
        //     summaryType: 'sum',
        //     field: {
        //         xtype: 'numberfield'
        //     },
        //     renderer: function(value, meta, record) {
        //         meta.tdCls = 'font7'
        //         return addCommas(value)
        //     },
        // },
        // {
        //     header: '%',
        //     width: 100,
        //     sortable: true,
        //     //renderer: Ext.util.Format.usMoney,
        //     //summaryRenderer: Ext.util.Format.usMoney,
        //     align:'right',
        //     dataIndex: 'qty_pct',
        //     //summaryType: 'sum',
        //     field: {
        //         xtype: 'numberfield'
        //     },
        //     renderer: function(value, meta, record) {
        //         meta.tdCls = 'font7'
        //         return `${value} %`
        //         //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
        //         //return value;
        //     },
        //     summaryRenderer:(value,summaryData,dataIndex)=>{
        //         //return addCommas(value)
        //     },
        // },
        /* {
            id: 'cost',
            header: 'Cost',
            width: 75,
            sortable: false,
            groupable: false,
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return Ext.util.Format.usMoney(record.get('estimate') * record.get('rate'));
            },
            dataIndex: 'cost',
            summaryType: function(records){
                var i = 0,
                    length = records.length,
                    total = 0,
                    record;

                for (; i < length; ++i) {
                    record = records[i];
                    total += record.get('estimate') * record.get('rate');
                }
                return total;
            },
            summaryRenderer: Ext.util.Format.usMoney
        }*/
       ],//endcolumn
        border:true,
        //split:true,
    
    }); //==end grid

    Ext.create('widget.panel', {
        //title: 'Layout Window with title <em>after</em> tools',
        // header: {
        //     titlePosition: 2,
        //     titleAlign: 'center'
        // },
        // closable: true,
        // closeAction: 'hide',
        // //width: 600,
        //minWidth: 350,
        height: 700,
        maximized:true,
        border: true,
        frame:true,
        renderTo:'grid_rider',
        //layout:'fit',
        //tools: [{type: 'pin'}],
        // layout: {
        //     type: 'border',
        //     padding: 1
        // },
        //split:true,

        items: [
            {
                xtype:'panel',
                region:'center',
                height:400,
                layout:'fit',
                items:[
                    grid
                ],
                split:true,
                

            },

            {
                xtype:'panel',
                region:'south',
                height:300,
                layout:'fit',
                items:[
                    riderGrid
                ]

             },

            // {
            //     xtype:'panel',
            //     //region: 'center',
            //     width:200,
            //     layout:'fit',
            //     height:500,
            //     frame:true,
            //     border:true


            // }
                

        ]
    });


}); //end ext on ready
