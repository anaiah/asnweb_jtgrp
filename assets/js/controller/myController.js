Ext.define('MyApp.controller.myController', {
    extend: 'Ext.app.Controller',

    init: function() {
        // initialization code
        //this.loadChartData()

    },

    loadChartData:()=>{

    },

    //== load po store / grid
    loadPo:(ydata)=>{
        console.log('after getpo, loadPO',ydata.length)
        if(ydata) { // if data  not null
            //====LOAD PO FOR APPROVAL====
            const storeInstance = Ext.data.StoreManager.lookup('poStore')
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