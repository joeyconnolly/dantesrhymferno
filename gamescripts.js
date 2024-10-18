/* Poet's Quest Game Script */

let dayCount = 1;
let poems = [];
let pendingSubmissions = [];
let magazines = [];
let publishers = [];
let poets = [];
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
  ideas: 5,
  friends: [],
};

function startupTasks() {
  initializeMagazines();
  initializePublishers();
  generateInitialPoets();
  updateStatus();
  logJournal("Your poetic journey begins. Will you rise to literary greatness?");
  openModal('startModal');
}

function initializeMagazines() {
  magazines = [
    { name: "The Blue Nib", qualityThreshold: 10, responseDays: 15 },
    { name: "Algebra of Owls", qualityThreshold: 15, responseDays: 20 },
    { name: "Brittle Star", qualityThreshold: 20, responseDays: 25 },
    { name: "Magma Poetry", qualityThreshold: 25, responseDays: 30 },
    { name: "The Rialto", qualityThreshold: 30, responseDays: 45 },
    { name: "Under the Radar", qualityThreshold: 35, responseDays: 50 },
    { name: "Poetry London", qualityThreshold: 40, responseDays: 60 },
    { name: "The Poetry Review", qualityThreshold: 50, responseDays: 90 },
    { name: "PN Review", qualityThreshold: 60, responseDays: 120 },
    { name: "The London Magazine", qualityThreshold: 70, responseDays: 150 },
    { name: "Granta", qualityThreshold: 80, responseDays: 180 },
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

function generateInitialPoets() {
  const firstNames = ["Emily", "William", "Sylvia", "T.S.", "Langston", "Maya", "Robert", "Elizabeth", "W.B.", "Pablo"];
  const lastNames = ["Dickinson", "Wordsworth", "Plath", "Eliot", "Hughes", "Angelou", "Frost", "Browning", "Yeats", "Neruda"];
  for (let i = 0; i < 5; i++) {
    poets.push({
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      traits: {
        intelligence: Math.floor(Math.random() * 50) + 50,
        kindness: Math.floor(Math.random() * 50) + 50,
        humor: Math.floor(Math.random() * 50) + 50,
      },
    });
  }
}

function updateStatus() {
  document.getElementById('daycount').textContent = dayCount;
  document.getElementById('ideasCount').textContent = player.ideas;
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
  if (player.ideas < 1) {
    logJournal("You lack ideas to write a poem today.");
    return;
  }

  player.ideas -= 1;

  const poem = createPoem();
  poems.push(poem);
  updatePoemLists();

  logJournal(`You crafted a new ${poem.type}, titled "${poem.title}".`);

  // Drafting a poem affects traits
  player.poeticInstinct += Math.floor(Math.random() * 3);
  player.phrasemaking += Math.floor(Math.random() * 2);
  player.imagination += Math.floor(Math.random() * 2);

  endDay();
}

function createPoem() {
  const adjectives = ["Silent", "Echoing", "Whispering", "Reflective", "Shadowy", "Burning", "Fractured", "Dreamy", "Solitary", "Starlit"];
  const nouns = ["Horizon", "Tomorrow", "Wind", "Time", "Mind", "Heart", "Light", "Dream", "Song", "Canvas"];
  const types = ["Sonnet", "Free Verse", "Haiku", "Villanelle", "Sestina", "Ode", "Elegy", "Ballad", "Limerick", "Ghazal"];
  const title = `The ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
  const type = types[Math.floor(Math.random() * types.length)];

  // Poem attributes based on player's stats
  const attributes = {
    imagery: calculateAttribute([player.observation, player.imagination]),
    technicality: calculateAttribute([player.wellReadness, player.poeticInstinct, player.phrasemaking]),
    profundity: calculateAttribute([player.selfAwareness, player.knowledge]),
    originality: calculateAttribute([player.boldness, player.imagination]),
    emotion: calculateAttribute([player.selfAwareness, player.mood === "Happy" ? 10 : 0]),
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
  const realPoets = ["Seamus Heaney", "Carol Ann Duffy", "Ted Hughes", "Philip Larkin", "Derek Walcott", "Simon Armitage", "Alice Oswald", "Jackie Kay"];
  const fakePoets = ["Amelia Rivers", "Jonathan Swiftly", "Luna Nightshade", "Oliver Finch", "Grace Willow", "Eleanor Frost", "Marcus Reed", "Clara Hart"];

  const allPoets = [...realPoets, ...fakePoets];
  const poetRead = allPoets[Math.floor(Math.random() * allPoets.length)];

  player.wellReadness += 5;
  player.ideas += 2;
  player.phrasemaking += 3;
  player.ear += 2;

  logJournal(`You read poetry by ${poetRead}, enriching your understanding of the craft.`);

  endDay();
}

function goForWalk() {
  player.ideas += 3;
  player.observation += 4;
  player.mood = "Content";

  logJournal("A walk amidst nature rejuvenated your senses and sparked new ideas.");

  endDay();
}

function socialize() {
  const socialGroups = [
    { name: "Local Poetry Club", requiredReputation: 0 },
    { name: "Aspiring Poets' Circle", requiredReputation: 20 },
    { name: "Established Poets' Guild", requiredReputation: 50 },
  ];

  let availableGroups = socialGroups.filter(group => player.reputation >= group.requiredReputation && !player.friends.includes(group.name));

  if (availableGroups.length > 0) {
    let group = availableGroups[0];
    player.friends.push(group.name);
    logJournal(`You attended a meeting of the ${group.name} and made new connections.`);
    // Chance to meet a poet
    if (Math.random() < 0.5) {
      let newPoet = generateRandomPoet();
      poets.push(newPoet);
      logJournal(`You met ${newPoet.name}, a fellow poet with unique insights.`);
    }
    player.reputation += 5;
  } else {
    logJournal("You spent time with your existing friends, sharing thoughts and experiences.");
    player.mood = "Happy";
  }

  endDay();
}

function generateRandomPoet() {
  const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Drew", "Cameron", "Lee"];
  const lastNames = ["Harris", "Morgan", "Clark", "Bell", "Bailey", "Parker", "Brooks", "Reed", "Cook", "Price"];
  return {
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    traits: {
      intelligence: Math.floor(Math.random() * 50) + 50,
      kindness: Math.floor(Math.random() * 50) + 50,
      humor: Math.floor(Math.random() * 50) + 50,
    },
  };
}

function introspect() {
  player.selfAwareness += 5;
  player.ethics += 2;
  player.mood = "Thoughtful";

  let introspection = `After reflecting, you realize you are ${describeTrait(player.wellReadness, "well-read")}, ${describeTrait(player.knowledge, "knowledgeable")}, ${describeTrait(player.poeticInstinct, "instinctual in poetry")}, ${describeTrait(player.phrasemaking, "adept at phrasemaking")}, ${describeTrait(player.imagination, "imaginative")}, and ${describeTrait(player.selfAwareness, "self-aware")}.`;

  logJournal(introspection);

  endDay();
}

function describeTrait(value, traitName) {
  if (value < 30) return `not very ${traitName}`;
  if (value < 60) return `somewhat ${traitName}`;
  if (value < 80) return `${traitName}`;
  return `highly ${traitName}`;
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

  poem.drafts += 1;

  // Improve random attributes
  for (let attr in poem.attributes) {
    if (Math.random() < 0.5) {
      poem.attributes[attr] += Math.floor(Math.random() * 5) + 1;
    }
  }

  // Recalculate quality
  poem.quality = Math.floor(
    (poem.attributes.imagery + poem.attributes.technicality + poem.attributes.profundity + poem.attributes.originality + poem.attributes.emotion + poem.attributes.musicality) / 6
  );

  logJournal(`You refined "${poem.title}", enhancing its qualities.`);

  // Editing a poem can affect traits
  player.phrasemaking += Math.floor(Math.random() * 2);
  player.poeticInstinct += Math.floor(Math.random() * 2);

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
        logJournal(`Success! "${sub.poem.title}" was accepted by ${sub.magazine.name}!`);
      } else {
        sub.poem.status = "Unpublished";
        logJournal(`"${sub.poem.title}" was rejected by ${sub.magazine.name}. Keep trying!`);
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
      logJournal("An unexpected inspiration fills your mind with new ideas.");
    },
    () => {
      player.wellReadness += 10;
      logJournal("You stumbled upon a rare poetry collection, expanding your knowledge.");
    },
    () => {
      player.reputation += 5;
      logJournal("A positive review of your work boosts your reputation.");
    },
    () => {
      player.mood = "Anxious";
      logJournal("Self-doubt sets in, affecting your mood.");
    },
    () => {
      let newFriend = generateRandomPoet();
      poets.push(newFriend);
      player.friends.push(newFriend.name);
      logJournal(`You met ${newFriend.name} at a local event and became friends.`);
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
