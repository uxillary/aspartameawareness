// Dark mode toggle

function initDarkMode() {
    const navList = document.querySelector('nav.main ul');
    if (!navList) return;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.id = 'darkModeToggle';
    // Use the same "icon" pattern as other header links so the Font Awesome
    // glyph is rendered consistently across pages
    a.className = 'icon solid fa-moon';
    a.style.cursor = 'pointer';
    a.setAttribute('aria-label', 'Switch to dark mode');
    a.setAttribute('title', 'Switch to dark mode');
    li.appendChild(a);
    // Insert toggle right after the search icon to keep it near related actions
    const searchLi = navList.querySelector('li.search');
    if (searchLi) {
        navList.insertBefore(li, searchLi.nextSibling);
    } else {
        navList.appendChild(li);
    }

    // Determine desired mode. If the user has previously selected a mode we
    // honour that choice. Otherwise default to the system preference using
    // `prefers-color-scheme`.
    const storedValue = localStorage.getItem('darkMode');
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersDark = mql.matches;
    const enabled = storedValue === null ? prefersDark : storedValue === 'true';

    if (enabled) document.body.classList.add('dark-mode');

    // When no explicit preference is stored, keep in sync with system changes
    if (storedValue === null) {
        mql.addEventListener('change', e => {
            document.body.classList.toggle('dark-mode', e.matches);
            updateIcon();
        });
    }
    updateIcon();

    a.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');
        const enabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', enabled);
        updateIcon();
    });

    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function updateIcon() {
        if (document.body.classList.contains('dark-mode')) {
            a.classList.remove('fa-moon');
            a.classList.add('fa-sun');
            a.setAttribute('aria-label', 'Switch to light mode');
            a.setAttribute('title', 'Switch to light mode');
            if (themeMeta) themeMeta.setAttribute('content', '#181818');
        } else {
            a.classList.remove('fa-sun');
            a.classList.add('fa-moon');
            a.setAttribute('aria-label', 'Switch to dark mode');
            a.setAttribute('title', 'Switch to dark mode');
            if (themeMeta) themeMeta.setAttribute('content', '#ffffff');
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
