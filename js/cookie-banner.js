(function() {
    const setCookie = (name, value, days) => {
        const d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    };
    const getCookie = name => {
        const cname = `${name}=`;
        return document.cookie.split(';').map(c => c.trim()).find(c => c.indexOf(cname) === 0)?.substring(cname.length) || null;
    };
    const createBanner = () => {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = '<span>We use cookies to improve your experience. <a href="/privacy.html">Learn more</a></span>' +
            '<div class="actions"><button id="accept-cookies" class="button caution">Accept</button><button id="decline-cookies" class="button">Decline</button></div>';
        document.body.appendChild(banner);
        document.getElementById('accept-cookies').addEventListener('click', () => {
            setCookie('cookieConsent', 'accepted', 365);
            banner.remove();
        });
        document.getElementById('decline-cookies').addEventListener('click', () => {
            setCookie('cookieConsent', 'declined', 365);
            banner.remove();
        });
    };
    const init = () => {
        if (!getCookie('cookieConsent')) createBanner();
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
