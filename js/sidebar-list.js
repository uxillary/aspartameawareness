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

            // Get the base path based on the current URL
            const currentPath = window.location.pathname;  // E.g., "/blogs/adhd.html"
            const basePath = currentPath.includes('/blogs/') ? '../' : '';  // Adjust as per current folder structure

            // Add basic navigation links for mobile menu
            const navLinks = [
                { url: 'index', text: 'Home' },
                { url: 'aspartame', text: 'Aspartame Guide' },
                { url: 'list-risks', text: 'Risks' },
                { url: 'blogs/alternatives', text: 'Alternatives' },
                { url: 'research', text: 'Research' },
                { url: 'quiz', text: 'Quiz' }
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
                const listItem = document.createElement('li');

                const link = document.createElement('a');
                link.href = basePath + post.url;
                link.className = 'group grid grid-cols-[64px_1fr] gap-3 items-center rounded-lg p-2 -m-2 hover:bg-white/5 transition';

                const img = document.createElement('img');
                img.src = basePath + post.img_url;
                img.alt = post.img_alt || '';
                img.className = 'h-16 w-16 rounded-md object-cover';

                const textWrap = document.createElement('div');
                textWrap.className = 'min-w-0';

                const title = document.createElement('h4');
                title.textContent = post.title;
                title.className = 'truncate font-semibold text-[color:var(--text)] group-hover:text-white';

                const date = document.createElement('p');
                date.textContent = post.date_two;
                date.className = 'text-xs text-[color:var(--muted)]';

                textWrap.appendChild(title);
                textWrap.appendChild(date);

                link.appendChild(img);
                link.appendChild(textWrap);
                listItem.appendChild(link);
                postsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error loading posts:', error);
        });
}

// Call the loadPostsList function when the page loads
document.addEventListener('headerLoaded', loadPostsList);
