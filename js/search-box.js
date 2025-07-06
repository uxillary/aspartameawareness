// Function to handle search input for a specific input and its corresponding dropdown
function handleSearch(inputId, dropdownId) {
    document.getElementById(inputId).addEventListener('input', function() {
        var query = this.value.toLowerCase();
        var dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = ''; // Clear previous suggestions

        // Only trigger search if the query length is 2 or more characters
        if (query.length >= 2) {
            // Fetch blog posts from the JSON file
            fetch('json/blogs.json') // Update path based on location
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
                        dropdown.style.display = 'block';
                        var item = document.createElement('div');
                        item.className = 'dropdown-item dropdown-no-results';
                        item.textContent = 'No results found';
                        dropdown.appendChild(item);
                    }
                });
        } else {
            dropdown.style.display = 'none'; // Hide dropdown if fewer than 2 characters are input
        }
    });
}

// Initialize search handling for both input elements
handleSearch('searchInput', 'dropdown');   // First search input and its dropdown
handleSearch('searchInput2', 'dropdown2'); // Second search input and its dropdown

// Hide dropdowns when clicking outside
document.addEventListener('click', function(event) {
    var dropdown1 = document.getElementById('dropdown');
    var dropdown2 = document.getElementById('dropdown2');
    if (!event.target.closest('#searchInput') && !event.target.closest('#searchInput2')) { // Check clicks outside both inputs
        dropdown1.style.display = 'none';
        dropdown2.style.display = 'none';
    }
});
