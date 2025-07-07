(function() {
    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
    }
    function getCookie(name) {
        var cname = name + '=';
        var decoded = decodeURIComponent(document.cookie);
        var ca = decoded.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(cname) === 0) return c.substring(cname.length);
        }
        return null;
    }
    function createBanner() {
        var banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = '<span>We use cookies to improve your experience. <a href="/privacy.html">Learn more</a></span>' +
            '<button id="accept-cookies" class="button">Accept</button>';
        document.body.appendChild(banner);
        document.getElementById('accept-cookies').addEventListener('click', function() {
            setCookie('cookieConsent', 'accepted', 365);
            banner.remove();
        });
    }
    function init() {
        if (!getCookie('cookieConsent')) {
            createBanner();
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
