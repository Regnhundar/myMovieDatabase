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
            let newFavorite = objectToCheck;
            favorites.push(newFavorite);
        } else {
            favorites = favorites.filter(favorite =>  favorite.imdbid !== objectToCheck.imdbid);
            }
        
    localStorage.setItem(`favorites`, JSON.stringify(favorites));
    console.log(`Current favorites:`, favorites);

    } catch (error) {
        console.log(`Something went wrong at handleStorage: ${error}`);

    }
}

export default {getFavorites, handleStorage}