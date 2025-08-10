document.addEventListener('DOMContentLoaded', () => {
  const loadComponent = (id, url, callback) => {
    const el = document.getElementById(id);
    if (!el) {
      if (callback) callback();
      return;
    }

    fetch(url)
      .then(resp => resp.text())
      .then(html => {
        el.innerHTML = html;
        if (callback) callback();
      })
      .catch(err => {
        console.error(`Failed to load ${id}:`, err);
        if (callback) callback();
      });
  };

  loadComponent('footer-placeholder', '/components/footer.html');
  loadComponent('header-placeholder', '/components/header.html', () =>
    document.dispatchEvent(new Event('headerLoaded'))
  );
  loadComponent('sidebar-placeholder', '/components/sidebar.html', () =>
    document.dispatchEvent(new Event('sidebarLoaded'))
  );
});
