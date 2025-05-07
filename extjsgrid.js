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


var grid
Ext.onReady(function(){
    
    Ext.tip.QuickTipManager.init();

    var store = Ext.create('Ext.data.Store', {
        model: 'Task',         
        storeId:'hubStore',
        groupField: 'location',
        //autoLoad: false,
        
        proxy: {
            // load using HTTP
            type: 'ajax',
            url: `http://192.168.5.221:10000/coor/summary`,
            // the return will be json, so lets set up a reader
            reader: {
                type: 'json'
            }
        },
    })
    store.load()

    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });

    


    var showSummary = true;
    grid = Ext.create('Ext.grid.Panel', {
        width: 800,
        height: 450,
        frame: true,
        title: `<i class="ti ti-user-plus" style="left:0px;font-color:red;font-size:25px;"></i>&nbsp;&nbsp;Summary Per Location`,
        iconCls: 'icon-grid',
        renderTo: 'grid_month',
        store: Ext.data.StoreManager.lookup('hubStore'),
        //plugins: [cellEditing],  /* takeout editing */

        viewConfig: {
            stripeRows: true,
            loadingText:'Loading Please Wait!',
            emptyText:'No Records Found!!!',
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
       ]//endcolumn


    });

    var summaryRow = grid.getView().getFeature(0); 

    styleObj = {
        // 'background-color': '#c4f185'  
    };
    //summaryRow.view.el.setStyle(styleObj);

});
