 // 1. Icon Initialization
 lucide.createIcons();
 
 // 2. Tab Switching Logic
 function switchTab(tabId) {
   // Hide all sections
   document.querySelectorAll('.tab-content').forEach(el => {
     el.classList.add('hidden');
   });
   
   // Show selected section
   document.getElementById('section-' + tabId).classList.remove('hidden');
   
   // Update Page Title
   const titles = {
     'overview': 'Dashboard Overview',
     'scanner': 'AI Waste Scanner',
     'map': 'Find Recycling Centers',
     'rewards': 'Rewards Store',
     'profile': 'My Profile',
     'report': 'Report Waste',
     'challenge': 'Daily Challenge'
   };
   document.getElementById('page-title').innerText = titles[tabId];
   
   // Update Sidebar Active State
   document.querySelectorAll('.nav-btn').forEach(btn => {
     // Reset styles
     btn.classList.remove('bg-emerald-600/10', 'text-emerald-400', 'border-emerald-500');
     btn.classList.add('text-slate-400', 'border-transparent');
   });
   
   // Set active style
   const activeBtn = document.getElementById('nav-' + tabId);
   activeBtn.classList.remove('text-slate-400', 'border-transparent');
   activeBtn.classList.add('bg-emerald-600/10', 'text-emerald-400', 'border-emerald-500');
   
   // Trigger Map Resize if map is shown (fixes Leaflet grey box issue)
   if (tabId === 'map') {
     setTimeout(() => { map.invalidateSize(); }, 100);
   }
 }
 
 // 3. Scanner Simulation Logic
 function simulateScan() {
   const placeholder = document.getElementById('upload-placeholder');
   const imageView = document.getElementById('scan-image-view');
   const resultEmpty = document.getElementById('scan-result-empty');
   const resultSuccess = document.getElementById('scan-result-success');
   
   // Show Scanning UI
   placeholder.classList.add('hidden');
   imageView.classList.remove('hidden');
   
   // After 2 seconds, show results
   setTimeout(() => {
     resultEmpty.classList.add('hidden');
     resultSuccess.classList.remove('hidden');
     resultSuccess.classList.add('animate-fadeIn');
   }, 2500);
 }
 
 // 4. Chart Initialization
 const ctx = document.getElementById('overviewChart').getContext('2d');
 new Chart(ctx, {
   type: 'bar',
   data: {
     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
     datasets: [{
       label: 'Items Recycled',
       data: [12, 19, 8, 15, 22, 30, 18],
       backgroundColor: '#10b981',
       borderRadius: 6,
     }]
   },
   options: {
     responsive: true,
     maintainAspectRatio: false,
     scales: {
       y: { beginAtZero: true, grid: { display: false } },
       x: { grid: { display: false } }
     }
   }
 });




/*


 var map = L.map('map-container').setView([51.505, -0.09], 13);
 
 L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
   attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
 }).addTo(map);
 
 
 L.marker([51.505, -0.09]).addTo(map)
   .bindPopup('<b>Green City Recyclers</b><br>Plastic & Paper').openPopup();
 
 L.marker([51.51, -0.1]).addTo(map)
   .bindPopup('<b>Tech Dump E-Waste</b><br>Electronics Only');
   
       */
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
        
        const recyclers = [
            
  {
    "id": 1,
    "name": "Dharampeth Plastic Recycling Center",
    "type": "plastic",
    "lat": 21.108019,
    "lng": 79.035749,
    "address": "Dharampeth, Nagpur, Maharashtra, India",
    "phone": "+91 9931565564",
    "rating": 3.9
  },
  {
    "id": 2,
    "name": "Manewada Glass Recycling Center",
    "type": "glass",
    "lat": 21.208685,
    "lng": 79.177788,
    "address": "Manewada, Nagpur, Maharashtra, India",
    "phone": "+91 9295901811",
    "rating": 3.7
  },
  {
    "id": 3,
    "name": "Mahal Paper Recycling Center",
    "type": "paper",
    "lat": 21.231286,
    "lng": 79.160786,
    "address": "Mahal, Nagpur, Maharashtra, India",
    "phone": "+91 9309520465",
    "rating": 4.7
  },
  {
    "id": 4,
    "name": "Dharampeth Glass Recycling Center",
    "type": "glass",
    "lat": 21.231779,
    "lng": 79.198636,
    "address": "Dharampeth, Nagpur, Maharashtra, India",
    "phone": "+91 9370862926",
    "rating": 4.0
  },
  {
    "id": 5,
    "name": "Itwari Glass Recycling Center",
    "type": "glass",
    "lat": 21.126509,
    "lng": 78.970374,
    "address": "Itwari, Nagpur, Maharashtra, India",
    "phone": "+91 9266761145",
    "rating": 5.0
  },
  {
    "id": 6,
    "name": "Nandanvan Plastic Recycling Center",
    "type": "plastic",
    "lat": 21.053691,
    "lng": 79.168907,
    "address": "Nandanvan, Nagpur, Maharashtra, India",
    "phone": "+91 9243491915",
    "rating": 3.7
  },
  {
    "id": 7,
    "name": "Sitabuldi Plastic Recycling Center",
    "type": "plastic",
    "lat": 21.053027,
    "lng": 79.062071,
    "address": "Sitabuldi, Nagpur, Maharashtra, India",
    "phone": "+91 9808763175",
    "rating": 4.4
  },
  {
    "id": 8,
    "name": "Itwari Plastic Recycling Center",
    "type": "plastic",
    "lat": 21.068187,
    "lng": 79.045093,
    "address": "Itwari, Nagpur, Maharashtra, India",
    "phone": "+91 9665197872",
    "rating": 4.4
  },
  {
    "id": 9,
    "name": "Sadar Scrap Recycling Center",
    "type": "scrap",
    "lat": 21.060302,
    "lng": 79.161147,
    "address": "Sadar, Nagpur, Maharashtra, India",
    "phone": "+91 9633258438",
    "rating": 4.8
  },
  {
    "id": 10,
    "name": "Pratap Nagar Ewaste Recycling Center",
    "type": "ewaste",
    "lat": 21.082795,
    "lng": 79.059853,
    "address": "Pratap Nagar, Nagpur, Maharashtra, India",
    "phone": "+91 9123463311",
    "rating": 4.6
  },
  {
    "id": 11,
    "name": "Pratap Nagar Paper Recycling Center",
    "type": "paper",
    "lat": 21.092402,
    "lng": 78.997871,
    "address": "Pratap Nagar, Nagpur, Maharashtra, India",
    "phone": "+91 9364829088",
    "rating": 3.7
  },
  {
    "id": 12,
    "name": "Dharampeth Ewaste Recycling Center",
    "type": "ewaste",
    "lat": 21.201148,
    "lng": 78.99475,
    "address": "Dharampeth, Nagpur, Maharashtra, India",
    "phone": "+91 9890372683",
    "rating": 4.3
  },
  {
    "id": 13,
    "name": "Kamptee Road Paper Recycling Center",
    "type": "paper",
    "lat": 21.083931,
    "lng": 79.03962,
    "address": "Kamptee Road, Nagpur, Maharashtra, India",
    "phone": "+91 9618037584",
    "rating": 4.2
  },
  {
    "id": 14,
    "name": "Manewada Metal Recycling Center",
    "type": "metal",
    "lat": 21.182326,
    "lng": 79.029937,
    "address": "Manewada, Nagpur, Maharashtra, India",
    "phone": "+91 9930374282",
    "rating": 4.6
  },
  {
    "id": 15,
    "name": "Jaripatka Ewaste Recycling Center",
    "type": "ewaste",
    "lat": 21.119304,
    "lng": 79.146741,
    "address": "Jaripatka, Nagpur, Maharashtra, India",
    "phone": "+91 9863059344",
    "rating": 4.1
  },
  {
    "id": 16,
    "name": "Wardhaman Nagar Paper Recycling Center",
    "type": "paper",
    "lat": 21.1217,
    "lng": 79.066782,
    "address": "Wardhaman Nagar, Nagpur, Maharashtra, India",
    "phone": "+91 9274162473",
    "rating": 3.6
  },
  {
    "id": 17,
    "name": "Kamptee Road Ewaste Recycling Center",
    "type": "ewaste",
    "lat": 21.068114,
    "lng": 78.984029,
    "address": "Kamptee Road, Nagpur, Maharashtra, India",
    "phone": "+91 9627930472",
    "rating": 4.3
  },
  {
    "id": 18,
    "name": "Itwari Scrap Recycling Center",
    "type": "scrap",
    "lat": 21.055817,
    "lng": 78.999374,
    "address": "Itwari, Nagpur, Maharashtra, India",
    "phone": "+91 9411964840",
    "rating": 4.4
  },
  {
    "id": 19,
    "name": "Itwari Metal Recycling Center",
    "type": "metal",
    "lat": 21.08013,
    "lng": 79.048356,
    "address": "Itwari, Nagpur, Maharashtra, India",
    "phone": "+91 9261116978",
    "rating": 4.8
  },
  {
    "id": 20,
    "name": "Itwari Plastic Recycling Center",
    "type": "plastic",
    "lat": 21.054009,
    "lng": 79.05305,
    "address": "Itwari, Nagpur, Maharashtra, India",
    "phone": "+91 9827457713",
    "rating": 5.0
  },
  {
    "id": 21,
    "name": "Koradi Road Ewaste Recycling Center",
    "type": "ewaste",
    "lat": 21.101758,
    "lng": 78.969789,
    "address": "Koradi Road, Nagpur, Maharashtra, India",
    "phone": "+91 9929992683",
    "rating": 3.9
  },
  {
    "id": 22,
    "name": "Pratap Nagar Glass Recycling Center",
    "type": "glass",
    "lat": 21.09795,
    "lng": 79.158548,
    "address": "Pratap Nagar, Nagpur, Maharashtra, India",
    "phone": "+91 9573747139",
    "rating": 3.6
  },
  {
    "id": 23,
    "name": "Wardhaman Nagar Glass Recycling Center",
    "type": "glass",
    "lat": 21.10486,
    "lng": 79.148677,
    "address": "Wardhaman Nagar, Nagpur, Maharashtra, India",
    "phone": "+91 9437799356",
    "rating": 3.6
  },
  {
    "id": 24,
    "name": "Mahal Scrap Recycling Center",
    "type": "scrap",
    "lat": 21.182479,
    "lng": 79.146892,
    "address": "Mahal, Nagpur, Maharashtra, India",
    "phone": "+91 9172073046",
    "rating": 3.5
  },
  {
    "id": 25,
    "name": "Kamptee Road Paper Recycling Center",
    "type": "paper",
    "lat": 21.112347,
    "lng": 79.120613,
    "address": "Kamptee Road, Nagpur, Maharashtra, India",
    "phone": "+91 9603426121",
    "rating": 4.9
  },
  {
    "id": 26,
    "name": "Manewada Glass Recycling Center",
    "type": "glass",
    "lat": 21.084778,
    "lng": 79.089565,
    "address": "Manewada, Nagpur, Maharashtra, India",
    "phone": "+91 9409405068",
    "rating": 4.7
  },
  {
    "id": 27,
    "name": "Dharampeth Ewaste Recycling Center",
    "type": "ewaste",
    "lat": 21.119658,
    "lng": 78.97331,
    "address": "Dharampeth, Nagpur, Maharashtra, India",
    "phone": "+91 9776673972",
    "rating": 4.6
  },
  {
    "id": 28,
    "name": "Dharampeth Paper Recycling Center",
    "type": "paper",
    "lat": 21.080874,
    "lng": 79.018198,
    "address": "Dharampeth, Nagpur, Maharashtra, India",
    "phone": "+91 9517318988",
    "rating": 4.7
  },
  {
    "id": 29,
    "name": "Mahal Glass Recycling Center",
    "type": "glass",
    "lat": 21.089309,
    "lng": 79.151704,
    "address": "Mahal, Nagpur, Maharashtra, India",
    "phone": "+91 9273140505",
    "rating": 4.2
  },
  {
    "id": 30,
    "name": "Itwari Glass Recycling Center",
    "type": "glass",
    "lat": 21.091501,
    "lng": 79.134815,
    "address": "Itwari, Nagpur, Maharashtra, India",
    "phone": "+91 9275025676",
    "rating": 3.5
  },
  {
    "id": 31,
    "name": "Itwari Scrap Recycling Center",
    "type": "scrap",
    "lat": 21.179878,
    "lng": 79.16137,
    "address": "Itwari, Nagpur, Maharashtra, India",
    "phone": "+91 9410694214",
    "rating": 4.1
  },
  {
    "id": 32,
    "name": "Jaripatka Plastic Recycling Center",
    "type": "plastic",
    "lat": 21.091218,
    "lng": 79.066011,
    "address": "Jaripatka, Nagpur, Maharashtra, India",
    "phone": "+91 9695392925",
    "rating": 3.8
  },
  {
    "id": 33,
    "name": "Itwari Scrap Recycling Center",
    "type": "scrap",
    "lat": 21.162834,
    "lng": 79.015195,
    "address": "Itwari, Nagpur, Maharashtra, India",
    "phone": "+91 9565949228",
    "rating": 3.8
  },
  {
    "id": 34,
    "name": "Mahal Metal Recycling Center",
    "type": "metal",
    "lat": 21.073236,
    "lng": 78.99654,
    "address": "Mahal, Nagpur, Maharashtra, India",
    "phone": "+91 9227258217",
    "rating": 4.2
  },
  {
    "id": 35,
    "name": "Besa Paper Recycling Center",
    "type": "paper",
    "lat": 21.073508,
    "lng": 79.18036,
    "address": "Besa, Nagpur, Maharashtra, India",
    "phone": "+91 9819605225",
    "rating": 4.8
  },
  {
    "id": 36,
    "name": "Dharampeth Ewaste Recycling Center",
    "type": "ewaste",
    "lat": 21.051283,
    "lng": 78.96469,
    "address": "Dharampeth, Nagpur, Maharashtra, India",
    "phone": "+91 9865863826",
    "rating": 5.0
  },
  {
    "id": 37,
    "name": "Manewada Ewaste Recycling Center",
    "type": "ewaste",
    "lat": 21.087488,
    "lng": 79.193751,
    "address": "Manewada, Nagpur, Maharashtra, India",
    "phone": "+91 9378002222",
    "rating": 4.0
  },
  {
    "id": 38,
    "name": "Mankapur Metal Recycling Center",
    "type": "metal",
    "lat": 21.121247,
    "lng": 78.997846,
    "address": "Mankapur, Nagpur, Maharashtra, India",
    "phone": "+91 9622838420",
    "rating": 4.4
  },
  {
    "id": 39,
    "name": "Besa Metal Recycling Center",
    "type": "metal",
    "lat": 21.098812,
    "lng": 79.029889,
    "address": "Besa, Nagpur, Maharashtra, India",
    "phone": "+91 9644011540",
    "rating": 4.3
  },
  {
    "id": 40,
    "name": "Sadar Ewaste Recycling Center",
    "type": "ewaste",
    "lat": 21.195303,
    "lng": 78.986152,
    "address": "Sadar, Nagpur, Maharashtra, India",
    "phone": "+91 9281953957",
    "rating": 4.3
  },
  {
    "id": 41,
    "name": "Manewada Glass Recycling Center",
    "type": "glass",
    "lat": 21.148405,
    "lng": 79.02042,
    "address": "Manewada, Nagpur, Maharashtra, India",
    "phone": "+91 9408911690",
    "rating": 4.5
  },
  {
    "id": 42,
    "name": "Hingna Metal Recycling Center",
    "type": "metal",
    "lat": 21.138077,
    "lng": 79.154464,
    "address": "Hingna, Nagpur, Maharashtra, India",
    "phone": "+91 9960126509",
    "rating": 4.3
  },
  {
    "id": 43,
    "name": "Wardhaman Nagar Scrap Recycling Center",
    "type": "scrap",
    "lat": 21.077863,
    "lng": 79.0322,
    "address": "Wardhaman Nagar, Nagpur, Maharashtra, India",
    "phone": "+91 9428893210",
    "rating": 4.0
  },
  {
    "id": 44,
    "name": "Itwari Metal Recycling Center",
    "type": "metal",
    "lat": 21.175759,
    "lng": 79.019138,
    "address": "Itwari, Nagpur, Maharashtra, India",
    "phone": "+91 9261336791",
    "rating": 4.2
  },
  {
    "id": 45,
    "name": "Dharampeth Paper Recycling Center",
    "type": "paper",
    "lat": 21.13271,
    "lng": 79.191567,
    "address": "Dharampeth, Nagpur, Maharashtra, India",
    "phone": "+91 9648319380",
    "rating": 4.2
  },
  {
    "id": 46,
    "name": "Pratap Nagar Scrap Recycling Center",
    "type": "scrap",
    "lat": 21.078119,
    "lng": 79.041003,
    "address": "Pratap Nagar, Nagpur, Maharashtra, India",
    "phone": "+91 9181526807",
    "rating": 3.5
  },
  {
    "id": 47,
    "name": "Mankapur Scrap Recycling Center",
    "type": "scrap",
    "lat": 21.166496,
    "lng": 79.102327,
    "address": "Mankapur, Nagpur, Maharashtra, India",
    "phone": "+91 9286294954",
    "rating": 4.6
  },
  {
    "id": 48,
    "name": "Nandanvan Metal Recycling Center",
    "type": "metal",
    "lat": 21.072809,
    "lng": 78.980702,
    "address": "Nandanvan, Nagpur, Maharashtra, India",
    "phone": "+91 9175016829",
    "rating": 4.0
  },
  {
    "id": 49,
    "name": "Besa Plastic Recycling Center",
    "type": "plastic",
    "lat": 21.226609,
    "lng": 79.086722,
    "address": "Besa, Nagpur, Maharashtra, India",
    "phone": "+91 9516295528",
    "rating": 4.6
  },
  {
    "id": 50,
    "name": "Hingna Plastic Recycling Center",
    "type": "plastic",
    "lat": 21.190222,
    "lng": 79.123238,
    "address": "Hingna, Nagpur, Maharashtra, India",
    "phone": "+91 9607037862",
    "rating": 3.9
  }

            ];

     
        function getIcon(type) {
            let color = 'gray';
            let iconName = 'recycle';
            
            if(type === 'ewaste') { color = 'purple'; iconName = 'cpu'; }
            if(type === 'plastic') { color = 'blue'; iconName = 'milk'; }
            if(type === 'metal') { color = 'orange'; iconName = 'wrench'; }
            if(type === 'paper') { color = 'green'; iconName = 'file-text'; }
            
            const html = `
                <div class="relative w-10 h-10 flex items-center justify-center bg-white rounded-full border-4 border-${color}-500 shadow-lg transform hover:scale-110 transition-transform">
                    <i data-lucide="${iconName}" class="w-5 h-5 text-${color}-600"></i>
                    <div class="absolute -bottom-1 w-2 h-2 bg-${color}-500 rotate-45"></div>
                </div>
            `;
            
            return L.divIcon({
                className: 'custom-pin',
                html: html,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        }

       
        const map = L.map('map').setView([21.1458, 79.0882], 11);

      
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        let markersLayer = L.layerGroup().addTo(map);

      
        function renderMarkers(filterType = 'all') {
            markersLayer.clearLayers(); 
            
            recyclers.forEach(loc => {
                if (filterType === 'all' || loc.type === filterType) {
                    
                    
                    const popupContent = `
                        <div class="p-0 font-sans">
                            <div class="bg-gray-800 text-white p-3 flex justify-between items-center">
                                <span class="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">${loc.type}</span>
                                <span class="text-yellow-400 text-xs font-bold px-5">★ ${loc.rating}</span>
                            </div>
                            <div class="p-4">
                                <h3 class="font-bold text-gray-800 text-lg mb-1">${loc.name}</h3>
                                <p class="text-sm text-gray-500 mb-3 flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin shrink-0 mt-0.5"><path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    ${loc.address}
                                </p>
                                <a href="tel:${loc.phone}" class="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 shadow-lg rounded-lg transition-colors">
                                    Contact Now
                                </a>
                            </div>
                        </div>
                    `;

                   
                    L.marker([loc.lat, loc.lng], { icon: getIcon(loc.type) })
                     .bindPopup(popupContent)
                     .addTo(markersLayer);
                }
            });
            
            
            lucide.createIcons();
        }
        
        /* Start map list */
        
  function renderList(filterType = 'all') {
    const listContainer = document.getElementById('nearby-list');
    const countLabel = document.getElementById('list-count');
    
    // 1. Clear the current list
    listContainer.innerHTML = '';

    // 2. Filter the data (using your existing recyclers array)
    const filteredData = recyclers.filter(loc => filterType === 'all' || loc.type === filterType);

    // 3. Update the "X locations found" text
    if (countLabel) {
        countLabel.innerText = `${filteredData.length} locations found`;
    }

    // 4. Generate HTML for each location
    filteredData.forEach(loc => {
        // Optional: specific styling based on type
        let typeColor = 'emerald';
        if(loc.type === 'ewaste') typeColor = 'purple';
        if(loc.type === 'plastic') typeColor = 'blue';
        if(loc.type === 'metal') typeColor = 'orange';
        if(loc.type === 'paper') typeColor = 'green';

        // Create the HTML card
        const itemHtml = `
            <div class="p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-${typeColor}-100 transition-all cursor-pointer group" 
                 onclick="map.flyTo([${loc.lat}, ${loc.lng}], 16)">
                
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-slate-800 group-hover:text-${typeColor}-700">${loc.name}</h4>
                    <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Open</span>
                </div>

                <p class="text-sm text-slate-500 mt-1">${loc.address}</p>
                <div class="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span class="capitalize font-medium text-${typeColor}-600 bg-${typeColor}-50 px-1.5 rounded">${loc.type}</span>
                    <span>★ ${loc.rating}</span>
                </div>
                
                <div class="mt-3 flex gap-2">
                     <button onclick="window.location.href='tel:${loc.phone}'" class="text-xs flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors">
                        <i data-lucide="phone" class="w-3 h-3"></i> Call
                    </button>
                    <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}')" class="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
                        <i data-lucide="navigation" class="w-3 h-3"></i> Navigate
                    </button>
                </div>
            </div>
        `;
        
        // Append the new item to the container
        listContainer.insertAdjacentHTML('beforeend', itemHtml);
    });

    // 5. Refresh icons so the new navigation/phone icons appear
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
 
        /* end Map list */
       
        
        function filterMap(type) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
   // Ensure event exists before accessing it (safe check)
    if(event) {
  
  event.currentTarget.classList.add('active');
      
    }

  renderMarkers(type);
  renderList(type);
}
 
        
        function locateUser() {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser");
                return;
            }

           
            const btn = document.querySelector('button[onclick="locateUser()"]');
            btn.innerHTML = '<div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                  
                    map.flyTo([latitude, longitude], 14, {
                        animate: true,
                        duration: 1.5
                    });

                   
                    L.marker([latitude, longitude], {
                        icon: L.divIcon({
                            className: 'user-pin',
                            html: `<div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg pulse-ring"></div>`,
                            iconSize: [20, 20]
                        })
                    }).addTo(map).bindPopup("You are here!").openPopup();

                    
                    btn.innerHTML = '<i data-lucide="crosshair" class="w-6 h-6"></i>';
                    lucide.createIcons();
                },
                () => {
                    alert("Unable to retrieve your location.");
                    btn.innerHTML = '<i data-lucide="crosshair" class="w-6 h-6"></i>';
                    lucide.createIcons();
                }
            );
        }

        
        window.addEventListener('load', () => {
            renderMarkers();
            renderList();
            lucide.createIcons();
            
           
            setTimeout(() => {
                document.getElementById('pageLoader').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('pageLoader').style.display = 'none';
                }, 500);
            }, 1500);
        });

 // Toggle Sidebar Function
  function toggleSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  // Toggle the translate class
  sidebar.classList.toggle('-translate-x-full');
  
  // Toggle visibility of overlay
  if (overlay.classList.contains('hidden')) {
    overlay.classList.remove('hidden');
    // Small delay to allow display:block to apply before opacity transition
    setTimeout(() => {
      overlay.classList.remove('opacity-0');
    }, 10);
  } else {
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300); // Wait for fade out
  }
}

// Initialize Lucide icons if not already done
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}
