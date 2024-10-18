/* Poet's Quest Game Script */

let dayCount = 1;
let poems = [];
let pendingSubmissions = [];
let magazines = [];
let publishers = [];
let player = {
  wellReadness: 50,
  knowledge: 50,
  poeticInstinct: 50,
  phrasemaking: 50,
  imagination: 50,
  selfAwareness: 50,
  boldness: 50,
  ear: 50,
  observation: 50,
  ethics: 50,
  mood: "Neutral",
  reputation: 0,
  energy: 100,
  ideas: 5,
  friends: [],
};

function startupTasks() {
  initializeMagazines();
  initializePublishers();
  updateStatus();
  logJournal("Your poetic journey begins. Will you rise to literary greatness?");
  openModal('startModal');
}

function initializeMagazines() {
  magazines = [
    { name: "Magma Poetry", qualityThreshold: 20, responseDays: 30 },
    { name: "The Rialto", qualityThreshold: 30, responseDays: 45 },
    { name: "Poetry London", qualityThreshold: 40, responseDays: 60 },
    { name: "The Poetry Review", qualityThreshold: 60, responseDays: 90 },
    { name: "PN Review", qualityThreshold: 70, responseDays: 120 },
    { name: "The London Magazine", qualityThreshold: 80, responseDays: 150 },
    { name: "Granta", qualityThreshold: 90, responseDays: 180 },
  ];

  const magazineSelect = document.getElementById('magazineToSubmit');
  magazines.forEach(mag => {
    let option = document.createElement('option');
    option.value = mag.name;
    option.textContent = mag.name;
    magazineSelect.appendChild(option);
  });
}

function initializePublishers() {
  publishers = [
    { name: "Bloodaxe Books", reputationRequired: 50 },
    { name: "Carcanet Press", reputationRequired: 60 },
    { name: "Faber & Faber", reputationRequired: 80 },
    { name: "Penguin Books", reputationRequired: 90 },
  ];
}

function updateStatus() {
  document.getElementById('daycount').textContent = dayCount;
  document.getElementById('ideasCount').textContent = player.ideas;
  document.getElementById('energy').textContent = player.energy;
  document.getElementById('mood').textContent = player.mood;
  document.getElementById('reputation').textContent = getReputationLevel();
  updateDevTools();
}

function getReputationLevel() {
  const levels = ["Unknown", "Novice", "Apprentice", "Adept", "Esteemed", "Renowned", "Legendary"];
  let index = Math.floor(player.reputation / 15);
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
  if (player.ideas < 1 || player.energy < 10) {
    logJournal("You lack the energy or ideas to write a poem today.");
    return;
  }

  player.ideas -= 1;
  player.energy -= 10;

  const poem = createPoem();
  poems.push(poem);
  updatePoemLists();

  logJournal(`You penned a new ${poem.type}, titled "${poem.title}".`);

  endDay();
}

function createPoem() {
  const titles = [
    "The Silent Horizon",
    "Echoes of Tomorrow",
    "Whispers in the Wind",
    "Reflections of Time",
    "Shadows of the Mind",
    "Embers of the Heart",
    "Fragments of Light",
    "Dreams Unveiled",
    "Songs of Solitude",
    "Canvas of Stars",
  ];
  const types = ["sonnet", "free verse", "haiku", "villanelle", "sestina", "ode", "elegy", "ballad", "limerick", "ghazal"];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const type = types[Math.floor(Math.random() * types.length)];

  // Poem attributes based on player's stats
  const attributes = {
    imagery: calculateAttribute([player.observation, player.imagination]),
    technicality: calculateAttribute([player.wellReadness, player.poeticInstinct, player.phrasemaking]),
    profundity: calculateAttribute([player.selfAwareness, player.knowledge]),
    originality: calculateAttribute([player.boldness, player.imagination]),
    emotion: calculateAttribute([player.selfAwareness, player.mood]),
    musicality: calculateAttribute([player.ear, player.phrasemaking]),
  };

  const quality = Math.floor(
    (attributes.imagery + attributes.technicality + attributes.profundity + attributes.originality + attributes.emotion + attributes.musicality) / 6
  );

  return {
    title: title,
    type: type,
    attributes: attributes,
    quality: quality,
    status: "Unpublished",
    drafts: 0,
  };
}

function calculateAttribute(stats) {
  const total = stats.reduce((acc, stat) => acc + stat, 0);
  const randomFactor = Math.floor(Math.random() * 20) - 10; // Adds variability
  return Math.floor((total / stats.length) + randomFactor);
}

function readPoetry() {
  if (player.energy < 10) {
    logJournal("You're too tired to read today.");
    return;
  }

  player.energy -= 10;
  player.wellReadness += 5;
  player.ideas += 2;
  player.phrasemaking += 3;
  player.ear += 2;

  logJournal("You immersed yourself in the works of great poets, gaining inspiration.");

  endDay();
}

function goForWalk() {
  if (player.energy < 5) {
    logJournal("You're too exhausted to go for a walk.");
    return;
  }

  player.energy -= 5;
  player.ideas += 3;
  player.observation += 4;
  player.mood = "Content";

  logJournal("A stroll through nature refreshed your mind and sparked new ideas.");

  endDay();
}

function socialize() {
  if (player.energy < 15) {
    logJournal("You don't have enough energy to socialize.");
    return;
  }

  player.energy -= 15;

  // Depending on reputation, unlock social circles
  if (player.reputation >= 50 && !player.friends.includes("Established Poets")) {
    player.friends.push("Established Poets");
    logJournal("You've befriended some established poets. Your network grows!");
    player.reputation += 5;
  } else if (player.reputation >= 30 && !player.friends.includes("Aspiring Poets")) {
    player.friends.push("Aspiring Poets");
    logJournal("You've met some aspiring poets at a local event.");
    player.reputation += 3;
  } else {
    logJournal("You spent time with friends, enjoying pleasant conversations.");
    player.mood = "Happy";
  }

  endDay();
}

function introspect() {
  if (player.energy < 10) {
    logJournal("Your mind is too cluttered for introspection.");
    return;
  }

  player.energy -= 10;
  player.selfAwareness += 5;
  player.ethics += 2;
  player.mood = "Thoughtful";

  logJournal("You reflected on your journey, gaining deeper self-understanding.");

  endDay();
}

function showEditModal() {
  const poemSelect = document.getElementById('poemToEdit');
  poemSelect.innerHTML = "<option value=''>-- Choose Poem --</option>";

  poems.forEach(poem => {
    if (poem.status === "Unpublished") {
      let option = document.createElement('option');
      option.value = poem.title;
      option.textContent = `${poem.title} (${poem.type})`;
      poemSelect.appendChild(option);
    }
  });

  openModal('editModal');
}

function editPoem() {
  const poemSelect = document.getElementById('poemToEdit');
  const poemTitle = poemSelect.value;

  if (!poemTitle) {
    logJournal("You must select a poem to edit.");
    return;
  }

  const poem = poems.find(p => p.title === poemTitle);

  if (player.energy < 10) {
    logJournal("You're too tired to focus on editing.");
    return;
  }

  player.energy -= 10;
  poem.drafts += 1;

  // Improve random attributes
  for (let attr in poem.attributes) {
    if (Math.random() < 0.5) {
      poem.attributes[attr] += Math.floor(player.technique() * 0.1);
    }
  }

  // Recalculate quality
  poem.quality = Math.floor(
    (poem.attributes.imagery + poem.attributes.technicality + poem.attributes.profundity + poem.attributes.originality + poem.attributes.emotion + poem.attributes.musicality) / 6
  );

  logJournal(`You refined "${poem.title}", enhancing its ${poem.type} form.`);

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
      option.textContent = `${poem.title} (${poem.type})`;
      poemSelect.appendChild(option);
    }
  });

  openModal('submitModal');
}

function submitPoem() {
  const poemSelect = document.getElementById('poemToSubmit');
  const magSelect = document.getElementById('magazineToSubmit');
  const poemTitle = poemSelect.value;
  const magName = magSelect.value;

  if (!poemTitle || !magName) {
    logJournal("You need to select both a poem and a magazine.");
    return;
  }

  const poem = poems.find(p => p.title === poemTitle);
  const magazine = magazines.find(m => m.name === magName);

  if (poem.status !== "Unpublished") {
    logJournal(`"${poem.title}" has already been submitted or published.`);
    return;
  }

  poem.status = "Pending";
  pendingSubmissions.push({ poem: poem, magazine: magazine, daySubmitted: dayCount, responseDay: dayCount + magazine.responseDays });

  logJournal(`You submitted "${poem.title}" to ${magazine.name}. It may take up to ${magazine.responseDays} days to hear back.`);

  updatePoemLists();
  closeModal('submitModal');
  endDay();
}

function showSubmissions() {
  const submissionsList = document.getElementById('pendingSubmissionsList');
  submissionsList.innerHTML = "";

  if (pendingSubmissions.length === 0) {
    submissionsList.innerHTML = "<li>No pending submissions.</li>";
  } else {
    pendingSubmissions.forEach(sub => {
      let listItem = document.createElement('li');
      listItem.textContent = `"${sub.poem.title}" submitted to ${sub.magazine.name}, expected response in ${sub.responseDay - dayCount} days.`;
      submissionsList.appendChild(listItem);
    });
  }

  openModal('submissionsModal');
}

function updatePoemLists() {
  const unpublishedList = document.getElementById('unpublishedPoemsList');
  const publishedList = document.getElementById('publishedPoemsList');

  unpublishedList.innerHTML = "";
  publishedList.innerHTML = "";

  poems.forEach(poem => {
    if (poem.status === "Unpublished") {
      const listItem = document.createElement('li');
      listItem.textContent = `${poem.title} (${poem.type}) - Quality: ${poem.quality}`;
      unpublishedList.appendChild(listItem);
    } else if (poem.status === "Published") {
      const listItem = document.createElement('li');
      listItem.textContent = `${poem.title} published in ${poem.publication}`;
      publishedList.appendChild(listItem);
    }
  });
}

function endDay() {
  dayCount++;
  processSubmissions();
  updateStatus();
  checkWinCondition();
  checkRandomEvents();
}

function processSubmissions() {
  pendingSubmissions = pendingSubmissions.filter(sub => {
    if (dayCount >= sub.responseDay) {
      const acceptanceChance = sub.poem.quality - sub.magazine.qualityThreshold + player.reputation / 2;
      if (acceptanceChance >= Math.random() * 100) {
        sub.poem.status = "Published";
        sub.poem.publication = sub.magazine.name;
        player.reputation += sub.magazine.qualityThreshold / 10;
        logJournal(`Great news! "${sub.poem.title}" was accepted by ${sub.magazine.name}!`);
      } else {
        sub.poem.status = "Unpublished";
        logJournal(`Unfortunately, "${sub.poem.title}" was rejected by ${sub.magazine.name}.`);
      }
      updatePoemLists();
      return false;
    }
    return true;
  });
}

function checkRandomEvents() {
  const eventChance = Math.random();
  if (eventChance < 0.1) {
    triggerRandomEvent();
  }
}

function triggerRandomEvent() {
  const events = [
    () => {
      player.ideas += 5;
      logJournal("An unexpected muse blesses you with a surge of ideas.");
    },
    () => {
      player.energy -= 20;
      logJournal("A bout of illness leaves you feeling drained.");
    },
    () => {
      player.wellReadness += 10;
      logJournal("You find an old anthology that enriches your knowledge.");
    },
    () => {
      player.reputation += 5;
      logJournal("A renowned poet mentions you in an interview, boosting your reputation.");
    },
    () => {
      player.mood = "Anxious";
      logJournal("Self-doubt creeps in, unsettling your mood.");
    },
  ];

  const randomEvent = events[Math.floor(Math.random() * events.length)];
  randomEvent();
}

function checkWinCondition() {
  // Win condition: Reputation reaches 100 and at least 5 published poems
  if (player.reputation >= 100 && poems.filter(p => p.status === "Published").length >= 5) {
    logJournal("Congratulations! You've become a celebrated poet with several published works.");
    alert("You've achieved your goal of becoming a renowned poet!");
  }
}

function toggleCheatMode() {
  const cheatDiv = document.getElementById('cheatMode');
  cheatDiv.hidden = !cheatDiv.hidden;
}

function updateDevTools() {
  document.getElementById('devWellReadness').textContent = player.wellReadness;
  document.getElementById('devKnowledge').textContent = player.knowledge;
  document.getElementById('devPoeticInstinct').textContent = player.poeticInstinct;
  document.getElementById('devPhrasemaking').textContent = player.phrasemaking;
  document.getElementById('devImagination').textContent = player.imagination;
  document.getElementById('devSelfAwareness').textContent = player.selfAwareness;
  document.getElementById('devBoldness').textContent = player.boldness;
  document.getElementById('devEar').textContent = player.ear;
  document.getElementById('devObservation').textContent = player.observation;
  document.getElementById('devEthics').textContent = player.ethics;
}

function addResources() {
  player.energy = 100;
  player.ideas += 10;
  player.wellReadness += 20;
  player.poeticInstinct += 20;
  updateStatus();
}

function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
