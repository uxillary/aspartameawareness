document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
    fetch('/components/footer.html')
      .then(resp => resp.text())
      .then(html => {
        placeholder.innerHTML = html;
      })
      .catch(err => {
        console.error('Failed to load footer:', err);
      });
  }
});
