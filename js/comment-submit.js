async function submitComment(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    data.token = data['cf-turnstile-response'];
    delete data['cf-turnstile-response'];
    try {
        const res = await fetch('https://example.workers.dev/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Request failed');
        alert('Comment submitted');
        form.reset();
    } catch (err) {
        alert(err.message);
    }
}
const commentForm = document.getElementById('comment-form');
if (commentForm) commentForm.addEventListener('submit', submitComment);
