Ext.define('MyApp.view.riderGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.ridergrid',
    id:    'riderGrid',
   
	//static member
	statics:{
		myTitle:''
	},

    cls: 'centered-headers-grid',
   
    //title : 'testList',
	columnLines:true,
    
    title: 'Rider Info',

    store: 'riderStore',  //store.storeID
    //plugins: [cellEditing],  /* takeout editing */

    viewConfig: {
        stripeRows: true,
        loadingText:'Loading Please Wait!',
        emptyText:'No Records Found!!!',

        listeners: {
            viewready: function(grid) {
                console.log('@@@riders grid viewready');
                var store = grid.getStore();
                store.sort('qty', 'DESC'); // replace 'fieldName' with your actual field
            
            }//end viewready
        }//end listeners viewconfig
    },    

    listeners:{
        cellmousedown: function(view, cell, cellIdx, record, row, rowIdx, eOpts){
            //console.log( record.get("location"))      
        },
        selectionchange: function(model, records ) {
        }
    },

   
    columns: [
        {
            text:'Name',
            dataIndex:'full_name',
            width:250,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'left',       // Align the column values to the right
            headerAlign: 'center',
            resizable:false,
            renderer: function(value) {
                if (!value) return '';
        
                var parts = value.split(',');
                if (parts.length !== 2) return value;
        
                var lastName = parts[0].trim();
                var firstNames = parts[1].trim();
        
                return firstNames + ' ' + lastName;
            }
        },
        /*
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
        /*
        {
            header: 'Name',
            width: 180,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'left',       // Align the column values to the right
            headerAlign: 'center',
            dataIndex: 'full_name',
            renderer: function(value, meta, record) {
               // console.log( 'hey',meta)
                meta.tdCls='font10p'
                return `<i class="ti ti-user-filled"></i>&nbsp;${value} <br>(${record.get('transactions')} Day(s))`
                //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                //return value;
            }
        },
        */
       {
            header: 'Parcel',
            width: 85,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'center',       // Align the column values to the right
            headerAlign: 'center',
            dataIndex: 'qty',
            sortable:false,
            //summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            },
            renderer: function(value, meta, record) {
                //meta.tdCls = 'font10g'
                
                //(parseInt(value) > 0 ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                if(parseInt(value)>0){
                    return `<b>${value}</b>`
                
                }else{
                    return value
                }
                //return value;
            }
        },
        {
            header: 'Delivery',
            width: 85,
            sortable:false,
            hideable:false,
            menuDisabled:true,
            align: 'center',       // Align the column values to the right
            headerAlign: 'center',
            dataIndex: 'delivered_pct',
            sortable:false,
            //summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            },
            renderer: function(value, meta, record) {
                //meta.tdCls = 'font10g'

                return `${value} %`
                //(value=="1" ? meta.tdCls += "uploaded" : meta.tdCls += "unuploaded");
                //return value;
            }
        },
        
    ],//end columns 

})