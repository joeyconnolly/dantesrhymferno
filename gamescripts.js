/* Poet's Journey Game Script */

let dayCount = 1;
let poems = [];
let pendingSubmissions = [];
let publications = [];
let events = [];
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
  logJournal("You awaken with a spark of inspiration. The world of poetry awaits.");
}

function initializePublications() {
  publications = [
    { name: "The Whispering Quill", qualityThreshold: 30 },
    { name: "Verse Vanguard", qualityThreshold: 50 },
    { name: "Echoes Literary Magazine", qualityThreshold: 70 },
    { name: "The Poetic Herald", qualityThreshold: 85 },
    { name: "Global Poets Quarterly", qualityThreshold: 95 },
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
  const levels = ["Unknown", "Emerging", "Recognized", "Renowned", "Legendary"];
  let index = Math.floor(player.reputation / 20);
  index = index >= levels.length ? levels.length - 1 : index;
  return levels[index];
}

function logJournal(entry) {
  const journal = document.getElementById('journalEntries');
  const newEntry = document.createElement('p');
  newEntry.textContent = `> ${entry}`;
  journal.prepend(newEntry);
}

function writePoem() {
  if (player.inspiration < 10 || player.energy < 10) {
    logJournal("You're too exhausted or uninspired to compose poetry today.");
    return;
  }

  player.inspiration -= 10;
  player.energy -= 10;

  const poem = createPoem();
  poems.push(poem);
  updatePoemLists();

  logJournal(`You composed a new poem titled "${poem.title}".`);

  endDay();
}

function createPoem() {
  const titles = [
    "Whispers of the Forgotten",
    "Echoes in Silence",
    "Shadows of Yesterday",
    "Journey Through Dreams",
    "Embers of Hope",
    "Canvas of Stars",
    "Melodies Unheard",
    "Fragments of Time",
    "Solace in Solitude",
    "Reflections of Dawn",
  ];
  const title = titles[Math.floor(Math.random() * titles.length)];

  const quality = Math.floor(
    (player.creativity * 0.5 + player.technique * 0.5) * (Math.random() * 0.3 + 0.7)
  );

  return {
    title: title,
    quality: quality,
    status: "Unpublished",
  };
}

function attendReading() {
  if (player.energy < 15) {
    logJournal("You're too tired to attend a poetry reading.");
    return;
  }

  player.energy -= 15;
  player.inspiration += 20;
  player.exposure += 5;

  logJournal("You attended a captivating poetry reading. Your inspiration soars.");

  endDay();
}

function joinWorkshop() {
  if (player.energy < 20 || player.inspiration < 5) {
    logJournal("You don't have enough energy or inspiration to join a workshop.");
    return;
  }

  player.energy -= 20;
  player.inspiration -= 5;
  player.technique += 10;
  player.insight += 10;

  logJournal("You participated in a workshop, honing your craft.");

  endDay();
}

function networkEvent() {
  if (player.energy < 15) {
    logJournal("You're too drained to network with others.");
    return;
  }

  player.energy -= 15;
  player.exposure += 15;
  player.reputation += 5;

  logJournal("You connected with fellow poets at a networking event.");

  endDay();
}

function relax() {
  player.energy += 20;
  player.inspiration += 15;
  player.mood = "Relaxed";

  if (player.energy > 100) player.energy = 100;
  if (player.inspiration > 100) player.inspiration = 100;

  logJournal("You took time to relax and reflect. Energy and inspiration restored.");

  endDay();
}

function editPoem() {
  const poemSelect = document.getElementById('poemToEdit');
  const poemTitle = poemSelect.value;

  if (!poemTitle) {
    logJournal("No poem selected for editing.");
    return;
  }

  const poem = poems.find(p => p.title === poemTitle);

  if (player.energy < 10) {
    logJournal("You're too tired to edit your work.");
    return;
  }

  player.energy -= 10;
  poem.quality += Math.floor(player.technique * 0.1);

  logJournal(`You refined your poem "${poem.title}". Its quality improved.`);

  updatePoemLists();
  endDay();
}

function submitPoem() {
  const poemSelect = document.getElementById('poemToSubmit');
  const pubSelect = document.getElementById('publicationToSubmit');
  const poemTitle = poemSelect.value;
  const pubName = pubSelect.value;

  if (!poemTitle || !pubName) {
    logJournal("Please select both a poem and a publication to submit.");
    return;
  }

  const poem = poems.find(p => p.title === poemTitle);
  const publication = publications.find(p => p.name === pubName);

  if (poem.status !== "Unpublished") {
    logJournal(`"${poem.title}" has already been submitted or published.`);
    return;
  }

  poem.status = "Pending";
  pendingSubmissions.push({ poem: poem, publication: publication, daySubmitted: dayCount });

  logJournal(`You submitted "${poem.title}" to ${publication.name}.`);

  updatePoemLists();
  endDay();
}

function updatePoemLists() {
  const unpublishedList = document.getElementById('unpublishedPoemsList');
  const publishedList = document.getElementById('publishedPoemsList');
  const poemToEditSelect = document.getElementById('poemToEdit');
  const poemToSubmitSelect = document.getElementById('poemToSubmit');

  unpublishedList.innerHTML = "";
  publishedList.innerHTML = "";
  poemToEditSelect.innerHTML = "<option value=''>-- Choose Poem --</option>";
  poemToSubmitSelect.innerHTML = "<option value=''>-- Choose Poem --</option>";

  poems.forEach(poem => {
    if (poem.status === "Unpublished") {
      const listItem = document.createElement('li');
      listItem.textContent = `${poem.title} (Quality: ${poem.quality})`;
      unpublishedList.appendChild(listItem);

      let option = document.createElement('option');
      option.value = poem.title;
      option.textContent = poem.title;
      poemToEditSelect.appendChild(option);

      option = document.createElement('option');
      option.value = poem.title;
      option.textContent = poem.title;
      poemToSubmitSelect.appendChild(option);
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
        logJournal(`Your poem "${sub.poem.title}" was accepted by ${sub.publication.name}!`);
      } else {
        sub.poem.status = "Unpublished";
        logJournal(`Your poem "${sub.poem.title}" was rejected by ${sub.publication.name}.`);
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
      logJournal("A sudden muse visits you. Your inspiration surges.");
    },
    () => {
      player.energy -= 20;
      logJournal("You caught a cold. Energy levels are low.");
    },
    () => {
      player.creativity += 10;
      logJournal("You had an enlightening conversation. Creativity increased.");
    },
    () => {
      player.reputation += 5;
      logJournal("A notable critic mentioned your work. Reputation improved.");
    },
    () => {
      player.mood = "Anxious";
      logJournal("Self-doubt creeps in. Your mood is affected.");
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

