let remitupload = document.getElementById('remittanceUploadForm')

util.speak('Uploading Image, please wait!!!')

remitupload.addEventListener("submit", e => {
    const formx = e.target;

    fetch(`${myIp}/postimage`, {
        method: 'POST',
        body: new FormData(formx),
        })
        .then( (response) => {
            return response.json() // if the response is a JSON object
        })
        .then( (data) =>{
            if(data.status){
                //console.log ('uploadpdf() value=> ', data )
                //console.log('*****TAPOS NA PO IMAGE POST*****')
                util.speak('Receipt Image successfully uploaded!!!')
                util.Toasted(`Receipt Image successfully uploaded!!!`,3000,false)

                util.hideModal('remittanceModal',2000)//then close form    
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