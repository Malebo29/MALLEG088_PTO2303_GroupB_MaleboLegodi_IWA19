import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

export  const matches = books;
export const page = 1;

export  const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}

export const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}

const listFragment = document.createDocumentFragment();
const extractedBooks = books.slice(0, BOOKS_PER_PAGE);

/**
 * Takes a book as an object literal and converts it a HTML element that can 
 * be appended to the DOM. Creating a book preview element individually prevents the 
 * JavaScript having to re-render the entire DOM every time a book preview is created.
 *
 * @param {object} book
 * @returns {HTMLElement}
 */

export const createBookPreview = (book) => {
    const bookCard = document.createElement('button')
    bookCard.classList = 'preview'
    bookCard.setAttribute('data-preview', book.id)
    bookCard.innerHTML = `
    <img class="preview__image" src="${book.image}" clickable = false />
    <div class="preview__info">
        <h3 class="preview__title" clickable = false>${book.title}</h3>
        <div class="preview__author" clickable = false>${authors[book.author]}</div>
    </div>
    
`
    bookCard.addEventListener('click', (event) => {
        event.preventDefault()
        const previewBook = event.target
        html.bookDetails.overlay.setAttribute('open', 'open')
    })

    return bookCard
}

/**
 * Since the list of genres is in use, and their identification can be configured before
 * the start of the app (in data.js), the actual options returned should be
 * dynamically added to the respective "<select>" elements in the HTML after
 * JavaScript loads. This function executes the logic that reads the current list of
 * genres and creates the HTML to select from.
 *
 * @returns {HTMLElement}
 */
export const createGenreOptionsHtml = () => {
    const genresFragment = document.createDocumentFragment()
    let genreOption = document.createElement('option')
    genreOption.innerText = 'All Genres'
    genresFragment.appendChild(genreOption)

    for (const genre of Object.entries(genres)) {
        const [id, name] = genre
        const genreOptionsElement = document.createElement('option')
        genreOptionsElement.innerText = name
        genresFragment.appendChild(genreOptionsElement)
    }
    return genresFragment
}

for ( const book of extractedBooks ) {
    const preview = createBookPreview(book)
    listFragment.appendChild(preview)
}

/**
 * Since the list of authors is in use, and their identification can be configured before
 * the start of the app (in data.js), the actual options returned should be
 * dynamically added to the respective "<select>" elements in the HTML after
 * JavaScript loads. This function executes the logic that reads the current list of
 * authors and creates the HTML to select from.
 *
 * @returns {HTMLElement}
 */
export const createAuthorOptionsHtml = () => {
    const authorsFragment = document.createDocumentFragment()
    let authorOption = document.createElement('option')
    authorOption.innerText = 'All Authors'
    authorsFragment.appendChild(authorOption)

    for (const author of Object.entries(authors)) {
        const [id, name] = author
        const authorOptionsElement = document.createElement('option')
        authorOptionsElement.innerText = name
        authorsFragment.appendChild(authorOptionsElement)
    }
    return authorsFragment
}

/**
 * An object literal that contains references to all the HTML elements
 * referenced through the operation of the app either upon initialisation or
 * while its running (via event listeners). This ensure that all UI elements can
 * be accessed and seen in a structured manner in a single data structure.
 *
 */
export const html = {
    list: {
        items: document.querySelector('[data-list-items]'),
        message: document.querySelector('[data-list-message]'),
        button: document.querySelector('[data-list-button]')
    },
    search: {
        overlay: document.querySelector('[data-search-overlay]'),
        form: document.querySelector('[data-search-form]'),
        cancel: document.querySelector('[data-search-cancel]'),
        title: document.querySelector('[data-search-title]'),
        author: document.querySelector('[data-search-authors]'),
        genre: document.querySelector('[data-search-genres]'),
    },
    settings: {
        overlay: document.querySelector('[data-settings-overlay]'),
        form: document.querySelector('[data-settings-form]'),
        cancel: document.querySelector('[data-settings-cancel]'),
        theme: document.querySelector('[data-settings-theme]'),
    },
    bookDetails: {
        overlay: document.querySelector('[data-list-active]'),
        blur: document.querySelector('[data-list-blur]'),
        image: document.querySelector('[data-list-image]'),
        title: document.querySelector('[data-list-title]'),
        subtitle: document.querySelector('[data-list-subtitle]'),
        description: document.querySelector('[data-list-description]'),
        close: document.querySelector('[data-list-close]'),
    },
    searchBtn: document.querySelector('[data-header-search]'),
    settingsBtn: document.querySelector('[data-header-settings]'),
}

if(localStorage.getItem('theme') == 'night'){
    document.documentElement.style.setProperty('--color-dark', night.dark);
    document.documentElement.style.setProperty('--color-light', night.light);
} else {
    document.documentElement.style.setProperty('--color-dark', day.dark);
    document.documentElement.style.setProperty('--color-light', day.light);
}

html.list.button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)
html.list.button.innerHTML = /* html */
    `<span>Show more</span>
    <span class="list__remaining">(${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
 `

html.list.items.appendChild(listFragment)
html.search.genre.appendChild(createGenreOptionsHtml())
html.search.author.appendChild(createAuthorOptionsHtml())