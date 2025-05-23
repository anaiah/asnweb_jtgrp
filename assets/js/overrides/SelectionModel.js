Ext.define('MyApp.overrides.SelectionModel', {
    override: 'Ext.selection.Model',
    select: function(records, keepExisting, suppressEvent) {
        console.log('Ext.selection.Model.select called with:', records, keepExisting, suppressEvent);
        this.callParent(arguments); // Call the original method
    }
});