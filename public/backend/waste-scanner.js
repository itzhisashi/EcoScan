const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz79z7rnN-7ttrjLzDadTbjbbrvMgcGYFYqESFWg2fHKEvUQXlF8PD4xGeuyTrMzrRkfw/exec';
let base64String = "";

lucide.createIcons();

function triggerCamera() { document.getElementById('cameraInput').click(); }

function triggerGallery() { document.getElementById('fileInput').click(); }

// --- UPDATED COMPRESSION LOGIC ---
function handleFileSelect(event, source) {
    const file = event.target.files[0];
    if (!file) return;
    
    const btn = document.getElementById('scanBtn');
    const previewImg = document.getElementById('preview');
    
    // UI Feedback: Disable button while compressing
    btn.disabled = true;
    btn.innerHTML = "Processing...";
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Create a lightweight pointer to the file
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = function() {
        try {
            // Clean up memory immediately
            URL.revokeObjectURL(objectUrl);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set compression constraints
            const MAX_WIDTH = 500;
            const MAX_HEIGHT = 500;
            let width = img.width;
            let height = img.height;
            
            // Maintain Aspect Ratio
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw white background then the image
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, width, height);
            
            // Export as compressed JPEG
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
            
            // Update Preview & global Base64
            previewImg.src = compressedDataUrl;
            document.getElementById('previewContainer').classList.remove('hidden');
            base64String = compressedDataUrl.split(',')[1];
            
            // Enable Scan Button
            btn.disabled = false;
            btn.innerHTML = "Analyze & Find Centers";
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            
            // LOCK LOGIC: Gray out the other option
            if (source === 'camera') {
                grayOut('galleryCard');
            } else {
                grayOut('cameraCard');
            }
            
            document.getElementById('result').classList.add('hidden');
            
        } catch (err) {
            console.error("Compression Error:", err);
            alert("Error processing image.");
        }
    };
    
    img.onerror = function() {
        alert("Could not load image file.");
        URL.revokeObjectURL(objectUrl);
    };
    
    img.src = objectUrl;
}

function grayOut(id) {
    const card = document.getElementById(id);
    card.classList.add('opacity-40', 'grayscale', 'pointer-events-none');
}

function resetUI() {
    base64String = "";
    document.getElementById('cameraInput').value = "";
    document.getElementById('fileInput').value = "";
    document.getElementById('previewContainer').classList.add('hidden');
    document.getElementById('scanBtn').disabled = true;
    document.getElementById('result').classList.add('hidden');
    
    // Remove Gray Out
    ['cameraCard', 'galleryCard'].forEach(id => {
        const card = document.getElementById(id);
        card.classList.remove('opacity-40', 'grayscale', 'pointer-events-none');
    });
}

// Keep your scanWaste() function exactly as it is
async function scanWaste() {
    const btn = document.getElementById('scanBtn');
    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('result');
    
    btn.disabled = true;
    btn.innerHTML = "Processing...";
    loading.classList.remove('hidden');
    resultBox.classList.add('hidden');
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ image: base64String })
        });
        
        const json = await response.json();
        
        if (json.status === 'success') {
            const data = json.data;
            
            document.getElementById('wasteType').innerText = data.wasteType;
            document.getElementById('value').innerText = data.estimatedValue;
            
            const score = data.recyclabilityScore;
            const bar = document.getElementById('scoreBar');
            document.getElementById('scoreText').innerText = score + "/100";
            
            let barColor = "#22c55e";
            if (score < 40) barColor = "#ef4444";
            else if (score < 75) barColor = "#eab308";
            bar.style.backgroundColor = barColor;
            
            setTimeout(() => { bar.style.width = score + "%"; }, 100);
            
            const stepsList = document.getElementById('steps');
            stepsList.innerHTML = '';
            data.recyclingSteps.forEach(step => {
                stepsList.innerHTML += `<li class="marker:text-orange-400">${step}</li>`;
            });
            
            const centersList = document.getElementById('centersList');
            const centerCount = document.getElementById('centerCount');
            centersList.innerHTML = '';
            
            if (data.centers && data.centers.length > 0) {
                centerCount.innerText = data.centers.length;
                data.centers.forEach(center => {
                    const li = document.createElement('li');
                    li.className = 'group bg-white border border-slate-200 p-4 rounded-xl hover:border-green-500 hover:shadow-md transition-all relative overflow-hidden';
                    li.innerHTML = `
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                        <div class="pl-2">
                            <span class="font-bold text-slate-800 block">${center.name}</span>
                            <div class="text-xs text-slate-500 mt-1">📍 ${center.address || 'Nagpur, Maharashtra'}</div>
                            <div class="mt-3 flex items-center justify-between">
                                <span class="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded uppercase font-bold">${center.type}</span>
                                <a href="tel:${center.phone}" class="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-100">📞 Call</a>
                            </div>
                        </div>`;
                    centersList.appendChild(li);
                });
            } else {
                centerCount.innerText = "0";
                centersList.innerHTML = `<li class="text-center text-slate-400 py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">No centers found.</li>`;
            }
            
            loading.classList.add('hidden');
            resultBox.classList.remove('hidden');
            resultBox.scrollIntoView({ behavior: 'smooth' });
            
        } else {
            alert('Server Error: ' + json.message);
        }
    } catch (error) {
        console.error(error);
        alert('Connection Failed.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = "Analyze & Find Centers";
        loading.classList.add('hidden');
    }
}