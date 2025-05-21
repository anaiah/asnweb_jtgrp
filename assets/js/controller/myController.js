Ext.define('MyApp.controller.myController', {
    extend: 'Ext.app.Controller',

    init: function() {
        // initialization code
        //this.loadChartData()

    },

    //===========GETMENU==========
    getmenu: async(grp_id) =>{
        console.log('=====FIRING ggetmenu()==========')
        await fetch(`${myIp}/menu/${grp_id}`,{
            cache:'reload'
        })
        .then( (res)  => res.json() )
        .then( (data) => {	

            var xdata = []
            
            xdata.push(data)
            console.log(xdata)
            
            const ul = document.getElementById('sidebarnav'); // Get the <ul> or <ol>

            //remove all elements of UL
            while (ul.firstChild) {
              ul.removeChild(ul.firstChild);
            }
              
            xdata[0].forEach(info => {  
              
                const li = document.createElement('li'); // Create a new <li>
                li.classList.add("nav-small-cap")

                const ii =  document.createElement('i')
                ii.classList.add("fs-10")
                
                li.appendChild( ii )

                const span =  document.createElement('span')
                span.textContent = info.menu
                span.classList.add('hide-menu')  
                //span.appendChild(ii)
                
                li.appendChild(span)

                ul.appendChild(li); // Append the <li> to the list
              
                //var subdata = JSON.parse(info.list)
                //console.log( info )
                var aList = []
                // //loop submenu
                aList.push( JSON.parse(info.list) )
                console.log( "yo", info.list  )
                    
                aList[0].forEach(xmenu => {  
                    // //=================== submenu
                    const li2 = document.createElement('li'); // Create a new <li>
                    li2.classList.add("sidebar-item")
                    
                    const span1 =  document.createElement('span')
                    const i2 =  document.createElement('i')
                    i2.classList.add("ti",`${xmenu.icon}`)
                    span1.appendChild(i2)

                    const span2 =  document.createElement('span')
                    span2.classList.add('hide-menu')  
                    span2.textContent = `${xmenu.sub}`

                    const aa = document.createElement('a'); // Create a new <li>
                    aa.classList.add("sidebar-link")

                    aa.appendChild(  span1 )
                    aa.appendChild(  span2 )

                    aa.href = xmenu.href
                    
                    li2.appendChild(aa)
                    
                    ul.appendChild(li2); // Append the <li> to the list                    
            
                })//===end subdata
    
            })//end foreach

            asn.collapz()//invoke one time
            

            return true;
            
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },
    //==========END  GETMENU
    
    
    loadPage: (page)=> {

        var start = (page - 1) * asn.pageSize;
        var end = start + asn.pageSize;
        var pageData = asn.allData.slice(start, end);
        
        asn.ctrlExt.sendData( pageData );
        
        asn.currentPage = page;

        asn.ctrlExt.updatePageInfo() //refresh

        console.log('==current page==', asn.currentPage)
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
            
            //asn.ctrlExt.updatePageInfo()

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