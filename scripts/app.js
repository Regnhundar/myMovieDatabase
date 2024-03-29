import apiModule from "./apiModule.js";
import renderModule from "./renderModule.js";
import localStorageModule from "./localStorageModule.js";
import trailerModule from "./trailerModule.js";
import paginationModule from './paginationModule.js';


window.addEventListener(`DOMContentLoaded`, () => {
    document.querySelector(`#searchbar`).addEventListener(`input`, searchForMovie);

    localStorageModule.getFavorites();
    if (document.querySelector(`#trailerSection`)) {
        document.querySelector(`#favoritesButton`).addEventListener(`click`, checkoutFavorites);
        populateTrailers();
        populateTopTwenty();
    }
    else if (document.location.pathname.endsWith("favorites.html")) {
        populateFavorites();
    }
});

// Kollar ifall du har lagt till någon favorit. Knappen borde kanske ha annan styling när den är tom också.
function checkoutFavorites(event) {
    event.preventDefault();
    let favorites = localStorageModule.getFavorites();
    if (favorites.length === 0) {
        renderModule.renderNotification(`Empty. Add something.`, 3000);
    } else {
        window.location.href = "favorites.html"
    }
}

async function populateTrailers() {

    try {
        const trailers = [];
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/movies.json`);
        await data.forEach(movie => {
            trailers.push(movie.trailer_link)
        });

        const fiveTrailers = [];
        //  för att inte få dublett så loopar vi igenom och tar bort den vi lägger till i fiveTrailers från ursprungliga arrayen.
        for (let i = 0; i < 5; i++) {
            const random = Math.floor(Math.random() * trailers.length);
            fiveTrailers.push(trailers[random])
            trailers.splice(random, 1);
        }
        document.querySelector(`#videoPlayer`).src = fiveTrailers[0];
        trailerModule.playerSetup(fiveTrailers);
    } catch (error) {
        console.log(`Something went wrong at populateTrailers: ${error}`);
    }
}


async function populateTopTwenty() {

    try {
        const topTwenty = [];
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/movies.json`);
        data.forEach(movie => {
            topTwenty.push(movie)
        });
        paginationModule.splitArrayIntoPages(topTwenty, `toplist`);

    } catch (error) {
        console.log(`Something went wrong at populateTopTwenty: ${error}`);
    }

}

// Nycklarna i omdbapi är inte i gemener vilket movies.json är. För att kunna rendera med samma funktion gör jag om nycklarna till gemener.
function standardizeApiKeys(input) {
    // Kollar först om anropet skickar med en array. Som från ex sökresultat.
    if (Array.isArray(input)) {
        let result = [];
        input.forEach(item => {
            const standardizedItem = {};
            Object.keys(item).forEach(key => {
                standardizedItem[key.toLowerCase()] = item[key];
            });
            result.push(standardizedItem);
        });
        return result;
        // När man lägger till en favorit är det ju enbart ett objekt och behöver då hanteras annorlunda.
    } else {
        const standardizedItem = {};
        Object.keys(input).forEach(key => {
            standardizedItem[key.toLowerCase()] = input[key];
        });
        return standardizedItem;
    }
}

async function searchForMovie(event) {

    try {

        let searchWord = event.target.value.toLowerCase();
        const searchBarRef = document.querySelector(`#searchbar`);

        if (searchBarRef.value.length > 0) {
            const data = await apiModule.getData(`http://www.omdbapi.com/?apikey=ea3e4608&s=${searchWord}`);
            let standardizedData = standardizeApiKeys(data.Search);
            renderModule.showContainer(`searching`);
            paginationModule.resetCurrentPage();
            paginationModule.resetPages();
            paginationModule.splitArrayIntoPages(standardizedData, `search`);
        } else {
            paginationModule.resetPages();
            paginationModule.resetCurrentPage();
            renderModule.showContainer(`notSearching`);
            if (document.querySelector(`#trailerSection`)) {
                populateTopTwenty();
            }
            else if (document.location.pathname.endsWith("favorites.html")) {
                populateFavorites();
            }
        }
    } catch (error) {
        console.log(`Something went wrong at searchForMovie: ${error}`);
    }
}

function populateFavorites() {
    const favorites = localStorageModule.getFavorites();
    paginationModule.splitArrayIntoPages(favorites, `favorite`);

}

async function getMoreInfo(event) {

    try {
        let moreInfo = await apiModule.getData(`http://www.omdbapi.com/?apikey=ea3e4608&plot=full&i=${event.currentTarget.dataset.imdbid}`);
        moreInfo = standardizeApiKeys(moreInfo);
        renderModule.renderMoreInfo(event, moreInfo);
    } catch (error) {
        console.log(`Something went wrong at getMoreInfo: ${error}`);
    }
}

async function sendToStorage(event) {

    event.stopPropagation(); // För att förhindra att eventlystnaren på containern också triggas 

    try {
        renderModule.favoriteIconToggle(event);
        let favoriteInfo = await apiModule.getData(`http://www.omdbapi.com/?apikey=ea3e4608&i=${event.currentTarget.dataset.imdbid}`);
        favoriteInfo = standardizeApiKeys(favoriteInfo);
        localStorageModule.handleStorage(favoriteInfo);

    } catch (error) {
        console.log(`Something went wrong at sendToStorage: ${error}`);
    }
}



export default { getMoreInfo, sendToStorage }