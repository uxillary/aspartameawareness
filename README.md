# Aspartame Awareness

This is the official repository for the Aspartame Awareness website, aimed at providing information and raising awareness about the effects of aspartame.
https://aspartameawareness.org

## Structure

- `index.njk` - The main homepage template.
- `blogs/` - Blog post templates.
- `css/`, `js/`, `images/` - Asset folders copied as-is.
- `_includes/` - Layout and partial templates used by Eleventy.

## Setup

To run this project locally:

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/aspartameawareness.org.git
    cd aspartameawareness.org
    ```
2. Install dependencies and build the site:
    ```sh
    npm install
    npx eleventy
    ```
   The generated site will appear in the `_site/` directory.

3. Use the search box to explore blog posts; a friendly "No results found" message appears when no matches are found.
4. The service worker caches pages for offline use. When offline, you'll see a simple offline page with a link back home.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

[MIT](LICENSE)
