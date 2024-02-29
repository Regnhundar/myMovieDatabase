import renderModule from "./renderModule.js";

let currentPage = 1;

let pages = [];

function splitArrayIntoPages(array, container) {
    // pages = []
    const itemsPerPage = 8;
    for (let i = 0; i < array.length; i += itemsPerPage) {
        pages.push(array.slice(i, i + itemsPerPage));
    }
    renderModule.renderMovie(pages[currentPage - 1], container);
}

function numberOfPages () {
    return pages.length;
}

function resetPages () {
    pages = [];
}

function previousPage(container) {

    if(currentPage > 1) {
        currentPage--;
        renderModule.renderMovie(pages[currentPage - 1], container)
    }
}

function nextPage(container) {

    if(currentPage < pages.length) {
        currentPage++;
        renderModule.renderMovie(pages[currentPage - 1], container)
    }
}

function updatePaginationDisplay() {
    const pageIndicatorRef = document.querySelector('#pageIndicator');
    pageIndicatorRef.textContent = `Page ${ currentPage }`;
}
 
export default { numberOfPages,resetPages,previousPage, nextPage, updatePaginationDisplay, splitArrayIntoPages };