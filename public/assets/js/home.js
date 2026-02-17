  // Constants derived from Sustainable Web Design (SWD) & Boavizta Dataset
  const CONSTANTS = {
    // Data Transfer
    kwh_per_gb: 0.81, // Energy intensity of data transfer
    carbon_per_kwh: 442, // Global grid average (gCO2e/kWh)
    
    // Infrastructure
    server_idle_watts: 50, // Watts used when server is idle
    server_max_watts: 200, // Watts used at 100% CPU
    storage_watts_per_tb: 2.5, // HDD storage energy cost per TB per hour
    
    // Email
    carbon_per_email: 4, // 4g for standard email, 0.3g for spam (blended avg)
    
    // Hardware (Manufacturing & Lifecycle Database)
    devices: {
      laptop: { manuf: 320, life: 4 }, // 320kg CO2e, 4 years
      desktop: { manuf: 450, life: 5 },
      smartphone: { manuf: 65, life: 2.5 },
      server: { manuf: 1200, life: 4 }
    }
  };
  
  function calculate() {
    // --- 1. STREAMING & BANDWIDTH ---
    const streamHours = parseFloat(document.getElementById('streamHours').value) || 0;
    const dataGB = parseFloat(document.getElementById('dataGB').value) || 0;
    
    // Approx 3GB per hour for HD video
    const totalVideoGB = streamHours * 3;
    const totalTransferGB = totalVideoGB + dataGB;
    
    const transferEnergykWh = totalTransferGB * CONSTANTS.kwh_per_gb;
    const transferCarbon = transferEnergykWh * CONSTANTS.carbon_per_kwh;
    
    document.getElementById('res_streaming').innerText = formatNum(transferCarbon) + " gCO2e";
    document.getElementById('res_bandwidth').innerText = formatNum(transferEnergykWh) + " kWh";
    
    
    // --- 2. CLOUD & SERVER ---
    const cpuLoad = parseInt(document.getElementById('cpuLoad').value);
    const storageTB = parseFloat(document.getElementById('storageTB').value) || 0;
    const emailCount = parseFloat(document.getElementById('emailCount').value) || 0;
    
    // Update range slider text
    document.getElementById('cpuVal').innerText = cpuLoad + "%";
    
    // Server Energy Calculation (Linear scaling between idle and max)
    // Formula: Idle + (Max - Idle) * (Load %)
    // We calculate for 1 month (720 hours)
    const activeWatts = CONSTANTS.server_idle_watts + ((CONSTANTS.server_max_watts - CONSTANTS.server_idle_watts) * (cpuLoad / 100));
    const serverKwhMonth = (activeWatts * 720) / 1000;
    
    const serverCarbon = serverKwhMonth * CONSTANTS.carbon_per_kwh;
    
    // Storage Energy
    const storageKwhMonth = (storageTB * CONSTANTS.storage_watts_per_tb * 720) / 1000;
    
    // Email Impact
    const emailCarbon = emailCount * CONSTANTS.carbon_per_email;
    
    document.getElementById('res_serverEnergy').innerText = formatNum(serverKwhMonth) + " kWh";
    document.getElementById('res_emissions').innerText = formatNum(serverCarbon) + " gCO2e";
    document.getElementById('res_storage').innerText = formatNum(storageKwhMonth) + " kWh";
    document.getElementById('res_email').innerText = formatNum(emailCarbon) + " gCO2e";
    
    
    // --- 3. HARDWARE ---
    const deviceType = document.getElementById('deviceType').value;
    const deviceData = CONSTANTS.devices[deviceType];
    
    document.getElementById('res_manufacturing').innerText = deviceData.manuf + " kgCO2e";
    document.getElementById('res_lifecycle').innerText = deviceData.life + " Years";
  }
  
  // Helper to format numbers nicely
  function formatNum(num) {
    if (num > 1000) return (num / 1000).toFixed(2) + "k";
    return num.toFixed(2);
  }
  
  // Run on load
  calculate();
  
  
  
    // 1. The Data Source (You can fetch this from an API later)
    const wasteData = [
        {
            category: "Plastic Waste",
            icon: "fa-bottle-water",
            color: "text-blue-500",
            items: [
                { name: "PET Bottles", value: 0.45, unit: "kg" },
                { name: "HDPE Containers", value: 0.12, unit: "kg" },
                { name: "Soft Packaging", value: 0.08, unit: "kg" }
            ]
        },
        {
            category: "E-Waste",
            icon: "fa-battery-full",
            color: "text-red-500", // Red because it's hazardous
            items: [
                { name: "Old Cables/Wires", value: 0.05, unit: "kg" },
                { name: "Batteries", value: 2, unit: "units" },
                { name: "Circuit Boards", value: 0.01, unit: "kg" }
            ]
        },
        {
            category: "Paper & Cardboard",
            icon: "fa-newspaper",
            color: "text-yellow-600",
            items: [
                { name: "Office Paper", value: 1.2, unit: "kg" },
                { name: "Cardboard Boxes", value: 0.8, unit: "kg" }
            ]
        },
        {
            category: "Wet Garbage",
            icon: "fa-apple-whole",
            color: "text-green-600",
            items: [
                { name: "Food Scraps (Compost)", value: 2.5, unit: "kg" },
                { name: "Garden Trimmings", value: 1.0, unit: "kg" }
            ]
        },
        {
            category: "Metals",
            icon: "fa-hammer", // simplified icon class
            color: "text-gray-500",
            items: [
                { name: "Aluminum Cans", value: 0.3, unit: "kg" },
                { name: "Scrap Iron", value: 0.5, unit: "kg" }
            ]
        }
    ];

    // 2. Function to Render the Table
    function renderWasteTable() {
        const tableBody = document.getElementById('waste-metrics-table');
        let htmlContent = '';
        let totalWeight = 0;

        wasteData.forEach(type => {
            // Loop through each item in the category
            type.items.forEach((item, index) => {
                
                // Only show the Category Name and Icon on the first row of that group
                const categoryCell = index === 0 
                    ? `<td class="px-6 py-4 font-bold ${type.color} border-t border-gray-100" rowspan="${type.items.length}">
                        <i class="fa-solid ${type.icon} mr-2"></i>${type.category}
                       </td>`
                    : ''; // Empty string for subsequent rows (merged effect)

                // Add border-t to separate categories visually, but not items within categories
                const rowBorder = index === 0 ? 'border-t border-gray-100' : '';

                htmlContent += `
                <tr class="bg-white hover:bg-gray-50 ${rowBorder}">
                    ${categoryCell}
                    <td class="px-6 py-4 border-l border-gray-50">
                        ${item.name}
                    </td>
                    <td class="px-6 py-4 font-mono text-gray-700">
                        ${item.value} <span class="text-xs text-gray-400">${item.unit}</span>
                    </td>
                </tr>`;
                
                // Simple sum for "kg" items only
                if(item.unit === 'kg') totalWeight += item.value;
            });
        });

        // Inject HTML
        tableBody.innerHTML = htmlContent;

        // Update Summary (Mock Calculation)
        // In a real app, you'd compare this against "Total Waste Generated"
        document.getElementById('total-diversion').innerText = totalWeight.toFixed(2) + " kg Recycled Today";
    }

    // Run on load
    renderWasteTable();