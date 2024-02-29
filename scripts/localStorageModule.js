import paginationModule from "./paginationModule.js"

function getFavorites() {

    try {
        const favoritesString = localStorage.getItem(`favorites`) || JSON.stringify([]);
        let favorites = JSON.parse(favoritesString);
        return favorites;
        
    } catch (error) {
        console.log(`Something went wrong at getFavorites: ${error}`);
        return [];
    }

}

function handleStorage (objectToCheck) {

    try {
        let favorites = getFavorites();
        let checkForDuplicate = favorites.some(favorite => favorite.imdbid === objectToCheck.imdbid);
        if (!checkForDuplicate) {
            favorites.unshift(objectToCheck);
        } else {
            favorites = favorites.filter(favorite =>  favorite.imdbid !== objectToCheck.imdbid);
            }
        
        localStorage.setItem(`favorites`, JSON.stringify(favorites));
        // OM man står i favorites och man togglar en favorit-ikon så renderas favorites-section om.
        if (document.location.pathname.endsWith("favorites.html")) {
            paginationModule.resetPages();
            paginationModule.splitArrayIntoPages(favorites, `favorite`);
        }

    } catch (error) {
        console.log(`Something went wrong at handleStorage: ${error}`);

    }
}

export default {getFavorites, handleStorage}