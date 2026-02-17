 
        // --- 1. DATA SOURCE (Daily City Waste in Metric Tonnes) ---
    // Based on typical composition of a Tier-2 Indian City
    const wasteData = {
        biodegradable: { // Wet Waste (Green)
            foodScraps: 450, 
            marketWaste: 120,
            gardenTrimmings: 80
        },
        recyclable: { // Dry Waste (Blue)
            plastic: 180,    
            paperCardboard: 90,       
            metals: 45,
            glass: 30        
        },
        hazardous: { // Domestic Hazardous (Red)
            ewaste: 15,      
            biomedical: 8,
            sanitary: 12
        },
        inert: { // Construction & Street Sweepings (Gray)
            constructionDebris: 150, 
            silt: 60          
        }
    };

    // --- 2. CALCULATE TOTALS ---
    // Helper function to sum values in an object
    const sumCategory = (cat) => Object.values(cat).reduce((a, b) => a + b, 0);

    const totals = {
        bio: sumCategory(wasteData.biodegradable),
        recycle: sumCategory(wasteData.recyclable),
        hazard: sumCategory(wasteData.hazardous),
        inert: sumCategory(wasteData.inert)
    };

    const totalWasteGenerated = totals.bio + totals.recycle + totals.hazard + totals.inert;

    // --- 3. RENDER CHART (Chart.js) ---
    const ctxw = document.getElementById('wasteChart').getContext('2d');
    new Chart(ctxw, {
        type: 'doughnut',
        data: {
            // These labels match the 4 main categories typical in Indian Waste Management
            labels: ['Biodegradable (Wet)', 'Recyclables (Dry)', 'Hazardous (E-waste)', 'Inert (C&D)'],
            datasets: [{
                data: [
                    totals.bio,
                    totals.recycle,
                    totals.hazard,
                    totals.inert
                ],
                // Colors: Green (Eco), Blue (Plastic/Paper), Red (Danger), Gray (Debris)
                backgroundColor: ['#22c55e', '#3b82f6', '#ef4444', '#94a3b8'],
                hoverOffset: 4,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            let value = context.raw;
                            // Calculate percentage for the tooltip
                            let percentage = Math.round((value / totalWasteGenerated) * 100) + '%';
                            return label + value + " MT (" + percentage + ")";
                        }
                    }
                }
            },
            cutout: '70%', // Makes the doughnut thinner/thicker
        }
    });

    // --- 4. OPTIONAL: Update HTML Elements (If you have them) ---
    // Assuming you have elements with these IDs in your HTML
    if(document.getElementById('total-waste')) {
        document.getElementById('total-waste').innerText = totalWasteGenerated.toLocaleString();
    }