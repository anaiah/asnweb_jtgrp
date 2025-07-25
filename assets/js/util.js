/*
Author: Carlo Dominguez
1/31/2023

this is for utilities
modals,forms,utilities

*/ 
//const myIp = "https://asn-jtgrp-api.onrender.com" 
//const myIp = "http://192.168.62.221:10000"

const requirements = document.querySelectorAll(".requirements")
const specialChars = "!@#$%^&*()-_=+[{]}\\| :'\",<.>/?`~"
const numbers = "0123456789"

let db = window.localStorage

let oldpwd = document.querySelector(".p1")
let nupwd = document.querySelector(".p2")

let lengBoolean, bigLetterBoolean, numBoolean, specialCharBoolean 
let leng = document.querySelector(".leng") 
let bigLetter = document.querySelector(".big-letter") 
let num = document.querySelector(".num") 
let specialChar = document.querySelector(".special-char") 

//speech synthesis
const synth = window.speechSynthesis

let xloginmodal,
	xnewsitemodal,
    xequipmenttagmodal

let voices = []

//first init delete all localstorage
//db.clear()
	
const util = {
	
	scrollsTo:(cTarget)=>{
        //asn.collapz()
		const elem = document.getElementById(cTarget)
		elem.scrollIntoView(true,{ behavior: 'smooth', block:'start', inline:'nearest' });

	},

    //=========================START VOICE SYNTHESIS ===============
    getVoice: async () => {
            
        voices = synth.getVoices()
        console.log( 'GETVOICE()')
                
        voices.every(value => {
            if(value.name.indexOf("English")>-1){
                console.log( "bingo!-->",value.name, value.lang )
                
            }
        })
        
        
    },//end func getvoice

    //speak method
    speak:(theMsg)=> {
                        
        console.log("SPEAK()")
        
        // If the speech mode is on we dont want to load
        // another speech
        if(synth.speaking) {
            //alert('Already speaking....');
            return;
        }	

        const speakText = new SpeechSynthesisUtterance(theMsg);

        // When the speaking is ended this method is fired
        speakText.onend = e => {
            //console.log('Speaking is done!');
        };
        
        // When any error occurs this method is fired
        speakText.error = e=> {
            console.error('Error occurred...');
        };

        // Checking which voices has been chosen from the selection
        // and setting the voice to the chosen voice
        
        
        voices.forEach(voice => {
            if(voice.name.indexOf("English")>-1){	
                ///// take out bring back later, 
                //console.log("speaking voice is ",voice.name)
                speakText.voice = voice
                
            }
            
        });

        // Setting the rate and pitch of the voice
        speakText.rate = 1
        speakText.pitch = 1

        // Finally calling the speech function that enables speech
        synth.speak(speakText)


    },//end func speak	
    
    //=======================END VOICE SYNTHESIS==========

    //===================== MESSENGER=================
    alertMsg:(msg,type,xmodal)=>{

        //where? login or signup modal?
        const alertPlaceholder = document.getElementById(xmodal)

        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
          `<div class="alert alert-${type} alert-dismissible" role="alert">`,
          `   <div>${msg}</div>`,
          '</div>'
        ].join('')
      
        //new osndp
        alertPlaceholder.innerHTML=""
        alertPlaceholder.append(wrapper)
    },//=======alert msg
	/*
    Toast: (msg,nTimeOut)=> {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");
        x.innerHTML=msg

        // Add the "show" class to DIV
        x.className = "show";
    
        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ 
            x.className = x.className.replace("show", "hid"); 
        }, nTimeOut);
    },
    //===============END MESSENGER ===================
    */
    
    //==============FORM FUNCS ===========
    clearBox:function(){
        let reset_input_values = document.querySelectorAll("input[type=text]") 
        for (var i = 0; i < reset_input_values.length; i++) { //minus 1 dont include submit bttn
            reset_input_values[i].value = ''
        }
    },

    //remove all form class
    resetFormClass:(frm)=>{
        const forms = document.querySelectorAll(frm)
        const form = forms[0]
    
        Array.from(form.elements).forEach((input) => {
            input.classList.remove('was-validated')
            input.classList.remove('is-valid')
            input.classList.remove('is-invalid')
        })
    },

    
    //======post check / dep slip      
    imagePost: async(url)=>{

            console.log('*** FIRING IMAGEPOST() ****')
            //upload pic of tagged euqipment
            const myInput = document.getElementsByName('uploaded_file')[0]

            //console.log('myinput', myInput.files[0])
           
            const formData = new FormData();

            formData.append('file', myInput.files[0]);     
            myInput.files[0].name ='EOEXPERIMENT.pdf'


            console.log('imagePost() myinput', myInput.files[0])

            ////console.log(formData)
            // Later, perhaps in a form 'submit' handler or the input's 'change' handler:
            await fetch(url, {
            method: 'POST',
            body: formData,
            })
            .then( (response) => {
                return response.json() // if the response is a JSON object
            })
            .then( (data) =>{
                console.log('SUCCESS')
            })
             // Handle the success response object
            .catch( (error) => {
                console.log(error) // Handle the error response object
            });


    },
    //===tagging equipment for rent/sale
    equipmentTagPost: async (frm,modal,url="",xdata={}) =>{

        console.log(xdata)
        fetch(url,{
            method:'PUT',
            //cache:'no-cache',

            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(xdata)
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            
            console.log('=======speaking now====', data)
            util.speak(data.voice)        

            util.hideModal('equipmentTagModal',2000)    
            
            //send message to super users
            const sendmsg = {
                msg: data.approve_voice,
                type: data.transaction     
            }

            //remind super users
            osndp.socket.emit('admin', JSON.stringify(sendmsg))

            osndp.filterBy() //reload admin.getall()
            //location.href='/admin'
        
        })
        .catch((error) => {
           // util.Toast(`Error:, ${error}`,1000)
            //console.error('Error:', error)
        })
    },

    //===== for signup posting
    signupPost:async function(frm,modal,url="",xdata={}){
        
        let continue_email = true

        fetch(url,{
            method:'POST',
            //cache:'no-cache',

            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(xdata)
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            //
            if(data.status){
                continue_email=true
				
				//util.speak( data.message )
				
                util.alertMsg(data.message,'success','signupPlaceHolder')
                util.alertMsg("Mailing "+util.UCase(xdata.full_name),'info','signupPlaceHolder')
                
            }else{
				
				//util.speak(data.message)
                continue_email=false
                util.alertMsg(data.message,'warning','signupPlaceHolder')
                return false
            }//eif

        })
        .finally(() => {
            if(continue_email){
				//util.speak('Emailed Successfully!')
				
                util.signupMailer(`/signupmailer/${util.UCase(xdata.full_name)}/${xdata.email}/${encodeURIComponent(window.location.origin)}`)
            }//eif
        })
        .catch((error) => {
           // util.Toast(`Error:, ${error.message}`,1000)
           console.error('Error:', error)
        })
            
    },

    //===passwordcheck
    passwordCheck:(pwd,pAlert)=>{
        
        requirements.forEach((element) => element.classList.add("wrong")) 
        
        //on focus show alter
        pwd.addEventListener('focus',(e)=>{
            pAlert.classList.remove("d-none") 
            if (!pwd.classList.contains("is-valid")) {
                pwd.classList.add("is-invalid") 
            }
            console.log('util focus')
        },false)

        //if blur, hide alert
        pwd.addEventListener("blur", () => {
            pAlert.classList.add("d-none") 
        },false) 

        //as the user types.. pls check 
        pwd.addEventListener('input',(e)=>{
            if(nupwd.value!==""){
                if(nupwd.value!==pwd.value){
                    nupwd.classList.remove("is-valid")
                    nupwd.classList.add("is-invalid")
                }
            }
            util.pwdChecker(pwd,pAlert)
            
        },false)
    
    }, //end func

    pwdChecker:(password,passwordAlert)=>{
        //check length first
        let value = password.value 
        if (value.length < 6) {
            lenBool = false 
        } else if (value.length > 5) {
            lenBool = true 
        }
        
        if (value.toLowerCase() == value) {
            bigLetterBoolean = false 
        } else {
            bigLetterBoolean = true 
        }

        numBoolean = false 
        for (let i = 0;  i < value.length ; i++) {
            for (let j = 0;  j < numbers.length ; j++) {
                if (value[i] == numbers[j]) {
                    numBoolean = true 
                }
            }
        }

        specialCharBoolean = false 
        for (let i = 0 ; i < value.length;  i++) {
            for (let j = 0 ; j < specialChars.length ; j++) {
                if (value[i] == specialChars[j]) {
                    specialCharBoolean = true 
                }
            }
        }
        //conditions
        if (lenBool == true &&
            bigLetterBoolean == true && 
            numBoolean == true && 
            specialCharBoolean == true) {

            password.classList.remove("is-invalid") 
            password.classList.add("is-valid") 

            requirements.forEach((element) => {
                element.classList.remove("wrong") 
                element.classList.add("good") 
            }) 
            passwordAlert.classList.remove("alert-warning") 
            passwordAlert.classList.add("alert-success") 
    
        } else {
            password.classList.remove("is-valid") 
            password.classList.add("is-invalid") 

            passwordAlert.classList.add("alert-warning") 
            passwordAlert.classList.remove("alert-success") 

            if (lenBool == false) {
                leng.classList.add("wrong") 
                leng.classList.remove("good") 
            } else {
                leng.classList.add("good") 
                leng.classList.remove("wrong") 
            }

            if (bigLetterBoolean == false) {
                bigLetter.classList.add("wrong") 
                bigLetter.classList.remove("good") 
            } else {
                bigLetter.classList.add("good") 
                bigLetter.classList.remove("wrong") 
            }

            if (numBoolean == false) {
                num.classList.add("wrong") 
                num.classList.remove("good") 
            } else {
                num.classList.add("good") 
                num.classList.remove("wrong") 
            }

            if (specialCharBoolean == false) {
                specialChar.classList.add("wrong") 
                specialChar.classList.remove("good") 
            } else {
                specialChar.classList.add("good") 
                specialChar.classList.remove("wrong") 
            }                        
        }//eif lengbool
    },///======end func checker

    //==========field 2 password validator
    passwordFinal:(pwd)=>{
        //on focus show alter
        pwd.addEventListener('focus',(e)=>{
            if (!pwd.classList.contains("is-valid")) {
                pwd.classList.add("is-invalid") 
            }

        },false)

        //if blur, hide alert
        pwd.addEventListener("blur", () => {
            console.log('p2 blur')
        },false) 

        pwd.addEventListener("input", () => {
            if(pwd.value == oldpwd.value){
                pwd.classList.remove("is-invalid") 
                pwd.classList.add("is-valid") 
            }else{
                if(pwd.classList.contains("is-valid")){
                    pwd.classList.remove("is-valid") 
                    pwd.classList.add("is-invalid") 
                }
            }
        },false) 

    },///// ========end password field 2 checker

    //===============END FORMS ==========//

    //====================UTILITIES ==============
    UCase:function(element){
        return element.toUpperCase()
    },
    
    //===== addto cart
	xaddtocart:()=>{
				
		//db.clear()//clear shopcart
		let cart = util.checklogin()
		
		//console.log(cart)
		
		if(cart==""||cart==null){
			util.alertMsg('Please Sign up then Login before you purchase a domain.','warning','warningPlaceHolder')    
		}else{
			
			//if all is good add to cart
			//console.log('==UY LOGGED==== ', dns_existing, searched_dns)
			
			if(dns_existing===false){
				let orders = {
					domain: searched_dns,
					amount: 10,
					email : cart.email
				}
				//===add to cart domain
				let tebingOrder = db.setItem("tebinglane-order",JSON.stringify(orders))
				//show for pay
				util.modalShow('paymentmodal')
			}//Eif
			
			//
		}
		
		console.log('hey adding to cart')
	},

	//check first if logged
	checklogin:()=>{
		let tebingUser = db.getItem("tebinglane-user")
		return JSON.parse(tebingUser)
		
	},
    
	
	setCookie : (c_name,value,exdays) => {
		//console.log('bagong setcookie');
		var exdate=new Date();
		exdate.setDate(exdate.getDate());
		var c_value = value +  "; SameSite=Lax; expires="+exdate.toISOString()+ "; path=/";
		console.log( c_name + "=" + c_value	)
		document.cookie=c_name + "=" + c_value;	
	},//eo setcookie


	getCookie : (c_name) => {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++)
		  {
		  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		  x=x.replace(/^\s+|\s+$/g,"");
		  if (x==c_name)
			{
			return unescape(y);
			}
		  }
	},
	//==========================END UTILITIES =======================
	
    //====================== CREATE DATE/SERIAL CODE==========================
    getDate:()=>{
        var today = new Date() 
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()

        today = mm + '-' + dd + '-' + yyyy
        return today
    },
    nugetDate:()=>{
        var today = new Date() 
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()

        today = yyyy +  '-' + mm + '-' + dd
        return today
    },

    strDate:()=>{
        var today = new Date() 
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()
        var mos = new Date(`${today.getMonth()+1}/${dd}/${yyyy}`).toLocaleString('en-PH',  {month:'long'})
        today = `${mos} ${dd}, ${yyyy}`
        return today
    },

    formatDate2:(xdate)=>{
        today = new Date(xdate)
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()

        today = mm+'/'+dd+'/'+yyyy
        return today

    },

    formatDate:()=>{
        var today = new Date() 
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()

        today = yyyy+ '-' + mm + '-' + dd
        return today

    },
    
    formatNumber: (num)=> {
        const absNum = Math.abs(num);

        if (absNum >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (absNum >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toFixed(0); // Or format as needed for smaller numbers
        }
    },
    
    addCommas: (nStr)=> {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },

    Codes:()=>{
		var today = new Date() 
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()
		var hh = String( today.getHours()).padStart(2,'0')
		var mmm = String( today.getMinutes()).padStart(2,'0')
		var ss = String( today.getSeconds()).padStart(2,'0')

        today = "EO"+yyyy+mm+dd+hh+mmm+ss
        return today
	},

    //esp getting values for SELECT DROPDOWNS
    //====THIS WILL FIRE WHEN CREATING NEWSITE====//
    getAllMall:(url)=>{

        fetch(url)
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            console.log( 'All Main Malls ',data )
            cSelect = document.getElementById('mall_type')

            osndp.removeOptions( cSelect)
            console.log('line 590 util.js osndp.removeOptions()')

            let option = document.createElement("option")
            option.setAttribute('value', "")
            option.setAttribute('selected','selected')
              
            let optionText = document.createTextNode( "-- Pls Select --" )
            option.appendChild(optionText)
          
            cSelect.appendChild(option)

            for (let key in data.result) {
                let option = document.createElement("option")
                option.setAttribute('value', data.result[key].unique_id)
              
                let optionText = document.createTextNode( data.result[key].mall_name )
                option.appendChild(optionText)
              
                cSelect.appendChild(option)
            }

            cSelect.focus()
            
        })
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })
    },
	//====================== END CREATE DATE/SERIAL CODE==========================
    

    //=======================MODALS ====================
    
    loadModals:(eModal, eModalFrm, eHashModalFrm, eModalPlaceHolder)=>{
		console.log('**** loadModals()***', eModal)
        
        //off keyboard cofig
        const configObj = { keyboard: false, backdrop:'static' }
		
        // get event
        //login event
        if(eModal == "loginModal"){
            xloginmodal =  new bootstrap.Modal(document.getElementById(eModal),configObj);
            
            let loginModalEl = document.getElementById(eModal)

            loginModalEl.addEventListener('hide.bs.modal', function (event) {
                //clear form
                let xform = document.getElementById(eModalFrm)
    
                xform.reset()
                util.resetFormClass(eHashModalFrm)
    
                //take away alert
                let cDiv = document.getElementById(eModalPlaceHolder)
                cDiv.innerHTML=""
    
                // do something...
                //console.log('LOGIN FORM EVENT -> ha?')
            },false)
            
        } //eif loginmodal

        //========for adding new site modal 
        if(eModal == "newsiteModal"){
        
            xnewsitemodal =  new bootstrap.Modal(document.getElementById(eModal),configObj);
           
                   
        
        }//eif equipmentmodal

        //equipment tag modal
        if(eModal == "equipmentTagModal"){
            //console.log('loadModals(equpmentTagModal)')
            xequipmenttagmodal =  new bootstrap.Modal(document.getElementById(eModal),configObj);
           
            //equipment 
            let equipmentTagModalEl = document.getElementById(eModal)
            
            equipmentTagModalEl.addEventListener('show.bs.modal', function (event) {
               console.log('uyyy showing ')
            },false)
            
            equipmentTagModalEl.addEventListener('hide.bs.modal', function (event) {
                 //clear form
                 let xform = document.getElementById(eModalFrm)
    
                 xform.reset()
                 util.resetFormClass(eHashModalFrm)
     
                //take away alert
                const cDiv = document.getElementById('equipmentTagPlaceHolder')
                cDiv.innerHTML=""
                
                //after posting bring back btn
                const itagsave = document.getElementById('i-tag-save')
                const btntagsave = document.getElementById('tag-save-btn')
                    
                btntagsave.disabled = false
                itagsave.classList.remove('fa-spin')
                itagsave.classList.remove('fa-refresh')
                itagsave.classList.add('fa-floppy-o')

               //// takeout muna  admin.fetchBadgeData()
                
            },false)       
        
        }//eif equipmentTagModal
        
        //================login,equipment andsignup  listener
        let aForms = [eHashModalFrm] 
        let aFormx

        // console.log(input.classList)
        if(eModal=="signupModal"){
            let passwordAlert = document.getElementById("password-alert");
        }
            
        //loop all forms
        aForms.forEach( (element) => {
            aFormx = document.querySelectorAll(element)
            //console.log(aFormx[0])
            if(aFormx){
                let aFormz = aFormx[0]
                //console.log(aFormz.innerHTML)
                Array.from(aFormz.elements).forEach((input) => {
              
                    if(!input.classList.contains('p1') &&
                        !input.classList.contains('p2')){//process only non-password field
                            input.addEventListener('keyup',(e)=>{
                                if(input.checkValidity()===false){
                                    input.classList.remove('is-valid')
                                    input.classList.add('is-invalid')
                                    e.preventDefault()
                                    e.stopPropagation()

                                } else {
                                    input.classList.remove('is-invalid')
                                    input.classList.add('is-valid')
                                } //eif
                            },false)

                            input.addEventListener('blur',(e)=>{

                                if(input.checkValidity()===false){
                                    input.classList.remove('is-valid')
                                    input.classList.add('is-invalid')
                                    e.preventDefault()
                                    e.stopPropagation()

                                } else {
                                    input.classList.remove('is-invalid')
                                    input.classList.add('is-valid')
                                } //eif
                            },false)
                    }else{ //=== if input contains pssword field
                        if(input.classList.contains('p1')){
                            if(eModal=="signupModal"){
                                util.passwordCheck(input,passwordAlert)        
                            }
                            
                        }else{
                            util.passwordFinal(input)
                        }
                        
                    }//else password field

                }) //end all get input
            }
        })///=====end loop form to get elements
    },
    
    //hide modal box
    hideModal:(cModal,nTimeOut)=>{
        setTimeout(function(){ 
            const myModalEl = document.getElementById(cModal)
            let xmodal = bootstrap.Modal.getInstance(myModalEl)
            xmodal.hide()
           
        }, nTimeOut)
    },
    //show modal box

    modalShow:(modalToShow)=>{
       
        console.log('util.modalShow() Loading... ', modalToShow)
        //off keyboard cofig
        const configObj = { keyboard: false, backdrop:'static' }
        
        switch( modalToShow ){

            case "dataEntryModal":
                const dataentrymodal =  new bootstrap.Modal(document.getElementById('dataEntryModal'),configObj);

                 dataentrymodal.show()  
                
                document.getElementById('f_transnumber').value = util.getCode()

                //asn.collapz();
            break

            case "remittanceModal":
                
                if(!asn.db.getItem('myCart')){
                    util.Toasted('Please make an Initial Entry by Opening Start Entry on the Menu!!!',3000,false)
                    util.speak('Please make an Initial Entry by Opening Start Entry on the Menu!!!')
                    return false
                }else{

                    const remitmodal =  new bootstrap.Modal(document.getElementById('remittanceModal'),configObj);
                    remitmodal.show() 

                    const dbval = JSON.parse( asn.db.getItem('myCart'))
                    const xdb = JSON.parse( asn.db.getItem('profile'))

                    //====from myCartlocal Storage
                    document.getElementById('trans_tbody').innerHTML=`<tr>
                        <td>${dbval.f_transnumber}</td>
                        <td>${dbval.f_parcel}</td>
                        <td>${dbval.login_date}</td>
                        
                        </tr>`

                    //update also form as to guide for present data
                    document.getElementById('ff_transnumber').value= dbval.f_transnumber
                    document.getElementById('x_parcel').value= dbval.f_parcel
                    document.getElementById('ff_parcel').value= dbval.f_parcel
                    document.getElementById('ff_amount').value= dbval.f_amount
                    document.getElementById('ff_empid').value= xdb.id //get emp id frm localDb
 
                }//eif

                //asn.collapz();
            break


            case "claimsModal":
                if(util.getCookie('grp_id')!=="2"){
                    const claimsmodal =  new bootstrap.Modal(document.getElementById('claimsModal'),configObj);
                    claimsmodal.show()  
   
                }else{
                    util.speak('SORRY... YOU DO NOT HAVE ACCESS FOR THIS MENU!')
                }
                
            break

            case "loginmodal":
                xloginmodal.show()    
            break
			
            case "newempModal":
                if(util.getCookie('grp_id')!=="2"){
                    //show the dialog modal
                    const xnewsitemodal =  new bootstrap.Modal(document.getElementById('newempModal'),configObj);
                    xnewsitemodal.show()  

                    document.getElementById('employeeId').value = `${util.generateRandomDigits(5)}`
                }else{
                    util.speak('SORRY... YOU DO NOT HAVE ACCESS FOR THIS MENU!')
                }
            break;

            case "newempModal2":
                //alert('dire')
                //show the dialog modal
                const xnewsitemodal2 =  new bootstrap.Modal(document.getElementById('newempModal2'),configObj);
                xnewsitemodal2.show()  

                document.getElementById('employeeId2').value = `${util.generateRandomDigits(5)}`
        
                /*
                 //==== load engineering
                 osndp.populate(document.getElementById('proj_engr'),'engineer')

                 //==== load archi
                 osndp.populate(document.getElementById('proj_design'),'design')

                */
                
            break
        }
    },
    //========MODAL LISTENERS========//
    modalListeners:(eModal)=>{
        switch (eModal){

            case "remittanceModal":
                

            break

            case "claimsModal":
                //util.speak('CLAIMS MODAL SHOW!')
                //for upload pdf
                const frmclaimsupload = document.getElementById('claimsuploadForm')
                frmclaimsupload.addEventListener("submit", e => {
                    const formx = e.target;

                    xmsg = "<div><i class='fa fa-spinner fa-pulse' ></i>  Uploading CSV to Database, Please Do Not Close!!!</div>"
                    util.alertMsg( xmsg,'danger','claimsPlaceHolder')
                    util.speak('UPLOADING TO DATABASE, PLEASE DO NOT CLOSE THIS WINDOW!')
                    
                    fetch(`${myIp}/xlsclaims`, {
                        method: 'POST',
                        body: new FormData(formx),
                        })
                        .then( (response) => {
                            return response.json() // if the response is a JSON object
                        })
                        .then( (data) =>{
                            if(data.status){
                                console.log ('CLAIMS DONE!', data )
                                util.speak(data.message)
                                document.getElementById('claimsPlaceHolder').innerHTML=""
                                util.hideModal('claimsModal',2000)//then close form    
                            }

                            return true
                        })
                        // Handle the success response object
                        .catch( (error) => {
                            util.speak('ERROR IN UPLOADING DATA!')
                            console.log(error) // Handle the error response object
                            return false;
                        });

                    //e.preventDefault()
                    console.log('===claims SUBMITTTTT===')
                        //// keep this reference for event listener and getting value
                        /////const eqptdesc = document.getElementById('eqpt_description')
                        ////eqptdesc.value =  e.target.value
                    
                    // Prevent the default form submit
                    e.preventDefault();    
                })
                //=================END FORM SUBMIT==========================//
                
            break

            case "newempModal":
                console.log('modallisteners()=== neweempModal')
                //for upload pdf
                const frmupload = document.getElementById('uploadForm')
                frmupload.addEventListener("submit", e => {
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
                                console.log ('uploadpdf() value=> ', data )
                                console.log('*****TAPOS NA PO IMAGE POST*****')
    
                                //util.hideModal('newempModal',2000)//then close form    
    
                                document.getElementById('newsitePlaceHolder').innerHTML=""
                            }
            
                        })
                         // Handle the success response object
                        .catch( (error) => {
                            console.log(error) // Handle the error response object
                        });


                    //e.preventDefault()
                    console.log('===ADMIN ATTACHMENT pdf FORM SUBMITTTTT===')
                        //// keep this reference for event listener and getting value
                        /////const eqptdesc = document.getElementById('eqpt_description')
                        ////eqptdesc.value =  e.target.value
                    
                    // Prevent the default form submit
                    e.preventDefault();    
                })
                //=================END FORM SUBMIT==========================//
                
                const newsiteModalEl = document.getElementById(eModal)

                //============== when new site modal loads, get project serial number
                newsiteModalEl.addEventListener('show.bs.modal', function (event) {
                    
                    //===turn off upload-btn
                    const btnsave = document.getElementById('mall-save-btn')
                    btnsave.disabled = true

                    console.log('newempModal() listeners loaded')
 
                },false)

                newsiteModalEl.addEventListener('hide.bs.modal', function (event) {
                    console.log('==hiding newsitemodal .on(hide)====')
                    //osndp.removeOptions(document.getElementById('proj_engr'))
                    //osndp.removeOptions(document.getElementById('proj_design'))
                    document.getElementById('newsitePlaceHolder').innerHTML=""
                   
                    //clear form
                    let xform = document.getElementById('newempForm')
                    xform.reset()
                    util.resetFormClass('#newempForm')

                    let uform = document.getElementById('uploadForm')
                    uform.reset()
                    util.resetFormClass('#uploadForm')

                    //after posting bring back btn
                    const isave = document.getElementById('i-save')
                    const btnsave = document.getElementById('mall-save-btn')
                        
                    btnsave.disabled = false
                    isave.classList.remove('fa-spin')
                    isave.classList.remove('fa-refresh')
                    isave.classList.add('fa-floppy-o')
                    
                    ////// take out muna admin.fetchBadgeData()

                    //osndp.getAll(1,document.getElementById('filter_type').value) //first time load speak
                    // do something...
                    //console.log('LOGIN FORM EVENT -> ha?')
                },false)           
            
            break

            case "newempModal2":
                //for upload pdf
                const frmupload2 = document.getElementById('uploadForm2')
                frmupload2.addEventListener("submit", e => {
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
                                console.log ('uploadpdf() value=> ', data )
                                console.log('*****TAPOS NA PO IMAGE POST*****')
    
                                //util.hideModal('newempModal',2000)//then close form    
    
                                document.getElementById('newsitePlaceHolder2').innerHTML=""
                            }
            
                        })
                         // Handle the success response object
                        .catch( (error) => {
                            console.log(error) // Handle the error response object
                        });


                    //e.preventDefault()
                    console.log('===ADMIN ATTACHMENT pdf FORM SUBMITTTTT===')
                        //// keep this reference for event listener and getting value
                        /////const eqptdesc = document.getElementById('eqpt_description')
                        ////eqptdesc.value =  e.target.value
                    
                    // Prevent the default form submit
                    e.preventDefault();    
                })
                //=================END FORM SUBMIT==========================//
                
                const newsiteModalEl2 = document.getElementById(eModal)

                //============== when new site modal loads, get project serial number
                newsiteModalEl2.addEventListener('show.bs.modal', function (event) {
                    //======get util.Codes()
                   // document.getElementById('serial').value= util.Codes() 
                    //document.getElementById('serial_pdf').value= document.getElementById('serial').value 
                    
                    //===turn off upload-btn
                    const btnsave = document.getElementById('mall-save-btn2')
                    btnsave.disabled = true

                    //==== create cookie to retrieve in api
                   // util.setCookie("serial_pdf",document.getElementById('serial').value+".pdf" ,1)
                        
                    //=====get   Malls()

                    console.log('newempModal() listeners loaded')
                    
                    //===populate dropdown for malls
                    //util.getAllMall(`https://localhost:10000/getallmall`)

                    
 
                },false)

                newsiteModalEl2.addEventListener('hide.bs.modal', function (event) {
                    console.log('==hiding newsitemodal .on(hide)====')
                    //osndp.removeOptions(document.getElementById('proj_engr'))
                    //osndp.removeOptions(document.getElementById('proj_design'))
                    document.getElementById('newsitePlaceHolder2').innerHTML=""
                   
                    //clear form
                    let xform = document.getElementById('newempForm2')
                    xform.reset()
                    util.resetFormClass('#newempForm2')

                    let uform = document.getElementById('uploadForm2')
                    uform.reset()
                    util.resetFormClass('#uploadForm2')

                    //after posting bring back btn
                    const isave = document.getElementById('i-save2')
                    const btnsave = document.getElementById('mall-save-btn2')
                        
                    btnsave.disabled = false
                    isave.classList.remove('fa-spin')
                    isave.classList.remove('fa-refresh')
                    isave.classList.add('fa-floppy-o')
                    
                    ////// take out muna admin.fetchBadgeData()

                    //osndp.getAll(1,document.getElementById('filter_type').value) //first time load speak
                    // do something...
                    //console.log('LOGIN FORM EVENT -> ha?')
                },false)           
            
            break

            case "commentsModal":
                const commentsModalEl = document.getElementById('commentsModal')

                commentsModalEl.addEventListener('hide.bs.modal', function (event) {
                    //clear form
                    let xform = document.getElementById('commentsForm')
                    xform.reset()
                    util.resetFormClass('#commentsForm')
                })

            break

            case "dataEntryModal":
                const dataEntryModalEl = document.getElementById('dataEntryModal')

                // dataEntryModalEl.addEventListener('show.bs.modal', function (event) {
                //     alert(util.getCode() )
                //     document.getElementById('f_transnumber').value =  util.getCode()
                // })
            
            break

        }//end sw
 
    }, //end modallisteners func =========
    //======================END MODALS====================
    //  clear form
    //  let xform = document.getElementById('commentsForm')
    //  xform.reset()
    //  util.resetFormClass('#commentsForm')
    
    getCode:() =>{

        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()
        var hh = String( today.getHours()).padStart(2,'0')
        var mmm = String( today.getMinutes()).padStart(2,'0')
        var ss = String( today.getSeconds()).padStart(2,'0')

        today = `ASN-${yyyy}${mm}${dd}${hh}${mmm}${ss}`
        return today
    },

    //===========STRIPE PAY ===========
    paymentInsert:()=>{
		const iframer = document.getElementById( "payframe" )
		const wrapper = document.createElement('div')
		
		wrapper.innerHTML = [
			'<iframe width="100%" height="100%" border=0 class="embed-responsive-item" src="checkout2.html"></iframe>'
		].join('')
		
		iframer.append(wrapper)
		
	},

    //==============randomizer ========//
    generateRandomDigits: (n) => {
        return Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n));
    },
      
    //===================MAILER==================
    signupMailer:async (url="")=>{
        fetch(url)
        .then((response) => {  //promise... then 
            return response.json()
        })
        .then((data) => {
            util.alertMsg(data.message,'warning','signupPlaceHolder')
            util.hideModal('signupModal',2000)
        })
        .catch((error) => {
            //util.Toast(`Error:, ${error.message}`,3000)
            console.error('Error:', error)
        })    
    },

    //==========FOR ALL THE DATA ENTRY FORM LOAD THIS FIRST TO BE ABLE TO BE VALIDATED ===//
	loadFormValidation:(eHashFrm)=>{

        console.log('===util.loadFormValidation()==', eHashFrm)
		let aForms = [eHashFrm] 
        let aFormx

		//loop all forms
		aForms.forEach( (element) => {
			aFormx = document.querySelectorAll(element)
			//console.log(aFormx[0])
			if(aFormx){
				let aFormz = aFormx[0]
				//console.log(aFormz.innerHTML)
				Array.from(aFormz.elements).forEach((input) => {
			
					if(!input.classList.contains('p1') &&
						!input.classList.contains('p2')){//process only non-password field
							input.addEventListener('keyup',(e)=>{
								if(input.checkValidity()===false){
									input.classList.remove('is-valid')
									input.classList.add('is-invalid')
									e.preventDefault()
									e.stopPropagation()

								} else {
									input.classList.remove('is-invalid')
									input.classList.add('is-valid')
								} //eif
							},false)

							input.addEventListener('blur',(e)=>{

								if(input.checkValidity()===false){
									input.classList.remove('is-valid')
									input.classList.add('is-invalid')
									e.preventDefault()
									e.stopPropagation()

								} else {
									input.classList.remove('is-invalid')
									input.classList.add('is-valid')
								} //eif
							},false)
					}else{ //=== if input contains pssword field
						if(input.classList.contains('p1')){
							if(eModal=="signupModal"){
								util.passwordCheck(input,passwordAlert)        
							}
						}else{
							util.passwordFinal(input)
						}
						
					}//else password field

				}) //end all get input
			}
		})///=====end loop form to get elements	
	},
    
    url:null,

    //==========WHEN SUBMIT BUTTON CLICKED ==================
    validateMe: async (frmModal, frm, classX)=>{
        console.log('validateMe()===', frmModal, frm)
        
        const forms = document.querySelectorAll(frm)
        const form = forms[0]
        let xmsg

        let aValid=[]
        
        Array.from(form.elements).forEach((input) => {
            
            if(input.classList.contains(classX)){
                aValid.push(input.checkValidity())
                if(input.checkValidity()===false){
					console.log('invalid ',input)
					
                    input.classList.add('is-invalid')
                }else{
                   input.classList.add('is-valid')
                }
            }
        })

        if(aValid.includes(false)){
            util.Toasted('Error, Please CHECK Your Entry, ERROR FIELDS MARKED IN RED!',3000,false)
            console.log('don\'t post')
            return false
        }else{
            
            //getform data for posting
            const mydata = document.getElementById(frm.replace('#',''))
            let formdata = new FormData(mydata)
            let objfrm = {}
            
            //// objfrm.grp_id="1" <-- if u want additional key value
            
            for (var key of formdata.keys()) {
                if(key=="pw2"){
                    //console.log('dont add',key)
                }else{
                   objfrm[key] = formdata.get(key);
                   
                }
            }
            objfrm.date_reg = util.getDate()

            //console.log('post this',frm,objfrm)

            //=== POST NA!!!
            switch(frm){ 
                case '#loginForm':
                    xmsg = "<div><i class='fa fa-spinner fa-pulse' ></i>  Searching Database please wait...</div>"
                    util.alertMsg( xmsg,'danger','loginPlaceHolder')

                    util.url = `${myIp}/loginpost/${objfrm.uid}/${objfrm.pwd}`
                    
                    util.loginPost(frm ,frmModal,`${util.url}`)

                break
				
				case "#newempForm":
                    //console.log('newsiteform data ', objfrm)
                    xmsg = "<div><i class='fa fa-spinner fa-pulse' ></i>  Saving to Database please wait...</div>"
                    util.alertMsg( xmsg,'danger','newsitePlaceHolder')
                    
                    const isave = document.getElementById('i-save')
                    const btnsave = document.getElementById('mall-save-btn')
                    isave.classList.remove('fa-floppy-o')
                    isave.classList.add('fa-refresh')
                    isave.classList.add('fa-spin')
                    btnsave.disabled = true
                    
                    util.newempPost(frm,frmModal,`${myIp}/newemppost`,objfrm )
                    //util.newsitePost(frm,frmModal,`https://localhost:10000/newsitepost/${util.formatDate()}`,objfrm )
                    
                    console.log('==posting newSiteModal data ==',objfrm);
				break;

                case "#newempForm2":
                    //console.log('newsiteform data ', objfrm)
                    xmsg = "<div><i class='fa fa-spinner fa-pulse' ></i>  Saving to Database please wait...</div>"
                    util.alertMsg( xmsg,'danger','newsitePlaceHolder2')
                    
                    const isave2 = document.getElementById('i-save2')
                    const btnsave2 = document.getElementById('mall-save-btn2')
                    isave2.classList.remove('fa-floppy-o')
                    isave2.classList.add('fa-refresh')
                    isave2.classList.add('fa-spin')
                    btnsave2.disabled = true
                    
                    util.newempPost(frm,frmModal,`${myIp}/newemppost`,objfrm )
                    //util.newsitePost(frm,frmModal,`https://localhost:10000/newsitepost/${util.formatDate()}`,objfrm )
                    
                    console.log('==posting newSiteModal data ==',objfrm);
				break;

                case "#commentsForm":
                    console.log('===POSTING ISSUES===')
                break

                case "#dataEntryForm":

                    objfrm.login_date = util.nugetDate() 
                    objfrm.transnumber = document.getElementById('f_transnumber').value

                    util.toggleButton('start-btn',true)
                    
                    asn.saveobjfrm = objfrm
                    asn.saveToLogin(`${myIp}/savetologin/${util.getCookie('f_id')}`,objfrm)

                break

                case "#remittanceForm":

                    //getform data for posting image
                    const mydata = document.getElementById('remittanceUploadForm')
                    let formdata = new FormData(mydata)
                    
                    const dbval = JSON.parse( db.getItem('myCart')) //get old value from localStorage
                    objfrm.old_transnumber = dbval.f_transnumber
                    objfrm.old_parcel = dbval.f_parcel
                    ///objfrm.old_amount = dbval.f_amount
                    
                    const hubamt = parseInt( document.getElementById('f_amount').value) 
                    const remitamt =parseInt( document.getElementById('ff_amount').value)
                    
                    if( remitamt > hubamt){
                        util.Toasted('Error!!! Remitted Amount greater than Amount of Scanned Parcels!!!',3000,false)
                        asn.speaks('Error!!! Remitted Amount  is greater than Amount of Scanned Parcels!!!')
                        document.getElementById('f_amount').focus()
                        break
                    }

                    //// objfrm.grp_id="1" <-- if u want additional key value

                    
                    for (var key of formdata.keys()) {
                        let xfile = formdata.get(key) ;

                        if( xfile.name == "" ){
                            util.Toasted('Please select a Picture of Receipt to Upload!!!',4000,false)
                            break;
                            
                        }else{
                            util.toggleButton('remittance-btn',true)
                            asn.saveTransaction(`${myIp}/savetransaction/${util.getCookie('f_id')}`,objfrm)
                            break;
                        }//eif
                    }

                break
            }//end switch

            return

        }//endif
    },

    //disable enable buttons
    toggleButton:(element,lshow)=>{
        let button = document.getElementById(element) //turn off remittance save btn
        button.disabled = lshow;
        button.setAttribute('aria-disabled', `${lshow}`  ); //Optional, but helps screen readers
    },

    //===calculate the distance haverstine ====//    
    getDistance:  (lat1 , lon1, lat2, lon2 ) =>{
        const R = 6371; // Earth's radius in kilometers
        const toRadians = (angle) => angle * (Math.PI / 180);

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in kilometers
    },

    //logout
    logOut:()=>{
        //clear items
        //db.removeItem('logged')
        // if(db.getItem('logged')){
        //     db.setItem('logged', false)
        // }
        
        location.href = '/jtx'
    },

    //=====THIS IS FOR RIDERS========//
    showPosition: async (position)=>{
        //let micasalat = '14.58063721485018'
        //let micasalon = '121.01563811625266'
       // util.speak('Checking your Position... please Wait!')
                
        let mypos = JSON.parse(db.getItem('myHub'))
                
        let distance = util.getDistance(mypos.lat, mypos.lon, position.coords.latitude, position.coords.longitude)
        let d_meters = ( distance.toFixed(3) * 1000 )
        
        console.log('==== asn.showPosition()  the distance is ',distance, d_meters)

        //override muna the meeters
        d_meters = 0.9 //DELETE LATER IF LIVE

        if( parseFloat(d_meters) <=  10){ // IF DISTANCE IS LESS OR EQ. 10METERS

            util.Toasted(`SUCCESS! YOUR DISTANCE FROM THE <BR>HUB IS ${d_meters} METER(S), PLS. WAIT!`,6000,false)
            
            //util.translate({xmsg: util.getCookie('f_voice'), cRedirect:"../jtx/dashboard"})
            location.href = '../jtx/dashboard'    
            
        }else{
            
            const errmsg =`ERROR -- PLEASE TRY AGAIN! YOUR DISTANCE FROM THE HUB  IS ${d_meters} METER(S) 
                        PLEASE GO NEARER INSIDE THE WAREHOUSE!`

            util.Toasted(`ERROR -- PLEASE TRY AGAIN! <BR>YOUR DISTANCE FROM THE HUB  IS ${d_meters} METER(S) 
                <br> PLEASE GO NEARER INSIDE THE WAREHOUSE!`,8000,false)
            
            util.speak(errmsg)
                
            document.getElementById('loginPlaceHolder').innerHTML = "" //reset alertmsg

            return 

        }
    },

    //==== for login posting
    loginPost: (frm,modal,url="") => {

        fetch(util.url, {
            cache:'reload'
        
        })
        .then((response) => {  //promise... then 
            
            return response.json();
        })

        .then((data) => {
            //console.log(`login here data ${JSON.stringify(data)}`)
            
            //close ModalBox
            if(data[0] .found){
                //////// === hide ko muna voice ha? paki-balik pag prod na -->util.speak(data[0].voice)
                util.alertMsg(data[0].message,'success','loginPlaceHolder')
                //document.getElementById('loginBtn').classList.add('hide-me')
                //addtocookie
                util.setGroupCookie(data[0].id,data[0].region, data[0].fname, data[0].grp_id, data[0].email, data[0].voice, data[0].pic)/*=== SET GROUP COOKIE */
            
                //add also to localdb
                let obj ={}

                obj.id = data[0].id
                obj.region = data[0].region
                obj.fullname = data[0].fname
                obj.grp_id = data[0].grp_id
                obj.email = data[0].email
                obj.pic = data[0].pic

                db.setItem('profile',JSON.stringify(obj))//save to localdb
                                    
                switch ( data[0].grp_id ){
                    case 1:
                        //check distance before proceeding to login
                        //take out chcking of distance bring back  later
                    /*  
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition( util.showPosition,{
                                enableHighAccuracy:true
                            });
                        }
                    */
                        location.href = '../jtx/dashboard' 
                    break
                
                    case 4: // coordinator
                        location.href = '../jtx/coord'    
                    break

                    case 3:  //head coord
                        location.href = '../jtx/headcoord'    
                    break
                
                    case 5: // operations mgr
                    case 8: //hr
                        console.log('poooknnatt')
                        location.href ='../jtx/operations'    
                    break

                }//===== endswitch
                        
            }else{
                util.speak(data[0].voice)
                util.alertMsg(data[0].message,'warning','loginPlaceHolder')
                console.log('notfound',data[0].message)
                return false
            }
            
        })
        .catch((error) => {
            util.speak(data[0].voice)
            util.alertMsg(data[0].message,'warning','loginPlaceHolder')
            console.log('not found',data[0].message)
            return false
        })

    },

    setGroupCookie:(xid, xregion, xname,xgrp,xemail,xvoice,xpic)=>{
        util.setCookie("f_dbId",xid,0)
        util.setCookie("f_id",xid,0)
        util.setCookie("f_region",xregion,0)
        util.setCookie("fname",xname,0)
        util.setCookie("grp_id",xgrp,0)
        util.setCookie("f_email",xemail,0)
        util.setCookie("f_voice",xvoice,0)
        util.setCookie("f_pic",xpic,0)
    },

    audio:null,

    // Usage:
    // func('my message'); // Calls with only 1 param, other_func defaults to empty function
    // Function('hey', () => { console.log('Running!'); });
    // func('my message', asn.other_func); // Calls with second param as a function
    isPlaying:false,
///=========================PLAY GREETINGS===============
  translate:async ({ xmsg, runwhat = () => {}, cRedirect } = {}) => {

        if (util.isPlaying) return; // prevent re-entry
  
        util.isPlaying = true;

        const aActs = [
            " Ingat po sa Byahe!", 
            " Galingan naten today ha?",
            " Kayang-kaya mo yan!!!!",
            " Wag pabayaan ang sarili!!!",
            " Magdasal lagi sa Panginoon!",
            " Gawin mong  sandigan ng lakas ang iyong Pamilya!"]
        
        const now = new Date();
        const hours = now.getHours(); // returns 0-23
        const wHrs = hours % 24;
        let xvoice

        if (wHrs >= 0 && wHrs < 12) { // Check for 12 AM (0)
            xvoice = `MAGANDANG UMAGA!!! ${xmsg} ${aActs[Math.floor(Math.random() * (5 - 0 + 1)) + 0]}`  
        } else if (wHrs >= 12 && wHrs <= 17) { //AM period
            xvoice =`MAGANDANG HAPON!!! ${xmsg} ${aActs[Math.floor(Math.random() * (5 - 0 + 1)) + 0]}`
        } else if (wHrs > 17 && wHrs <= 23) { //AM period
            xvoice = `MAGANDANG GABI!!! ${xmsg} ${aActs[Math.floor(Math.random() * (5 - 0 + 1)) + 0]}`
         
        }

        const apiKey = 'sk_71ec2e7034a4e78f766acbbfd418beb2d6e7c8febfc94507'; // your API key
        const voiceId = 'NEqPvTuKWuvwUMAEPBPR'; // your voice ID

        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
                },
                body: JSON.stringify({
                text: xvoice ,
                model_id: 'eleven_multilingual_v2',
                output_format: 'mp3',
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const audioBlob = await response.blob();
            const url = URL.createObjectURL(audioBlob);
            const audio = new Audio(url);

            //carlo
            audio.onended = null; // Remove previous handle

            // use onended instead of addEventListener
            audio.onended = () => {
                util.isPlaying = false; // reset flag
            
                if (cRedirect !== undefined && cRedirect !== null) {
                    window.location.href = cRedirect;
                }
                if (typeof runwhat === 'function') {
                    runwhat();
                   
                }
            }//ended onended
            
            audio.play();
        } catch (error) {
        console.error('Error:', error);
            util.isPlaying = false; // Reset flag on error
        }

    },    
    //new site posting 
    newempPost:async function(frm,modal,url="",xdata={}){
        fetch(url,{
            method:'POST',
            //cache:'no-cache',
            headers: {
                "Content-Type": "application/json",
            },
            
            body: JSON.stringify(xdata)
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            if(data.status){

                //trigger pdf upload
                //===trigger upload pdf
                const uploadbtn = document.getElementById('upload-btn')
                uploadbtn.click()
                
                util.speak(data.voice);

                xmsg = "<div><i class='fa fa-spinner fa-pulse' ></i>  Uploading file please wait...</div>"
                util.alertMsg( xmsg,'danger','newsitePlaceHolder')
                    
                ///document.getElementById('ip').innerHTML = 'Uploading file , please Wait!!!'

                //     //send message to super users
                // const sendmsg = {
                //     msg: data.approve_voice,
                //     type:""    
                // }

                //remind super users
                //osndp.socket.emit('admin', JSON.stringify(sendmsg))
                
                ////util.alertMsg(data.message,'success','equipmentPlaceHolder')
                
                //hide modalbox
                util.hideModal('newempModal',2000)    
            
                ///// THIS IS IMPORTANT.. TAKE OUT MUNA 03/09/2024 admin.filterBy() ///getAll() // update tables and speak

                //util.Toast('PLS. WAIT, UPLOADING FILE!',20000)
                 
            }else{
                util.speak(data.voice)
                //util.alertMsg(data.message,'warning','equipmentPlaceHolder')
                return false
            }//eif
            
            
        })
        .catch((error) => {
        // util.Toast(`Error:, ${error.message}`,1000)
        console.error('Error:', error)
        //yes
        })
    
    },
    
    //utility toastify
    Toasted:async(msg,nDuration,lClose)=>{
        Toastify({
            text: msg ,
            duration: nDuration,
            escapeMarkup: false, //to create html
            close: lClose,
            position:'center',
            offset:{
                x: 0,
                y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
            },
            style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
        
    }, //===end toasted!
    
}//****** end obj */