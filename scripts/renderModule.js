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
    let sectionRef = document.querySelector(`.${container}-section`);
    array.forEach(movie => {

        let figureRef = document.createElement(`figure`);
        figureRef.addEventListener(`click`, script.moreInfo);
        figureRef.classList.add(`${container}-section__movie-container`);
        figureRef.dataset.imdbid = movie.imdbid;
        let imgRef = document.createElement(`img`);
        imgRef.classList.add(`${container}-section__image`)
        imgRef.src = `${movie.poster}`;
        imgRef.alt= `Cover of the movie ${movie.title}`;
        let captionRef = document.createElement(`figcaption`);
        captionRef.classList.add(`${container}-section__movie-title`);
        captionRef.textContent = movie.title;
        figureRef.appendChild(imgRef);
        figureRef.appendChild(captionRef);
        sectionRef.appendChild(figureRef);


    });
}

function renderMoreInfo (result) {
    console.log(result);
}



export default {playerSetup, renderMovie, renderMoreInfo}