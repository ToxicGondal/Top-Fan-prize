const wheel = document.getElementById("wheel");
const winnerDiv = document.getElementById("winner");
const spinBtn = document.getElementById("spinBtn");
const saveBtn = document.getElementById("saveBtn");
const savedNamesDiv = document.getElementById("savedNames");
const nameInputsDiv = document.getElementById("nameInputs");
const addNameBtn = document.getElementById("addNameBtn");

let names = [];
let colors = ["#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#4B0082","#8B00FF","#FF1493","#00CED1","#ADFF2F"];
let rotation = 0;
let maxSpins = 5;
let spinsDone = 0;

addNameBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.className = "input-box";
  div.innerHTML = `<input type="text" placeholder="Enter name"><button class="removeBtn">X</button>`;
  nameInputsDiv.appendChild(div);
});

nameInputsDiv.addEventListener("click", (e) => {
  if(e.target.classList.contains("removeBtn")){
    e.target.parentElement.remove();
  }
});

saveBtn.addEventListener("click", () => {
  names = [];
  const inputs = nameInputsDiv.querySelectorAll("input");
  inputs.forEach(input => {
    const val = input.value.trim();
    if(val) names.push(val);
  });
  if(names.length < 2){
    alert("Please enter at least 2 names.");
    return;
  }
  displaySavedNames();
  createWheel();
});

function displaySavedNames() {
  savedNamesDiv.innerHTML = "";
  names.forEach(name => {
    const div = document.createElement("div");
    div.innerText = name;
    savedNamesDiv.appendChild(div);
  });
}

function createWheel() {
  wheel.querySelectorAll(".slice").forEach(s => s.remove());
  const slices = names.length;
  const angle = 360 / slices;
  names.forEach((name, i) => {
    const slice = document.createElement("div");
    slice.className = "slice";
    slice.style.transform = `rotate(${i*angle}deg) skewY(${90-angle}deg)`;
    slice.style.background = colors[i % colors.length];
    slice.innerHTML = `<span>${name}</span>`;
    wheel.appendChild(slice);
  });
}

function showConfetti() {
  for(let i=0;i<30;i++){
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random()*100 + "%";
    confetti.style.background = colors[Math.floor(Math.random()*colors.length)];
    confetti.style.animationDuration = (Math.random()*1+1.5) + "s";
    document.body.appendChild(confetti);
    setTimeout(()=> confetti.remove(), 2500);
  }
}

spinBtn.addEventListener("click", () => {
  if(names.length < 2){
    alert("Please save at least 2 names first.");
    return;
  }
  if(spinsDone >= maxSpins){
    alert("Maximum spins reached!");
    return;
  }
  spinsDone++;
  winnerDiv.style.transform = "translate(-50%, -50%) scale(0)";
  winnerDiv.style.opacity = 0;
  const randomDegree = Math.floor(Math.random()*360) + 720;
  rotation += randomDegree;
  wheel.style.transition = "transform 5s cubic-bezier(0.33,1,0.68,1)";
  wheel.style.transform = `rotate(${rotation}deg)`;
  setTimeout(() => {
    const slices = names.length;
    const actualDegree = rotation % 360;
    const anglePerSlice = 360 / slices;
    const winnerIndex = Math.floor((360 - actualDegree) / anglePerSlice) % slices;
    winnerDiv.innerHTML = `🎉 ${names[winnerIndex]} 🎉`;
    winnerDiv.style.transition = "transform 1.5s ease, opacity 1.5s ease";
    winnerDiv.style.transform = "translate(-50%, -50%) scale(1.5)";
    winnerDiv.style.opacity = 1;
    showConfetti();
  }, 5000);
});