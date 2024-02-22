import apiModule from "./apiModule.js";
import renderModule from "./renderModule.js";
import localStorageModule from "./localStorageModule.js";


window.addEventListener(`DOMContentLoaded`, () => {
    document.querySelector(`#searchbar`).addEventListener(`input`, searchForMovie);
    document.querySelector(`#favoritesButton`).addEventListener(`click`, populateFavorites);
    localStorageModule.getFavorites();
    console.log(localStorageModule.getFavorites());
    if (document.querySelector(`#trailerSection`)) {
        populateTrailers();
        populateTopTwenty();
    }
    
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

// Nycklarna i omdbapi är inte i gemener vilket movies.json är. För att kunna rendera med samma funktion gör jag om nycklarna till gemener.
function standardizeApiKeys (array) {
    let result = [];
    array.forEach(movie => {
        const standardizedMovie = {};
        Object.keys(movie).forEach(key => {
            standardizedMovie[key.toLowerCase()] = movie[key]
        })
        result.push(standardizedMovie);
    })
    return result;
}

async function searchForMovie (event) {

    try {

        let searchWord = event.target.value.toLowerCase();
        const searchBarRef = document.querySelector(`#searchbar`);
        const searchResultContainerRef = document.querySelector(`#searchResultSection`);
        const data = await apiModule.getData(`http://www.omdbapi.com/?apikey=ea3e4608&s=${searchWord}`);


        if (searchBarRef.value.length > 0) {
           
     
            const standardizedData = standardizeApiKeys(data.Search);


            searchResultContainerRef.innerHTML = ``;
            document.querySelector(`#topTwentySection`).classList.add(`d-none`);
            document.querySelector(`#trailerSection`).classList.add(`d-none`);
            searchResultContainerRef.classList.remove(`d-none`);

            renderModule.renderMovie(standardizedData, `search-result`);
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

async function populateFavorites() {
// OBS: sätt tillbaka href på <a> så den tar dig till favorites.html
    try {
        const buttonRef = document.querySelector(`#favoritesButton`);
        const favorites = localStorageModule.getFavorites();

        let favoriteArray = [];

        if (buttonRef.textContent === `Favorites`) {
            for(let i = 0; i < favorites.length; i++) {
                let favoriteInfo = await apiModule.getData(`http://www.omdbapi.com/?apikey=ea3e4608&i=${favorites[i].id}`);
                favoriteArray.push(favoriteInfo);
            }

            favoriteArray = standardizeApiKeys(favoriteArray);

            renderModule.renderMovie(favoriteArray, `favorite`);

        }
    } catch (error) {
        console.log(`Something went wrong at populateFavorites: ${error}`);
      } 
}


async function getMoreInfo (event) {
    try {
        const moreInfo = await apiModule.getData(`http://www.omdbapi.com/?apikey=ea3e4608&plot=full&i=${event.currentTarget.dataset.imdbid}`);
        
        renderModule.renderMoreInfo(event, moreInfo)
    } catch (error) {
        console.log(`Something went wrong at getMoreInfo: ${error}`);
    }
}

 function sendToStorage (event) {
    event.stopPropagation(); // För att förhindra att eventlystnaren på containern också triggas 

    try {
        localStorageModule.handleStorage(event.currentTarget.dataset.imdbid);
        renderModule.favoriteIconToggle(event);
         
    } catch (error) {
        console.log(`Something went wrong at sendToStorage: ${error}`);
    }
}



export default {getMoreInfo, sendToStorage}