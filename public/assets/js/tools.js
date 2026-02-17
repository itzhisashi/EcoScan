
// Function to Open Modal and Inject Content
        function openModal(toolId) {
            const modal = document.getElementById('toolModal');
            const modalBody = document.getElementById('modal-body-content');
            
            // Find the content div based on the ID passed
            const sourceContent = document.getElementById(toolId + '-content');
            
            if (sourceContent) {
                // Inject the HTML from the hidden div into the modal
                modalBody.innerHTML = sourceContent.innerHTML;
                // Show the modal
                modal.classList.remove('hidden');
                document.body.classList.add("no-scroll");
            } else {
                console.error('No content found for tool: ' + toolId);
            }
        }

        // Function to Close Modal
        function closeModal() {
            const modal = document.getElementById('toolModal');
            modal.classList.add('hidden');
            // Optional: Clear content on close
            document.getElementById('modal-body-content').innerHTML = '';
            document.body.classList.remove("no-scroll");
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape") {
                closeModal();
            }
        });
    
    
    /* Waste Value Estimator */
    
    // Initialize Icons
lucide.createIcons();

// Data Dictionary
const wasteRates = {
    glass_beer: { price: 15.0, co2: 0.3, energy: 0.12 },
    glass_cullet: { price: 13.0, co2: 0.3, energy: 0.12 },
    glass_trans: { price: 10.0, co2: 0.3, energy: 0.12 },
    glass_broken: { price: 6.50, co2: 0.3, energy: 0.12 },
    glass_bottle: { price: 4.00, co2: 0.3, energy: 0.12 },
    glass_tough: { price: 1.00, co2: 0.0, energy: 0.00 },
    
    paper_news: { price: 14.0, co2: 2.5, energy: 4.0 },
    paper_books: { price: 12.0, co2: 2.0, energy: 3.5 },
    paper_card: { price: 8.00, co2: 2.0, energy: 3.0 },
    
    metal_copper: { price: 600.0, co2: 3.5, energy: 7.0 },
    metal_brass: { price: 420.0, co2: 3.0, energy: 5.0 },
    metal_alum: { price: 130.0, co2: 9.0, energy: 14.0 },
    metal_steel: { price: 45.0, co2: 1.5, energy: 2.5 },
    metal_iron: { price: 26.0, co2: 1.8, energy: 2.0 },
    
    plas_pet: { price: 18.0, co2: 1.5, energy: 5.8 },
    plas_hard: { price: 12.0, co2: 1.4, energy: 6.0 },
    plas_soft: { price: 5.00, co2: 1.2, energy: 5.0 },
    
    ewaste: { price: 30.0, co2: 1.4, energy: 3.0 }
};

function processCalculation() {
    const type = document.getElementById('wasteType').value;
    const weightInput = document.getElementById('weight');
    const weight = parseFloat(weightInput.value);
    
    // UI References
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');
    const resultsArea = document.getElementById('resultsArea');
    
    // Validation
    if (!type) {
        alert("Please select a waste category.");
        return;
    }
    if (isNaN(weight) || weight <= 0) {
        alert("Please enter a valid weight (e.g., 5).");
        return;
    }
    
    // 1. Show Loader, Hide others
    emptyState.classList.add('hidden');
    resultsArea.classList.add('hidden');
    loadingState.classList.remove('hidden');
    
    // 2. Simulate Network/Calculation Delay (600ms)
    setTimeout(() => {
        const rates = wasteRates[type];
        
        // Calculations
        const totalValue = Math.round(rates.price * weight);
        const totalCO2 = (rates.co2 * weight).toFixed(2);
        const totalEnergy = (rates.energy * weight).toFixed(1);
        const phoneCharges = Math.round((rates.energy * weight) / 0.015);
        
        // Update DOM
        document.getElementById('outValue').innerText = `₹${totalValue.toLocaleString('en-IN')}`;
        document.getElementById('outCO2').innerText = `${totalCO2} kg`;
        document.getElementById('outEnergy').innerText = `${totalEnergy} kWh`;
        document.getElementById('outPhones').innerText = `${phoneCharges.toLocaleString('en-IN')}`;
        
        // 3. Show Results
        loadingState.classList.add('hidden');
        resultsArea.classList.remove('hidden');
        
        // Re-render icons if needed (though they are static, sometimes dynamic updates need this)
        lucide.createIcons();
        
    }, 600); // 600ms delay for "Ass Loader" effect
}

/****** Carbon Footprint Data ******/
        const cityDatabase = {
    "mumbai": {
        name: "Mumbai, Maharashtra",
        footprint: 3.2,
        aqi: 165,
        pm25: 68,
        no2: 45,
        insight: "High footprint due to density and electricity consumption. Coastal breeze helps moderate pollution levels."
    },
    "delhi": {
        name: "New Delhi, Delhi",
        footprint: 4.1,
        aqi: 310,
        pm25: 145,
        no2: 89,
        insight: "Critical levels. High vehicle emissions, construction dust, and crop burning contribute to the highest national footprint."
    },
    "bangalore": {
        name: "Bangalore, Karnataka",
        footprint: 2.8,
        aqi: 95,
        pm25: 35,
        no2: 40,
        insight: "Moderate footprint. Tech parks consume high energy, but significant green cover helps offset local pollution."
    },
    "chennai": {
        name: "Chennai, Tamil Nadu",
        footprint: 2.6,
        aqi: 85,
        pm25: 30,
        no2: 35,
        insight: "Industrial zones maintain steady emissions, but sea breeze keeps AQI relatively better than other metros."
    },
    "kolkata": {
        name: "Kolkata, West Bengal",
        footprint: 2.3,
        aqi: 180,
        pm25: 85,
        no2: 42,
        insight: "Old vehicle engines, high population density, and industrial proximity keep emissions higher than average."
    },
    "hyderabad": {
        name: "Hyderabad, Telangana",
        footprint: 2.7,
        aqi: 110,
        pm25: 45,
        no2: 38,
        insight: "Rapid IT expansion and construction are increasing the carbon footprint, though green zones provide some relief."
    },
    "pune": {
        name: "Pune, Maharashtra",
        footprint: 2.4,
        aqi: 130,
        pm25: 55,
        no2: 50,
        insight: "Rapid industrialization is increasing the footprint. High 2-wheeler usage contributes significantly to AQI."
    },
    "ahmedabad": {
        name: "Ahmedabad, Gujarat",
        footprint: 2.9,
        aqi: 150,
        pm25: 65,
        no2: 55,
        insight: "Heavy industrial presence and textile mills contribute to a higher carbon footprint and particulate matter."
    },
    "jaipur": {
        name: "Jaipur, Rajasthan",
        footprint: 2.1,
        aqi: 140,
        pm25: 60,
        no2: 35,
        insight: "Dust storms and tourism traffic contribute to AQI, though industrial emissions are lower than metros."
    },
    "lucknow": {
        name: "Lucknow, Uttar Pradesh",
        footprint: 2.2,
        aqi: 190,
        pm25: 95,
        no2: 40,
        insight: "Construction activities and vehicular density in core areas lead to poor air quality in winter."
    },
    "surat": {
        name: "Surat, Gujarat",
        footprint: 3.0,
        aqi: 145,
        pm25: 62,
        no2: 52,
        insight: "Diamond and textile industries drive energy consumption, leading to a higher per capita carbon footprint."
    },
    "nagpur": {
        name: "Nagpur, Maharashtra",
        footprint: 1.9,
        aqi: 112,
        pm25: 42,
        no2: 28,
        insight: "Lower than metros. Logistics hub status increases transport emissions, but residential consumption is moderate."
    },
    "indore": {
        name: "Indore, Madhya Pradesh",
        footprint: 1.8,
        aqi: 90,
        pm25: 38,
        no2: 25,
        insight: "Effective waste management strategies have kept the carbon footprint lower than comparable tier-2 cities."
    },
    "patna": {
        name: "Patna, Bihar",
        footprint: 1.7,
        aqi: 220,
        pm25: 110,
        no2: 35,
        insight: "Geographical location traps pollutants. High biomass burning and construction dust cause severe AQI spikes."
    },
    "bhopal": {
        name: "Bhopal, Madhya Pradesh",
        footprint: 1.6,
        aqi: 85,
        pm25: 32,
        no2: 22,
        insight: "Extensive lakes and greenery help maintain good air quality and a lower urban carbon footprint."
    },
    "kanpur": {
        name: "Kanpur, Uttar Pradesh",
        footprint: 2.5,
        aqi: 200,
        pm25: 105,
        no2: 45,
        insight: "Leather tanneries and industrial units contribute significantly to both water and air pollution."
    },
    "visakhapatnam": {
        name: "Visakhapatnam, Andhra Pradesh",
        footprint: 2.6,
        aqi: 100,
        pm25: 40,
        no2: 48,
        insight: "Port activities and heavy industries (steel/oil) keep the industrial footprint high despite coastal winds."
    },
    "vadodara": {
        name: "Vadodara, Gujarat",
        footprint: 2.7,
        aqi: 135,
        pm25: 58,
        no2: 50,
        insight: "Chemical and petrochemical industries in the vicinity contribute to a higher specific carbon footprint."
    },
    "nashik": {
        name: "Nashik, Maharashtra",
        footprint: 1.5,
        aqi: 75,
        pm25: 25,
        no2: 18,
        insight: "Green city status and agricultural base keep industrial emissions lower compared to Mumbai/Pune."
    },
    "coimbatore": {
        name: "Coimbatore, Tamil Nadu",
        footprint: 2.0,
        aqi: 80,
        pm25: 30,
        no2: 28,
        insight: "Manufacturing hub, but wind energy usage and green cover help balance the carbon emissions."
    },
    "kochi": {
        name: "Kochi, Kerala",
        footprint: 1.9,
        aqi: 70,
        pm25: 25,
        no2: 20,
        insight: "High maritime traffic, but abundant rainfall and vegetation keep the overall air quality index good."
    },
    "chandigarh": {
        name: "Chandigarh",
        footprint: 2.4,
        aqi: 105,
        pm25: 45,
        no2: 30,
        insight: "High per capita vehicle ownership increases the footprint, despite the city's excellent green planning."
    },
    "ludhiana": {
        name: "Ludhiana, Punjab",
        footprint: 2.6,
        aqi: 170,
        pm25: 80,
        no2: 45,
        insight: "Industrial hub for cycles and textiles. Winter stubble burning in surrounding areas severely impacts AQI."
    },
    "agra": {
        name: "Agra, Uttar Pradesh",
        footprint: 1.8,
        aqi: 160,
        pm25: 75,
        no2: 35,
        insight: "Strict regulations near the Taj Mahal control industrial emissions, but vehicular pollution remains high."
    },
    "varanasi": {
        name: "Varanasi, Uttar Pradesh",
        footprint: 1.6,
        aqi: 185,
        pm25: 90,
        no2: 30,
        insight: "Congested narrow streets and construction dust lead to high particulate matter in the air."
    },
    "rajkot": {
        name: "Rajkot, Gujarat",
        footprint: 2.2,
        aqi: 115,
        pm25: 50,
        no2: 38,
        insight: "Small scale engineering and casting industries contribute to a moderate but rising carbon footprint."
    },
    "thiruvananthapuram": {
        name: "Thiruvananthapuram, Kerala",
        footprint: 1.4,
        aqi: 55,
        pm25: 20,
        no2: 15,
        insight: "One of the greenest cities with low industrial activity, resulting in minimal carbon emissions."
    },
    "bhubaneswar": {
        name: "Bhubaneswar, Odisha",
        footprint: 1.7,
        aqi: 95,
        pm25: 40,
        no2: 25,
        insight: "Rapid urbanization is testing the city's green cover, but it remains cleaner than most eastern cities."
    },
    "jamshedpur": {
        name: "Jamshedpur, Jharkhand",
        footprint: 2.8,
        aqi: 125,
        pm25: 55,
        no2: 48,
        insight: "Steel city. Heavy industrial reliance creates a high footprint, though maintained greenery helps mitigate AQI."
    },
    "guwahati": {
        name: "Guwahati, Assam",
        footprint: 1.6,
        aqi: 130,
        pm25: 65,
        no2: 28,
        insight: "Valley topography traps pollutants from vehicles and nearby brick kilns, causing winter smog."
    },
    "raipur": {
        name: "Raipur, Chhattisgarh",
        footprint: 2.5,
        aqi: 140,
        pm25: 68,
        no2: 45,
        insight: "Surrounded by steel and sponge iron plants, leading to higher industrial dust and carbon emissions."
    },
    "dehradun": {
        name: "Dehradun, Uttarakhand",
        footprint: 1.5,
        aqi: 110,
        pm25: 50,
        no2: 20,
        insight: "Tourism influx and valley location trap vehicle emissions, degrading the once pristine mountain air."
    },
    "ranchi": {
        name: "Ranchi, Jharkhand",
        footprint: 1.8,
        aqi: 100,
        pm25: 45,
        no2: 25,
        insight: "Industrial growth is moderate. Weather patterns help disperse pollutants effectively most of the year."
    },
    "aurangabad": {
        name: "Aurangabad, Maharashtra",
        footprint: 1.9,
        aqi: 105,
        pm25: 48,
        no2: 32,
        insight: "Auto manufacturing hub. Growing industrial zones are gradually increasing the local carbon footprint."
    },
    "mysore": {
        name: "Mysore, Karnataka",
        footprint: 1.3,
        aqi: 60,
        pm25: 22,
        no2: 15,
        insight: "Planned city with excellent vegetation and low industrial density, maintaining a very low footprint."
    },
    "goa": {
        name: "Panaji, Goa",
        footprint: 2.0,
        aqi: 65,
        pm25: 28,
        no2: 20,
        insight: "High tourism density increases per capita waste and energy use, but air quality remains good."
    },
    "amritsar": {
        name: "Amritsar, Punjab",
        footprint: 1.9,
        aqi: 155,
        pm25: 70,
        no2: 30,
        insight: "Religious tourism traffic and seasonal crop burning in Punjab impact the local air quality significantly."
    },
    "jodhpur": {
        name: "Jodhpur, Rajasthan",
        footprint: 1.7,
        aqi: 135,
        pm25: 65,
        no2: 25,
        insight: "Arid climate leads to high natural dust (PM10), but industrial carbon emissions are relatively low."
    },
    "madurai": {
        name: "Madurai, Tamil Nadu",
        footprint: 1.6,
        aqi: 85,
        pm25: 35,
        no2: 28,
        insight: "Textile and rubber industries exist, but emissions are moderate compared to larger industrial hubs."
    },
    "gwalior": {
        name: "Gwalior, Madhya Pradesh",
        footprint: 2.0,
        aqi: 175,
        pm25: 85,
        no2: 35,
        insight: "Located in a pollution basin. Vehicular emissions and dust contribute to poor air quality ratings."
    }

        };

        function fetchCityData() {
            const cityKey = document.getElementById('citySelect').value;
            if (!cityKey) return;

            // 1. Show Loader
            document.getElementById('loader').classList.remove('hidden');
            document.getElementById('results').classList.add('hidden');

            // 2. Simulate Network Request (Wait 1 second)
            setTimeout(() => {
                const data = cityDatabase[cityKey];

                // 3. Update UI
                document.getElementById('cityName').textContent = data.name;
                
                // Update Footprint
                document.getElementById('footprintValue').textContent = data.footprint;
                
                // Calculate Bar Width (Max is 5.0 tons)
                const percentage = (data.footprint / 5.0) * 100;
                document.getElementById('footprintBar').style.width = percentage + "%";
                
                // Dynamic Description based on footprint
                let desc = "";
                if(data.footprint > 3.5) desc = "Status: Critical (Above National Avg)";
                else if(data.footprint > 2.5) desc = "Status: High (Urban Standard)";
                else desc = "Status: Moderate (Sustainable Goal: 1.5)";
                document.getElementById('footprintDesc').textContent = desc;

                // Update AQI
                document.getElementById('aqiBadge').textContent = `AQI ${data.aqi}`;
                document.getElementById('pm25').textContent = `${data.pm25} µg/m³`;
                document.getElementById('no2').textContent = `${data.no2} ppb`;

                // AQI Color Logic
                const aqiEl = document.getElementById('aqiStatus');
                const badgeEl = document.getElementById('aqiBadge');
                
                if(data.aqi > 200) {
                    aqiEl.textContent = "Hazardous";
                    aqiEl.className = "text-2xl font-bold text-red-600";
                    badgeEl.className = "bg-red-100 text-red-700 px-3 py-1 rounded-lg font-bold";
                } else if (data.aqi > 100) {
                    aqiEl.textContent = "Unhealthy";
                    aqiEl.className = "text-2xl font-bold text-orange-500";
                    badgeEl.className = "bg-orange-100 text-orange-700 px-3 py-1 rounded-lg font-bold";
                } else {
                    aqiEl.textContent = "Good";
                    aqiEl.className = "text-2xl font-bold text-green-600";
                    badgeEl.className = "bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold";
                }

                document.getElementById('localInsight').textContent = data.insight;

                // 4. Hide Loader, Show Results
                document.getElementById('loader').classList.add('hidden');
                document.getElementById('results').classList.remove('hidden');

            }, 800); // 800ms delay simulates "Fetching..."
        }
        
  // --- Tool 1: Resin Data & Logic (Corrected for Modals) ---
const resinData = {
    1: { name: "PETE (Polyethylene Terephthalate)", status: "Recyclable & Safe", color: "bg-emerald-100 text-emerald-800 border-emerald-300", desc: "Soda/water bottles. Porous surface; single use recommended." },
    2: { name: "HDPE (High-Density Polyethylene)", status: "Recyclable & Safe", color: "bg-emerald-100 text-emerald-800 border-emerald-300", desc: "Milk jugs, detergent. Low risk of leaching. Great for recycling." },
    3: { name: "PVC (Polyvinyl Chloride)", status: "Avoid", color: "bg-red-100 text-red-800 border-red-300", desc: "Pipes, shower curtains. Can release toxins. Rarely recyclable." },
    4: { name: "LDPE (Low-Density Polyethylene)", status: "Caution", color: "bg-amber-100 text-amber-800 border-amber-300", desc: "Plastic bags. Safe but hard to recycle in curbside bins." },
    5: { name: "PP (Polypropylene)", status: "Safe", color: "bg-emerald-100 text-emerald-800 border-emerald-300", desc: "Yogurt cups, straws. Heat resistant and increasingly recyclable." },
    6: { name: "PS (Polystyrene)", status: "Avoid", color: "bg-red-100 text-red-800 border-red-300", desc: "Styrofoam cups. Leaches styrene. Difficult to recycle." },
    7: { name: "Other", status: "Caution", color: "bg-amber-100 text-amber-800 border-amber-300", desc: "Mixed plastics. May contain BPA. Check labels carefully." }
};

function showResinInfo(id, clickedBtn) {
    // 1. Find the Modal Container specifically
    // We look for the modal body content to ensure we are targeting the visible tool
    const modalContext = document.getElementById('modal-body-content');
    
    // Safety check: if tool is not in modal (e.g. testing standalone), fall back to document
    const context = modalContext || document;

    // 2. Reset styles for all buttons inside this context
    context.querySelectorAll('.resin-btn').forEach(b => {
        b.className = `resin-btn w-12 h-12 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold hover:bg-emerald-500 hover:text-white transition shadow-sm`;
    });

    // 3. Set Active Style on clicked button
    clickedBtn.className = `resin-btn w-12 h-12 rounded-full border-2 border-emerald-600 bg-emerald-600 text-white font-bold shadow-md scale-110 transition`;

    // 4. Populate Data
    const data = resinData[id];
    
    // We specifically look for elements INSIDE the context to avoid updating the hidden template
    const nameEl = context.querySelector('#resinName');
    const statusEl = context.querySelector('#resinStatus');
    const descEl = context.querySelector('#resinDesc');
    const resultBox = context.querySelector('#resinResult');

    if(nameEl) nameEl.innerText = data.name;
    if(descEl) descEl.innerText = data.desc;
    
    if(statusEl) {
        statusEl.innerText = data.status;
        statusEl.className = `inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 ${data.color}`;
    }
    
    // 5. Show result with animation
    if(resultBox) {
        resultBox.classList.remove('hidden');
        resultBox.classList.remove('animate-fade-in'); 
        void resultBox.offsetWidth; // trigger reflow
        resultBox.classList.add('animate-fade-in');
    }
}


        // --- Tool 2: Calculator Logic ---
        function calculateSavings() {
            const dist = parseFloat(document.getElementById('distance').value);
            if(!dist || dist <= 0) return;

            const savings = Math.round(dist * 192); // ~192g CO2 per km
            const phones = Math.round(savings / 5); // ~5g CO2 to charge phone
            
            document.getElementById('savedCo2').innerText = savings;
            document.getElementById('treeEquiv').innerText = `⚡ Like charging ${phones} smartphones`;
            
            const resDiv = document.getElementById('calcResult');
            resDiv.classList.remove('hidden');
            resDiv.classList.add('animate-fade-in');
        }
        
        
          // --- Tool 1: Shower Logic ---
        let showerFlow = 15; // Liters per minute
        
        function setHead(type) {
            const btnStd = document.getElementById('btnStd');
            const btnEco = document.getElementById('btnEco');
            
            if(type === 'standard') {
                showerFlow = 15;
                btnStd.className = "py-2 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-sm font-semibold shadow-sm";
                btnEco.className = "py-2 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm font-medium hover:bg-slate-50";
            } else {
                showerFlow = 8; // Eco flow
                btnStd.className = "py-2 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm font-medium hover:bg-slate-50";
                btnEco.className = "py-2 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-sm font-semibold shadow-sm";
            }
            updateShower();
        }

        function updateShower() {
            const mins = document.getElementById('showerTime').value;
            document.getElementById('timeVal').innerText = mins;
            
            const totalLiters = mins * showerFlow;
            document.getElementById('litersUsed').innerText = totalLiters;
            
            // Indian bucket is approx 20 Liters
            const buckets = (totalLiters / 20).toFixed(1);
            document.getElementById('bathEquiv').innerText = `🪣 Approx ${buckets} buckets`;
        }
        
         // --- Tool 2: Meatless Logic ---
 let meals = 1;
 
 function changeMeals(delta) {
     meals += delta;
     if (meals < 1) meals = 1;
     if (meals > 50) meals = 50;
     
     document.getElementById('mealCount').innerText = meals;
     
     // 1 Meal swap ~ 1300L water, 3.2kg CO2
     const water = meals * 1300;
     const co2 = (meals * 3.2).toFixed(1);
     
     const waterStr = water > 999 ? (water / 1000).toFixed(1) + 'k' : water;
     
     document.getElementById('waterSaved').innerText = waterStr;
     document.getElementById('co2Saved').innerText = co2;
 }
 
     // --- Tool 3: Phantom Energy Logic (INR) ---
        function calcPhantom() {
            const checks = document.querySelectorAll('input[type="checkbox"]:checked');
            let totalKwh = 0;
            
            checks.forEach(chk => {
                totalKwh += parseInt(chk.value);
            });

            // Avg Cost in India ~ ₹10 per unit (kWh)
            const cost = Math.round(totalKwh * 10); 

            document.getElementById('phantomKwh').innerText = totalKwh;
            document.getElementById('phantomCost').innerText = '₹' + cost;
        }

        // Init
        updateShower();
        calcPhantom();