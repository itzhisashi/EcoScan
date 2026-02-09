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
