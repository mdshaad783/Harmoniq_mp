console.log("Hello World");
let songs;
let currFolder;
function secondsToMinuteSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  // const roundoffsecond = Math.floor(seconds)
  const totalminutes = Math.floor(seconds / 60);
  const totalseconds = Math.floor(seconds % 60);
  // console.log(totalminutes)
  // console.log(totalseconds)
  // const formattedminutes = String(totalminutes).padStart(2,'0')
  // const formattedseconds = String(totalseconds).padStart(2,'0')
  const formattedMinutes = String(totalminutes).padStart(2, "0");
  const formattedSeconds = String(totalseconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}



const playMusic = (track) => {
  const cards = document.querySelectorAll(".card");
  // Add event listener to each card
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      // Find the h3 element inside the clicked card and get its text content
      const songTitle = this.querySelector("h3").innerText;
      console.log(songTitle); // Logs the song title when the card is clicked
    });
  });

  
  // let audio = new Audio("/songs/"+track)
  currentSong.src = `/${currFolder}/` + track;
  currentSong.play();
  play.src = "svg/pause.svg";
  document.querySelector(".currSongInfo").innerHTML =
    '<img src="svg/music.svg" alt="playing">' + `<p>${track}</p>`;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};
let currentSong = new Audio();
async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  console.log(folder);
  
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(div);
  

  // console.log(as);
  // Array of songs derived from a tag href
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currFolder}/`)[1]);
      // console.log(element);
    }
  }
  // Showing all songs iin playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";


  
//   songUL = ""
  for (const song of songs) {
    let a = (songUL.innerHTML =
      songUL.innerHTML +
      `
            <li>
                            <img src="svg/music.svg" class="filter" alt="">
                            <div class="songinfo">
                                <div class="songName">${song.replaceAll("%20"," ")}</div>
                                <div class="songArtist">Singer</div>
                            </div>
                            <div class="playbutton">
                                <span>Play Now</span>
                                <img src="svg/songplay.svg" class="filter" width="16px" alt="">
                            </div>
                        </li> 
     `);
    // console.log(songs[6])
  }
  // console.log(songUL);
  //Playing first song
  // var audio = new Audio(songs[4])
  // audio.play();

  //Attaching songs with play function
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector('.songinfo').firstElementChild.innerHTML);

      //Using the above created global playMusic() function
      playMusic(
        e.querySelector(".songinfo").firstElementChild.innerHTML.trim()
      );
    });
  });

  
  


  //Attaching songs with the playbutton
  play.addEventListener("click", () => {
    if(currentSong.paused) {
      currentSong.play();
      play.src = "svg/pause.svg";
    } 
    else {
      currentSong.pause();
      play.src = "svg/songplay.svg";
    }
  });


  // Targetting Previous Song Button
  previousSong.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(index-1);
    if (index - 1 >= 0) {
      previousbuttonsong = songs[index - 1].replaceAll("%20", " ");
      playMusic(previousbuttonsong);
    } else if (index - 1 < 0) {
      previousbuttonsong = songs[songs.length - 1].replaceAll("%20", " ");
      playMusic(previousbuttonsong);
    }
  });
  // Targetting Next Song Button
  nextSong.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(songs);

    // console.log(index+1);
    // console.log(index);
    if (index + 1 < songs.length) {
      nextbuttonsong = songs[index + 1].replaceAll("%20", " ");
      playMusic(nextbuttonsong);
    } else if (index + 1 == songs.length) {
      nextbuttonsong = songs[0].replaceAll("%20", " ");
      playMusic(nextbuttonsong);
    }
  });

//   return songs
} 

            // Displaying Albums
async function displayAlbums() {
    let x = await fetch(`/songs/`);
    let response = await x.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    
    let anchors = div.getElementsByTagName('a')
    let songcontent = document.querySelector(".songcontent")
    let arrayOfAlbums = Array.from(anchors)
    // console.log(arrayOfAlbums);
    
        for (let index = 0; index < arrayOfAlbums.length; index++) {
            const e = arrayOfAlbums[index];
            
        

        if(e.href.includes("/songs/") && !e.href.includes('.htaccess')){
            // console.log(e.href);
            let album = (e.href.split('/').slice(-1)[0]);
            // console.log(album);
            let y = await fetch(`/songs/${album}/info.json`);
            let response = await y.json();
            // console.log(response);

            songcontent.innerHTML = songcontent.innerHTML + `
                    <div data-folder="${album}" class="card">
                        <div class="playbtn">
                            <img src="svg/play.svg" alt="">
                        </div>
                        <img src="/songs/${album}/cover.jpeg" alt="">
                        <h3 class="folderName">${response.title}</h3>
                        <p>${response.singer}</p>
                    </div>`
            
        }
        else{}
    }
    // Loading the playlist
    Array.from(document.getElementsByClassName('card')).forEach(e=>{
        e.addEventListener('click', async item=>{
            await getsongs(`songs/${item.currentTarget.dataset.folder}`);})
            // playMusic(songs[0])
    })
}


async function main() {
  // document.querySelector('.card').addEventListener('click',()=>{

  //     console.log(document.querySelector('.folderName').innerHTML);

  // })
  //Array of songs
  await getsongs("songs/glory");
  // console.log(songs);


        // Displaying albums
        displayAlbums();
  

  
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime,currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinuteSeconds(
      currentSong.currentTime
    )}/${secondsToMinuteSeconds(currentSong.duration)}`;
    //Adding left style in percentage to move the circle forward
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
    
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".leftbox").style.left = "0%";
    document.querySelector(".songList").style.maxheight = "30vh";
  });

  document.querySelector(".plusicon").addEventListener("click", () => {
    document.querySelector(".leftbox").style.left = "-100%";
  });
  






  function togglePlayPause() {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svg/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svg/songplay.svg";
    }
  }
  document.addEventListener("keydown", (event) => {
    // Check if the pressed key is the spacebar
    if (event.code === "Space") {
      event.preventDefault(); // Prevent the page from scrolling
      togglePlayPause();
    }
  });

  // Setting the volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });


    
}
getsongs();
main();
// shaad.addEventListener("click",()=>{
//     location.href='https://mdshaad783.github.io/mdshaad.github.io/';
// })
