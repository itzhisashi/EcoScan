  // --- CONFIGURATION ---
  const JSON_FILE = 'nagpur_recycling_pincode.json'; // Your file name
  let map, markersLayer, userMarker;
  let allRecyclers = [];
  
  // --- 1. INITIALIZE MAP ---
  function initMap() {
      // Start centered on India or a default location
      map = L.map('map').setView([21.1458, 79.0882], 13); // Default Nagpur
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      markersLayer = L.layerGroup().addTo(map);
  }
  
  // --- 2. LOAD JSON DATA ---
  async function loadData() {
      const status = document.getElementById('statusMsg');
      try {
          status.innerText = "Loading database...";
          const response = await fetch(JSON_FILE);
          if (!response.ok) throw new Error("File not found");
          
          allRecyclers = await response.json();
          status.innerText = `Database loaded: ${allRecyclers.length} centers.`;
          
          // Show all initially
          plotMarkers(allRecyclers);
          
      } catch (error) {
          console.error(error);
          status.innerHTML = `<span class="text-red-500">Error: Could not load '${JSON_FILE}'. Ensure you are running a local server.</span>`;
      }
  }
  
  // --- 3. CORE LOGIC: FIND NEARBY ---
  async function findNearby() {
      const pin = document.getElementById('pincode').value.trim();
      const status = document.getElementById('statusMsg');
      
      if (!pin) {
          status.innerText = "Please enter a PIN code.";
          return;
      }
      
      status.innerText = `Searching location for ${pin}...`;
      
      try {
          // Step A: Geocode PIN (Get Lat/Lng from text)
          const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${pin}&countrycodes=in&limit=1`;
          const geoRes = await fetch(geoUrl);
          const geoData = await geoRes.json();
          
          if (!geoData || geoData.length === 0) {
              status.innerHTML = `<span class="text-red-500">Location not found for PIN ${pin}</span>`;
              return;
          }
          
          const userLat = parseFloat(geoData[0].lat);
          const userLng = parseFloat(geoData[0].lon);
          const displayName = geoData[0].display_name;
          
          // Step B: Calculate distances
          const nearbyData = allRecyclers.map(site => {
              const dist = getDistanceFromLatLonInKm(userLat, userLng, site.lat, site.lng);
              return { ...site, distance: dist };
          });
          
          // Step C: Sort by closest distance
          nearbyData.sort((a, b) => a.distance - b.distance);
          
          // Step D: Filter (e.g., show top 5 closest)
          const topResults = nearbyData.slice(0, 5);
          
          // Step E: Update Map & UI
          updateMapWithResults(userLat, userLng, topResults, displayName);
          updateSidebar(topResults);
          
          status.innerText = `Found ${topResults.length} centers near ${pin}.`;
          
      } catch (err) {
          console.error(err);
          status.innerText = "Error searching. Check internet.";
      }
  }
  
  // --- 4. MAP UPDATE HELPER ---
  function updateMapWithResults(lat, lng, results, locName) {
      markersLayer.clearLayers();
      if (userMarker) map.removeLayer(userMarker);
      
      // 1. Add User Marker (Blue Pulse)
      const userIcon = L.divIcon({
          className: 'user-marker',
          html: `<div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg">
                        <div class="absolute -inset-2 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
                       </div>`,
          iconSize: [20, 20]
      });
      userMarker = L.marker([lat, lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`<span style="padding:20px;text-align:left;"><b>Your Search Area:</b><br>${locName}</span>`)
          .openPopup();
      
      // 2. Add Factory Markers
      plotMarkers(results);
      
      // 3. Zoom to fit
      const group = new L.featureGroup([
          userMarker,
          ...results.map(r => L.marker([r.lat, r.lng]))
      ]);
      map.flyToBounds(group.getBounds(), { padding: [50, 50], duration: 1.5 });
  }
  
  // --- 5. PLOT MARKERS ---
  function plotMarkers(data) {
      data.forEach(loc => {
          const icon = getIcon(loc.type);
          const popup = `
                    <div class="font-sans">
                        <div class="bg-gray-800 text-white p-2 rounded-t text-xs font-bold uppercase flex justify-between">
                            <span>${loc.type}</span>
                                                            <span class="text-yellow-400 text-xs font-bold px-5">★ ${loc.rating}</span>
                               
                        </div>
                        <div class="p-3">
                            <h3 class="font-bold text-sm">${loc.name}</h3>
                            <p class="text-xs text-gray-500 my-1">${loc.address}</p>
                            ${loc.distance ? `<p class="text-xs font-semibold text-green-600 mb-2">${loc.distance.toFixed(1)} km away</p>` : ''}
                            <a href="tel:${loc.phone}" class="block text-center bg-green-100 text-green-700 text-xs font-bold py-1.5 rounded hover:bg-green-200">Call Now</a>
                        </div>
                    </div>
                `;
          L.marker([loc.lat, loc.lng], { icon: icon }).addTo(markersLayer).bindPopup(popup);
      });
      lucide.createIcons();
  }
  
  // --- 6. UPDATE SIDEBAR LIST ---
  function updateSidebar(data) {
      const list = document.getElementById('resultsList');
      const panel = document.getElementById('resultsPanel');
      
      list.innerHTML = '';
      panel.classList.remove('hidden');
      
      data.forEach(loc => {
          const item = document.createElement('div');
          item.className = "bg-white p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer";
          item.innerHTML = `
                    <div class="flex justify-between items-start">
                        <h3 class="font-semibold text-sm text-gray-800">${loc.name}</h3>
                        <span class="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">${loc.type}</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 truncate">${loc.address}</p>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-xs font-bold text-green-600 flex items-center gap-1">
                            <i data-lucide="map-pin" class="w-3 h-3"></i> ${loc.distance.toFixed(2)} km
                        </span>
                        <span class="text-xs text-yellow-500">★ ${loc.rating}</span>
                    </div>
                `;
          
          // Click list item to fly to map marker
          item.onclick = () => {
              map.flyTo([loc.lat, loc.lng], 16);
          };
          
          list.appendChild(item);
      });
      lucide.createIcons();
  }
  
  // --- UTILS ---
  function getIcon(type) {
      let color = 'gray';
      if (type === 'ewaste') color = 'purple';
      if (type === 'plastic') color = 'blue';
      if (type === 'metal') color = 'orange';
      if (type === 'paper') color = 'green';
      if (type === 'glass') color = 'teal';
      if (type === 'scrap') color = 'red';
      
      return L.divIcon({
          className: 'custom-pin',
          html: `<div class="w-8 h-8 bg-white rounded-full border-2 border-${color}-500 flex items-center justify-center shadow-md">
                        <i data-lucide="recycle" class="w-4 h-4 text-${color}-600"></i>
                       </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
      });
  }
  
  // Haversine Formula (Calculate distance between two Lat/Lngs in KM)
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);
      var dLon = deg2rad(lon2 - lon1);
      var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
  }
  
  function deg2rad(deg) {
      return deg * (Math.PI / 180)
  }
  
  // --- STARTUP ---
  window.onload = () => {
      initMap();
      loadData();
      lucide.createIcons();
  };