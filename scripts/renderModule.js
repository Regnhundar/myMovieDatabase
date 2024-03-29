import localStorageModule from "./localStorageModule.js";
import script from "./app.js";
import pagination from './paginationModule.js';
import paginationModule from "./paginationModule.js";


function renderNotification(message, time) {
    let utilitybarRef = document.querySelector(`#utilityBar`);
    let messageRef = document.createElement(`h3`);
    messageRef.classList.add(`utility-bar__notification`);
    messageRef.textContent = message;
    utilitybarRef.appendChild(messageRef);

    setTimeout(() => {
        messageRef.classList.add('show');
    }, 100);

    setTimeout(() => {
        messageRef.classList.remove('show');
        messageRef.addEventListener('transitionend', () => {
            messageRef.remove();
        });
    }, time);
}

// array = array av filmer. Sökresultat, favoriter och topplistan.
// container = en sträng. `toplist`, `search` eller `favorite`. Bestämmer vart allt ska hamna och heta. 
function renderMovies(array, container) {
    
    const mainRef = document.querySelector(`#main`);
    let sectionRef = document.querySelector(`.${container}-section`);

    // Jag vill att favorite-sectionen ska uppdatera sitt innehåll direkt om man togglar ikonen. Det görs via att den här funktionen körs igen. 
    // Så för att undvika att sektionen växer behövs en kontroll.
    if (!sectionRef) {
        sectionRef = document.createElement(`section`);
        sectionRef.classList.add(`${container}-section`);
        sectionRef.id = `${container}Section`;
    } else {
        sectionRef.innerHTML = ``;
    }

    const sectionHeadlineRef = createSectionTitle(container);
    sectionRef.appendChild(sectionHeadlineRef);

    // Loopar igenom arrayen och anropar createMovieCard som skapar korten och returnerar dem i en figure.
    array.forEach(movie => {
        const figureRef = createMovieCard(movie, container);
        sectionRef.appendChild(figureRef);
    });

    // Kollar om det finns fler än 1 sida. Finns fler än 1 sida skapas navigation och returneras i en wrapper.
    if (paginationModule.numberOfPages() > 1) {
        const pagination = setUpPageNavigation(container);
        sectionRef.appendChild(pagination);
    }

    mainRef.appendChild(sectionRef);

}

function createSectionTitle(container) {

    let sectionHeaderRef = document.createElement(`h2`);
    sectionHeaderRef.classList.add(`${container}-section__title`);
    sectionHeaderRef.id = `${container}Title`;

    if (container === `toplist`) {
        sectionHeaderRef.innerHTML = `<span class="${container}-section__title-background ${container}-section__title-background--top">TOP</span>
                                      <span class="${container}-section__title-background ${container}-section__title-background--bottom">TWENTY</span>`;
    }
    else if (container === `favorite`) {
        sectionHeaderRef.innerHTML = `<span class="${container}-section__title-background ${container}-section__title-background--top">MY</span> 
                                      <span class="${container}-section__title-background ${container}-section__title-background--bottom">FAVORITES</span>`;
    }
    else if (container === `search`) {
        sectionHeaderRef.innerHTML = `<span class="${container}-section__title-background ${container}-section__title-background--top">SEARCH</span> 
                                      <span class="${container}-section__title-background ${container}-section__title-background--bottom">RESULTS:</span>`;
    }
    return sectionHeaderRef;
}


function createMovieCard(movie, container) {

    let figureRef = document.createElement(`figure`);
    figureRef.addEventListener(`click`, script.getMoreInfo);
    figureRef.classList.add(`${container}-section__movie-container`);
    figureRef.dataset.imdbid = movie.imdbid;
    figureRef.title = `Click for more info!`

    let posterRef = document.createElement(`img`);
    posterRef.classList.add(`${container}-section__image`)
    posterRef.src = `${movie.poster}`;
    posterRef.alt = `Cover of the movie ${movie.title}`;

    let favoriteRef = document.createElement(`img`);
    favoriteRef.classList.add(`${container}-section__favorite-icon`, `d-none`);
    figureRef.addEventListener(`mouseenter`, () => {
        favoriteRef.classList.remove(`d-none`);
    });
    figureRef.addEventListener(`mouseleave`, () => {
        favoriteRef.classList.add(`d-none`);
    });
    favoriteRef.dataset.imdbid = movie.imdbid;
    if (localStorageModule.getFavorites().some(favorite => favorite.imdbid === movie.imdbid)) {
        favoriteRef.src = `./assets/favorite.svg`;
        favoriteRef.alt = `Remove from favorites!`
        favoriteRef.title = `Remove from favorites`
    } else {
        favoriteRef.src = `./assets/notFavorite.svg`;
        favoriteRef.alt = `Add to favorites!`
        favoriteRef.title = `Add to favorites`
    }
    favoriteRef.addEventListener(`click`, script.sendToStorage);

    let captionRef = document.createElement(`figcaption`);
    captionRef.classList.add(`${container}-section__movie-title`);
    captionRef.textContent = movie.title;

    figureRef.appendChild(posterRef);
    figureRef.appendChild(favoriteRef);
    figureRef.appendChild(captionRef);

    return figureRef;
}


function setUpPageNavigation(container) {

    const buttonWrapperRef = document.createElement(`nav`);
    buttonWrapperRef.classList.add(`${container}-section__navigation-wrapper`);

    const backButtonRef = document.createElement(`a`);
    backButtonRef.href = `#${container}Title`
    backButtonRef.id = `${container}BackButton`
    backButtonRef.classList.add(`${container}-section__navigation-button`, `${container}-section__navigation-button--left`);
    backButtonRef.textContent = `\u25C0 BACK`;
    backButtonRef.addEventListener(`click`, () => {
        pagination.previousPage(`${container}`)
    });

    const pageCounterRef = document.createElement(`p`);
    pageCounterRef.classList.add(`${container}-section__page-counter`);
    pageCounterRef.id = `${container}Counter`
    if (container === `toplist`) {
        pageCounterRef.textContent = `1 / ${paginationModule.numberOfPages()}`;
    } else {
        pageCounterRef.textContent = `${paginationModule.getCurrentPage()} / ${paginationModule.numberOfPages()}`;
    }

    const nextButtonRef = document.createElement(`a`);
    nextButtonRef.href = `#${container}Title`
    nextButtonRef.classList.add(`${container}-section__navigation-button`, `${container}-section__navigation-button--right`);
    nextButtonRef.id = `${container}NextButton`
    nextButtonRef.textContent = `NEXT \u25B6`;
    nextButtonRef.addEventListener(`click`, () => {
        pagination.nextPage(`${container}`)
    });

    buttonWrapperRef.appendChild(backButtonRef);
    buttonWrapperRef.appendChild(pageCounterRef);
    buttonWrapperRef.appendChild(nextButtonRef);

    return buttonWrapperRef;
}


function renderMoreInfo(event, result) {

    event.preventDefault();

    const infoContainer = document.querySelector(`.more-info-container`);

    if (infoContainer) {
        infoContainer.remove();
    }

    else {
        const moreInfoContainerRef = document.createElement(`article`);
        let parentContainerRef = document.querySelector(`#toplistSection`);
        const searchResultContainer = event.target.closest('.search-section');
        const favoriteContainer = event.target.closest('.favorite-section');

        if (searchResultContainer) {
            parentContainerRef = document.querySelector('#searchSection');
        }
        else if (favoriteContainer) {
            parentContainerRef = document.querySelector('#favoriteSection');
        }

        moreInfoContainerRef.classList.add(`more-info-container`);



        const infoWrapperRef = document.createElement(`div`);
        infoWrapperRef.classList.add(`more-info-container__info-wrapper`);

        const titleRef = document.createElement(`h3`);
        titleRef.classList.add(`more-info-container__title`);
        titleRef.textContent = result.title;

        infoWrapperRef.appendChild(titleRef);

        const directorRef = document.createElement(`p`);
        directorRef.classList.add(`more-info-container__director`);
        directorRef.textContent = `Director: ${result.director}`;

        infoWrapperRef.appendChild(directorRef);

        const actorsRef = document.createElement(`p`);
        actorsRef.classList.add(`more-info-container__actor`);
        actorsRef.textContent = `Actors: ${result.actors}`;

        infoWrapperRef.appendChild(actorsRef);

        const runtimeRef = document.createElement(`p`);
        runtimeRef.classList.add(`more-info-container__runtime`);
        runtimeRef.textContent = `Runtime: ${result.runtime}`;

        infoWrapperRef.appendChild(runtimeRef);

        const ratingRef = document.createElement(`p`);
        ratingRef.classList.add(`more-info-container__rating`);
        ratingRef.textContent = `IMDb Rating: ${result.imdbrating}`;

        infoWrapperRef.appendChild(ratingRef);

        moreInfoContainerRef.appendChild(infoWrapperRef);

        const closeButtonRef = document.createElement(`button`);
        closeButtonRef.classList.add(`more-info-container__close-button`);
        closeButtonRef.addEventListener(`click`, () => {
            document.querySelector(`.more-info-container`).remove();
        })
        closeButtonRef.textContent = `CLOSE`
        moreInfoContainerRef.appendChild(closeButtonRef);

        const plotAndPosterContainerRef = document.createElement(`div`);
        plotAndPosterContainerRef.classList.add(`more-info-container__plot-and-poster-wrapper`);

        const posterRef = document.createElement(`img`);
        posterRef.classList.add(`more-info-container__poster`);
        posterRef.src = result.poster;
        posterRef.alt = `Cover of the movie ${result.title}`;

        plotAndPosterContainerRef.appendChild(posterRef);

        const plotRef = document.createElement(`p`);
        plotRef.classList.add(`more-info-container__plot-text`);
        plotRef.textContent = result.plot;

        plotAndPosterContainerRef.appendChild(plotRef);

        moreInfoContainerRef.appendChild(plotAndPosterContainerRef);

        const parentRect = parentContainerRef.getBoundingClientRect();
        const offsetY = event.clientY - parentRect.top;
        
        moreInfoContainerRef.style.top = `${offsetY}px`;
        
        parentContainerRef.appendChild(moreInfoContainerRef);
    }
}


function favoriteIconToggle(event) {

    let favoriteIcon = event.target;

    if (favoriteIcon.src.endsWith(`favorite.svg`)) {

        renderNotification(`Removed from favorites!`, 1300);
        favoriteIcon.src = `./assets/notFavorite.svg`;
        favoriteIcon.title = `Add to favorites`;
        
    }
    else if (favoriteIcon.src.endsWith(`notFavorite.svg`)) {
        renderNotification(`Added to favorites!`, 1300);
        favoriteIcon.src = `./assets/favorite.svg`;
        favoriteIcon.title = `Remove from favorites`;
    }
}


function showContainer(container) {

    const topListContainerRef = document.querySelector(`#toplistSection`);
    const searchResultContainerRef = document.querySelector(`#searchSection`);
    const trailerContainerRef = document.querySelector(`#trailerSection`);
    const favoriteContainerRef = document.querySelector(`#favoriteSection`);

    if (container === `notSearching`) {

        if (trailerContainerRef) {
            topListContainerRef.classList.remove(`d-none`);
            trailerContainerRef.classList.remove(`d-none`);
            searchResultContainerRef.remove();
        }
        else if (favoriteContainerRef) {
            favoriteContainerRef.classList.remove(`d-none`);
            searchResultContainerRef.remove();
        }
    }

    else if (container === `searching`) {

        if (favoriteContainerRef) {
            favoriteContainerRef.classList.add(`d-none`);
        }
        else if (trailerContainerRef) {
            topListContainerRef.classList.add(`d-none`);
            trailerContainerRef.classList.add(`d-none`);
        }
    }
}



export default { renderNotification, renderMovies, renderMoreInfo, favoriteIconToggle, showContainer }