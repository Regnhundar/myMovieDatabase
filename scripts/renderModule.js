import localStorageModule from "./localStorageModule.js";
import script from "./script.js";
import pagination from './paginationModule.js';
import paginationModule from "./paginationModule.js";


function renderMovie (array, container) {

    const mainRef = document.querySelector(`#main`);
    const  sectionContainerRef = document.querySelector(`.${container}-section`);
// Jag vill att favorites-sectionen ska uppdatera sitt innehåll direkt om man togglar ikonen. Det görs via att den här funktionen körs igen. 
// Så för att undvika att fler sektioner skapas tar vi bort den gamla innan den nya skapas.
    if (sectionContainerRef) {
        sectionContainerRef.remove(); 
    }
    
    let sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`${container}-section`);
    sectionRef.id = `${container}Section`;
    sectionRef.innerHTML = ``;
    
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
        sectionHeaderRef.innerHTML = `<span class="${container}-section__title-background ${container}-section__title-background--top">YOUR</span> 
                                      <span class="${container}-section__title-background ${container}-section__title-background--bottom">RESULTS:</span>`;
    }
    sectionRef.appendChild(sectionHeaderRef);

    array.forEach(movie => {

        let figureRef = document.createElement(`figure`);
        figureRef.addEventListener(`click`, script.getMoreInfo);

        figureRef.classList.add(`${container}-section__movie-container`);
        figureRef.dataset.imdbid = movie.imdbid;
        let posterRef = document.createElement(`img`);
        posterRef.classList.add(`${container}-section__image`)
        posterRef.src = `${movie.poster}`;
        posterRef.alt= `Cover of the movie ${movie.title}`;
        let favoriteRef = document.createElement(`img`);
        favoriteRef.classList.add(`${container}-section__favorite-icon`, `d-none`);
        figureRef.addEventListener(`mouseenter`, () => {
            favoriteRef.classList.remove(`d-none`);
        });
        figureRef.addEventListener(`mouseleave`, () => {
            favoriteRef.classList.add(`d-none`);
        });
        favoriteRef.dataset.imdbid = movie.imdbid;
        if (localStorageModule.getFavorites().some(favorite => favorite.imdbid === movie.imdbid)){
            favoriteRef.src = `./assets/favorite.svg`;
            favoriteRef.alt = `Remove from favorites!`
        } else {
            favoriteRef.src = `./assets/notFavorite.svg`;
            favoriteRef.alt = `Add to favorites!`
        }
        favoriteRef.addEventListener(`click`, script.sendToStorage);
        let captionRef = document.createElement(`figcaption`);
        captionRef.classList.add(`${container}-section__movie-title`);
        captionRef.textContent = movie.title;

        figureRef.appendChild(posterRef);
        figureRef.appendChild(favoriteRef);
        figureRef.appendChild(captionRef);
        
        sectionRef.appendChild(figureRef);
    });

    if (paginationModule.numberOfPages() > 1) {
    const buttonWrapperRef = document.createElement(`div`);
    buttonWrapperRef.classList.add(`${container}-section__button-wrapper`);

    const backButtonRef = document.createElement(`a`);
    backButtonRef.href = `#${container}Title`
    backButtonRef.classList.add(`${container}-section__navigation-button`);
    backButtonRef.textContent = `\u25C0 BACK`;
    backButtonRef.addEventListener(`click`, () => {
        pagination.previousPage(`${container}`)});
    const nextButtonRef = document.createElement(`a`);
    nextButtonRef.href = `#${container}Title`
    nextButtonRef.classList.add(`${container}-section__navigation-button`);
    nextButtonRef.textContent= `NEXT \u25B6`;
    nextButtonRef.addEventListener(`click`, () => {
        pagination.nextPage(`${container}`)});

    buttonWrapperRef.appendChild(backButtonRef);
    buttonWrapperRef.appendChild(nextButtonRef);
    sectionRef.appendChild(buttonWrapperRef);
    }
    mainRef.appendChild(sectionRef);
}

function renderMoreInfo (event, result) {

    event.preventDefault();

    const  infoContainer = document.querySelector(`.more-info-container`);

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

        const containerRect = parentContainerRef.getBoundingClientRect();
        const offsetX = containerRect.width / 2; 
        const offsetY = event.clientY - containerRect.top;


        moreInfoContainerRef.style.left = `calc(50% - ${offsetX}px)`;
        moreInfoContainerRef.style.top = `${offsetY}px`;

        parentContainerRef.appendChild(moreInfoContainerRef);
    }
}

function favoriteIconToggle (event) {
    let favoriteIcon = event.target;
    if (favoriteIcon.src.endsWith(`favorite.svg`)) {
        favoriteIcon.src = `./assets/notFavorite.svg`
    }
    else if (favoriteIcon.src.endsWith(`notFavorite.svg`)) {
        favoriteIcon.src = `./assets/favorite.svg`
    }
}

function showContainer (container) {

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



export default {renderMovie, renderMoreInfo, favoriteIconToggle, showContainer}