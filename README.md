# Aspartame Awareness

This is the official repository for the Aspartame Awareness website, aimed at providing information and raising awareness about the effects of aspartame.
https://aspartameawareness.org

## Structure

- `index.html` - The main homepage of the website.
- `css/` - Folder containing the CSS files.
- `js/` - Folder containing the JavaScript files.
- `images/` - Folder containing image assets.
- `private-dev/` - Folder containing private files that are not uploaded to the server (ignored by git).

## Setup

To run this project locally:

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/aspartameawareness.org.git
    cd aspartameawareness.org
    ```

2. Install the dependencies:
   ```sh
   npm install
   ```
3. Build the static site with Eleventy:
   ```sh
   npx eleventy
   ```
   The generated files will be placed in the `_site/` directory. You can start a development server that watches for changes with:
   ```sh
   npm start
   ```
4. Use the search box to explore blog posts; a friendly "No results found" message appears when no matches are found.
5. The service worker caches pages for offline use. When offline, you'll see a simple offline page with a link back home.
6. Dark mode is available and now automatically follows your system preference on the first visit.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

[MIT](LICENSE)
