function selectSong(path) {
  const player = document.getElementById("audio-player");
  player.src = path;
  player.play();
  addToQueue(path);
  updateTrackInfo(path);
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

// === New player logic ===

const audioPlayer = document.getElementById("audio-player");
const seekSlider = document.getElementById("seek-slider");
const volumeSlider = document.getElementById("volume-slider");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const trackTitle = document.getElementById("track-title");
const trackAlbum = document.getElementById("track-album");
const albumCover = document.getElementById("album-cover");

const playlist = [
  { title: "Song 1", album: "Retro Vibes", src: "assets/song1.mp3", cover: "assets/cover1.jpg" },
  { title: "Song 2", album: "Darkwave Nights", src: "assets/song2.mp3", cover: "assets/cover2.jpg" }
];
let currentTrackIndex = 0;

function updateTrackInfo(src) {
  const track = playlist.find(t => t.src === src);
  if (track) {
    trackTitle.textContent = track.title;
    trackAlbum.textContent = track.album;
    albumCover.src = track.cover;
  }
}

audioPlayer.addEventListener("loadedmetadata", () => {
  seekSlider.max = audioPlayer.duration;
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  seekSlider.value = audioPlayer.currentTime;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

seekSlider.addEventListener("input", () => {
  audioPlayer.currentTime = seekSlider.value;
});

volumeSlider.addEventListener("input", () => {
  audioPlayer.volume = volumeSlider.value;
});

document.getElementById("play-btn").addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  playTrack(currentTrackIndex);
});

document.getElementById("next-btn").addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  playTrack(currentTrackIndex);
});

function playTrack(index) {
  const track = playlist[index];
  audioPlayer.src = track.src;
  audioPlayer.play();
  updateTrackInfo(track.src);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}
