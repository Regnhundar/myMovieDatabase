import localStorageModule from "./localStorageModule.js";
import script from "./script.js";
let trailerToView = 0;
let playlist = [];

function playerSetup (trailers) {
     trailers.forEach(trailer => { playlist.push(trailer) 
    });
    document.querySelector(`#leftArrow`).addEventListener(`click`, previousTrailer);
    document.querySelector(`#rigthArrow`).addEventListener(`click`, nextTrailer);
}

function renderTrailer () {
    const videoPlayer = document.querySelector(`#videoPlayer`);
    videoPlayer.src = playlist[trailerToView];
}

function previousTrailer () {
    if (trailerToView === 0) {
        trailerToView = 4;
    }
    else {
        trailerToView--;
    }
    renderTrailer();
}

function nextTrailer () {
    if (trailerToView === 4) {
        trailerToView = 0;
    }
    else {
        trailerToView++;
    }
    renderTrailer();
}

function renderMovie (array, container) {
    console.log(array);

    const mainRef = document.querySelector(`#main`);

    const  sectionContainerRef = document.querySelector(`.${container}-section`);

    if (sectionContainerRef) {
        sectionContainerRef.remove();
    }
    
    let sectionRef = document.createElement(`section`);
    sectionRef.classList.add(`${container}-section`);
    sectionRef.id = `${container}Section`;
    sectionRef.innerHTML = ``;
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
        if (localStorageModule.getFavorites().some(favorite => favorite.id === movie.imdbid)){
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
        mainRef.appendChild(sectionRef);

    });
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

        const searchResultContainer = event.target.closest('.search-section__movie-container');
        const favoriteContainer = event.target.closest('.favorite-section__movie-container');
        if (searchResultContainer) {
            parentContainerRef = document.querySelector('#searchSection');
        }
        else if (favoriteContainer) {
            parentContainerRef = document.querySelector('#favoriteSection');
        }


        moreInfoContainerRef.classList.add(`more-info-container`);
        const titleRef = document.createElement(`h2`);
        titleRef.classList.add(`more-info-container__title`)
        titleRef.textContent = result.Title
        moreInfoContainerRef.appendChild(titleRef);
        const plotRef = document.createElement(`p`);
        plotRef.classList.add(`more-info-container__plot-text`);
        plotRef.textContent = result.Plot;
        moreInfoContainerRef.appendChild(plotRef);
        console.log(result);
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



export default {playerSetup, renderMovie, renderMoreInfo, favoriteIconToggle}