
// Get the audio element
const audio = document.getElementById("audio");

// Get music player buttons
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

// Get progress bar, timestamps and volume control
const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const totalTime = document.getElementById("total-time");
const volume = document.getElementById("volume");

// Get currently playing song details
const albumImage = document.querySelector(".album img");
const albumTitle = document.querySelector(".album .p1");
const albumArtist = document.querySelector(".album .p2");

// Get play/pause icon and all song cards
const playIcon = playBtn.querySelector("img");
const cards = document.querySelectorAll(".card[data-song]");


// Store all songs and their details in an array
const songs = [
    {
        title: "Tum Mile",
        artist: "Pritam, Neeraj Shridhar",
        cover: "picture/card1img.jpeg",
        src: "songs/song1.mp3"
    },
    {
        title: "Mahiye Jinna Sohna",
        artist: "Darshan Raval",
        cover: "picture/card2img.jpeg",
        src: "songs/song2.mp3"
    },
    {
        title: "Mere Paas Tum Ho",
        artist: "Rahat Fateh Ali Khan",
        cover: "picture/card3img.jpeg",
        src: "songs/song3.mp3"
    },
    {
        title: "Oo Meri Laila",
        artist: "Atif Aslam, Jyotica Tangri",
        cover: "picture/card4img.jpeg",
        src: "songs/song4.mp3"
    },
    {
        title: "Darmiyaan",
        artist: "Rekha Bhardwaj, Raghav Kaushik, Amrita Saluja",
        cover: "picture/card5img.jpeg",
        src: "songs/song5.mp3"
    },
    {
        title: "Tera Zikr",
        artist: "Darshan Raval",
        cover: "picture/card6img.jpeg",
        src: "songs/song6.mp3"
    },
    {
        title: "Bin Tere",
        artist: "Vishal-Shekhar, Shafaqat Amanat Ali, Sunidhi Chauhan",
        cover: "picture/card7img.jpeg",
        src: "songs/song7.mp3"
    },
    {
        title: "Teri Ore",
        artist: "Pritam, Rahat Fateh Ali Khan, Shreya Ghoshal, Mayur Puri",
        cover: "picture/card8img.jpeg",
        src: "songs/song8.mp3"
    },
    {
        title: "Shukran Allah",
        artist: "Salim-Sulaiman, Sonu Nigam, Shreya Ghoshal, Salim Merchant",
        cover: "picture/card9img.jpeg",
        src: "songs/song9.mp3"
    }
];


// Store the current song index and playback modes
let songIndex = 0;
let isShuffle = false;
let isRepeat = false;


// Convert seconds into MM:SS format
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}


// Update the play/pause button icon
function updatePlayIcon() {
    if (!playIcon) return;

    if (audio.paused) {
        playIcon.src = "picture/player_icon2.png";
        playIcon.alt = "Play";
        playBtn.setAttribute("aria-label", "Play");
    } else {
        playIcon.src = "picture/player_icon3.png";
        playIcon.alt = "Pause";
        playBtn.setAttribute("aria-label", "Pause");
    }
}


// Automatically update the icon when playback state changes
audio.addEventListener("play", updatePlayIcon);
audio.addEventListener("pause", updatePlayIcon);
audio.addEventListener("ended", updatePlayIcon);


// Highlight the currently selected song card
function highlightCard(index) {
    cards.forEach(card => {
        const isActive = Number(card.dataset.song) === index;

        card.classList.toggle("playing", isActive);
        card.setAttribute("aria-current", isActive ? "true" : "false");
    });
}


// Load a song and update its details in the player
function loadSong(index) {
    // Prevent invalid song indexes
    if (index < 0 || index >= songs.length) return;

    // Update the current song index
    songIndex = index;

    const song = songs[songIndex];

    // Set the audio source
    audio.src = song.src;

    // Update album image, title and artist
    albumTitle.textContent = song.title;
    albumArtist.textContent = song.artist;
    albumImage.src = song.cover;

    // Reset the progress bar and timestamps
    currentTime.textContent = "00:00";
    totalTime.textContent = "00:00";
    progress.value = 0;

    // Highlight the selected card
    highlightCard(songIndex);

    // Update the play/pause icon
    updatePlayIcon();
}


// Play the current song
async function playSong() {
    try {
        await audio.play();
        updatePlayIcon();
    } catch (error) {
        // Display an error if the audio cannot be played
        console.error("Unable to play audio:", error);
        updatePlayIcon();
        alert("Please check the audio URL and your internet connection.");
    }
}


// Pause the current song
function pauseSong() {
    audio.pause();
    updatePlayIcon();
}


// Handle the play/pause button click
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});


// Play the next song
function playNext() {
    if (isShuffle && songs.length > 1) {
        // Select a random song different from the current song
        let nextIndex;

        do {
            nextIndex = Math.floor(Math.random() * songs.length);
        } while (nextIndex === songIndex);

        songIndex = nextIndex;
    } else {
        // Move to the next song and return to the first at the end
        songIndex = (songIndex + 1) % songs.length;
    }

    // Load and play the selected song
    loadSong(songIndex);
    playSong();
}


// Play the previous song
function playPrevious() {
    // Restart the current song if it has played for more than 3 seconds
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    // Move to the previous song
    songIndex = (songIndex - 1 + songs.length) % songs.length;

    // Load and play the previous song
    loadSong(songIndex);
    playSong();
}


// Add click events to next and previous buttons
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrevious);


// Enable or disable shuffle mode
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;

    // Update the button's active state
    shuffleBtn.classList.toggle("active", isShuffle);
    shuffleBtn.style.opacity = isShuffle ? "1" : "0.6";
});


// Enable or disable repeat mode
repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;

    // Update the button's active state
    repeatBtn.classList.toggle("active", isRepeat);
    repeatBtn.style.opacity = isRepeat ? "1" : "0.6";
});


// Update the total duration when audio metadata loads
audio.addEventListener("loadedmetadata", () => {
    totalTime.textContent = formatTime(audio.duration);
    progress.max = 100;
});


// Update duration if the audio duration changes
audio.addEventListener("durationchange", () => {
    if (Number.isFinite(audio.duration)) {
        totalTime.textContent = formatTime(audio.duration);
    }
});


// Update the current timestamp and progress bar during playback
audio.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }
});


// Allow users to seek to a different position in the song
progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});


// Automatically play the next song when the current song ends
audio.addEventListener("ended", () => {
    if (isRepeat) {
        // Replay the current song
        audio.currentTime = 0;
        playSong();
    } else {
        // Play the next song
        playNext();
    }
});


// Update the audio volume when the volume slider changes
volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});


// Add click and keyboard events to all song cards
cards.forEach(card => {

    // Select and play the song associated with the clicked card
    function selectCard() {
        const index = Number(card.dataset.song);

        // Check whether the card has a valid song mapping
        if (!Number.isInteger(index) || !songs[index]) {
            console.warn("No song mapped to this card:", card);
            return;
        }

        // Load and play the selected song
        loadSong(index);
        playSong();
    }

    // Play the song when the card is clicked
    card.addEventListener("click", selectCard);

    // Support Enter and Space keys for keyboard accessibility
    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectCard();
        }
    });

});


// Set the initial volume from the volume slider
audio.volume = Number(volume.value);

// Load the first song when the page opens
loadSong(songIndex);
