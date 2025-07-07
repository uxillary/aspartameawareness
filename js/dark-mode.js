// Dark mode toggle

function initDarkMode() {
    const navList = document.querySelector('nav.main ul');
    if (!navList) return;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.id = 'darkModeToggle';
    // Using Font Awesome 5 which doesn't recognize the `fa-solid` prefix
    // Add only the icon class so it matches the other header icons
    a.className = 'fa-moon';
    a.style.cursor = 'pointer';
    li.appendChild(a);
    // Insert toggle right after the search icon to keep it near related actions
    const searchLi = navList.querySelector('li.search');
    if (searchLi) {
        navList.insertBefore(li, searchLi.nextSibling);
    } else {
        navList.appendChild(li);
    }

    const storedPref = localStorage.getItem('darkMode');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (storedPref === 'true' || (storedPref === null && mediaQuery.matches)) {
        document.body.classList.add('dark-mode');
    }
    updateIcon();

    // Update when user changes system preference and no explicit preference saved
    mediaQuery.addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') !== null) return;
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        updateIcon();
    });

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

// Run immediately if the document has already loaded. When this script is
// placed at the end of the page, the DOMContentLoaded event may have fired
// before we register the listener which would prevent the toggle from being
// added. This check ensures the toggle always appears.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}
