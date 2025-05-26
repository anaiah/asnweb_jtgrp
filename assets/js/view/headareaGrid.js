Ext.define('MyApp.view.headareaGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.headareagrid',
	
	//static member
	statics:{
		myTitle:''
	},

    //title : 'testList',
	columnLines:true,
    region: 'center',
    
    cls: 'centered-headers-grid',

    id:'headareaGrid',
    title: 'Area',
    
    store: 'headareaStore',//storeId Ext.data.StoreManager.lookup('headareaStore'),

    viewConfig: {
        stripeRows: true,
        loadingText:'Loading Please Wait!',
        emptyText:'No Records Found!!!',

        //apply row css
        getRowClass: function(record) { 
        }, 

        listeners: {
            viewready: function(view) {
         
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
        id: 'hgroup',
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
            tdCls: 'task',
            //dont lock muna locked:true,
            dataIndex: 'area',
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'left',       // Align the column values to the right
            headerAlign: 'center',
            renderer: function(value, meta, record) {
                return value;
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
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'left',       // Align the column values to the right
            headerAlign: 'center',
            dataIndex: 'location',
            renderer: function(value, meta) {
                return `${value}`
               
            }
        }, 
        {
            header: '%',
            width:60,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'center',       // Align the column values to the right
            headerAlign: 'center',//renderer: Ext.util.Format.usMoney,
            //summaryRenderer: Ext.util.Format.usMoney,
            align:'right',
            dataIndex: 'qty_pct',
            //summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            },
            renderer: function(value, meta, record) {
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
            width: 85,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'right',       // Align the column values to the right
            headerAlign: 'center',
            dataIndex: 'parcel',
            summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            },
            renderer: function(value, meta, record) {
               
                return util.addCommas(value)
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value)}</b>`
            },
        },
        {
            header: 'Delivered',
            width: 85,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'right',       // Align the column values to the right
            headerAlign: 'center',dataIndex: 'parcel_delivered',
            summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            },
            renderer: function(value, meta, record) {
                return util.addCommas(value)
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value)}</b>`
            },
        },
        {
            header: 'Amount',
            width: 130,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'right',       // Align the column values to the right
            headerAlign: 'center',
            dataIndex: 'amount',
            summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            },
            renderer: function(value, meta, record) {
                return util.addCommas(value.toFixed(2))
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value.toFixed(2))}</b>`
            },
        }, 
        {
            header: 'Remitted',
            width: 130,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'right',       // Align the column values to the right
            headerAlign: 'center',
            dataIndex: 'amount_remitted',
            summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            },
            renderer: function(value, meta, record) {
                return util.addCommas(value.toFixed(2))
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value.toFixed(2))}</b>`
            },
        },
       
    ], //end columns
   

})