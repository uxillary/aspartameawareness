// Function to fetch blog URLs from JSON and redirect to a random URL
function loadRandomBlogURL() {
    // Fetch the URLs from the JSON file
    fetch('../json/urls-blog.json')  // Ensure the correct path to your JSON file
        .then(response => response.json())
        .then(posts => {
            // Get the current page URL
            const currentURL = window.location.href;

            // Filter out the current page URL from the list
            const availablePosts = posts.filter(post => post.url !== currentURL);

            // Check if there are available posts left
            if (availablePosts.length > 0) {
                // Get a random post from the filtered list
                const randomPost = availablePosts[Math.floor(Math.random() * availablePosts.length)];

                // Redirect to the random blog URL
                window.location.href = randomPost.url;
            } else {
                console.error('No available posts to redirect to.');
            }
        })
        .catch(error => {
            console.error('Error fetching the posts JSON:', error);
        });
}

// Add event listener to the "Next Page" button
document.getElementById('next-page-button').addEventListener('click', function (event) {
    // Prevent the default anchor behavior (no page reload)
    event.preventDefault();

    // Call the function to redirect to a random blog
    loadRandomBlogURL();
});
