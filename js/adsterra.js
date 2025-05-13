// adsterra.js
(function() {
  function loadAd() {
    if (window.adLoaded) return;
    window.adLoaded = true;

    var s = document.createElement('script');
    s.src = "//pl26628602.profitableratecpm.com/54/39/7f/54397fb0d695138ae3f30b30f5c39626.js"; // example src
    s.type = "text/javascript";
    document.body.appendChild(s);
  }

  // Delay until user scrolls or clicks
  window.addEventListener('scroll', loadAd, { once: true });
  window.addEventListener('click', loadAd, { once: true });
})();
