// Dark mode toggle

function initDarkMode() {
    const navList = document.querySelector('nav.main ul');
    if (!navList) return;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.id = 'darkModeToggle';
    a.className = 'fa-solid fa-moon';
    a.style.cursor = 'pointer';
    li.appendChild(a);
    navList.appendChild(li);

    const stored = localStorage.getItem('darkMode') === 'true';
    if (stored) document.body.classList.add('dark-mode');
    updateIcon();

    a.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');
        const enabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', enabled);
        updateIcon();
    });

    function updateIcon() {
        if (document.body.classList.contains('dark-mode')) {
            a.classList.remove('fa-moon');
            a.classList.add('fa-sun');
        } else {
            a.classList.remove('fa-sun');
            a.classList.add('fa-moon');
        }
    }
}

document.addEventListener('DOMContentLoaded', initDarkMode);
