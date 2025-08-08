function loadJSON(url) {
    return fetch(url, { headers: { 'Accept': 'application/json' } })
        .then(resp => {
            if (!resp.ok) throw new Error('Network error');
            return resp.json();
        });
}
