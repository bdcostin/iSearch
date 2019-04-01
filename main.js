`use strict`

function query(selector) {
    return document.querySelector(selector);
}

// function getSearch(input) {
//     encodeURIComponent(input);
//     let promise = fetch(
//         `https://itunes-api-proxy.glitch.me/search?term=${input}`
//     ).then(function (response) {
//         if (!response.ok) {
//             throw Error(response.statusText);
//         }
//         return response.json();
//     })
//     return promise;
// }

// async: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function This wraps the response in a promise.

async function getSearch(input) {
    encodeURIComponent(input);
    const response = await fetch(
        `https://itunes-api-proxy.glitch.me/search?term=${input}`);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
}

function updateSearch (artist) {
    getSearch(artist)
    .then(function (searchData) {
        console.log(searchData);
        const searchedArtistDiv = artist;
        searchedArtistDiv.innerText = ``;
        const trackListDiv = query(`.track_list`);
        trackListDiv.innerText = ``;
        for (let track of searchData.results) {
            const artistDiv = document.createElement(`div`);
            const albumDiv = document.createElement(`div`);
            const artworkDiv = document.createElement(`div`);
            const trackInfoDiv = document.createElement('div');
            const audio = document.createElement(`audio`);
            const trackDiv = document.createElement(`div`);

            artistDiv.classList.add(`track`);
            artistDiv.innerHTML = `<span class=display">${track.artistName}</span>`; trackInfoDiv.classList.add("display");
            artworkDiv.innerHTML = `<img data-audio-id="audio-id${searchData.results.indexOf(track)}" class="br-100 h4 w4 dib mb2" src="${track.artworkUrl100}" alt="${track.collectionName}">`;
            audio.id = `audio-id${searchData.results.indexOf(track)}`; audio.classList.add("track_audio");
            audio.innerHTML = `<source src="${track.previewUrl}">`; trackDiv.classList.add("track");
            trackDiv.innerHTML = `<span class="display">${track.trackName}</span>`; albumDiv.classList.add("track");
            albumDiv.innerHTML = `<span class="display">${track.collectionName}</span>`;

            artworkDiv.append(audio);
            trackInfoDiv.appendChild(artworkDiv);
            trackInfoDiv.appendChild(trackDiv);
            trackInfoDiv.appendChild(albumDiv);
            trackInfoDiv.appendChild(artistDiv);
            trackListDiv.appendChild(trackInfoDiv);
        }       
    })
}

function playSong() {
    query(`#track`).addEventListener(`click`, function(event) {
        if (event.target && event.target.nodeName === `IMG`) {    
            console.log('image item clicked');
            const img = event.target
            console.log(img.dataset[`audioId`])
            let song = query(`#${img.dataset[`audioId`]}`)
            if (!song.paused) {
                song.pause();
            } else {
                song.play();
            }
            
        }
    })
}

function main() {
    query(`#search`).addEventListener(`change`, function(event) {
        updateSearch(event.target.value);
        
    });
    playSong();
}

document.addEventListener(`DOMContentLoaded`, main);
