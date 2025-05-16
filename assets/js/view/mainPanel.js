
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
            title: 'Purchase Order',
            store: 'poStore', // Your store
            id:'poGrid',
            border:true,
            //width: 300,
            height:'100%',
            //autoHeight:true,
             //collapsible: true //dont collapse group header
            flex:1,
            split: true,
            
            features: [{
                id: 'group',
                ftype: 'groupingsummary',
                groupHeaderTpl: `<span class=xgrpheader>PO# {name}</span>`,
                //groupHeaderTpl: new Ext.XTemplate('<tpl for=".">', '<input type="button" value={name}></div>', '</tpl>'),
                hideGroupedHeader: true,
                enableGroupingMenu: false,
                collapsible:false
            }],
            columns: [
                { 
                    text: '', 
                    dataIndex: 'po_number', 
                    width: 10,
                    menuDisabled:true,
                    sortable:false,
                    hideable: false,
                    dataIndex: 'hub',
                  
                },
                { 
                    text: '&nbsp;', 
                    dataIndex: 'invoice_number', 
                    //width:260,
                    flex:1,
                    menuDisabled:true,
                    sortable:false,
                    resizable:false,
                    hideable: false,
                    tdCls:'wrap-cell',
                    renderer: function(value, meta, record) {
                        // console.log( 'hey',meta)
                         meta.tdCls='font10p'
                         return `
                            DATE : <b>${record.get('po_date')}</b><br>
                            INVOICE : <b>${value} </b><br>
                            EQPT NO : <b>${record.get('eqpt_no')} </b><br>
                            TYPE : <b>${record.get('type')}</b><br>
                            DESCRIPTION : <b>${record.get('description')} </b><br>
                            TRANSACTION : <b>${record.get('transaction')}</b><br>
                            CLIENT : <b>${record.get('client')}</b><br>
                            COMPANY  : <b>${record.get('company')}</b><br><br>
                            <button onclick="javascript:Ext.getCmp('poGrid').makesure('${util.getCookie('approver_type')}','${record.get('po_number')}','${value}')" class='btn btn-md btn-primary mt-1 mb-1'><i class='ti ti-circle-check'></i>&nbsp;Approve</button>
                              `
                            //<button onclick="javascript:Ext.getCmp('poGrid').makesure('${util.getCookie('approver_type')}','${record.get('po_number')}')" class='btn btn-md btn-primary mt-1 mb-1'><i class='ti ti-circle-check'></i>&nbsp;Approve</button>
                              
                            // "javascript:dash.showApprover(
                            //             '${util.getCookie('approver_type')}',
                            //             '${data.result[key].po_number}')"
                    }

                },
                {
                    text:'Qty.',
                    dataIndex: 'qty',
                    width:50,
                    menuDisabled:true,
                    sortable:false,
                    hideable: false,
                },
                { 
                    text: 'Amt', 
                    dataIndex: 'total', 
                    width:110,
                    menuDisabled:true,
                    sortable:false,
                    hideable: false,
                    renderer: (value,meta,record)=>{
                        meta.tdCls='font11p'
                        return util.addCommas(value.toFixed(2))
                    },
                },
                
                {
                    text:'Rcpt',
                    xtype: 'templatecolumn',
                    //dataIndex:'avatarurl',
                    width:100,
                    tpl:`<img onclick="javascript:dash.showImage(this.src)" class='ximg' src="{avatarurl}" width="50" height="50" style="">`                               
                            
                },                    
            ],
            //viewconfig
            viewConfig: {
                stripeRows: true,
                loadingText:'Loading Please Wait!',
                emptyText:'No PO For Approval!!!',
    
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

                        console.log('PO grid viewready');

                        var imgs = Ext.DomQuery.select('img', Ext.getCmp('poGrid').getEl().dom);
    
                        Ext.each(imgs, function(img) {
                            Ext.get(img).on('error', function() {
                                // When an image fails to load, you can replace it or style it
                                Ext.get(img).setStyle({ opacity: 0.5, border: '2px solid red' });
                                // OR replace src with a placeholder
                                Ext.get(img).set({ src: '/no_image.png' });
                            });
                        });

                        Ext.getCmp('poGrid').getView().refresh();
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
                    console.log('poGrid SELECTION CHANGE FIRED======')
                    
                    if(records[0]){
                        var idx = this.getStore().indexOf(records[0]);
                        dash.selected_po = this.getStore().getAt(idx).get('po_number')
    
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
           
            showToast:false,

            //function
            makesure:(id,ponumber,sinumber)=>{

                if(Ext.getCmp('poGrid').showToast){
                    return false;
                }


                const butt1 = `<div><p class='text-center'>ARE YOU SURE YOU WANT TO APPROVE PO#<br>${ponumber}?<br><br /><button type='button' id='btnYes' class='btn btn-primary'>Yes</button>
                &nbsp;<button type='button' id='btnNo' class='btn btn-primary'>No</button></p></div>`
                
                Ext.getCmp('poGrid').showToast = true

                Toastify({
                    text: butt1,
                    duration:0,
                    close:false,
                    position:'center',
                    offset:{
                        x: 0,
                        y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                    },
                    escapeMarkup:false, //to create html
                    style: {
                        
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();

                $('#btnYes').on('click', function () {
                    
                    var xxx = document.querySelector('.toastify')
                    xxx.classList.add('hide-me')

                    console.log('**SAVING***',id,ponumber)
                    Ext.getCmp('poGrid').showToast = false

                    dash.equipmentApprove( ponumber,sinumber, id ) //dash obj.method approve
                });

                $('#btnNo').on('click', function () {
                    
                    var xxx = document.querySelector('.toastify')
                    xxx.classList.add('hide-me')
                    Ext.getCmp('poGrid').showToast = false
                    return false
                });

            }
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

    checkImage:(image)=>{
        return new Promise((resolve, reject)=> {
        
           
                            
            //reject()
        
        })
    },

});