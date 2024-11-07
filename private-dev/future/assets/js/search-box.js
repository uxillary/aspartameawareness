document.getElementById('searchInput').addEventListener('input', function() {
    var query = this.value.toLowerCase();
    var dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = ''; // Clear previous suggestions

    // Only trigger search if the query length is 2 or more characters
    if (query.length >= 3) {
        // Fetch blog posts from the JSON file
        fetch('../json/blogs.json')
            .then(response => response.json())
            .then(blogPosts => {
                // Filter posts based on query (matching title or keywords)
                var matchedPosts = blogPosts.filter(function(post) {
                    return post.title.toLowerCase().includes(query) || post.keywords.some(keyword => keyword.toLowerCase().includes(query));
                });

                // Show results in dropdown
                if (matchedPosts.length > 0) {
                    dropdown.style.display = 'block';
                    matchedPosts.forEach(function(post) {
                        var item = document.createElement('div');
                        item.className = 'dropdown-item';
                        item.textContent = post.title;
                        item.onclick = function() {
                            window.location.href = post.url; // Redirect to the blog page
                        };
                        dropdown.appendChild(item);
                    });
                } else {
                    dropdown.style.display = 'none';
                }
            });
    } else {
        dropdown.style.display = 'none'; // Hide dropdown if fewer than 2 characters are input
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!document.getElementById('searchContainer').contains(event.target)) {
        document.getElementById('dropdown').style.display = 'none';
    }
});