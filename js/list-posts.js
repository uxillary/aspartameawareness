// Function to load and display posts
function loadPosts() {
    // Fetch the JSON data
    fetch('json/posts.json')  // Adjust the path as necessary to your JSON file location
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById('posts-list'); // Container to append posts to

            // Get 5 random posts from the JSON data
            const randomPosts = getRandomPosts(posts, 5);

            // Loop through each random post and create HTML structure
            randomPosts.forEach(post => {
                // Create list item for each post
                const listItem = document.createElement('li');
                listItem.classList.add('bg-white','dark:bg-neutral-800','rounded','shadow');

                // Create article element
                const article = document.createElement('article');
                article.classList.add('flex','flex-col','gap-2','p-4');

                // Create header for the article
                const header = document.createElement('header');
                header.classList.add('mb-2');
                const title = document.createElement('h3');
                const titleLink = document.createElement('a');
                title.classList.add('text-sm','font-semibold','leading-tight');
                titleLink.href = post.url; // Set URL for the post
                titleLink.textContent = post.title; // Set title text
                title.appendChild(titleLink);

                // Create time element for the post date
                const time = document.createElement('time');
                time.classList.add('published','block','text-xs','text-gray-500','dark:text-gray-400');
                time.setAttribute('datetime', post.date_one); // Set the datetime attribute
                time.textContent = post.date_two; // Set the displayed date

                // Append title and time to the header
                header.appendChild(title);
                header.appendChild(time);

                // Create image element and link
                const imageLink = document.createElement('a');
                imageLink.href = post.url; // Link to the post
                imageLink.classList.add('block');
                const img = document.createElement('img');
                img.src = post.img_url; // Set the image source
                img.alt = post.img_alt; // Set the image alt text
                img.classList.add('w-full','rounded');
                imageLink.appendChild(img);

                // Append header and image link to the article
                article.appendChild(header);
                article.appendChild(imageLink);

                // Append article to the list item
                listItem.appendChild(article);

                // Append the list item to the posts list container
                postsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading posts:', error));
}

// Call the loadPosts function to populate the list when the page is loaded
window.onload = loadPosts;
