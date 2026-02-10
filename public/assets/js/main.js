function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  document.getElementById("mobileMenu").classList.add("hidden");
}

function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("hidden");
}

function simulateScan() {
  const resultBox = document.getElementById("scanResult");
  const results = [
    "Plastic Bottle – Recyclable",
    "Glass – Recyclable",
    "Banana Peel – Compostable",
    "Battery – Hazard Waste"
  ];
  resultBox.innerText = results[Math.floor(Math.random() * results.length)];
  resultBox.classList.remove("hidden");
}
 // --- Initialize Icons ---
        lucide.createIcons();

        // --- Navigation Logic ---
        function scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }

        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // --- Scanner Logic ---
        const fileInput = document.getElementById('file-input');
        const uploadPlaceholder = document.getElementById('upload-placeholder');
        const imagePreview = document.getElementById('image-preview');
        const analyzeBtn = document.getElementById('analyze-btn');
        const scannerLoader = document.getElementById('scanner-loader');
        const resultCard = document.getElementById('result-card');
        const scanEffect = document.getElementById('scan-effect');

        const mockResults = [
            { type: "Plastic (PET)", method: "Recyclable", color: "text-emerald-600", bg: "bg-emerald-50", icon: "recycle", tip: "Rinse and crush before binning.", statusClass: "bg-green-100 text-green-700" },
            { type: "Glass Bottle", method: "Recyclable", color: "text-teal-600", bg: "bg-teal-50", icon: "recycle", tip: "Remove cap/cork. Do not break.", statusClass: "bg-green-100 text-green-700" },
            { type: "Banana Peel", method: "Compostable", color: "text-amber-600", bg: "bg-amber-50", icon: "leaf", tip: "Place in green bin or home compost.", statusClass: "bg-amber-100 text-amber-700" },
            { type: "E-Waste (Battery)", method: "Special Hazard", color: "text-red-600", bg: "bg-red-50", icon: "trash-2", tip: "Do NOT trash. Find specialized drop-off.", statusClass: "bg-red-100 text-red-700" },
        ];

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                    uploadPlaceholder.classList.add('hidden');
                    analyzeBtn.classList.remove('hidden');
                    // Reset previous results
                    resultCard.classList.add('hidden');
                    resultCard.innerHTML = '';
                    scanEffect.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            }
        });

        analyzeBtn.addEventListener('click', () => {
            scannerLoader.classList.remove('hidden');
            analyzeBtn.classList.add('hidden');
            
            // Simulate AI Delay
            setTimeout(() => {
                scannerLoader.classList.add('hidden');
                const result = mockResults[Math.floor(Math.random() * mockResults.length)];
                
                resultCard.innerHTML = `
                    <div class="p-4 rounded-xl border ${result.bg} border-opacity-50">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <h4 class="text-sm uppercase tracking-wide text-slate-500 font-semibold">Detected Material</h4>
                                <p class="text-2xl font-bold ${result.color}">${result.type}</p>
                            </div>
                            <div class="p-2 rounded-lg ${result.bg} ${result.color}">
                                <i data-lucide="${result.icon}" class="w-6 h-6"></i>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-200">
                            <div class="flex items-center gap-2 mb-1">
                                <i data-lucide="info" class="w-4 h-4 text-slate-400"></i>
                                <span class="font-semibold text-slate-700">Disposal Guide:</span>
                            </div>
                            <p class="text-slate-600 text-sm">${result.tip}</p>
                            <div class="mt-4">
                                <span class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${result.statusClass}">
                                    ${result.method}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onclick="resetScanner()" class="w-full mt-4 text-slate-500 hover:text-slate-700 text-sm font-medium">
                        Scan Another Item
                    </button>
                `;
                
                resultCard.classList.remove('hidden');
                scanEffect.classList.add('hidden');
                lucide.createIcons(); // Re-render icons for new content
            }, 2000);
        });

        function resetScanner() {
            fileInput.value = '';
            imagePreview.src = '';
            imagePreview.classList.add('hidden');
            uploadPlaceholder.classList.remove('hidden');
            resultCard.classList.add('hidden');
            resultCard.innerHTML = '';
        }

        // --- Location Map Logic ---
        const centersData = [
            { id: 1, name: "EcoHub Central", type: "mixed", lat: 40, left: '30%', top: '40%', status: 'Open', color: 'bg-emerald-500' },
            { id: 2, name: "City Glassworks", type: "glass", lat: 30, left: '60%', top: '25%', status: 'Open', color: 'bg-teal-500' },
            { id: 3, name: "TechRetire E-Waste", type: "ewaste", lat: 60, left: '75%', top: '65%', status: 'Closing Soon', color: 'bg-red-500' },
            { id: 4, name: "Green Soil Compost", type: "bio", lat: 50, left: '20%', top: '70%', status: 'Open', color: 'bg-amber-500' },
        ];

        let activeFilter = 'all';
        let activeCenterId = null;

        function renderMap() {
            const container = document.getElementById('map-pins-container');
            const listContainer = document.getElementById('centers-list');
            
            container.innerHTML = '';
            listContainer.innerHTML = '';

            const filtered = activeFilter === 'all' 
                ? centersData 
                : centersData.filter(c => c.type === activeFilter);

            // Render List and Pins
            filtered.forEach(center => {
                // 1. Render Sidebar List Item
                const listItem = document.createElement('div');
                const isActive = activeCenterId === center.id;
                
                listItem.className = `p-4 rounded-xl border cursor-pointer transition-all ${isActive ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'}`;
                listItem.onclick = () => {
                    activeCenterId = center.id;
                    renderMap(); // Re-render to update active states
                };

                listItem.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold text-slate-800">${center.name}</h4>
                        <span class="text-xs px-2 py-0.5 rounded-full ${center.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}">
                            ${center.status}
                        </span>
                    </div>
                    <p class="text-sm text-slate-500 flex items-center gap-1 mb-2">
                        <i data-lucide="map-pin" class="w-3 h-3"></i> 1.2 miles away
                    </p>
                    <div class="flex gap-2 text-xs">
                        <span class="px-2 py-1 bg-slate-100 rounded text-slate-600 capitalize">${center.type === 'mixed' ? 'General Recycle' : center.type}</span>
                    </div>
                `;
                listContainer.appendChild(listItem);

                // 2. Render Map Pin
                const pin = document.createElement('div');
                pin.className = `absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 z-10`;
                pin.style.left = center.left;
                pin.style.top = center.top;
                pin.onclick = () => {
                    activeCenterId = center.id;
                    renderMap();
                };

                let popupHtml = '';
                if (isActive) {
                    popupHtml = `
                        <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-xl shadow-xl w-48 text-center animate-fadeIn z-20 pointer-events-none">
                            <h5 class="font-bold text-slate-800 text-sm">${center.name}</h5>
                            <p class="text-xs text-slate-500 mt-1">Accepts: <span class="capitalize">${center.type}</span></p>
                            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                        </div>
                    `;
                }

                pin.innerHTML = `
                    <div class="relative flex items-center justify-center w-10 h-10 ${center.color} rounded-full shadow-lg border-2 border-white">
                        <i data-lucide="recycle" class="w-5 h-5 text-white"></i>
                        ${isActive ? '<div class="absolute w-full h-full rounded-full bg-white opacity-30 animate-ping"></div>' : ''}
                    </div>
                    ${popupHtml}
                `;
                
                container.appendChild(pin);
            });

            lucide.createIcons();
        }

        function filterCenters(type) {
            activeFilter = type;
            activeCenterId = null; // Reset selection on filter change
            
            // Update button styles
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if(btn.dataset.type === type) {
                    btn.classList.remove('bg-slate-100', 'text-slate-600');
                    btn.classList.add('bg-slate-800', 'text-white');
                } else {
                    btn.classList.add('bg-slate-100', 'text-slate-600');
                    btn.classList.remove('bg-slate-800', 'text-white');
                }
            });

            renderMap();
        }

        // Initial Render
        renderMap();

