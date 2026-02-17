// dashboard.js

const API_URL = "https://script.google.com/macros/s/AKfycbwagXkfnb2xKxOkfU00tRcwD4IvV6Wgx9p6ACqP_KgTStu75z59yH3I8450LiB8QoMp/exec"; // REPLACE WITH NEW DEPLOYMENT URL

/* ================= INIT & PROFILE ================= */
(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        location.href = "login.html";
        return;
    }

    // 1. Get IP
    let ip = "Unknown";
    try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipJson = await ipRes.json();
        ip = ipJson.ip;
        document.getElementById("uIp").innerText = "IP Address : " + ip;
    } catch (e) { console.log("IP Error"); }

    // 2. Fetch User Profile & Reports
    loadProfile(token);
})();

async function loadProfile(token) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "get_profile", token: token })
        });
        const data = await res.json();

        if (data.status === "success") {
            // Update UI
            document.getElementById("uName").innerText = data.profile.username;
            document.getElementById("pName").innerText = data.profile.username;
            document.getElementById("uEmail").innerText = data.profile.email;
            document.getElementById("avatar").innerText = data.profile.username.charAt(0).toUpperCase();
            document.getElementById("Pavatar").innerText = data.profile.username.charAt(0).toUpperCase();
            
            // Co2 per kg and tree planted
            
            // ✅ Environmental Impact
           
            
            // Eco Points & Badge Logic
            const points = data.profile.points;
            document.getElementById("uPoints").innerText = points;
            document.getElementById("pPoints").innerText = points;
            document.getElementById("hPoints").innerText = points;
            document.getElementById("aPoints").innerText = points;
            document.getElementById("uBadge").innerText = calculateBadge(points);
            document.getElementById("uBadge").innerText = calculateBadge(points);
            document.getElementById("badge-bg").style.backgroundColor = getBadgeColor(points);
            
            
            const impact = calculateImpact(points);

            document.getElementById("coCarbon").innerText = impact.co2.toFixed(2) + " kg";
            document.getElementById("treePlanted").innerText = impact.trees.toFixed(2);
            
            const level = calculateLevel(points);
            
            document.getElementById("userLevel").innerText = "Level " + level;
            
            document.getElementById("levelName").innerText = "Level " + level +": Eco Warrior";
            
            
            
            
            const progressbar = calculateLevelPercentage(points);
            
            document.getElementById("levelPercent").innerText = progressbar + "%";
            
            document.getElementById("levelPer").innerText = progressbar + "%";
            
            document.getElementById("progressbar-style").style.width = progressbar + "%";
            
            
            
            // progress bar
          /*  document.getElementById("levelName").innerText = "Level " + progressbar.levelprogress + ": Eco Warrior";

            // Update percent text
            document.getElementById("levelPercent").innerText = progressbar.levelpercent + "%";

            // Update progress bar
            document.getElementById("levelBar").style.width = progressbar.levelpercent + "%";*/
            
            // Populate Table
            renderHistory(data.history);
        } else {
            alert("Session expired");
            logout();
        }
    } catch (e) {
        console.error(e);
    }
}

/* ================= REPORTING LOGIC ================= */

// 1. Get Location
/*function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById("lat").value = position.coords.latitude;
            document.getElementById("lng").value = position.coords.longitude;
        }, () => { alert("Location access denied."); });
    } else {
        alert("Geolocation not supported by this browser.");
    }
}*/
function getLocation() {
            const btn = document.querySelector('button[onclick="getLocation()"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Locating...`;
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    document.getElementById('lat').value = position.coords.latitude.toFixed(6);
                    document.getElementById('lng').value = position.coords.longitude.toFixed(6);
                    
                    // Success state styling
                    btn.innerHTML = `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Location Tagged`;
                    btn.classList.add('bg-green-50', 'border-green-200', 'text-green-700');
                }, () => {
                     btn.innerHTML = originalText;
                     alert("Could not fetch location.");
                });
            } else {
                alert("Geolocation is not supported by this browser.");
                btn.innerHTML = originalText;
            }
        }




// 2. Convert Image to Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// 3. Handle Submit
document.getElementById("reportForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById("wasteImg");
    if(fileInput.files.length === 0) {
        alert("Please upload an image.");
        return;
    }

    // Show Loader
    const btn = document.getElementById("submitBtn");
    
    const loader = document.getElementById("loader");
    btn.style.display = "none";
    loader.style.display = "flex";
    btn.disabled = true;
    btn.classList.add('opacity-75', 'cursor-not-allowed', 'grayscale');

    try {
        const imageBase64 = await toBase64(fileInput.files[0]);
        const token = localStorage.getItem("token");

        const payload = {
            action: "report_waste",
            token: token,
            wasteType: document.getElementById("wasteType").value,
            description: document.getElementById("desc").value,
            address: `${document.getElementById("address").value}, ${document.getElementById("city").value} - ${document.getElementById("pincode").value}`,
            lat: document.getElementById("lat").value,
            lng: document.getElementById("lng").value,
            image: imageBase64,
            mimeType: fileInput.files[0].type
        };

        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.status === "success") {
            alert(`Report Submitted! You earned ${data.points} Eco-Points.`);
            location.reload(); // Refresh to show new points
        } else {
            alert("Error: " + data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Failed to submit report.");
    } finally {
        btn.style.display = "block";
        loader.style.display = "none";
    }
});

/* ================= UTILS ================= */

function calculateLevelPercentage(points) {
    let min = 0;
    let max = 200;

    if (points <= 200) {
        min = 0;
        max = 200;
    } else if (points <= 500) {
        min = 200;
        max = 500;
    } else if (points <= 1000) {
        min = 500;
        max = 1000;
    }

    const progress = points - min;
    const range = max - min;

    return Math.min((progress / range) * 100, 100).toFixed(2);
}

function calculateLevel(points) {
    if (points <= 200) return 1;
    if (points <= 500) return 2;
    if (points <= 1000) return 3;
    return 3; // max level capped
}

/*function calculateLevelPercentage(points) {
    const progress = points % 200;
    return ((progress / 200) * 100).toFixed(2);
}

function calculateLevel(points) {
    return Math.floor(points / 200) + 1;
}
*/


function calculateImpact(points) {
    const CO2_PER_POINT = 0.5;   // kg CO₂ saved per point
    const CO2_PER_TREE = 21;     // kg CO₂ absorbed by 1 tree/year

    const co2Saved = points * CO2_PER_POINT;
    const treesPlanted = co2Saved / CO2_PER_TREE;

    return {
        co2: co2Saved,
        trees: treesPlanted
    };
}






/*function calculateImpact(points) {
    const co2 = points / 10;      // 10 points = 1kg CO2
    const trees = co2 / 21;       // 1 tree = 21kg CO2
    return { co2, trees };
}*/

function calculateBadge(points) {
    if (points >= 500) return "Gold";
    if (points >= 200) return "Silver";
    return "Bronze";
}

function getBadgeColor(points) {
    if (points >= 500) return "#FFF09D";
    // Gold
    if (points >= 200) return "#E7E7E7";
    // Silver
    return "#CDA074"; // Bronze
}

function renderHistory(reports) {
    const tbody = document.getElementById("historyTable");
    tbody.innerHTML = "";
    
    // Sort by date (newest first)
    
    reports.sort((a, b) => new Date(b.date) - new Date(a.date));

    reports.forEach(r => {
        
        const isResolved = r.status === "Resolved";

        const statusClasses = isResolved
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : "bg-yellow-100 text-yellow-700 border-yellow-200 animate-pulse";
        
        const row = `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-gray-700">${new Date(r.date).toLocaleDateString()}</td>
                <td class="px-6 py-4 font-medium text-gray-800">${r.type}</td>
                <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClasses} border"><span class="status-badge status-${r.status}">${r.status}</span></td>
                <td class="px-6 py-4 text-gray-600 font-bold">&plus;${r.points}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function logout() {
    if(confirm("Are you sure you want to log out?")) {
                alert("Logging out...");
                localStorage.clear();
                location.href = "login.html";
            }
}
