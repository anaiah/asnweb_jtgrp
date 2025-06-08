    Ext.define('MyApp.view.MyWindow', {
        extend: 'Ext.window.Window',
        alias: 'widget.mywindow',
        id:'mywindow',
        title: 'ADD USER',
        width: 400,
        height: 400,
        resizable:false,
        modal:true,
        //html: 'Hello World',
        autoShow: true,
        requires: [
            'Ext.form.Panel'
        ],

        initComponent: function() {
            var me = this;
            // var myIp = 'http://192.168.62.221:10000'; // Keep your URL if needed

            //apply
            Ext.applyIf(me, {
                items:[
                    {
                        xtype:'form',
                        bodyPadding: 10,
                        defaults: {
                            labelAlign: 'right',    // labels align to right
                            labelWidth: 80,         // fixed label width
                            labelPad: 5,            // space between label and field
                            width: 350              // wider input fields
                        },
                        items: [
                            // Add simpler form fields here if needed
                            // {
                            //     xtype: 'textfield',
                            //     fieldLabel: 'Sample Text',
                            //     name: 'sample',
                            //     allowBlank: false
                            // },
                            {
                                xtype: 'combobox',
                                fieldLabel: 'Location',
                                name: 'location',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['id', 'location'],
                                    //data: []
                                }),
                                displayField: 'location',
                                valueField: 'id',
                                queryMode: 'local',
                                listeners: {
                                    select: me.onLocationSelect,
                                    scope: me
                                }
                            },
                            
                            {
                                xtype: 'combobox',
                                fieldLabel: 'Hub',
                                name: 'hub',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['id', 'hub']    
                                }),
                                displayField: 'hub',
                                valueField: 'hub',
                                queryMode: 'local',
                                listeners: {
                                    //select: me.onHubSelect,
                                    scope: me
                                }
                            },
                            // {
                            //     xtype: 'combobox',
                            //     fieldLabel: 'User',
                            //     name: 'user',
                            //     store: Ext.create('Ext.data.Store', {
                            //         fields: ['id', 'full_name'],
                            //         data: [{id: 1, name: 'Test'}, {id: 2, name: 'Sample'}]
                            //     }),
                            //     displayField: 'full_name',
                            //     valueField: 'id',
                            //     queryMode: 'local'
                            // }
                            // New TextField: Name (required)
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Name',
                                name: 'name',
                                allowBlank: false, // required
                                blankText: 'Name is required'
                            },
                            // New TextField: Email (required, email validation)
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Email',
                                name: 'email',
                                allowBlank: false,
                                blankText: 'Email is required',
                                vtype: 'email', // built-in email validation
                                vtypeText: 'Must be a valid email address',
                                listeners: {
                                    blur: function(field) {
                                        field.setValue(field.getValue().toLowerCase());
                                    }
                                }
                            }
                            // you can add more fields here
                        ],//end item forms
                        buttons: [
                            {
                                text: 'Save',
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        // Example submit, adapt URL as needed
                                        form.submit({
                                            url: `${myIp}/coor/adduser`,

                                            success: function(form, action) {
                                                Ext.Msg.alert('Success', action.result.msg);
                                            },
                                            failure: function(form, action) {
                                                Ext.Msg.alert('Failed', action.result ? action.result.msg : 'Error');
                                            }
                                        });
                                    }
                                }
                            }
                        ]//end buttons

                    }//end form

                ]//end items
            });

            me.callParent(arguments)

            //load all locations first
            me.on('afterrender', me.loadLocationData, me, { single: true });

        },//END INITCOMPONENT
    
        //==add the methods
        loadLocationData: function() {
       //     var myIp = 'http://192.168.62.221:10000'; // Keep your URL if needed

            console.log('loading locations==')
            var me = this;
            Ext.Ajax.request({
                //autoLoad:false,
                url: `${myIp}/coor/getlocation/${util.getCookie('f_email')}`,
                success: function(response) {
                    var data = Ext.decode(response.responseText);
                   
                    console.log('location data',data)
                   
                    me.down('combobox[name=location]').getStore().loadData(data);
                    me.down('combobox[name=hub]').setValue(null);
                   
                },
                failure: function() {
                    Ext.Msg.alert('Error', 'Failed to load locations.');
                }
            });
        },
        
        
        onLocationSelect: function(combo, records) {
            var me = this;
            var locationName= records[0].get('location').toLowerCase();
            Ext.Ajax.request({
                //autoLoad:false,
                url: `${myIp}/coor/gethub/${locationName}/${util.getCookie('f_email')}`,
            
                success: function(response) {
                    var data = Ext.decode(response.responseText);
                    console.log('location is ',data)

                    me.down('combobox[name=hub]').getStore().loadData(data);
                    me.down('combobox[name=hub]').setValue(null);
                    //me.down('combobox[name=user]').getStore().loadData([]);
                },
                failure: function() {
                    Ext.Msg.alert('Error', 'Failed to load hubs.');
                }
            });
        },

         onHubSelect: function(combo, records) {
            var me = this;
            var hubId = records[0].get('id');
            Ext.Ajax.request({
                autoLoad:false,
                url: `${myIp}/toolshub/hubId`,
                success: function(response) {
                    var data = Ext.decode(response.responseText);
                    me.down('combobox[name=user]').getStore().loadData(data);
                    me.down('combobox[name=user]').setValue(null);
                },
                failure: function() {
                    Ext.Msg.alert('Error', 'Failed to load users.');
                }
            });
        }
    });//================END WINDOWS COMPONENT ========================//

