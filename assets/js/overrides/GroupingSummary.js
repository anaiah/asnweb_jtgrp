 // Ext.Loader.setConfig(...);  // If you have Ext.Loader config, it goes BEFORE this
Ext.define('MyApp.overrides.GroupingSummary', {
    override: 'Ext.grid.feature.GroupingSummary',
    init: function() {
        console.log('MyApp.overrides.GroupingSummary is being applied!');
        this.callParent(arguments);
    },
    generateSummaryData: function(groupName, records, generateEmpty) {
        console.log('generateSummaryData called for group:', groupName);
        console.log('Records:', records);
        var summary = this.callParent(arguments);
        console.log('Summary:', summary);
        return summary;
    }
});