Ext.define('MyApp.view.opmgrGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.opmgrGrid',
	
	//static member
	statics:{
		myTitle:''
	},

    //title : 'testList',
	columnLines:true,
    region: 'center',
    //renderTo:'grid_month',
    
    id:'opmgrGrid',
    title: 'Region',
    autoHeight:true,
    //
    width:500,
    height:300,
    //height:'100%',
    //minWidth:300,
    //layout:'fit',
    store: Ext.data.StoreManager.lookup('opmgrStore'),

    border:true,
    frame:true,
    
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
                console.log('REGION grid viewready loading store');
                /*                           
                store.sort([
                    { property: 'qty_pct', direction: 'DESC' },
                   
                    { property: 'location', direction: 'ASC' },
                    { property: 'hub', direction: 'ASC' },
                    
                ]);
                */
                //load the store now
               
            }//end viewready
        }//end listeners viewconfig
    },    
    
        //selModel:{

            listeners:{
                afterrender: function(grid) {
                    this.getStore().load()
                    console.log('aferrender fired this.getSTore().oad()')

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
                      //console.log( record.get("location"))      
                },
                selectionchange: function(model, records ) {
        
                }//end selectionchange
                
            },//end listener

        //}, //end selmodel
    
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
            text: 'Area',
            //flex: 1,
            width:185,
            tdCls: 'task',
            //dont lock muna locked:true,
            menuDisabled:true,
            sortable:false,
            dataIndex: 'area',
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
            header: '',
            width: 180,
            sortable: false,
            menuDisabled:true,
            dataIndex: 'region',
            renderer: function(value, meta) {
                ///console.log( 'hey',meta)
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