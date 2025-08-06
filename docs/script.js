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

function showTipOptions() {
  const tipDiv = document.getElementById("tip-options");
  tipDiv.classList.remove("hidden");
}
