// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const hexagons = document.querySelectorAll('.hexagon a');

    hexagons.forEach(hex => {
        hex.addEventListener('click', () => {
            hexagons.forEach(link => link.parentElement.classList.remove('active'));
            hex.parentElement.classList.add('active');
        });
    });
});
