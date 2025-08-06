const player = document.getElementById("audio-player");
const seekSlider = document.getElementById("seek-slider");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playButton = document.getElementById("play-btn");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const volumeSlider = document.getElementById("volume-slider");
const trackTitleEl = document.getElementById("track-title");
const trackAlbumEl = document.getElementById("track-album");

// Playlist
const playlist = ["assets/song1.mp3", "assets/song2.mp3"];
let currentTrackIndex = 0;

// Load current track
function loadTrack(index) {
  player.src = playlist[index];
  updateTrackInfo(playlist[index]);
  player.load();
  player.play();
}

function updateTrackInfo(path) {
  const filename = path.split('/').pop().split('.')[0];
  trackTitleEl.textContent = filename.replace(/_/g, ' ');
  trackAlbumEl.textContent = "Album: Abyss Hits"; // Placeholder album name
}

// Time formatting
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

// Sync seek slider with track progress
player.addEventListener("timeupdate", () => {
  seekSlider.value = player.currentTime;
  currentTimeEl.textContent = formatTime(player.currentTime);
});

player.addEventListener("loadedmetadata", () => {
  seekSlider.max = player.duration;
  durationEl.textContent = formatTime(player.duration);
});

// Seek when slider moved
seekSlider.addEventListener("input", () => {
  player.currentTime = seekSlider.value;
});

// Play/Pause toggle
playButton.addEventListener("click", () => {
  if (player.paused) {
    player.play();
    playButton.textContent = "⏸";
  } else {
    player.pause();
    playButton.textContent = "▶️";
  }
});

// Prev/Next
prevButton.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
});

nextButton.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
});

// Volume control
volumeSlider.addEventListener("input", () => {
  player.volume = volumeSlider.value;
});

// Playlist item selection
function selectSong(path) {
  const index = playlist.indexOf(path);
  if (index !== -1) {
    currentTrackIndex = index;
    loadTrack(index);
  }
  addToQueue(path);
}

function addToQueue(song) {
  const queue = document.getElementById("queue-list");
  const li = document.createElement("li");
  li.textContent = song.split('/').pop();
  queue.appendChild(li);
}

function showTipOptions() {
  const tipDiv = document.getElementById("tip-options");
  tipDiv.classList.remove("hidden");
}

// Auto-load first song
window.onload = () => {
  loadTrack(currentTrackIndex);
  playButton.textContent = "⏸";
};
