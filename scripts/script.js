import apiModule from "./apiModule.js";
import renderModule from "./renderModule.js";
import localStorageModule from "./localStorageModule.js";


window.addEventListener(`DOMContentLoaded`, () => {
    document.querySelector(`#searchbar`).addEventListener(`input`, searchForMovie);
    document.querySelector(`#favoritesButton`).addEventListener(`click`, myFavoriteFunction);
    populateTrailers();
    populateTopTwenty();
    localStorageModule.getFavorites();
    console.log(`DOMContentLoaded`); 
});


async function populateTrailers () {
    try {
        const trailers = [];
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/movies.json`);
        await data.forEach(movie => { 
            trailers.push(movie.trailer_link)
        });

        const fiveTrailers = [];

        for (let i = 0; i<5; i++) {
            const random = Math.floor(Math.random() * trailers.length);
            fiveTrailers.push(trailers[random])
            trailers.splice(random, 1);
        }
        document.querySelector(`#videoPlayer`).src = fiveTrailers[0];
        renderModule.playerSetup(fiveTrailers);
    } catch (error) {
        console.log(`Something went wrong at populateTrailers: ${error}`);
    }
}


async function populateTopTwenty () {
    try {
        const topTwenty = [];
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/movies.json`);
        data.forEach(movie => { 
            topTwenty.push(movie)
        });

        renderModule.renderMovie(topTwenty, `top-twenty`);
    } catch (error) {
        console.log(`Something went wrong at populateTopTwenty: ${error}`);
    }

}

async function searchForMovie (event) {

    try {

        let searchWord = event.target.value.toLowerCase();
        const searchResults = [];
        const searchBarRef = document.querySelector(`#searchbar`);
        const searchResultContainerRef = document.querySelector(`#searchResultSection`);
        const data = await apiModule.getData(`http://www.omdbapi.com/?apikey=ea3e4608&s=${searchWord}`);


        if (searchBarRef.value.length > 0) {
            // Nycklarna i omdbapi är inte i gemener vilket movies.json är. För att kunna rendera med samma funktion gör jag om nycklarna till gemener.
            data.Search.forEach(movie => {
                const standardizedMovie = {};
                Object.keys(movie).forEach(key => {
                    standardizedMovie[key.toLowerCase()] = movie[key]
                })
                searchResults.push(standardizedMovie);
            })

            searchResultContainerRef.innerHTML = ``;
            document.querySelector(`#topTwentySection`).classList.add(`d-none`);
            document.querySelector(`#trailerSection`).classList.add(`d-none`);
            searchResultContainerRef.classList.remove(`d-none`);

            renderModule.renderMovie(searchResults, `search-result`);
        }
        else {
            document.querySelector(`#topTwentySection`).classList.remove(`d-none`);
            document.querySelector(`#trailerSection`).classList.remove(`d-none`);
            searchResultContainerRef.classList.add(`d-none`);
        }
    } catch (error) {
        console.log(`Something went wrong at searchForMovie: ${error}`);
    }
}

function myFavoriteFunction() {
    const buttonRef = document.querySelector(`#favoritesButton`);

    if (buttonRef.textContent === `Favorites`) {
        console.log(`Bajs`);
    }
}

async function getMoreInfo (event) {
    console.log(`getMoreInfo: ${event.target}`);
    try {
        const moreInfo = await apiModule.getData(`http://www.omdbapi.com/?apikey=ea3e4608&plot=full&i=${event.currentTarget.dataset.imdbid}`);
        
        renderModule.renderMoreInfo(event, moreInfo)
    } catch (error) {
        console.log(`Something went wrong at moreInfo: ${error}`);
    }
}

async function sendToStorage (event) {
    console.log(`sendToStorage: ${event.target}`);
    event.stopPropagation(); // För att förhindra att eventlystnaren på containern också triggas 
    try {

        localStorageModule.handleStorage(event.currentTarget.dataset.imdbid);
         
    } catch (error) {
        console.log(`Something went wrong at sendToStorage: ${error}`);
    }

    }



export default {getMoreInfo, sendToStorage}