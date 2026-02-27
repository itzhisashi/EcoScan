// dashboard.js

const API_URL = "https://script.google.com/macros/s/AKfycbyZ4HRHejxZmhObT8GqMDGp4Jl002xupo50QaB8nyPPvjhxuBbxlTTW-P0GIxzYErv7/exec"; // REPLACE WITH NEW DEPLOYMENT URL

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
    
    window.addEventListener('focus', () => {
        console.log("User returned to tab, fetching fresh data...");
        loadProfile(token);
    });
    
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
            
            
            // ✅ Environmental Impact
           
            
            // Eco Points & Badge Logic
            const points = data.profile.points;
            document.getElementById("uPoints").innerText = points;
            document.getElementById("pPoints").innerText = points;
            document.getElementById("hPoints").innerText = points;
            document.getElementById("aPoints").innerText = points;
            
                // 👉 DYNAMICALLY LOCK/UNLOCK CARDS BASED ON POINTS
    updateRewardsUI(points);
        
            document.getElementById("uBadge").innerText = calculateBadge(points);
            document.getElementById("uBadge").innerText = calculateBadge(points);
            document.getElementById("badge-bg").style.backgroundColor = getBadgeColor(points);
            
            
            const impact = calculateImpact(points);

            document.getElementById("coCarbon").innerText = impact.co2.toFixed(2);
            document.getElementById("treePlanted").innerText = impact.trees.toFixed(2);
            
            const level = calculateLevel(points);
            
            document.getElementById("userLevel").innerText = "Level " + level;
            
            document.getElementById("levelName").innerText = "Level " + level +": Eco Warrior";
            
            const progressbar = calculateLevelPercentage(points);
            
            document.getElementById("levelPercent").innerText = progressbar + "%";
            
            document.getElementById("levelPer").innerText = progressbar + "%";
            
            document.getElementById("progressbar-style").style.width = progressbar + "%";
            
            // Populate Table
            renderHistory(data.history);
            renderChallengeUI(data.profile);
        } else {
            alert("Session expired");
            logout();
        }
    } catch (e) {
        console.error(e);
    }
}

/* ================= REPORTING LOGIC ================= */

// 1. Show Image Preview when file is selected
document.getElementById('wasteImg').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('reportImgPreview');
            const placeholder = document.getElementById('reportImgPlaceholder');
            const containerBox = document.getElementById('imageContainerBox');
            
            // Set image source and show it
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            
            // Hide the text/icon placeholder
            placeholder.classList.add('hidden');

            // Style the container so it looks clean with the new image
            containerBox.classList.remove('border-dashed', 'border-2', 'bg-slate-50');
            containerBox.classList.add('border', 'bg-black/5');
        }
        reader.readAsDataURL(file);
    }
});

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
            wasteType: document.getElementById("wasteType2").value,
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

        // if (data.status === "success") {
        //     alert(`Report Submitted! Points will be awarded once verified.`);
        //     location.reload(); // Refresh to show new points
        // } else {
        //     alert("Error: " + data.message);
        // }

        if (data.status === "success") {
            alert(`Report Submitted! Points will be awarded once verified.`);
            
            // 1. Reset the text inputs and dropdowns
            document.getElementById("reportForm").reset();
            
            // 2. Reset the Image Preview UI
            const preview = document.getElementById('reportImgPreview');
            const placeholder = document.getElementById('reportImgPlaceholder');
            const containerBox = document.getElementById('imageContainerBox');
            
            if(preview) {
                preview.src = "";
                preview.classList.add('hidden');
            }
            if(placeholder) placeholder.classList.remove('hidden');
            if(containerBox) {
                containerBox.classList.add('border-dashed', 'border-2', 'bg-slate-50');
                containerBox.classList.remove('border', 'bg-black/5');
            }

            // 3. SILENTLY UPDATE DATA (No page reload)
            loadProfile(token); 
            
            // Optional: Switch to profile tab to see history
            // switchTab('profile'); 
            
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

        const statusPoints = isResolved ? `+${r.points}` : "--";

        const pointsStyle = isResolved 
             ? "text-brand-600 font-bold bg-brand-50 px-2 py-1 rounded-lg group-hover:bg-brand-100 transition-colors"
             : "text-slate-300 font-bold px-2 py-1";

        const statusClasses = isResolved
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : "bg-yellow-100 text-yellow-700 border-yellow-200 animate-pulse";
        
        const row = `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-gray-700">${new Date(r.date).toLocaleDateString()}</td>
                <td class="px-6 py-4 font-medium text-gray-800">${r.type}</td>
                <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClasses} border"><span class="status-badge status-${r.status}">${r.status}</span></td>
                <td class="px-6 py-4 text-gray-600 font-bold"><span class="${pointsStyle}">${statusPoints}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

/*function logout() {
    if(confirm("Are you sure you want to log out?")) {
                alert("Logging out...");
                localStorage.clear();
                location.href = "login.html";
            }
}*/

// 1. Function called by your original Logout button
function logout() {
    const modal = document.getElementById('logoutModal');
    modal.classList.remove('hidden'); // Show modal
}

// 2. Function to hide the modal if they click "Cancel"
function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.classList.add('hidden'); // Hide modal
}

// 3. The actual logout process
function confirmLogout() {
    // Optional: Show a loading state on the button
    const btn = event.target;
    btn.innerText = "Logging out...";
    btn.disabled = true;

    localStorage.clear();
    
    // Small delay for a smoother feel
    setTimeout(() => {
        window.location.href = "login.html";
    }, 800);
}

/* ================= REWARDS UI & LOGIC ================= */

function updateRewardsUI(userPoints) {
    const cards = document.querySelectorAll('.reward-card');
    
    cards.forEach(card => {
        const cost = parseInt(card.getAttribute('data-cost'));
        const btn = card.querySelector('.redeem-btn');
        const title = btn.getAttribute('data-title');
        const code = btn.getAttribute('data-code');

        if (userPoints >= cost) {
            // UNLOCKED STATE
            card.classList.remove('grayscale', 'opacity-60', 'cursor-not-allowed');
            card.classList.add('hover:shadow-lg', 'hover:-translate-y-1');
            
            btn.disabled = false;
            btn.innerHTML = 'Redeem <i data-lucide="chevron-right" class="w-3 h-3"></i>';
            btn.classList.remove('bg-slate-200', 'text-slate-500', 'cursor-not-allowed');
            btn.classList.add('bg-slate-900', 'text-white', 'hover:bg-emerald-600', 'cursor-pointer');
            
            // Assign click event
            btn.onclick = () => openCoupon(title, code);
        } else {
            // LOCKED STATE (Grayed out)
            card.classList.add('grayscale', 'opacity-60');
            card.classList.remove('hover:shadow-lg', 'hover:-translate-y-1');
            
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="lock" class="w-3 h-3"></i> Locked';
            btn.classList.add('bg-slate-200', 'text-slate-500', 'cursor-not-allowed');
            btn.classList.remove('bg-slate-900', 'text-white', 'hover:bg-emerald-600', 'cursor-pointer');
            btn.onclick = null;
        }
    });

    // Re-initialize Lucide icons dynamically
    if(window.lucide) { lucide.createIcons(); }
}

// Initialize Tabs
document.addEventListener("DOMContentLoaded", () => {
    if(window.lucide) { lucide.createIcons(); }

    const tabBtns = document.querySelectorAll('.tab-btn');
    const rewardCards = document.querySelectorAll('.reward-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset colors
            tabBtns.forEach(b => {
                b.classList.remove('bg-slate-900', 'text-white');
                b.classList.add('bg-slate-100', 'text-slate-600');
            });
            // Make active
            btn.classList.remove('bg-slate-100', 'text-slate-600');
            btn.classList.add('bg-slate-900', 'text-white');

            const target = btn.getAttribute('data-target');

            // Filter
            rewardCards.forEach(card => {
                if (target === 'all' || card.getAttribute('data-level') === target) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// Modal & Copy Coupon Logic
let modal, modalTitle, couponCodeText, copyBtn;

document.addEventListener("DOMContentLoaded", () => {
    modal = document.getElementById('coupon-modal');
    modalTitle = document.getElementById('modal-title');
    couponCodeText = document.getElementById('coupon-code');
    copyBtn = document.getElementById('copy-btn');

    // Close modal if clicked outside
    if(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCoupon();
        });
    }
});

function openCoupon(title, code) {
    if(!modal) return;
    modalTitle.textContent = title;
    couponCodeText.textContent = code;
    copyBtn.innerHTML = `<i data-lucide="copy" class="w-5 h-5"></i> Copy Code`;
    if(window.lucide) lucide.createIcons();
    modal.classList.remove('hidden');
}

function closeCoupon() {
    if(modal) modal.classList.add('hidden');
}

function copyCoupon() {
    const textToCopy = couponCodeText.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerHTML = `<i data-lucide="check" class="w-5 h-5"></i> Copied!`;
        if(window.lucide) lucide.createIcons();
        
        setTimeout(() => {
            copyBtn.innerHTML = `<i data-lucide="copy" class="w-5 h-5"></i> Copy Code`;
            if(window.lucide) lucide.createIcons();
        }, 2000);
    }).catch(err => {
        alert("Copy failed. Please manually copy the code.");
    });
}

/* ================= SETTINGS & PROFILE UPDATES ================= */

function openSettingsModal() {
    document.getElementById('settingsModal').classList.remove('hidden');
    // Clear fields
    document.getElementById('setNewUsername').value = '';
    document.getElementById('setNewPassword').value = '';
    document.getElementById('setNewEmail').value = '';
    document.getElementById('emailOtp').value = '';
    document.getElementById('basicMsg').innerText = '';
    document.getElementById('emailMsg').innerText = '';
    
    // Reset Email UI to Step 1
    document.getElementById('emailStep1').classList.remove('hidden');
    document.getElementById('emailStep2').classList.add('hidden');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.add('hidden');
}

// 1. Save Username or Password
async function saveBasicSettings() {
    const token = localStorage.getItem("token");
    const newUsername = document.getElementById('setNewUsername').value.trim();
    const newPassword = document.getElementById('setNewPassword').value.trim();
    const btn = document.getElementById('saveBasicBtn');
    const msg = document.getElementById('basicMsg');

    if (!newUsername && !newPassword) return;

    btn.disabled = true;
    btn.innerHTML = 'Saving...';
    msg.innerText = '';

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "update_profile",
                token: token,
                newUsername: newUsername,
                newPassword: newPassword
            })
        });
        const data = await res.json();
        
        msg.style.color = data.status === "success" ? "#16a34a" : "#ef4444";
        msg.innerText = data.message;
        
        if (data.status === "success") {
            setTimeout(() => location.reload(), 1500); // Reload to reflect changes
        }
    } catch (e) {
        msg.style.color = "#ef4444";
        msg.innerText = "Connection error.";
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Save Changes';
    }
}

// 2. Request OTP for Email Change
async function requestEmailOTP() {
    const token = localStorage.getItem("token");
    const newEmail = document.getElementById('setNewEmail').value.trim();
    const btn = document.getElementById('sendOtpBtn');
    const msg = document.getElementById('emailMsg');

    if (!newEmail || !newEmail.includes('@')) {
        msg.style.color = "#ef4444";
        msg.innerText = "Enter a valid email.";
        return;
    }

    btn.disabled = true;
    btn.innerHTML = 'Sending...';
    msg.innerText = '';

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "request_email_change",
                token: token,
                newEmail: newEmail
            })
        });
        const data = await res.json();
        
        if (data.status === "success") {
            msg.style.color = "#16a34a";
            msg.innerText = data.message;
            // Switch UI to OTP step
            document.getElementById('emailStep1').classList.add('hidden');
            document.getElementById('emailStep2').classList.remove('hidden');
        } else {
            msg.style.color = "#ef4444";
            msg.innerText = data.message;
            btn.disabled = false;
            btn.innerHTML = 'Send Verification Code';
        }
    } catch (e) {
        msg.style.color = "#ef4444";
        msg.innerText = "Connection error.";
        btn.disabled = false;
        btn.innerHTML = 'Send Verification Code';
    }
}

// 3. Verify OTP and Update Email
async function verifyEmailOTP() {
    const token = localStorage.getItem("token");
    const otp = document.getElementById('emailOtp').value.trim();
    const btn = document.getElementById('verifyOtpBtn');
    const msg = document.getElementById('emailMsg');

    if (otp.length !== 6) {
        msg.style.color = "#ef4444";
        msg.innerText = "Enter the 6-digit code.";
        return;
    }

    btn.disabled = true;
    btn.innerHTML = 'Verifying...';
    msg.innerText = '';

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "verify_email_change",
                token: token,
                otp: otp
            })
        });
        const data = await res.json();
        
        msg.style.color = data.status === "success" ? "#16a34a" : "#ef4444";
        msg.innerText = data.message;
        
        if (data.status === "success") {
            // Update UI elements instantly to avoid confusion
            document.getElementById("uEmail").innerText = data.newEmail;
            setTimeout(closeSettingsModal, 2000);
        } else {
            btn.disabled = false;
            btn.innerHTML = 'Verify & Update Email';
        }
    } catch (e) {
        msg.style.color = "#ef4444";
        msg.innerText = "Connection error.";
        btn.disabled = false;
        btn.innerHTML = 'Verify & Update Email';
    }
}


/* ================= DAILY CHALLENGES & STREAKS ================= */

function renderChallengeUI(profile) {
    // 1. Calculate Days Left in Month
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysLeft = lastDayOfMonth.getDate() - now.getDate();
    document.getElementById("daysLeftText").innerText = daysLeft + " Days Left";

    // 2. Update Monthly Progress
    const actions = profile.monthlyActions || 0;
    const maxActions = 25;
    const percent = Math.min(Math.round((actions / maxActions) * 100), 100);
    document.getElementById("monthlyActionsText").innerText = `${actions} / ${maxActions} Actions`;
    document.getElementById("overviewMonthly").innerText = `${actions} / ${maxActions} Completed`;
    document.getElementById("monthlyPercentText").innerText = `${percent}% Complete`;
    document.getElementById("monthlyProgressBar").style.width = `${percent}%`;
    document.getElementById("overviewMonthlyStyle").style.width =`${percent}%`;

    // 3. Render Streak UI
    const streak = profile.streak || 0;
    document.getElementById("streakCount").innerText = streak;

    // Check if claimed today
    let claimedToday = false;
    if (profile.lastClaim) {
        const last = new Date(profile.lastClaim);
        if (last.toDateString() === now.toDateString()) {
            claimedToday = true;
        }
    }

    // Update Button State
    const btn = document.getElementById("claimStreakBtn");
    if (claimedToday) {
        btn.disabled = true;
        btn.innerHTML = 'Claimed <i data-lucide="check" class="w-4 h-4"></i>';
        btn.classList.replace('bg-emerald-50', 'bg-slate-100');
        btn.classList.replace('text-emerald-600', 'text-slate-500');
    } else {
        btn.disabled = false;
        btn.innerHTML = 'Claim Now <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>';
    }

    // 4. Build Streak Cards Dynamically
    const container = document.getElementById("streakCardsContainer");
    container.innerHTML = "";

    const streakData = [
        { day: 1, pts: 20 },
        { day: 2, pts: 50 },
        { day: 3, pts: 100 }
    ];

    streakData.forEach((s, index) => {
        // Active logic: If claimed today, show up to current streak as active.
        // If not claimed today, the NEXT day in the sequence should be highlighted.
        let isActive = false;
        let isPast = false;

        if (claimedToday) {
            if (s.day === streak || (streak > 3 && s.day === 3)) isActive = true;
            else if (s.day < streak) isPast = true;
        } else {
            if (s.day === streak + 1 || (streak >= 3 && s.day === 3)) isActive = true;
            else if (s.day <= streak) isPast = true;
        }

        let html = "";
        if (isActive) {
            // Highlighted / Next to claim
            html = `
            <div class="relative group cursor-pointer">
              <div class="bg-gradient-to-b from-emerald-50 to-white border-2 border-emerald-500 rounded-2xl p-4 text-center transition-transform hover:scale-[1.02] shadow-md shadow-emerald-100">
                ${claimedToday ? `
                <span class="absolute -top-2 -right-2 flex h-5 w-5">
                  <span class="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 items-center justify-center text-[10px] text-white">✓</span>
                </span>` : `
                <span class="absolute -top-2 -right-2 flex h-5 w-5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 items-center justify-center text-[10px] text-white">!</span>
                </span>
                `}
                <div class="text-emerald-600 text-xl font-black">+${s.pts}</div>
                <p class="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">Day ${streak > 3 && s.day === 3 ? streak + (claimedToday ? 0 : 1) : s.day}</p>
              </div>
            </div>`;
        } else if (isPast) {
            // Already claimed past days
            html = `
            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center opacity-80">
              <div class="absolute -top-2 -right-2 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
              <div class="text-xl text-emerald-600 font-bold">+${s.pts}</div>
              <p class="text-[10px] font-bold text-emerald-600/70 uppercase mt-1 tracking-tighter">Day ${s.day}</p>
            </div>`;
        } else {
            // Future days
            html = `
            <div class="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 text-center opacity-60">
              <div class="text-xl grayscale opacity-50 text-slate-400 font-bold">+${s.pts}</div>
              <p class="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">Day ${streak > 3 && s.day === 3 ? streak + 1 : s.day}</p>
            </div>`;
        }
        container.innerHTML += html;
    });

    if(window.lucide) lucide.createIcons();
}

async function claimDailyStreak() {
    const token = localStorage.getItem("token");
    const btn = document.getElementById("claimStreakBtn");
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Claiming...';

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "claim_streak", token: token })
        });
        const data = await res.json();

        // if (data.status === "success") {
        //     alert(data.message);
        //     // Refresh the page to sync all points, badges, and progress bars
        //     location.reload(); 
        // } else {
        //     alert(data.message);
        //     btn.disabled = false;
        //     btn.innerHTML = 'Claim Now';
        // }

        if (data.status === "success") {
            alert(data.message);
            
            // SILENTLY UPDATE DATA (No page reload)
            loadProfile(token); 
            
        } else {
            alert(data.message);
            btn.disabled = false;
            btn.innerHTML = 'Claim Now';
        }


        
    } catch (e) {
        alert("Connection error.");
        btn.disabled = false;
        btn.innerHTML = 'Claim Now';
    }
}
