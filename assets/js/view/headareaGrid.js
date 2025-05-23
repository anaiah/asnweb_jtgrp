Ext.define('MyApp.view.headareaGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.headareaGrid',
	
	//static member
	statics:{
		myTitle:''
	},

    //title : 'testList',
	columnLines:true,
    region: 'center',
    renderTo:'grid_month',
    cls: 'centered-headers-grid',

    id:'headareaGrid',
    title: 'Area',
    autoHeight:true,
    //
    width:500,
    height:300,
    //height:'100%',
    //minWidth:300,
    //layout:'fit',
    store: Ext.data.StoreManager.lookup('headareaStore'),

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
           // this.setLoading(`..searching`);

            if(records[0]){ 

                /*  BALIK MO ITO CARLO LATER HA?
                
                var idx = this.getStore().indexOf(records[0]);
                hub_search = this.getStore().getAt(idx).get('hub')
                
                
                console.log('hubsearch', hub_search)

                const riderstore = Ext.data.StoreManager.lookup('riderStore') 
                
                riderstore.removeAll()

                // To change the URL dynamically
                var proxy = riderstore.getProxy();
                proxy.url =  `${myIp}/coor/ridersummary/${hub_search}`;

                // or use `sorters` array directly
                //rider_store.sort('delivered_pct', 'DESC');          
                
                
                // If you need to reload data from the new URL
                //store.sort('yourField', 'ASC'); // set the sorting
                riderstore.load({
                    callback: function() {
                        // After loading, refresh the view
                        Ext.getCmp('riderGrid').getView().refresh();
                        
                    }
                });
                */
            }//EIF

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
            dataIndex: 'area',
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'left',       // Align the column values to the right
            headerAlign: 'center',
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
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'left',       // Align the column values to the right
            headerAlign: 'center',dataIndex: 'location',
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
                meta.tdCls = 'font7'

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
                meta.tdCls = 'font7'
                return util.addCommas(value.toFixed(2))
            },
            summaryRenderer:(value,summaryData,dataIndex)=>{
                return `<b>${util.addCommas(value.toFixed(2))}</b>`
            },
        },
       
    ], //end columns
   

})