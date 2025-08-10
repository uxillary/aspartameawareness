// Dark mode toggle

function initDarkMode() {
    const navList = document.querySelector('nav.main ul');
    if (!navList) {
        // If the navigation hasn't been injected yet wait for the header
        // to load and then initialise dark mode. Using `{ once: true }`
        // ensures this handler runs a single time.
        document.addEventListener('headerLoaded', initDarkMode, { once: true });
        return;
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.id = 'darkModeToggle';
    a.style.cursor = 'pointer';
    a.setAttribute('aria-label', 'Switch to dark mode');
    a.setAttribute('title', 'Switch to dark mode');

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-moon';
    a.appendChild(icon);

    // Accessibility label that is visually hidden by the theme's
    // `.icon > .label` rule.
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = 'Toggle dark mode';
    a.appendChild(label);
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

    if (enabled) document.body.classList.add('dark-mode', 'dark');

    // When no explicit preference is stored, keep in sync with system changes
    if (storedValue === null) {
        mql.addEventListener('change', e => {
            document.body.classList.toggle('dark-mode', e.matches);
            document.body.classList.toggle('dark', e.matches);
            updateIcon();
        });
    }
    updateIcon();

    a.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('dark');
        const enabled = document.body.classList.contains('dark');
        localStorage.setItem('darkMode', enabled);
        updateIcon();
    });

    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function updateIcon() {
        if (document.body.classList.contains('dark')) {
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
