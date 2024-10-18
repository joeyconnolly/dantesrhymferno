/* Poet's Odyssey Game Script */

let dayCount = 1;
let poems = [];
let pendingSubmissions = [];
let publications = [];
let player = {
  creativity: 50,
  technique: 50,
  exposure: 0,
  insight: 50,
  energy: 100,
  inspiration: 50,
  mood: "Content",
  reputation: 0,
};

function startupTasks() {
  initializePublications();
  updateStatus();
  logJournal("You stand at the dawn of your poetic journey, the quill eager in your hand.");
}

function initializePublications() {
  publications = [
    { name: "The Muse's Whisper", qualityThreshold: 30 },
    { name: "Ink and Essence", qualityThreshold: 50 },
    { name: "Luminary Letters", qualityThreshold: 70 },
    { name: "Verse Chronicle", qualityThreshold: 85 },
    { name: "World Poetry Digest", qualityThreshold: 95 },
  ];

  const publicationSelect = document.getElementById('publicationToSubmit');
  publications.forEach(pub => {
    let option = document.createElement('option');
    option.value = pub.name;
    option.textContent = pub.name;
    publicationSelect.appendChild(option);
  });
}

function updateStatus() {
  document.getElementById('daycount').textContent = dayCount;
  document.getElementById('inspiration').textContent = player.inspiration;
  document.getElementById('energy').textContent = player.energy;
  document.getElementById('mood').textContent = player.mood;
  document.getElementById('reputation').textContent = getReputationLevel();
  updateDevTools();
}

function getReputationLevel() {
  const levels = ["Unknown", "Budding", "Emerging", "Established", "Renowned", "Legendary"];
  let index = Math.floor(player.reputation / 20);
  index = index >= levels.length ? levels.length - 1 : index;
  return levels[index];
}

function logJournal(entry) {
  const journal = document.getElementById('journalEntries');
  const newEntry = document.createElement('p');
  newEntry.textContent = `Day ${dayCount}: ${entry}`;
  journal.prepend(newEntry);
}

function writePoem() {
  if (player.inspiration < 10 || player.energy < 10) {
    logJournal("Fatigue clouds your mind, and inspiration eludes you.");
    return;
  }

  player.inspiration -= 10;
  player.energy -= 10;

  const poem = createPoem();
  poems.push(poem);
  updatePoemLists();

  logJournal(`Verses flow onto the page as you compose "${poem.title}".`);

  endDay();
}

function createPoem() {
  const titles = [
    "Whispers of Eternity",
    "Echoes of the Soul",
    "Shadows and Light",
    "Journey of the Heart",
    "Embers of Memory",
    "Canvas of Dreams",
    "Melodies of the Wind",
    "Fragments of Hope",
    "Solace in Stars",
    "Reflections Beyond Time",
  ];
  const title = titles[Math.floor(Math.random() * titles.length)];

  const quality = Math.floor(
    (player.creativity * 0.6 + player.technique * 0.4) * (Math.random() * 0.4 + 0.6)
  );

  return {
    title: title,
    quality: quality,
    status: "Unpublished",
  };
}

function attendReading() {
  if (player.energy < 15) {
    logJournal("Your limbs feel heavy; you decide to rest instead of going out.");
    return;
  }

  player.energy -= 15;
  player.inspiration += 20;
  player.exposure += 5;

  logJournal("Inspired by the words of others at the reading, your muse awakens.");

  endDay();
}

function joinWorkshop() {
  if (player.energy < 20 || player.inspiration < 5) {
    logJournal("You lack the energy or inspiration to engage in a workshop today.");
    return;
  }

  player.energy -= 20;
  player.inspiration -= 5;
  player.technique += 10;
  player.insight += 10;

  logJournal("Through collaborative effort at the workshop, your skills sharpen.");

  endDay();
}

function networkEvent() {
  if (player.energy < 15) {
    logJournal("Exhaustion takes over; you skip the networking event.");
    return;
  }

  player.energy -= 15;
  player.exposure += 15;
  player.reputation += 5;

  logJournal("You mingle with fellow poets, forging connections that could shape your future.");

  endDay();
}

function relax() {
  player.energy += 20;
  player.inspiration += 15;
  player.mood = "Relaxed";

  if (player.energy > 100) player.energy = 100;
  if (player.inspiration > 100) player.inspiration = 100;

  logJournal("A day of rest rejuvenates your spirit and body.");

  endDay();
}

function showEditModal() {
  const poemSelect = document.getElementById('poemToEdit');
  poemSelect.innerHTML = "<option value=''>-- Choose Poem --</option>";

  poems.forEach(poem => {
    if (poem.status === "Unpublished") {
      let option = document.createElement('option');
      option.value = poem.title;
      option.textContent = poem.title;
      poemSelect.appendChild(option);
    }
  });

  openModal('editModal');
}

function editPoem() {
  const poemSelect = document.getElementById('poemToEdit');
  const poemTitle = poemSelect.value;

  if (!poemTitle) {
    logJournal("Your thoughts wander without a poem to focus on.");
    return;
  }

  const poem = poems.find(p => p.title === poemTitle);

  if (player.energy < 10) {
    logJournal("Your mind is weary; editing will have to wait.");
    return;
  }

  player.energy -= 10;
  poem.quality += Math.floor(player.technique * 0.1);

  logJournal(`You refine "${poem.title}", polishing its verses to a new sheen.`);

  updatePoemLists();
  closeModal('editModal');
  endDay();
}

function showSubmitModal() {
  const poemSelect = document.getElementById('poemToSubmit');
  poemSelect.innerHTML = "<option value=''>-- Choose Poem --</option>";

  poems.forEach(poem => {
    if (poem.status === "Unpublished") {
      let option = document.createElement('option');
      option.value = poem.title;
      option.textContent = poem.title;
      poemSelect.appendChild(option);
    }
  });

  openModal('submitModal');
}

function submitPoem() {
  const poemSelect = document.getElementById('poemToSubmit');
  const pubSelect = document.getElementById('publicationToSubmit');
  const poemTitle = poemSelect.value;
  const pubName = pubSelect.value;

  if (!poemTitle || !pubName) {
    logJournal("Uncertainty stalls your submission; select both a poem and a publication.");
    return;
  }

  const poem = poems.find(p => p.title === poemTitle);
  const publication = publications.find(p => p.name === pubName);

  if (poem.status !== "Unpublished") {
    logJournal(`"${poem.title}" has already embarked on its journey to readers.`);
    return;
  }

  poem.status = "Pending";
  pendingSubmissions.push({ poem: poem, publication: publication, daySubmitted: dayCount });

  logJournal(`With hopeful anticipation, you submit "${poem.title}" to ${publication.name}.`);

  updatePoemLists();
  closeModal('submitModal');
  endDay();
}

function updatePoemLists() {
  const unpublishedList = document.getElementById('unpublishedPoemsList');
  const publishedList = document.getElementById('publishedPoemsList');

  unpublishedList.innerHTML = "";
  publishedList.innerHTML = "";

  poems.forEach(poem => {
    if (poem.status === "Unpublished") {
      const listItem = document.createElement('li');
      listItem.textContent = `${poem.title} (Quality: ${poem.quality})`;
      unpublishedList.appendChild(listItem);
    } else if (poem.status === "Published") {
      const listItem = document.createElement('li');
      listItem.textContent = `${poem.title} (Published in ${poem.publication})`;
      publishedList.appendChild(listItem);
    }
  });
}

function endDay() {
  dayCount++;
  processSubmissions();
  updateStatus();
  checkRandomEvents();
}

function processSubmissions() {
  pendingSubmissions = pendingSubmissions.filter(sub => {
    if (dayCount - sub.daySubmitted >= 3) {
      const acceptanceChance = sub.poem.quality - sub.publication.qualityThreshold + player.reputation;
      if (acceptanceChance >= Math.random() * 100) {
        sub.poem.status = "Published";
        sub.poem.publication = sub.publication.name;
        player.reputation += 10;
        logJournal(`Joyous news arrives: "${sub.poem.title}" was accepted by ${sub.publication.name}!`);
      } else {
        sub.poem.status = "Unpublished";
        logJournal(`A letter of regret informs you that "${sub.poem.title}" was not accepted by ${sub.publication.name}.`);
      }
      updatePoemLists();
      return false;
    }
    return true;
  });
}

function checkRandomEvents() {
  const eventChance = Math.random();
  if (eventChance < 0.2) {
    triggerRandomEvent();
  }
}

function triggerRandomEvent() {
  const events = [
    () => {
      player.inspiration += 20;
      logJournal("A stroll through nature ignites a blaze of inspiration within you.");
    },
    () => {
      player.energy -= 20;
      logJournal("Sleepless nights take their toll, leaving you drained.");
    },
    () => {
      player.creativity += 10;
      logJournal("A profound dream enriches your creativity.");
    },
    () => {
      player.reputation += 5;
      logJournal("Word of your talent spreads through whispers in literary circles.");
    },
    () => {
      player.mood = "Anxious";
      logJournal("Self-doubt clouds your thoughts, and anxiety creeps in.");
    },
  ];

  const randomEvent = events[Math.floor(Math.random() * events.length)];
  randomEvent();
}

function toggleCheatMode() {
  const cheatDiv = document.getElementById('cheatMode');
  cheatDiv.hidden = !cheatDiv.hidden;
}

function updateDevTools() {
  document.getElementById('devCreativity').textContent = player.creativity;
  document.getElementById('devTechnique').textContent = player.technique;
  document.getElementById('devExposure').textContent = player.exposure;
  document.getElementById('devInsight').textContent = player.insight;
  document.getElementById('devEnergy').textContent = player.energy;
  document.getElementById('devInspiration').textContent = player.inspiration;
}

function addResources() {
  player.energy = 100;
  player.inspiration = 100;
  player.creativity += 20;
  player.technique += 20;
  updateStatus();
}

function toggleDropdown(id) {
  document.getElementById(id).classList.toggle('show');
}

window.onclick = function(event) {
  if (!event.target.matches('nav ul li button')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
