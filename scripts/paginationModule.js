import renderModule from "./renderModule.js";

let currentPage = 1;

let pages = [];

// Tar emot en array innan den renderas ut på sidan. Gör en array med arrayer som har högst 8 objekt per array.

function splitArrayIntoPages(array, container) {
    const itemsPerPage = 8;
    for (let i = 0; i < array.length; i += itemsPerPage) {
        pages.push(array.slice(i, i + itemsPerPage));
    }

    if (pages[currentPage - 1] === undefined) {
        currentPage--;
        if (currentPage === 0) {
            currentPage = 1;
        }
    }
    renderModule.renderMovie(pages[currentPage - 1], container);
}

function numberOfPages() {
    return pages.length;
}

function getCurrentPage() {
    return currentPage;
}

function resetPages() {
    pages = [];
}

function previousPage(container) {

    if (currentPage > 1) {
        currentPage--;
        renderModule.renderMovie(pages[currentPage - 1], container)
        updatePageNumber(container)
    }
}

function nextPage(container) {

    if (currentPage < pages.length) {
        currentPage++;
        renderModule.renderMovie(pages[currentPage - 1], container);
        console.log(container);
        updatePageNumber(container);
    }
}



function updatePageNumber(container) {
    const pageCounterRef = document.querySelector(`#${container}Counter`);
    pageCounterRef.textContent = `${currentPage} / ${pages.length}`;
    const nextButtonRef = document.querySelector(`#${container}NextButton`);
    const backButtonRef = document.querySelector(`#${container}BackButton`);
    if (currentPage > pages.length) {
        currentPage = pages.length;
    }
    if (currentPage === pages.length) {
        nextButtonRef.classList.add(`d-none`);
    }
    else if (currentPage === 1) {
        backButtonRef.classList.add(`d-none`);
    }
}

export default { updatePageNumber, getCurrentPage,numberOfPages, resetPages, previousPage, nextPage, splitArrayIntoPages };