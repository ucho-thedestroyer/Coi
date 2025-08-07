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
const playlist = ["assets/epilogue I.m4a", "assets/song2.mp3"];
let currentTrackIndex = 0;

// Load current track
function loadTrack(index) {
  player.src = playlist[index];
  updateTrackInfo(playlist[index]);
  player.load();
  player.play();
}

// Update title and album display
function updateTrackInfo(path) {
  const filename = path.split('/').pop().split('.')[0];
  trackTitleEl.textContent = filename.replace(/_/g, ' ');
  trackAlbumEl.textContent = "Album: Abyss Hits"; // Placeholder album name
}

// Format seconds to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

// Sync seek slider with playback
player.addEventListener("timeupdate", () => {
  seekSlider.value = player.currentTime;
  currentTimeEl.textContent = formatTime(player.currentTime);
});

// Update slider max and duration text when metadata loads
player.addEventListener("loadedmetadata", () => {
  seekSlider.max = player.duration;
  durationEl.textContent = formatTime(player.duration);
});

// Jump to new time when seek slider is moved
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

// Previous track
prevButton.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
});

// Next track
nextButton.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
});

// Volume control
volumeSlider.addEventListener("input", () => {
  player.volume = volumeSlider.value;
});

// Select song from playlist
function selectSong(path) {
  const index = playlist.indexOf(path);
  if (index !== -1) {
    currentTrackIndex = index;
    loadTrack(index);
  }
  addToQueue(path);
}

// Add selected song to visual queue
function addToQueue(song) {
  const queue = document.getElementById("queue-list");
  const li = document.createElement("li");
  li.textContent = song.split('/').pop();
  queue.appendChild(li);
}

// Show tipping options
function showTipOptions() {
  const tipDiv = document.getElementById("tip-options");
  tipDiv.classList.remove("hidden");
}

// Initialize player on page load
window.onload = () => {
  loadTrack(currentTrackIndex);
  player.volume = volumeSlider.value;
  playButton.textContent = "⏸";
};
