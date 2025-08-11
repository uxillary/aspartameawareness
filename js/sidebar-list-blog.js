// Function to load and display the posts list
function loadPostsList() {
    // Fetch the JSON data
    fetch('../json/posts.json')  // Adjust the path as necessary to your JSON file location
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById('sidebar-list'); // Container to append posts to

            if (!postsList) {
                console.error('Sidebar list container not found!');
                return;
            }

            // Clear any existing content
            postsList.innerHTML = '';

            // Get the base path based on the current URL
            const currentPath = window.location.pathname;  // E.g., "/blogs/adhd.html"
            const basePath = currentPath.includes('/blogs/') ? '../' : '';  // Adjust as per current folder structure

            // Add basic navigation links for mobile menu
            const navLinks = [
                { url: 'index', text: 'Home' },
                { url: 'aspartame', text: 'Aspartame Guide' },
                { url: 'list-risks', text: 'Risks' },
                { url: 'blogs/alternatives', text: 'Alternatives' },
                { url: 'research', text: 'Research' }
            ];

            navLinks.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('py-2');
                const a = document.createElement('a');
                a.href = basePath + item.url;
                a.textContent = item.text;
                a.classList.add('block', 'hover:text-[var(--accent-color)]');
                li.appendChild(a);
                postsList.appendChild(li);
            });

            // Loop through each post and create HTML structure
            posts.forEach(post => {
                // Create the list item element
                const listItem = document.createElement('li');
                listItem.classList.add('py-2');

                // Create the link element
                const link = document.createElement('a');
                link.href = basePath + post.url; // Concatenate the base path with the URL from JSON
                link.classList.add('block', 'hover:text-[var(--accent-color)]');

                // Create the title element
                const title = document.createElement('h3');
                title.textContent = post.title; // Set the title text
                title.classList.add('font-semibold');

                // Create the subtitle/description element
                const subtitle = document.createElement('p');
                subtitle.textContent = post.sub; // Set the subtitle text
                subtitle.classList.add('text-xs', 'text-gray-400');

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

// Call the loadPostsList function when the page loads
document.addEventListener('headerLoaded', loadPostsList);
