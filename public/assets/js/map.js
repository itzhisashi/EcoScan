  
        // 1. Initialize Map centered on Nagpur
        var map = L.map('map').setView([21.1458, 79.0882], 12);

        // 2. Add OpenStreetMap Tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // --- DEFINING THE ICONS ---
        // We use different colored markers for different types of centers
        var nmcIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });

        var scrapIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });

        var ewasteIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });

        // --- DATA: ALL LOCATIONS IN NAGPUR ---
        var locations = [
            // --- NMC GARBAGE TRANSFER STATIONS (Red) ---
            { lat: 21.1300, lng: 79.1600, title: "Bhandewadi Dumping Yard", type: "NMC", desc: "Main Municipal Dump Yard" },
            { lat: 21.1478, lng: 79.1151, title: "Mangalwari Market Station", type: "NMC", desc: "Garbage Transfer Station" },
            { lat: 21.1639, lng: 79.0989, title: "Kamal Chowk / Kamal Bazaar", type: "NMC", desc: "Waste Collection Point" },
            { lat: 21.1500, lng: 79.1100, title: "Budhwar Bazar (Mahal)", type: "NMC", desc: "Market Waste Collection" },
            { lat: 21.1400, lng: 79.0800, title: "Mor Bhavan (Sitabuldi)", type: "NMC", desc: "City Center Transfer Point" },
            { lat: 21.1406, lng: 79.0778, title: "Cotton Market", type: "NMC", desc: "Vegetable Waste Collection" },
            { lat: 21.1200, lng: 79.0700, title: "Chunna Bhatti (Ajni Area)", type: "NMC", desc: "Transfer Station" },

            // --- PRIVATE SCRAP DEALERS (Green) ---
            { lat: 21.1500, lng: 79.0900, title: "Shree Bajrang Sales", type: "Scrap", desc: "Metal & Industrial Scrap" },
            { lat: 21.1300, lng: 79.0800, title: "A V Sales Corp (Dhantoli)", type: "Scrap", desc: "General Scrap Dealer" },
            { lat: 21.1480, lng: 79.1150, title: "Dhanraj Steel Traders", type: "Scrap", desc: "Steel & Iron Scrap" },
            { lat: 21.1100, lng: 78.9800, title: "S K Scrap Traders (Hingna)", type: "Scrap", desc: "Industrial Waste Recycler" },
            { lat: 21.1500, lng: 78.9900, title: "Galaxy Enterprises (Wadi)", type: "Scrap", desc: "Plastic & Metal Scrap" },
            { lat: 21.2333, lng: 79.2000, title: "Kamptee Scrap Zone", type: "Scrap", desc: "Regional Scrap Hub" },
            { lat: 21.1150, lng: 79.1230, title: "Fhizhan Scrap (Taj Bagh)", type: "Scrap", desc: "Local Scrap Dealer" },
            { lat: 21.0914, lng: 79.1076, title: "Manewada Recycling Unit", type: "Scrap", desc: "Paper & Plastic" },
            { lat: 21.1958, lng: 79.0558, title: "Gorewada Scrap Point", type: "Scrap", desc: "General Waste" },
            { lat: 21.1000, lng: 79.1300, title: "Sudam Nagari Collection", type: "Scrap", desc: "Dighori Area Collection" },
    { 
        lat: 21.2333, 
        lng: 79.1950, 
        title: "Kamptee Cantonment Waste Plant", 
        type: "NMC", 
        desc: "Official Cantonment Board waste processing unit." 
    },
    { 
        lat: 21.2250, 
        lng: 79.2000, 
        title: "Dragon Palace Area Collection", 
        type: "NMC", 
        desc: "Public waste collection point near temple grounds." 
    },
    { 
        lat: 21.2180, 
        lng: 79.1850, 
        title: "Yerkheda Gram Panchayat Dump", 
        type: "NMC", 
        desc: "Local village waste transfer station." 
    },
    { 
        lat: 21.2290, 
        lng: 79.1910, 
        title: "Kamptee Main Market Scrap", 
        type: "Scrap", 
        desc: "General paper and plastic scrap dealer." 
    },
    { 
        lat: 21.2400, 
        lng: 79.2100, 
        title: "New Kamptee Metal Works", 
        type: "Scrap", 
        desc: "Iron and heavy metal scrap yard." 
    },
    { 
        lat: 21.2150, 
        lng: 79.1750, 
        title: "Teka Naka Recycling Hub", 
        type: "Scrap", 
        desc: "Large scale plastic and bottle recycling." 
    },
    { 
        lat: 21.2220, 
        lng: 79.1980, 
        title: "Modi Padau Kabadi", 
        type: "Scrap", 
        desc: "Small scale household waste buyer." 
    },
    { 
        lat: 21.2100, 
        lng: 79.1600, 
        title: "Automotive Square E-Collection", 
        type: "E-Waste", 
        desc: "Nearest major E-Waste drop-off point for Kamptee." 
    },
            // --- E-WASTE RECYCLERS (Blue) ---
            { lat: 20.9500, lng: 79.0000, title: "Suritex E-Waste (Butibori)", type: "E-Waste", desc: "Major E-Waste Plant" },
            { lat: 21.1500, lng: 78.9950, title: "Zebronics Collection (Wadi)", type: "E-Waste", desc: "Electronics Drop-off" },
            { lat: 21.1100, lng: 79.0500, title: "ServCare E-Waste", type: "E-Waste", desc: "Authorized E-Waste Collector" }
        ];

        // --- ADDING MARKERS TO MAP ---
        locations.forEach(function(loc) {
            var iconToUse;
            if(loc.type === "NMC") iconToUse = nmcIcon;
            else if(loc.type === "E-Waste") iconToUse = ewasteIcon;
            else iconToUse = scrapIcon;

            L.marker([loc.lat, loc.lng], {icon: iconToUse})
             .addTo(map)
             .bindPopup(`<b>${loc.title}</b><br>${loc.desc}<br><span style="font-size:11px;color:grey">${loc.type}</span>`);
        });

        // --- ADD LEGEND (Bottom Right) ---
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<i style="background: red"></i> NMC Transfer Station<br>';
            div.innerHTML += '<i style="background: green"></i> Scrap/Recycling Dealer<br>';
            div.innerHTML += '<i style="background: blue"></i> E-Waste Center<br>';
            return div;
        };

        legend.addTo(map);

        // --- LIVE USER LOCATION ---
        function onLocationFound(e) {
            var radius = e.accuracy / 2;
            L.circle(e.latlng, radius).addTo(map);
            L.marker(e.latlng).addTo(map)
                .bindPopup("<b>📍 You are here</b>").openPopup();
        }
        
        // Ask for location
        map.locate({setView: true, maxZoom: 13});
        map.on('locationfound', onLocationFound);
