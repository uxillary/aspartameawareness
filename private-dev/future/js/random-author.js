// Array of names
const names = [
    "Aspartame Advocate",
    "The Cautionary Chemist",
    "Health Sentinel",
    "Aspartame Insight",
    "Awareness Agent",
    "Aspartame Analyst",
    "The Cautionist",
    "Aspartame Alert",
    "Health Vigil",
    "Safety Scribe"
];

// Function to select a random name
function getRandomName() {
    return names[Math.floor(Math.random() * names.length)];
}

// Apply random names to all elements with the 'random-name' class
document.addEventListener("DOMContentLoaded", () => {
    const nameElements = document.querySelectorAll(".random-name");
    nameElements.forEach(element => {
        element.textContent = getRandomName(); // Assign a random name
    });
});
