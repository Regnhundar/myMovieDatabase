import renderModule from "./renderModule.js";

let currentPage = 1;

let pages = [];


// Tar emot en array innan den renderas ut på sidan. Gör en array med arrayer som har högst 8 objekt per array.
function splitArrayIntoPages(array, container) {

    const itemsPerPage = 8;
    for (let i = 0; i < array.length; i += itemsPerPage) {
        pages.push(array.slice(i, i + itemsPerPage));
    }
    // Failsafe ifall du står i favorites och tar bort favoriter och på så vis tömmer sidor.
    if (pages[currentPage - 1] === undefined) {
        currentPage--;
        if (currentPage === 0) {
            currentPage = 1;
        }
    }

    renderModule.renderMovies(pages[currentPage - 1], container);
}


function numberOfPages() {

    return pages.length;
}


function getCurrentPage() {

    return currentPage;
}

function resetCurrentPage() {
    currentPage = 1;
}

function resetPages() {
    pages = [];
}


function previousPage(container) {

    if (currentPage > 1) {
        currentPage--;
    }
    else {
        currentPage = pages.length;
    }
    renderModule.renderMovies(pages[currentPage - 1], container);
    updatePageNumber(container);
}


function nextPage(container) {

    if (currentPage < pages.length) {
        currentPage++;
    }
    else {
        currentPage = 1;
    }
    renderModule.renderMovies(pages[currentPage - 1], container);
    updatePageNumber(container);
}


function updatePageNumber(container) {

    const pageCounterRef = document.querySelector(`#${container}Counter`);
    pageCounterRef.textContent = `${currentPage} / ${pages.length}`;

    if (currentPage > pages.length) {
        currentPage = pages.length;
    }
}

export default { resetCurrentPage, updatePageNumber, getCurrentPage, numberOfPages, resetPages, previousPage, nextPage, splitArrayIntoPages };