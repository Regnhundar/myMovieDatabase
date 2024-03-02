let trailerToView = 0;
let playlist = [];

function playerSetup(trailers) {
    trailers.forEach(trailer => {
        playlist.push(trailer)
    });
    document.querySelector(`#previousTrailer`).addEventListener(`click`, previousTrailer);
    document.querySelector(`#nextTrailer`).addEventListener(`click`, nextTrailer);
    
}

function renderTrailer() {
    const videoPlayer = document.querySelector(`#videoPlayer`);
    videoPlayer.src = playlist[trailerToView];
}

function previousTrailer() {
    if (trailerToView === 0) {
        trailerToView = 4;
    }
    else {
        trailerToView--;
    }
    document.querySelector(`#trailerCounter`).textContent = `${trailerToView + 1} / 5`
    renderTrailer();
}

function nextTrailer() {
    if (trailerToView === 4) {
        trailerToView = 0;
    }
    else {
        trailerToView++;
    }
    document.querySelector(`#trailerCounter`).textContent = `${trailerToView + 1} / 5`
    renderTrailer();
}

export default { playerSetup }