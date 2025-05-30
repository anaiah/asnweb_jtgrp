
Ext.define('MyApp.view.mainPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainpanel',
    id:'mainPanel',
    // layout: {
    //     type: 'border',
    //     align: 'stretch'
    // },
    layout:'hbox',
    frame:true,
    border:true,
    //renderTo:'grid_month',
    items: [
        {
            region: 'west',
            xtype: 'grid',
            title: 'Current Month Transaction',
            store: 'monthlyStore', // Your store
            id:'monthlyGrid',
            border:true,
            //width: 300,
            height:'100%',
            //autoHeight:true,
             //collapsible: true //dont collapse group header
            flex:1,
            split: true,

            bbar: [
                {
                    xtype: 'button',
                    text: '<i class="ti ti-player-skip-back-filled"></i>&nbsp;Previous',
                    handler: function() {
                        if ( asn.currentPage > 1) {
                            asn.ctrlExt.loadPage( asn.currentPage - 1);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: 'Next&nbsp;<i class="ti ti-player-skip-forward-filled"></i>&nbsp;',
                    handler: function() {
                        if (( asn.currentPage * asn.pageSize) < asn.allData.length) {
                           asn.ctrlExt.loadPage( asn.currentPage + 1);
                        }
                    }
                },
                // Optional display of current page info
                {
                    xtype: 'tbtext',
                    id: 'pageInfo',
                    text: 'Page 1'
                }
            ],
                        
            // features: [{
            //     id: 'group',
            //     ftype: 'groupingsummary',
            //     groupHeaderTpl: `<span class=xgrpheader>PO# {name}</span>`,
            //     //groupHeaderTpl: new Ext.XTemplate('<tpl for=".">', '<input type="button" value={name}></div>', '</tpl>'),
            //     hideGroupedHeader: true,
            //     enableGroupingMenu: false,
            //     collapsible:false
            // }],

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
                        meta.tdCls='font11p'
                        return util.addCommas(value)
                    },
                    summaryType:'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        //console.log(dataIndex)
                        return '<div style="font-weight:bold; color:red;">' + util.addCommas(value) + '</div>';
                    }
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
                        meta.tdCls='font11p'
                        return util.addCommas(value)
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
                        meta.tdCls='font11p'
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
                    //renderer: Ext.util.Format.usMoney,
                    //summaryRenderer: Ext.util.Format.usMoney,
                    dataIndex: 'amount_remitted',
                    align:'right',
                    renderer: (value,meta,record)=>{
                        meta.tdCls='font11p'
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
                stripeRows: true,
                loadingText:'Loading Please Wait!',
                emptyText:'No location Transaction!!!',
    
                //apply row css
                getRowClass: function(record) { 

                    if(record.get('')){
                        //return "row-class shadow"
                    }else{

                    }
                    //return record.get('clone') =="1" ? 'clone-row' : null; 
                }, 

                listeners: {
                    viewready: (view)=> {

                        console.log('rider grid viewready');

                        // var imgs = Ext.DomQuery.select('img', Ext.getCmp('poGrid').getEl().dom);
    
                        // Ext.each(imgs, function(img) {
                        //     Ext.get(img).on('error', function() {
                        //         // When an image fails to load, you can replace it or style it
                        //         Ext.get(img).setStyle({ opacity: 0.5, border: '2px solid red' });
                        //         // OR replace src with a placeholder
                        //         Ext.get(img).set({ src: '/no_image.png' });
                        //     });
                        // });

                        //Ext.getCmp('poGrid').getView().refresh();

                        // xgrid = Ext.getCmp('poGrid')

                        // // set height via CSS class (more reliable)
                        // var toolbarEl = xgrid.down('toolbar').getEl();
                        
                        // toolbarEl.setStyle('height', '50px');
                        // // also adjust line-height
                        // toolbarEl.setStyle('line-height', '50px');
                        // toolbarEl.setStyle('top', '330px');
                                          
                        
                        /*                           
                        store.sort([
                            { property: 'qty_pct', direction: 'DESC' },
                           
                            { property: 'location', direction: 'ASC' },
                            { property: 'hub', direction: 'ASC' },
                            
                        ]);
                        */
                        //load the store now
                        //store.load()
    
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
                    console.log('monnthlyGrid SELECTION CHANGE FIRED======')
                    
                    if(records[0]){
                        var idx = this.getStore().indexOf(records[0]);
                        //dash.selected_po = this.getStore().getAt(idx).get('po_number')
    
                        // rider_store.removeAll();
    
                        // // To change the URL dynamically
                        // var proxy = rider_store.getProxy();
                        // proxy.url =  `${myIp}/coor/ridersummary/${hub_search}`;
    
                        // // or use `sorters` array directly
                        // //rider_store.sort('delivered_pct', 'DESC');          
                        
                        
                        // // If you need to reload data from the new URL
                        // //store.sort('yourField', 'ASC'); // set the sorting
                        // rider_store.load({
                        //     callback: function() {
                        //         // After loading, refresh the view
                        //         Ext.getCmp('rider-grid').getView().refresh();
                        //     }
                        // });
              
                        // console.log( this.getStore().getAt(idx).get('hub') )
    
                    }//eif
                    
                }//end selectionchange
                
            },
           
            
           
        },//take  out east grid for now

      
        // {
        //     region: 'east',
        //     xtype: 'grid',
        //     title: 'Client',
        //     store: '', // Your other store
        //     border:true,
        //     height:'100%',
        //     columns: [
        //         { text: 'Code', dataIndex: 'code', width: 100 },
        //         { text: 'Description', dataIndex: 'desc', flex: 1 }
        //     ],
        //     width: 300,
        //     //split: true,
        //     //collapsible: true
        // }
    ], //end items

    
});