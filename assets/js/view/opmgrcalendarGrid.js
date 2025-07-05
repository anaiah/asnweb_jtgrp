Ext.define('MyApp.view.opmgrcalendarGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.opmgrcalendargrid',
    id: 'opmgrcalendarGrid',
    title:'&nbsp;',

    //store: Ext.data.StoreManager.lookup('opmgrcalendarStore'), // your storeId
    store: 'opmgrcalendarStore',

    //width: 500,
    //height: 300,
    cls: 'centered-headers-grid',

    features: [{
        ftype: 'summary',
        dock: 'bottom' // position at the bottom
    }],

    columns: [
        { 
            text: 'Date', 
            dataIndex: 'Dates', 
            width: 100,
            menuDisabled:true,
            sortable:false,
            hideable: false,
            renderer: (value,meta,record)=>{
                meta.tdCls='font11p'
                return util.addCommas(value)
            },
          
        },
        {
            text:'Qty.',
            dataIndex: 'parcel',
            width:70,
            menuDisabled:true,
            sortable:false,
            hideable: false,
            align:'right',
            renderer: (value,meta,record)=>{
                //meta.tdCls='font11p'
                
                return (parseInt(value)>0,`<b>${util.addCommas(value)}</b>`,util.addCommas(value))
            },
            summaryType:'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                //console.log(dataIndex)
                return '<div style="font-weight:bold; color:red;">' + util.addCommas(value) + '</div>';
            }
            //to get other column in summaryRenderer
            // Access another column's summary value
            // `var otherColumnValue = summaryData.data['otherColumnDataIndex'];

            // // Use otherColumnValue in your formatting
            // return '<div style="font-weight:bold; color:red;">' +
            // util.addCommas(value) + ' (Other: ' + otherColumnValue + ')' +
            // '</div>';`
        },
        {
            text:'Delivered',
            dataIndex: 'delivered',
            width:80,
            menuDisabled:true,
            sortable:false,
            hideable: false,
            align:'right',
            renderer: (value,meta,record)=>{
                //meta.tdCls='font11p'
                eturn (parseInt(value)>0,`<b>${util.addCommas(value)}</b>`,util.addCommas(value))
            },
            summaryType:'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                //console.log(dataIndex)
                return '<div style="font-weight:bold; color:red;">' + util.addCommas(value) + '</div>';
            }
        },
       
       
        { 
            text: 'Amt', 
            dataIndex: 'total_amount', 
            width:130,
            menuDisabled:true,
            sortable:false,
            hideable: false,
            align:'right',
            renderer: (value,meta,record)=>{
                //meta.tdCls='font11p'
                return util.addCommas(value.toFixed(2))
            },
            summaryType:'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                //console.log(dataIndex)
                return '<div style="font-weight:bold; color:red;">' + util.addCommas(value.toFixed(2)) + '&nbsp;&nbsp;&nbsp;</div>';
            }
        },
        {
            text: 'Remitted',
            width: 130,
            sortable: false,
            menuDisabled:true,
            dataIndex: 'amount_remitted',
            align:'right',
            renderer: (value,meta,record)=>{
                //meta.tdCls='font11p'
                return util.addCommas(value.toFixed(2))
            },
            summaryType:'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                //console.log(dataIndex)
                return '<div style="font-weight:bold; color:red;">' + util.addCommas(value.toFixed(2)) + '&nbsp;&nbsp;&nbsp;</div>';
            }
        },
    ],
    //viewconfig
    viewConfig: {
        scope:this,
        stripeRows: true,
        loadingText:'Loading Please Wait!',
        emptyText:'No Attendance!!!',

        //apply row css
        getRowClass: function(record, rowIndex, rowParams, store) {
            if (record.get('total_amount') > 0) {
                return "with-work";                
            }

        }, 

        listeners: {
            viewready: (view)=> {

                console.log('Calendar grid viewready');

            }//end viewready
        }//end listeners viewconfig
    },    
    
    //listener
    listeners:{
        afterrender: function(grid) {
            //this is the place to check all the DOMS
            //esp checkingbroken img
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
            console.log('calendarGrid RowClicked SELECTION CHANGE FIRED======')
            
            
        }//end selectionchange
        
    },
   
    
   
})//take  out east grid for now
