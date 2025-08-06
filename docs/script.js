function selectSong(path) {
  const player = document.getElementById("audio-player");
  player.src = path;
  player.play();
  addToQueue(path);
}

function addToQueue(song) {
  const queue = document.getElementById("queue-list");
  const li = document.createElement("li");
  li.textContent = song.split('/').pop();
  queue.appendChild(li);
}

function selectSong(songUrl) {
  const audio = document.getElementById("audio-player");
  audio.src = songUrl;
  audio.play();

  const queueList = document.getElementById("queue-list");
  const li = document.createElement("li");
  li.textContent = songUrl.split("/").pop();
  queueList.appendChild(li);
}

function showTipOptions() {
  document.getElementById("tip-options").classList.remove("hidden");
}
