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
  document.getElementById("tip-options").style.display = "block";
}

function payWithLightning() {
  alert("Lightning Invoice Coming Soon...");
  // Integration logic goes here
}

function payWithSolana() {
  alert("Solana Wallet Connect Coming Soon...");
  // Integration logic goes here
}
