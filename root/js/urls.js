// Function to fetch blog URLs from JSON and redirect to a random URL
function loadRandomBlogURL() {
    // Fetch the URLs from the JSON file
    fetch('json/urls.json')  // Ensure the correct path to your JSON file
        .then(response => response.json())
        .then(posts => {
            // Get a random post from the list
            const randomPost = posts[Math.floor(Math.random() * posts.length)];

            // Redirect to the random blog URL
            window.location.href = randomPost.url;
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