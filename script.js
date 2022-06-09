// SETTING VARIABLES
const elements = ["vocals", "guitar", "drums"];
const buttons = elements.map((element => `${element}-btn`));
const presses = {};
elements.forEach(element => {
    presses[element] = 0;
});

// INIT STEM TOGGLE BUTTONS
const buttonInit = () => {
    buttons.forEach((button) => {
        document.getElementById(button).addEventListener("click", toggle);
    });
}

// INIT PLAY BUTTON
const playButtonInit = () => {
    document.getElementById('play-btn').addEventListener("click", playerToggle);
}

// TOGGLE STEM ON / OFF
const toggle = (event) => {
    button = document.getElementById(event.target.id);
    videoId = event.target.id.split('-')[0];

    if(button.classList.contains('active')){
        button.classList.remove('active');
        video = document.getElementById(videoId);
        video.classList.remove("primary");
        video.volume = 0;
    }
    else{
        button.classList.add('active');
        video = document.getElementById(videoId);
        video.classList.add("primary");
        video.volume = 1.0;
    } 
    
    presses[videoId] = presses[videoId] + 1
    console.log(presses);
}

// TOGGLE PLAYER
const playerToggle = (event) => {
    button = document.getElementById(event.target.id);

    if(button.classList.contains('playing')){
        elements.forEach(element => {
            video = document.getElementById(element);
            blank = document.getElementById(element.concat('-blank'));
            video.pause();
            blank.pause();
        });
        button.classList.remove('playing');
    }
    else{
        elements.forEach(element => {
            video = document.getElementById(element);
            blank = document.getElementById(element.concat('-blank'));
            video.play();
            blank.play();            
        });
        button.classList.add('playing');
    } 
}

// POPCORN - VIDEO SYNCHRONIZATION
// VIDEOS WILL INEVITABLY FALL OUT OF SYNC WHEN TOGGLING WHICH SETS THE VIDEO VOLUME ... WERID :-(
// THE CODE BELOW ATTEMPTS TO SYNC VIDEOS IF ANY OF THEM ARE OUT OF SYNC BY MORE THAN THE syncTime.

// SETTING THIS TOO LOW WILL CAUSE THE SYNC FUNCTION TO RUN UNHINGED
const syncTime = 0.09; //seconds
const readyState = 4;

// POPCORN INIT
var videos = {
    vocals: Popcorn("#vocals"),
    guitar: Popcorn("#guitar"),
    drums: Popcorn("#drums"),
  },
  loadCount = 0,
  events = "play pause timeupdate seeking".split(/\s+/g);

// iterate both media sources
Popcorn.forEach(videos, function(media, type) {
  // when each is ready... 
  media.on("canplayall", function() {

    // trigger a custom "sync" event
    this.emit("sync");
  });
});

// THE SYNC FUNCTION
// 
// with requestAnimationFrame, we can ensure that as frequently as the browser would allow, the video is resync'ed.
function sync() {

    // SINCE THE LAG OCCURS WHEN A PARTICULAR STEM IS TOGGLED, USE THE "LEAST PRESSED" BUTTON AS THE "LEADER"
    leastPressed = Object.keys(presses).reduce((a, b) => presses[a] < presses[b] ? a : b);
    switch(leastPressed){

    // IN EACH CASE, THE OTHER VIDEOS WILL CHECK TO SEE IF THEY NEED TO SYNC TO THE "LEADER" BASED ON syncTime
        case 'vocals':
            if ( videos.vocals.media.readyState === readyState ) {
                vocals_time = videos.vocals.currentTime();
                guitar_time = videos.guitar.currentTime();
                drums_time = videos.drums.currentTime();
                if ( Math.abs( vocals_time-guitar_time ) > syncTime ) {
                    videos.guitar.currentTime(vocals_time);
                    console.log("guitar synced to vocals");
                }
                if ( Math.abs( vocals_time-drums_time ) > syncTime ) {
                    videos.drums.currentTime(vocals_time);
                    console.log("drums synced to vocals");
                }     
            }
            break;

        case 'guitar':
            if ( videos.guitar.media.readyState === readyState ) {
                guitar_time = videos.guitar.currentTime();
                vocals_time = videos.vocals.currentTime();
                drums_time = videos.drums.currentTime();
                if ( Math.abs( guitar_time-vocals_time ) > syncTime ) {
                    videos.vocals.currentTime(guitar_time);
                    console.log("vocals synced to guitar");
                }
                if ( Math.abs( guitar_time-drums_time ) > syncTime ) {
                    videos.drums.currentTime(guitar_time);
                    console.log("drums synced to guitar");
                }
            }

            break;

        case 'drums':
            if (videos.drums.media.readyState === readyState) {
                drums_time = videos.drums.currentTime();
                vocals_time = videos.vocals.currentTime();
                guitar_time = videos.guitar.currentTime();
                if ( Math.abs( drums_time-vocals_time ) > syncTime ) {
                    videos.vocals.currentTime(drums_time);
                    console.log("vocals synced to drums");
                }
                if ( Math.abs( drums_time-guitar_time ) > syncTime ) {
                    videos.guitar.currentTime(drums_time);
                    console.log("guitars synced to drums");
                }
            }
            break;

        default:
            // do nothing
    }

    // REQUEST SYNC CALLBACK AGAIN
    requestAnimationFrame(sync);
}

// INITIATE SYNC FUNCTION
sync();

document.addEventListener("DOMContentLoaded", buttonInit);
document.addEventListener("DOMContentLoaded", playButtonInit);
