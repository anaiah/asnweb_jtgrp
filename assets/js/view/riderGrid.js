Ext.define('MyApp.view.riderGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.riderGrid',
	
	//static member
	statics:{
		myTitle:''
	},

    //title : 'testList',
	columnLines:true,
    renderTo:'rider_grid',
    
    title: 'Rider Info',
    id:    'riderGrid',
    flex: 1,
    frame:true,
    
    height:200,
    width:500
    ,
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
            renderer: function(value, meta, record) {
               // console.log( 'hey',meta)
                meta.tdCls='font10p'
                return `<i class="ti ti-user-filled"></i>&nbsp;${value} <br>(${record.get('transactions')} Day(s))`
                //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                //return value;
            }
        },
        {
            header: 'Delivery',
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
    ],//end columns 

})