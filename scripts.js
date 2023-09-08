import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";
import { matches, page, day, night, createBookPreview, html } from "./view.js";

if (!books && !Array.isArray(books)) throw new Error('Source required');

const handleSearchToggle = (event) => {
    event.preventDefault();
    html.search.overlay.setAttribute('open', 'open');
    html.search.title.focus();   
}

const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    console.log(filters)
    const searchResults = []
    
    for (const book of books) {
        const titleMatch = filters.title.trim() != '' && book.title.toLowerCase().includes(filters.title.toLowerCase())
        const authorMatch = (filters.author != 'All Genres' || filters.author != 'any') && authors[book.author].toLowerCase().includes(filters.author.toLowerCase())        
        
        let genreMatch = false 

        for (const genre of book.genres){               
            if (genres[genre] == filters.genre && (filters.genre != 'All Genres' || filters.genre != 'any')) {
                genreMatch = true
            }
        }
    
        if (titleMatch || authorMatch || genreMatch){
            searchResults.push(book)
        };
        
        if (searchResults.length < 1 ){
            html.list.message.classList.add('list__message_show')
        } else {
            html.list.message.classList.remove('list__message_show')
        }
    } 
    
    html.list.items.innerHTML = ''
    
    const searchFragment = document.createDocumentFragment()
    const extractedResults = searchResults.slice(0, searchResults.length)
    
    for (const result of extractedResults) {
            const preview = createBookPreview(result)
            searchFragment.appendChild(preview)
    }

    html.list.items.appendChild(searchFragment)

    const initial = searchResults.length - [page * BOOKS_PER_PAGE]
    const remaining = initial > BOOKS_PER_PAGE ? initial : 0
    html.list.button.disabled = initial < BOOKS_PER_PAGE

    html.list.button.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `
    window.scrollTo({ top: 0, behavior: 'smooth' });
    html.search.overlay.removeAttribute('open');
}
    
const handleSearchCancel = (event) => {
    event.preventDefault();
    html.search.overlay.removeAttribute('open');

}

const handleSettingsToggle = (event) => {
    event.preventDefault();
    html.settings.overlay.setAttribute('open', 'open');
    html.settings.theme.focus();
}
    
const handleSettingsSubmit = (event) => {
    event.preventDefault();
    const selectedTheme = new FormData(event.target)
    const result = Object.fromEntries(selectedTheme)
   
    if(result.theme == 'night'){
        document.documentElement.style.setProperty('--color-dark', night.dark);
        document.documentElement.style.setProperty('--color-light', night.light);  
        localStorage.setItem('theme', 'night');
    } else {
        document.documentElement.style.setProperty('--color-dark', day.dark);
        document.documentElement.style.setProperty('--color-light', day.light);
        localStorage.setItem('theme', 'day');
    }

    html.settings.overlay.removeAttribute('open');
}

const handleSettingsCancel = (event) => {
    event.preventDefault();
    html.settings.overlay.removeAttribute('open');    
}
    
const handleViewBookDetailsToggle = (event) => {
    event.preventDefault();
    html.bookDetails.overlay.setAttribute('open', 'open');
    const active = event.target;
    const previewBook = books.filter(book => book.id === active.getAttribute('data-preview'))[0];

    html.bookDetails.blur.setAttribute('src', previewBook.image);
    html.bookDetails.image.setAttribute('src', previewBook.image);
    html.bookDetails.title.innerText = previewBook.title;
    html.bookDetails.subtitle.innerText = `${authors[previewBook.author]} (${new Date(previewBook.published).getFullYear()})`;
    html.bookDetails.description.innerText = previewBook.description;
}

const handleViewBookDetailsClose = (event) => {
    event.preventDefault();
    html.bookDetails.overlay.removeAttribute('open');
}

const handleShowMoreButton = (event) => {
    event.preventDefault();
    if( matches.length != 0) {
        for ( const match of matches){
            const { author, id, image, title } = match
            const preview = createBookPreview({
                author,
                id,
                image,
                title,
            })
        
            html.list.items.appendChild(preview)
        }
    } 

    for ( const book of books){
        const { author, id, image, title } = book
        const preview = createBookPreview({
            author,
            id,
            image,
            title,
        })

        html.list.items.appendChild(preview)
}
}

html.searchBtn.addEventListener('click', handleSearchToggle)
html.search.cancel.addEventListener('click', handleSearchCancel)
html.search.form.addEventListener('submit', handleSearchSubmit)

html.settingsBtn.addEventListener('click', handleSettingsToggle)
html.settings.cancel.addEventListener('click', handleSettingsCancel)
html.settings.form.addEventListener('submit', handleSettingsSubmit)

html.list.items.addEventListener('click', handleViewBookDetailsToggle)
html.bookDetails.close.addEventListener('click', handleViewBookDetailsClose)

html.list.button.addEventListener('click', handleShowMoreButton)