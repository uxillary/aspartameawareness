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
                listItem.classList.add('bg-white','dark:bg-neutral-800','rounded-lg','shadow-md','overflow-hidden','transition','transform','border-l-4','border-transparent','hover:border-[var(--accent-color)]','focus-within:border-[var(--accent-color)]','hover:-translate-y-1','focus-within:-translate-y-1','hover:shadow-xl','focus-within:shadow-xl');

                // Create article element
                const article = document.createElement('article');
                article.classList.add('flex','flex-col','sm:flex-row','sm:items-center','gap-4');

                // Create image element and link
                const imageLink = document.createElement('a');
                imageLink.href = post.url; // Link to the post
                imageLink.classList.add('block','sm:w-32','sm:h-24','flex-shrink-0');
                const img = document.createElement('img');
                img.src = post.img_url; // Set the image source
                img.alt = post.img_alt; // Set the image alt text
                img.classList.add('w-full','h-full','object-cover');
                imageLink.appendChild(img);

                // Create content container
                const content = document.createElement('div');
                content.classList.add('flex-1','p-4','space-y-1');

                // Create header for the article
                const header = document.createElement('header');
                const title = document.createElement('h3');
                const titleLink = document.createElement('a');
                title.classList.add('text-sm','font-semibold','leading-tight');
                titleLink.href = post.url; // Set URL for the post
                titleLink.textContent = post.title; // Set title text
                title.appendChild(titleLink);

                // Create time element for the post date
                const time = document.createElement('time');
                time.classList.add('block','text-xs','text-gray-500','dark:text-gray-400');
                time.setAttribute('datetime', post.date_one); // Set the datetime attribute
                time.textContent = post.date_two; // Set the displayed date

                // Create subtitle element
                const subtitle = document.createElement('p');
                subtitle.classList.add('text-xs','text-gray-600','dark:text-gray-300');
                subtitle.textContent = post.sub;

                // Assemble content
                header.appendChild(title);
                content.appendChild(header);
                content.appendChild(time);
                content.appendChild(subtitle);

                // Append image and content to article
                article.appendChild(imageLink);
                article.appendChild(content);

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
