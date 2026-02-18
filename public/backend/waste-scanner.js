// ⚠️ REPLACE THIS URL WITH YOUR GOOGLE SCRIPT DEPLOYMENT URL
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxiZEriu06P5OxWu-_VstAm1d1xqo4_gBPnkWvvkCIdCHIrWvwgXDCZm5NLf7XFbPwT/exec';
        
        let base64String = "";

        // Preview the uploaded image
        function previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.getElementById('preview');
                    img.src = e.target.result;
                    img.classList.remove('hidden'); // Show image using Tailwind
                    base64String = e.target.result.split(',')[1];
                    
                    // Enable button
                    const btn = document.getElementById('scanBtn');
                    btn.disabled = false;
                    btn.classList.remove('opacity-50', 'cursor-not-allowed');
                    
                    // Hide old results
                    document.getElementById('result').classList.add('hidden'); 
                }
                reader.readAsDataURL(file);
            }
        }

        async function scanWaste() {
            const btn = document.getElementById('scanBtn');
            const loading = document.getElementById('loading');
            const resultBox = document.getElementById('result');
            
            // UI State: Loading
            btn.disabled = true;
            btn.innerHTML = "Processing...";
            loading.classList.remove('hidden');
            resultBox.classList.add('hidden');

            try {
                // Send to Backend
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ image: base64String })
                });

                const json = await response.json();

                if (json.status === 'success') {
                    const data = json.data;

                    // --- 1. Populate Basic Data ---
                    document.getElementById('wasteType').innerText = data.wasteType;
                    document.getElementById('value').innerText = data.estimatedValue;
                    
                    // --- 2. Animate Score Bar ---
                    const score = data.recyclabilityScore;
                    const bar = document.getElementById('scoreBar');
                    document.getElementById('scoreText').innerText = score + "/100";
                    
                    // Color Logic (Tailwind classes would be dynamic, but inline style works best for variable width/color here)
                    let barColor = "#22c55e"; // Green-500
                    if(score < 40) barColor = "#ef4444"; // Red-500
                    else if(score < 75) barColor = "#eab308"; // Yellow-500
                    
                    bar.style.backgroundColor = barColor;
                    
                    // Trigger animation
                    setTimeout(() => { bar.style.width = score + "%"; }, 100);

                    // --- 3. Populate Steps (With Tailwind Classes) ---
                    const stepsList = document.getElementById('steps');
                    stepsList.innerHTML = ''; 
                    data.recyclingSteps.forEach(step => {
                        stepsList.innerHTML += `<li class="marker:text-orange-400">${step}</li>`;
                    });

                    // --- 4. Populate Centers List (With Tailwind Classes) ---
                    const centersList = document.getElementById('centersList');
                    const centerCount = document.getElementById('centerCount');
                    centersList.innerHTML = ''; 
                    
                    if (data.centers && data.centers.length > 0) {
                        centerCount.innerText = data.centers.length;
                        
                        data.centers.forEach(center => {
                            // JS creates HTML string with Tailwind classes
                            const li = document.createElement('li');
                            li.className = 'group bg-white border border-slate-200 p-4 rounded-xl hover:border-green-500 hover:shadow-md hover:-translate-y-1 transition-all duration-200 relative overflow-hidden';
                            li.innerHTML = `
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-xl"></div>
                                <div class="pl-2">
                                    <span class="font-bold text-slate-800 text-lg block group-hover:text-green-700 transition-colors">${center.name}</span>
                                    <div class="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                        <span>📍 ${center.address || 'Nagpur, Maharashtra'}</span>
                                    </div>
                                    <div class="mt-3 flex items-center justify-between">
                                        <span class="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded uppercase font-bold tracking-wider">${center.type}</span>
                                        <a href="tel:${center.phone}" class="bg-green-50 text-green-700 text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1">
                                            📞 Call
                                        </a>
                                    </div>
                                </div>
                            `;
                            centersList.appendChild(li);
                        });
                    } else {
                        centerCount.innerText = "0";
                        centersList.innerHTML = `
                            <li class="text-center text-slate-400 py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                No specific centers found for this waste type.
                            </li>`;
                    }

                    // Show Results
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
