// Dark mode toggle

function initDarkMode() {
    const navList = document.querySelector('nav.main ul');
    if (!navList) return;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.id = 'darkModeToggle';
    // Insert an <i> element so Font Awesome 6 icons work regardless of the
    // theme's legacy "icon" styles.
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-moon';
    icon.setAttribute('aria-hidden', 'true');

    // Fallback text shown if the Font Awesome font fails to load
    const fallback = document.createElement('span');
    fallback.textContent = '🌓';
    fallback.style.display = 'none';

    a.className = 'icon';
    a.style.cursor = 'pointer';
    a.setAttribute('aria-label', 'Switch to dark mode');
    a.setAttribute('title', 'Switch to dark mode');
    a.appendChild(icon);
    a.appendChild(fallback);
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
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            a.setAttribute('aria-label', 'Switch to light mode');
            a.setAttribute('title', 'Switch to light mode');
            if (themeMeta) themeMeta.setAttribute('content', '#181818');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            a.setAttribute('aria-label', 'Switch to dark mode');
            a.setAttribute('title', 'Switch to dark mode');
            if (themeMeta) themeMeta.setAttribute('content', '#ffffff');
        }
    }

    // Display fallback text if the icon fails to load
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            if (icon.offsetWidth === 0) fallback.style.display = 'inline';
        });
    } else {
        // Best-effort fallback for browsers without Font Loading API
        setTimeout(() => {
            if (icon.offsetWidth === 0) fallback.style.display = 'inline';
        }, 500);
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
