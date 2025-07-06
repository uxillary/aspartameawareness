// Dark mode toggle
function initDarkMode() {
    let toggle = document.getElementById('darkModeToggle');
    if (!toggle) {
        const navList = document.querySelector('nav.main ul');
        if (!navList) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.id = 'darkModeToggle';
        a.className = 'fa-solid fa-moon';
        a.setAttribute('aria-label', 'Toggle dark mode');
        a.style.cursor = 'pointer';
        li.appendChild(a);
        navList.appendChild(li);
        toggle = a;
    }

    const stored = localStorage.getItem('darkMode') === 'true';
    if (stored) document.body.classList.add('dark-mode');
    updateIcon();

    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');
        const enabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', enabled);
        updateIcon();
    });

    function updateIcon() {
        if (document.body.classList.contains('dark-mode')) {
            toggle.classList.remove('fa-moon');
            toggle.classList.add('fa-sun');
        } else {
            toggle.classList.remove('fa-sun');
            toggle.classList.add('fa-moon');
        }
    }
}

document.addEventListener('DOMContentLoaded', initDarkMode);
