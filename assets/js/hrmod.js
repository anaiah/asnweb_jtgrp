import { hrisutil } from './mod-hrisutil.js';

//hrisutil.tester()


//************************* LISTENERS **************************** */
//listenr for change in select element with id "employeeSelect"

// document.addEventListener('change', (e) => {
//     if (e.target.matches('.xelTester')) { 
//         // 1. Get the currently selected value
//         const selectedValue = e.target.value;

//         // 2. Get the text label (the part the user sees)
//         const selectedText = e.target.options[e.target.selectedIndex].text;

//         console.log("Value:", selectedValue);
//         console.log("Label:", selectedText);

//         // Example: If you need to do something with that value
//         // timekeep.openTimekeepModal(selectedValue);
//     }
// });

document.addEventListener('click', (e) => {
    switch (e.target.id) {
        case 'downloadTimekeepBtn':
            console.log('hrisutil.downloadTimekeepXls() called');
            hrisutil.downloadTimekeepXls();
            break;

    }
}, true); // Use capture to ensure it catches the event



// This runs once when the app starts
document.addEventListener('blur', (e) => {
    switch (e.target.id) {
        case 'email':
            const currentEmail = e.target.value.trim();
            const originalEmail = e.target.dataset.original; // Stored when modal opens 

            if (!currentEmail || currentEmail === originalEmail) return;// if after blur it is thesame return false, dont do anythhing

            // else Run your AJAX
            hrisutil.checkEmailDuplicate(currentEmail);
            
            break;
    }
    
}, true); // Use capture to ensure it catches the event

//region
document.addEventListener('change', (e) => {

    //const idx = e.target.getAttribute('data-idx'); -- attribute data-dix get the index of the current row being edited
    switch (e.target.id) {
        case 'region':
            hrisutil.showPosition();
            console.log('Region logic fired');
            break;

        case 'jobTitle':
            // e.target is the #jobTitle element
            hrisutil.handlePositionChange(e.target);
            console.log('Position logic fired');
            break;

        case 'locStore':
            hrisutil.fetchAndPopulateHubs(e.target.value);
            console.log('=========== firing hrisutil.fetchAndPopHub() in  hrmmod.js  Location and HUB logic fired', e.target.value);
            break;
        case 'email':
            console.log('Email field changed, value: ', e.target.value);    
            break;

        case 'actionSelect':
            const action = e.target.value;
            const form = document.getElementById("searchForm");

            if (!action) return;

            if (action === "search") {
                hrisutil.checkform && hrisutil.checkform(form); //same as validateForm()
            } else if (action === "timekeeping") {
                hrisutil.printTimeKeep && hrisutil.printTimeKeep();
            } else if (action === "masterfile") {
                hrisutil.printMasterfile && hrisutil.printMasterfile(form);
            }///eif

            // reset back to placeholder after firing
            e.target.value = "";
            break;

        default:
            // Do nothing for other elements
            break;
    }
});

//============= NEW EMP MODAL LISTENERS =================//
const myModal = document.getElementById('newempModal');
myModal.addEventListener('show.bs.modal', function () {
    const btn = document.getElementById('newemp-next-btn');
    const mode = btn.dataset.mode;
    if(mode === 'edit'){
        console.log('+++++++++++ newempmodal edit mode is opened')
        const fileInputs = myModal.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.required = false;
        });
        document.getElementById('h4Text').innerHTML = '<i class="ti ti-pencil-square" style="font-size:17px"></i> Edit Account';

    }else{ 

        document.getElementById('h4Text').innerHTML = '<i class="ti ti-pencil-square" style="font-size:17px"></i> Create Account';

    }
});

//===== modal close reset  everything  to readonly and add mode
myModal.addEventListener('hide.bs.modal', function (event) {
    
    console.log('==hiding newEmpModal .on(hide) from util.js ====')
    document.getElementById('newempPlaceHolder').innerHTML=""

    util.toggleButtonLoading('footer-msg',null,false)

    const btn = document.getElementById('newemp-next-btn');
    const mode = btn.dataset.mode;

    //clear form
    let xform = document.getElementById('newempForm')
    xform.reset()
    util.resetFormClass('#newempForm')

    if(mode === 'edit') {

        // 1. CLEANUP: Remove any previous injections (ID or Thumbnails)
        document.querySelectorAll('.injected-edit-ui').forEach(el => el.remove());
       
        // pls go back to add
        const fileInputs = myModal.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.required = true;
        });
        
        btn.dataset.mode = 'add'; // back to add mode
        btn.innerHTML = `<i id="i-next" class="fa fa-arrow-right"></i> &nbsp;&nbsp; NEXT`;

        const emaildata = myModal.querySelector('#email');
        //emaildata.value = '';
        emaildata.dataset.original = '';


    }//EIF

});           
                
