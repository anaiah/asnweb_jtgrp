document.addEventListener('click', (e) => {
    switch (e.target.id) {
        case 'start-btn':
            console.log('uy start-btn clicked');
            riderobj.saveParcel('start-btn');

            break;

    }
}, true); // Use capture to ensure it catches the event

// Global event interceptor to disable ALL keyboard inputs while loading



const riderobj = {
    saveParcel: (savebtn) => {

        const saveBtn = document.getElementById(savebtn);

        const overlay = document.getElementById('loadingOverlay');
        console.log('firing riderobj.saveParcel()')

         // 1. Show the gray blocking overlay module layout
        overlay.style.display = 'flex';
        
        // 2. Lock down the computer/phone physical keyboard inputs entirely
        window.addEventListener('keydown', util.blockKeyboard, true);
        window.addEventListener('keypress', util.blockKeyboard, true);
        
        // 3. Fire your existing Node.js database submission script down here...
        // Example: await fetch('/api/save-parcel', { ... });
        riderobj.saveToLogin(`${myIp}/savetologin/${util.getCookie('f_id')}`)
    },

    saveToLogin:async(url="")=>{

            console.log('firing asn.saveToLogin() main.js  called from util.js validateMe(#dataentryform) =====', asn.saveobjfrm)
                        
            if (asn.currentAudio) {
                asn.currentAudio.pause();
                asn.currentAudio.currentTime = 0; // Reset to the beginning
            }

            // Your existing data entry form logic
            const formElement = document.getElementById('remittanceForm');
            const dataEntryFormData = new FormData(formElement);
            let dataEntryObjfrm = {};
            
            for (var key of dataEntryFormData.keys()) {
                dataEntryObjfrm[key] = dataEntryFormData.get(key);
            }

            dataEntryObjfrm.login_date = util.nugetDate(); 
            dataEntryObjfrm.transnumber = document.getElementById('f_transnumber').value;
                                
            const dbx = JSON.parse( db.getItem('profile'));
            
            dataEntryObjfrm.region = dbx.region;
            dataEntryObjfrm.besi_id = dbx.besi_id;
            
            asn.saveobjfrm = dataEntryObjfrm

            let newdb = asn.db.getItem('myCart')

            if(!newdb){ //FIRST DATA ENTRY

                const url = `${myIp}/savetologin/${util.getCookie('f_id')}`
                
                //=== save as login
                await fetch(url,{
                    method:'POST',
                    cache:'reload',
                    headers: {
                        "Content-Type": "application/json",
                    },
                
                    body: JSON.stringify( asn.saveobjfrm )
                })
                .then((response) => {  //promise... then 
                    return response.json();
                })
                .then( (data) => {
                    
                    if(data.success !== "ok"){
            
                        util.speak(data.msg)
                        
                        asn.db.removeItem('myCart')

                        util.hideModal('dataEntryModal',2000)    
                        util.toggleButtonLoading("start-btn", null, false);

                        return
                    }
                    
                    console.log('saving data...', asn.saveobjfrm)

                    //set mycart localstorage
                    asn.db.setItem('myCart', JSON.stringify(asn.saveobjfrm))
            
                    const mydata = data.data
                    console.log('***%%%%%%%%%% FROM NODEJS SAVELOGIN() TRIGGER SOCKET EMIT*****', mydata)

                    util.toggleButtonLoading("start-btn", null, false);

                    asn.socket.emit('sendtoOpMgr', mydata)

                    util.speak('Local Storage Saved!!!') //speak
                    util.Toasted('Local Storage Saved!!!',3000,false)//alert
                    
                    util.hideLoadingandUnlock() //hide overlay and unlock keyboard

                    util.hideModal('dataEntryModal',2000)    
                    
                    setTimeout(() => {
                        asn.logout()
                    }, 2000);

                })    
                .catch((error) => {
                    alert(`Error:, ${error}`)
                    //util.speak()
                    console.error('Error:', error)
                    util.toggleButtonLoading("start-btn", null, false);

                }) .finally(()=>{
                    //util.hideLoadingandUnlock() //hide overlay and unlock keyboard
                })  
            
            //2ND DATA ENTRY
            }else{ //===if with prev record get prev rec and add

                let finaldb = JSON.parse( newdb ) //get all value of old local storage

                finaldb.f_parcel = parseInt(finaldb.f_parcel) + parseInt( xdata.f_parcel)
                //finaldb.f_amount = parseFloat(finaldb.f_amount) + parseFloat( objfrm.f_amount)

                asn.db.setItem('myCart', JSON.stringify(finaldb))

                //util.toggleButton('start-btn',false)
                util.toggleButtonLoading("start-btn", null, false);
            }
            
            // const badge = document.getElementById('bell-badge')
            // badge.innerHTML = 'With Entry'

            
                
    },

    //====rider  save transaction / save remittance
    saveTransaction:async function(url="",xdata={}){

        util.speak('Saving Transaction to Database, Please Wait!!!')
                                    
        await fetch(url,{
            method:'POST',
            cache:'reload',
            headers: {
                "Content-Type": "application/json",
            },
            
            body: JSON.stringify(xdata)
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then( (data) => {

            const xdata = data.data
            console.log('***%%%%%%%%%% FROM NODEJS SAVETRANSACTION() TRIGGER SOCKET EMIT *****', xdata)
            
            
            if(data.success=="ok")
                {
                console.log( '+++++ saveTransaction()++++')

                dbx = JSON.parse( asn.db.getItem('profile'));
                    
                const xregion = dbx.region;
                const xbesi_id = dbx.besi_id;

                //change form action for posting the Image receipt
                document.getElementById('remittanceUploadForm').action=`${myIp}/postimage/${document.getElementById('ff_transnumber').value}/${xregion}`

                xmsg = "<i class='fa fa-spinner fa-pulse' ></i>  Uploading Receipt, please wait!!!"
                util.Toasted( xmsg, 3000, false)
                
                //util.speak("Transaction Saved");

                //everytime save notify opmgr
                asn.socket.emit('sendtoOpMgr', xdata)

                asn.db.removeItem('myCart') //delete myCart in localDB after final remittance
                
                //===update also chart and monthly performance card
                asn.piedata.length = 0  //reset

                asn.getMonthlyTransaction(util.getCookie('f_id'))

                //===== click submit button of Upload Form === listened in **listen.js***
                const remuploadbtn = document.getElementById('remittance_upload_btn')
                remuploadbtn.click()

            }else{
                util.speak('DATABASE ERROR! PLEASE CHECK!')
            }

            //util.toggleButton('remittance-btn',false)
            util.toggleButtonLoading('remittance-btn',null,false)
           
        })  
        .catch((error) => {
            util.Toasted(`Error:, ${error}`,2000,false)
            console.error('Error:', error)
        })    
    }
}
    