// Function to load and display the posts list
function loadPostsList() {
    // Fetch the JSON data
    fetch('json/posts.json')  // Adjust the path as necessary to your JSON file location
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById('sidebar-list'); // Container to append posts to

            if (!postsList) {
                console.error('Sidebar list container not found!');
                return;
            }

            // Clear any existing content
            postsList.innerHTML = '';

            // Loop through each post and create HTML structure
            posts.forEach(post => {
                // Create the list item element
                const listItem = document.createElement('li');

                // Create the link element
                const link = document.createElement('a');
                link.href = post.url; // Set the URL for the link

                // Create the title element
                const title = document.createElement('h3');
                title.textContent = post.title; // Set the title text

                // Create the subtitle/description element
                const subtitle = document.createElement('p');
                subtitle.textContent = post.sub; // Set the subtitle text

                // Append the title and subtitle to the link
                link.appendChild(title);
                link.appendChild(subtitle);

                // Append the link to the list item
                listItem.appendChild(link);

                // Append the list item to the posts list container
                postsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error loading posts:', error);
        });
}

// Call the loadPostsList function when the page is loaded
document.addEventListener('DOMContentLoaded', loadPostsList);
