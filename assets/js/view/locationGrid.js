/*  THE STORE IS LOADING IN VIEWREADY, I'LL PUT IN CONTROLLER */

Ext.define('MyApp.view.locationGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.locationgrid',
	
    id:'locationGrid',

    cls: 'centered-headers-grid',
    
	//static member
	statics:{
		myTitle:''
	},

    columnLines:true,
    
    title: 'Location',
    
    //========store of grid====
    store: 'locationStore',//storeID

    viewConfig: {
        stripeRows: true,
        loadingText:'Loading Please Wait!',
        emptyText:'No Records Found!!!',

        //apply row css
        getRowClass: function(record) { 
        }, 

        listeners: {
            viewready: function(grid) {
                var store = grid.getStore();
                store.sort('parcel', 'DESC'); // replace 'fieldName' with your actual field
            }//end viewready
        }//end listeners viewconfig
    },    
    listeners:{
        afterrender: function(grid) {
        },
    
        cellmousedown: function(view, cell, cellIdx, record, row, rowIdx, eOpts){
                   
        },
        selectionchange: function(model, records ) {
        
        }//end selectionchange
        
    },
    features: [{
        id: 'zzgroup',
        ftype: 'groupingsummary',
        groupHeaderTpl: `<i class='ti ti-map-pins'></i>&nbsp;<span class=xgrpheader>{name}</span>`,
        hideGroupedHeader: true,
        enableGroupingMenu: false,
        collapsible:false
    }],
    columns: [ /* your columns */ 
        {
            text: 'Hub',
            //flex: 1,
            width:185,
            //tdCls: 'task',
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
                if(parseInt(value)>0){
                    //meta.tdCls = 'font10'
                    return `<b>${util.addCommas(value)}</b>`
                }else{
                    return util.addCommas(value)
                }
                
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
            dataIndex: 'amount',
            align:'right',
            summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            },
            renderer: function(value, meta, record) {
                meta.tdCls = 'font7'
                return util.addCommas(value.toFixed(2))
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value.toFixed(2))}</b>`
            },
        }, 
        {
            header: 'Remitted',
            width: 130,
            sortable: false,
            menuDisabled:true,
            dataIndex: 'amount_remitted',
            align:'right',
            summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            },
            renderer: function(value, meta, record) {
                meta.tdCls = 'font7'
                return util.addCommas(value.toFixed(2))
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value.toFixed(2))}</b>`
            },
        },
       
    ], //end columns
   

})