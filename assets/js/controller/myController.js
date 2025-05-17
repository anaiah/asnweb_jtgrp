Ext.define('MyApp.controller.myController', {
    extend: 'Ext.app.Controller',

    init: function() {
        // initialization code
        //this.loadChartData()

    },

    loadChartData:()=>{

    },

    loadPage: (page)=> {

        var start = (page - 1) * asn.pageSize;
        var end = start + asn.pageSize;
        var pageData = asn.allData.slice(start, end);
        
        asn.ctrlExt.sendData( pageData );

        asn.ctrlExt.updatePageInfo() //refresh

        asn.currentPage = page;
    
        // Optionally update UI components (like a paging toolbar)
        // and disable/enable buttons based on page
        // For example:
        // Ext.getCmp('prevBtn').setDisabled(page === 1);
        // Ext.getCmp('nextBtn').setDisabled(end >= allData.length);
    },

    updatePageInfo:()=> {
        var start = ( asn.currentPage - 1) * asn.pageSize + 1;
        var end = Math.min(asn.currentPage * asn.pageSize, asn.allData.length);
        Ext.getCmp('pageInfo').setText('Showing ' + start + ' - ' + end + ' of ' + asn.allData.length);
    },

    //== load po store / grid
    sendData:(ydata)=>{
        console.log('myController.js===== after getpo, loadPO',ydata.length)

        if(ydata) { // if data  not null
            //====LOAD PO FOR APPROVAL====
            const storeInstance = Ext.data.StoreManager.lookup('monthlyStore')
            //storeInstance.removeAll();

            storeInstance.loadData(ydata ) //load ARRAY OF DATA
            
            
            if (storeInstance) {
                // Get an array of all records
                var records = storeInstance.getRange();

                // Loop through records
                Ext.each(records, function(record) {
                    //console.log('tutssa',record.get('po_number'), record.get('invoice_number'));
                });

            } else{
                console.log('boge')
            }//eif
            
        }//eif poData is not null
    },

    // Your custom function
    checkImage:(imageSrc)=> {
        return new Promise((resolve, reject)=> {
        
        const img = new Image();
        let result

        img.onload = () => {
            result = true; // Image loaded successfully
        };
      
        img.onerror = () => {
            result = false; // Image failed to load
        };

        img.src = imageSrc;
        
        resolve(result)

        })
    },
      
});