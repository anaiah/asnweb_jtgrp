let remitupload = document.getElementById('remittanceUploadForm')

remitupload.addEventListener("submit", e => {
    const formx = e.target;

    util.speak('Uploading Image, please wait!!!')
    const dbx = JSON.parse( db.getItem('profile'));
                    
    const region  = dbx.region;
    //util.toggleButtonLoading
    util.toggleButtonLoading('remittance-btn','Saving..',true)

    fetch(`${myIp}/postimage/${document.getElementById('ff_transnumber').value}/${region}`, {
        method: 'POST',
        body: new FormData(formx),
        })
        .then( (response) => {
            return response.json() // if the response is a JSON object
        })
        .then( (data) =>{
            if(data.status){
                util.Toasted(`Receipt Image successfully uploaded!!!`,3000,false)
                util.speak('Receipt Image successfully uploaded!!!')
                
                //reset form
                let xform = document.getElementById('remittanceUploadForm')
                xform.reset()
                
                util.resetFormClass('#remittanceUploadForm')

                //hide modal
                util.hideModal('remittanceModal',2000)//then close form

                util.toggleButtonLoading('remittance-btn',null,false)
                
                setTimeout(() => {
                    asn.logout()
                }, 3000);

            } //eif

        })
            // Handle the success response object
        .catch( (error) => {
            console.log(error) // Handle the error response object
            return false;
        });


    // Prevent the default form submit
    e.preventDefault();                   
})

