const xutil = {
// 1. Structural fix: Track loading state to prevent infinite loops
    modelsLoaded: false,

    loadModels: async () => {
        // If models are already loaded, exit immediately to save memory and time
        if (xutil.modelsLoaded) return;

        const imageInput = document.getElementById('id_picture');
        const statusMessage = document.getElementById('statusMessage');

        // FIXED CDN: Direct NPM mirror pointing to the correct binary weight files
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/';
        
        try {
            if (statusMessage) statusMessage.textContent = "Loading AI Models... Please wait.";
            
            // FIXED MODEL: Swapped to tinyFaceDetector for robust mobile/high-res support
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
            
            xutil.modelsLoaded = true; // Mark as done
            
            if (statusMessage) //statusMessage.textContent = "Models loaded successfully! Ready for input.";
            statusMessage.innerHTML = `
                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div> 
                    Analyzing image content...
                `;
            if (imageInput) imageInput.disabled = false; 

        } catch (err) {
            if (statusMessage) statusMessage.textContent = "Failed to load models. Please refresh.";
            console.error("Model Loading Error: Check CDN path or network.", err);
        }
    },
   
    // FIXED PARAMETER: Added 'event' explicitly into the arguments list
    // FIX: Accept the explicit event block here
    faceRecognition: async (event) => {
        // Fallback: If inline HTML parameter mapping breaks, locate the DOM node by ID manually
        const currentEvent = event || window.event;
        const inputElement = currentEvent ? currentEvent.target : document.getElementById('id_picture');
    
        if (!inputElement || !inputElement.files || inputElement.files.length === 0) return; 
        
        const file = inputElement.files[0];
        const statusMessage = document.getElementById('statusMessage');

        try {
            //if (statusMessage) statusMessage.textContent = "Analyzing image content...";
            // BOOTSTRAP SPINNER INJECTION
            if (statusMessage) {
                statusMessage.innerHTML = `
                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div> 
                    Analyzing image content...
                `;
            }
            console.log("Analyzing file via util.faceRecognition()...");
            
            await xutil.loadModels();

            const img = await faceapi.bufferToImage(file);

            const detection = await faceapi.detectSingleFace(
                img, 
                new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 })
            ).withAgeAndGender();

            // 1. Verify a face exists at all
            if (!detection) {
                alert("Verification Failed: No human face detected. Please ensure your face is upright and clear.");
                if (statusMessage) statusMessage.textContent = "Verification failed.";
                if (inputElement) inputElement.value = ''; 
                return;
            }

            // 2. Read the biological estimations
            const gender = detection.gender; // Returns 'male' or 'female'
            const confidence = (detection.genderProbability * 100).toFixed(1);

            // CHANGED LOGIC: Accept both male and female properties unconditionally
            if (gender === 'male' || gender === 'female') {
                console.log(`Success: Human face verified. Detected profile: ${gender} (${confidence}% confidence).`);
                if (statusMessage) statusMessage.textContent = `Passed! Verified profile: ${gender} (${confidence}%).`;
                alert("Verification Passed!");
                
                // --- Insert your form submit action or file payload continuation here ---
            }

        } catch (error) {
            console.error("Error analyzing input image:", error);
            if (statusMessage) statusMessage.textContent = "An error occurred during scanning.";
            alert("An error occurred during screening.");
            if (inputElement) inputElement.value = ''; 
        }
    }
}


//safe browser
const xutil = {
    modelsLoaded: false,

    loadModels: async () => {
        if (xutil.modelsLoaded) return;
        const imageInput = document.getElementById('id_picture');
        const statusMessage = document.getElementById('statusMessage');
        //const MODEL_URL = 'https://jsdelivr.net';
        // FIXED CDN: Direct NPM mirror pointing to the correct binary weight files
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/';
        
        
        try {
            if (statusMessage) statusMessage.innerHTML = '<div class="spinner-border spinner-border-sm text-primary me-2"></div> Booting engine...';
            
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
            
            xutil.modelsLoaded = true; 
            if (statusMessage) statusMessage.textContent = "AI Engine Ready.";
            if (imageInput) imageInput.disabled = false; 
        } catch (err) {
            console.error(err);
        }
    },

    // NEW METHOD: Wipes TensorFlow completely out of mobile RAM
        // NEW FIX: Safe and complete cleanup without invalid function calls
    // SAFE FIX: Releases memory buffers without destroying the TensorFlow runtime engine framework
    destroyAI: async () => {
        console.log("Purging AI engine from memory...");
        try {
            if (faceapi && faceapi.tf) {
                // 1. Instantly free heavy neural net matrix memory cells
                faceapi.tf.disposeVariables(); 
                
                // 2. Clear out underlying browser texture frames safely
                if (faceapi.tf.engine && typeof faceapi.tf.engine().startScope === 'function') {
                    // Safe alternative to reset(): Force clears temporary mathematical allocations
                    faceapi.tf.engine().startScope();
                    faceapi.tf.engine().endScope();
                }
            }
            
            // Mark models as un-loaded so face-api knows it needs to fetch weights on the next image run
            xutil.modelsLoaded = false;
            console.log("Memory successfully freed for other file inputs.");
        } catch (e) {
            console.warn("Clean up warning:", e);
        }
    },


    faceRecognition: async (event) => {
        const currentEvent = event || window.event;
        const inputElement = currentEvent ? currentEvent.target : document.getElementById('id_picture');
    
        if (!inputElement || !inputElement.files || inputElement.files.length === 0) return; 
        
        const file = inputElement.files[0];
        const statusMessage = document.getElementById('statusMessage');

        try {
            if (statusMessage) {
                statusMessage.innerHTML = '<div class="spinner-border spinner-border-sm text-primary me-2"></div> Analyzing image content...';
            }
            
            await xutil.loadModels();
            const img = await faceapi.bufferToImage(file);

            const detection = await faceapi.detectSingleFace(
                img, 
                new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 })
            ).withAgeAndGender();

            if (!detection) {
                alert("Verification Failed: No human face detected.");
                if (statusMessage) statusMessage.textContent = "Verification failed.";
                if (inputElement) inputElement.value = ''; 
                return;
            }

            const gender = detection.gender; 
            const confidence = (detection.genderProbability * 100).toFixed(1);

            if (gender === 'male' || gender === 'female') {
                if (statusMessage) statusMessage.textContent = `Passed! Verified profile: ${gender} (${confidence}%).`;
                alert("Verification Passed!");

                // CLEANUP TRIGGER: Wipe the AI out of RAM right now since we are done with it
                await xutil.destroyAI(); 
                
                // Clear the image DOM reference to unlock further browser garbage collection
                img.src = ''; 
            }

        } catch (error) {
            console.error("Error:", error);
            if (statusMessage) statusMessage.textContent = "An error occurred during scanning.";
            alert("An error occurred during screening.");
            if (inputElement) inputElement.value = ''; 
            await xutil.destroyAI(); // Cleanup on error too
        }
    }
};
