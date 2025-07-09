document.addEventListener('DOMContentLoaded', () => {
  const footer = document.getElementById('footer-placeholder');
  if (footer) {
    fetch('/components/footer.html')
      .then(resp => resp.text())
      .then(html => {
        footer.innerHTML = html;
      })
      .catch(err => console.error('Failed to load footer:', err));
  }

  const header = document.getElementById('header-placeholder');
  if (header) {
    fetch('/components/header.html')
      .then(resp => resp.text())
      .then(html => {
        header.innerHTML = html;
        document.dispatchEvent(new Event('headerLoaded'));
      })
      .catch(err => {
        console.error('Failed to load header:', err);
        document.dispatchEvent(new Event('headerLoaded'));
      });
  } else {
    document.dispatchEvent(new Event('headerLoaded'));
  }
});
