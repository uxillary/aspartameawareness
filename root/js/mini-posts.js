// Function to get a random subset of posts
function getRandomPosts(posts, numPosts) {
    // Shuffle the array and return the first `numPosts` elements
    const shuffled = posts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numPosts);
}

// Function to load and display mini posts
function loadMiniPosts() {
    // Fetch the JSON data
    fetch('../json/posts-blog.json')  // Adjust the path as necessary to your JSON file location
        .then(response => response.json())
        .then(posts => {
            const miniPostsContainer = document.getElementById('mini-posts-container');

            // Get 4 random posts from the JSON data
            const randomPosts = getRandomPosts(posts, 4);

            // Loop through each random post and create HTML structure
            randomPosts.forEach(post => {
                // Create the mini-post article element
                const article = document.createElement('article');
                article.classList.add('mini-post');

                // Create header with title and date
                const header = document.createElement('header');
                
                // Title
                const title = document.createElement('h3');
                const titleLink = document.createElement('a');
                titleLink.href = post.url; // Set URL for the post
                titleLink.textContent = post.title; // Set title text
                title.appendChild(titleLink);
                
                // Date
                const time = document.createElement('time');
                time.classList.add('published');
                time.setAttribute('datetime', post.date_one); // Set the datetime attribute
                time.textContent = post.date_two; // Set the displayed date

                // Append title and date to the header
                header.appendChild(title);
                header.appendChild(time);

                // Create image element and link
                const imageLink = document.createElement('a');
                imageLink.href = post.url; // Link to the post
                imageLink.classList.add('image');
                const img = document.createElement('img');
                img.src = post.img_url_md; // Set the medium image source
                img.alt = post.img_alt; // Set the image alt text
                imageLink.appendChild(img);

                // Append header and image link to the article
                article.appendChild(header);
                article.appendChild(imageLink);

                // Append article to the container
                miniPostsContainer.appendChild(article);
            });
        })
        .catch(error => {
            console.error('Error fetching the posts JSON:', error);
        });
}

// Call the loadMiniPosts function to populate the mini-posts when the page is loaded
window.onload = loadMiniPosts;
