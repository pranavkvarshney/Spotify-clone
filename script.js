console.log("JS")
let currsong = new Audio();
let songs
let currfolder
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder) {

    let a = await fetch(`/${folder}/`)
    currfolder = folder
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML += `<li> 
        <img src="music.svg" alt="" class="invert">
                            <div class="info">
                                <div>${decodeURIComponent(song)} </div>
                                <div>Unknown</div>
                            </div>
                            <img src="play.svg" alt="" class="invert">
        
        
        
        
        </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    return songs
}
const playmusic = (track) => {
    currsong.src = `${currfolder}/` + track
    currsong.play()
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
    play.src = "pause.svg"

}
async function displayalbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let CardContainer = document.querySelector(".CardContainer")
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[1]
            //get metadata
            let b = await fetch(`songs/${folder}/info.json`)
            let response = await b.json();
            CardContainer.innerHTML += `
        <div data-folder="${folder}" class="card ">
        <div class="play">
        <img src="greenplay.svg" alt="">
        
        </div>
        <img src=" songs\\${folder}\\coverimage.jpeg" alt="">
        <h2>${response.title}</h2>
        <p>${response.description}</p>
        </div>`
        }
    }
    //load the library when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            console.log(songs)
            playmusic(songs[0])
        })
    })
}



async function main() {

    await getsongs("songs/")
    //display all the albums
    displayalbums()


    play.addEventListener("click", () => {
        if (currsong.paused) {
            currsong.play()
            play.src = "pause.svg"
        }
        else {
            currsong.pause()
            play.src = "play.svg"
        }
    })
    currsong.addEventListener(("timeupdate"), () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currsong.currentTime)}/${secondsToMinutesSeconds(currsong.duration)}`
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%"
    })
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currsong.currentTime = ((currsong.duration) * percent) / 100
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"

    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"

    })
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {

            playmusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })
    //add input to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currsong.volume = parseInt(e.target.value) / 100
    })

}
main()