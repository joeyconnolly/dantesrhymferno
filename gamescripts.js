/*
Poet Simulator v0.4

New Features:
- Submissions now take time to be responded to.
- You can make friends with groups of poets.
- Expanded filler text with more examples.
- Added random events that can affect your stats.

*/

var dayCount = 1;
var poemList = [];
var pendingSubmissions = [];
var knownPoets = [];

var poemTypes = ["sonnet", "short free-verse poem", "medium-length free-verse poem", "long free-verse poem", "sestina", "villanelle", "ghazal", "pantoum", "strange new form of your own"];
var magList = [
  { name: "Brittle Star", quality: 25 },
  { name: "Magma", quality: 45 },
  { name: "Poetry London", quality: 60 },
  { name: "Poetry Review", quality: 75 },
  { name: "Poetry Magazine", quality: 85 }
];
var gameLength = 100;

function test() {
  var poetList = "";

  for (var i = 0; i < 100; i++) {
    var newPoet = new Poet();
    poetList = poetList + "<br>" + newPoet.firstName + " " + newPoet.lastName + " who is " + newPoet.talent + ", " + newPoet.demeanor + " and " + newPoet.humour;
  }

  logger(poetList);
}

var wellReadness = 0;
var knowledge = 0;
var poeticInstinct = 0;
var phrasemaking = 0;
var imagination = 0;
var selfAwareness = 0;
var boldness = 0;
var ear = 0;
var observation = 0;
var ethics = 0;
var mood = 0;

var ideasCount = 0;
var reputation = 0;

// POSSIBLE DAILY ACTIONS *****************

function writePoem() {

  if (ideasCount <= 0) {

    updateConsole("On day " + dayCount + " you tried to write a poem, but didn't have any ideas!");

  } else {

    var ideasUsed = 1 + Math.floor(Math.random() * 10);
    if (ideasUsed > ideasCount) { ideasUsed = ideasCount; }

    var newPoem = new Poem(ideasUsed);
    ideasCount = ideasCount - ideasUsed;

    // show in cheatmode bit
    poemDetails(newPoem);

    // check for a or an
    var article = getPoemQuality(newPoem).match('^[aieouAIEOU].*') ? "an" : "a";

    updateConsole("On day " + dayCount + " you used " + ideasUsed + " of your ideas to write " + newPoem.name + ", " + article + " " + getPoemQuality(newPoem) + " poem");

    // set daily action update and new number of ideas
    document.getElementById('ideasCount').innerHTML = ideasCount;

    // add new poem to poemList
    poemList.push(newPoem);

    // add poem to dropdowns
    addPoemToLists(newPoem);

  }

  poeticInstinct = poeticInstinct + Math.floor(Math.random() * 2);
  poeticInstinct > 99 ? poeticInstinct = 99 : null;

  phrasemaking = phrasemaking + Math.floor(Math.random() * 2);
  phrasemaking > 99 ? phrasemaking = 99 : null;

  selfAwareness = selfAwareness + Math.floor(Math.random() * 2);
  selfAwareness > 99 ? selfAwareness = 99 : null;

  ear = ear + Math.floor(Math.random() * 2);
  ear > 99 ? ear = 99 : null;

  addDay();

}

function takeWalk() {

  var newIdeas = Math.floor((Math.random() * 5) * (1 + observation / 10));
  ideasCount = ideasCount + newIdeas;

  var objectList = ["a car", "a dog", "a tree", "a bouncing ball", "a laughing child", "some lovers in one-another's arms", "how terrible everything is", "the outside of your room for once", "the ugly machinations of capital", "two trees", "a child mourning for its lost balloon", "the merry jig of modern life", "many diverse things", "something massive", "a mysterious stranger", "an old friend", "a peculiar cloud formation", "a street performer", "an unusual bird", "a hidden alleyway"];
  var seenObject = objectList[Math.floor(Math.random() * objectList.length)];

  imagination = imagination + Math.floor(Math.random() * 2);
  imagination > 99 ? imagination = 99 : null;

  observation = observation + Math.floor(Math.random() * 2);
  observation > 99 ? observation = 99 : null;

  updateConsole("On day " + dayCount + " you went for a walk, and saw " + seenObject + ". You had " + newIdeas + " ideas!");

  document.getElementById('ideasCount').innerHTML = ideasCount;

  addDay();

}

function readABook() {

  wellReadness = wellReadness + 1 + Math.floor(Math.random() * 3);
  wellReadness > 99 ? wellReadness = 99 : null;

  knowledge = knowledge + 1 + Math.floor(Math.random() * 3);
  knowledge > 99 ? knowledge = 99 : null;

  phrasemaking = phrasemaking + 1 + Math.floor(Math.random() * 3);
  phrasemaking > 99 ? phrasemaking = 99 : null;

  selfAwareness = selfAwareness + 1 + Math.floor(Math.random() * 3);
  selfAwareness > 99 ? selfAwareness = 99 : null;

  imagination = imagination + Math.floor(Math.random() * 2);
  imagination > 99 ? imagination = 99 : null;

  observation = observation + Math.floor(Math.random() * 2);
  observation > 99 ? observation = 99 : null;

  ear = ear + 1 + Math.floor(Math.random() * 3);
  ear > 99 ? ear = 99 : null;

  var newIdeas = Math.floor((Math.random() * 3) * (1 + observation / 10));
  ideasCount = ideasCount + newIdeas;
  document.getElementById('ideasCount').innerHTML = ideasCount;

  var interruption = ["<em>Match of the Day</em> is on.", "you're startled by a fox walking through the snow outside your window, and it puts you right off.", "Barbara calls to ask about physics.", "you fall asleep, and dream of topless Larkin until the sun wakes you.", "the power goes out.", "a sudden rainstorm distracts you.", "your favorite coffee shop closes early."];
  var randomInterruption = interruption[Math.floor(Math.random() * interruption.length)];

  dayResult(" you read a book, becoming more well-read and increasing your knowledge of the world, your ability to put a sentence together, your ear for the music of language, and your self-awareness! Plus you stole some ideas. Books are amazing. However, " + randomInterruption);

  addDay();

}

function socialise() {

  var socialGroup = document.getElementById('socialiselist').value;

  if (socialGroup == "Non-poets") {
    var happening = ["talks about philosophy.", "explains the offside rule, endlessly.", "knocks over your drink.", "has kissed a Tory.", "shares a hilarious anecdote.", "debates the merits of veganism.", "invites you to a concert.", "tells you about a new exhibit at the museum."];
    dayResult(" you socialise with your mates, who mostly don't really like poetry. " + random(firstNames) + " " + random(happening) + " Nonetheless, it makes you a bit smarter and self-aware, and the conversation sets you thinking.");

    knowledge += Math.floor(Math.random() * 3);
    knowledge = Math.min(knowledge, 99);

    selfAwareness += Math.floor(Math.random() * 3);
    selfAwareness = Math.min(selfAwareness, 99);

    ideasCount += 1;
    document.getElementById('ideasCount').innerHTML = ideasCount;

  } else if (socialGroup == "Aspiring poets") {

    dayResult(" you attend a gathering of aspiring poets. You share ideas and discuss your work.");

    // Increase skills
    poeticInstinct += Math.floor(Math.random() * 3);
    poeticInstinct = Math.min(poeticInstinct, 99);

    selfAwareness += Math.floor(Math.random() * 2);
    selfAwareness = Math.min(selfAwareness, 99);

    boldness += Math.floor(Math.random() * 2);
    boldness = Math.min(boldness, 99);

    // Meet new poets
    var newPoet = new Poet();
    knownPoets.push(newPoet);

    dayResult(" You met a new poet: " + newPoet.firstName + " " + newPoet.lastName + ".");

  } else if (socialGroup == "Published poets") {

    dayResult(" you mingle with published poets at a literary event.");

    // Increase skills
    wellReadness += Math.floor(Math.random() * 2);
    wellReadness = Math.min(wellReadness, 99);

    phrasemaking += Math.floor(Math.random() * 2);
    phrasemaking = Math.min(phrasemaking, 99);

    reputation += 1;
    setReputation(0);

    // Chance to become friends with a poet
    if (Math.random() < 0.5) {
      var newPoet = new Poet();
      knownPoets.push(newPoet);

      dayResult(" You made friends with " + newPoet.firstName + " " + newPoet.lastName + ", a published poet.");
    } else {
      dayResult(" You had some interesting conversations but didn't make any new friends.");
    }

  } else if (socialGroup == "Famous poets") {

    dayResult(" you attend an exclusive party with famous poets.");

    // Increase skills
    knowledge += Math.floor(Math.random() * 3);
    knowledge = Math.min(knowledge, 99);

    phrasemaking += Math.floor(Math.random() * 3);
    phrasemaking = Math.min(phrasemaking, 99);

    reputation += 2;
    setReputation(0);

    // Chance to become friends with a famous poet
    if (Math.random() < 0.3) {
      var newPoet = new Poet();
      knownPoets.push(newPoet);

      dayResult(" You made friends with " + newPoet.firstName + " " + newPoet.lastName + ", a famous poet.");
    } else {
      dayResult(" You had some fascinating conversations but didn't make any new friends.");
    }

  }

  addDay();

}

function study() {

  knowledge = knowledge + 1 + Math.floor(Math.random() * 6);
  knowledge > 99 ? knowledge = 99 : null;

  wellReadness = wellReadness + 1 + Math.floor(Math.random() * 3);
  wellReadness > 99 ? wellReadness = 99 : null;

  var interruption = ["<em>Match of the Day</em> is on.", "you're startled by a fox walking through the snow outside your window, and it puts you right off.", "Barbara calls to ask about physics.", "you fall asleep, and dream of topless Larkin until the sun wakes you.", "the neighbor's dog won't stop barking.", "your internet connection fails.", "you receive an unexpected visitor."];
  var randomInterruption = interruption[Math.floor(Math.random() * interruption.length)];

  dayResult(" you read about poetry late into the night. Until 10:30 pm, when " + randomInterruption);

  addDay();

}

function submitPoem() {

  // Find name of poem to be submitted
  var poemInput = document.getElementById('poemtosubmit');
  var poemSubmitted = poemList.filter(obj => {
    return obj.name == poemInput.value;
  })[0];

  // Find which magazine's been submitted to
  var magInput = document.getElementById('selectmagazine');
  var magSubmitted = magList.filter(obj => {
    return obj.name == magInput.value;
  })[0];

  // Check that it's a valid poem and magazine choice
  if (poemSubmitted == undefined || magSubmitted == undefined) {
    dayResult("maybe something happened, but I can't tell you unless you CHOOSE A VALID POEM AND MAGAZINE");
    return;
  }

  // Remove poem from unpublished lists to prevent resubmission
  poemSubmitted.status = 'Pending';
  removePoemFromLists(poemSubmitted);

  // Assign a response time (e.g., between 3 and 14 days)
  var responseTime = 3 + Math.floor(Math.random() * 12); // 3 to 14 days

  // Add to pending submissions
  pendingSubmissions.push({
    poem: poemSubmitted,
    magazine: magSubmitted,
    submitDay: dayCount,
    responseDay: dayCount + responseTime
  });

  dayResult(" you submitted your poem '" + poemSubmitted.name + "' to " + magSubmitted.name + ". They will respond in " + responseTime + " days.");

  addDay();
}

function processSubmissionResponse(submission) {
  var poemSubmitted = submission.poem;
  var magSubmitted = submission.magazine;

  // Calculate the submission strength. Formula is poem's quality score + luck (-10 to +10) + reputation
  var poemQuality = poemSubmitted.qualityScore;
  var luck = Math.floor(Math.random() * 20) - 10;
  var totalSubValue = poemQuality + luck + reputation;

  // Check if poem is accepted
  if (totalSubValue >= magSubmitted.quality) {

    dayResult(" you had your poem '" + poemSubmitted.name + "' accepted by " + magSubmitted.name + "!");
    setReputation(magSubmitted.quality / 10);

    // change poem's status to name of magazine
    poemSubmitted.status = magSubmitted.name;

    // No need to remove from lists; it's already removed when submitted

  } else {

    dayResult(" you had your poem '" + poemSubmitted.name + "' REJECTED by " + magSubmitted.name + "!");

    // Since the poem was rejected, set its status back to 'Unpublished' so it can be resubmitted
    poemSubmitted.status = 'Unpublished';
    // Add poem back to lists
    addPoemToLists(poemSubmitted);
  }
}

function redraftPoem() {

  // find which poem's being redrafted
  var poemInput = document.getElementById('poemtodraft');
  var poemDrafted = poemList.filter(obj => {
    return obj.name == poemInput.value;
  })[0];

  if (poemDrafted == undefined) {
    dayResult("maybe something happened, but unless you choose a valid poem for drafting you won't know!");
    return;
  }

  var editList = "";

  // 20% chance of changing each attribute, between -10 and 30, weighted towards +10
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.imagery = poemDrafted.imagery + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem's images got slightly " + moreOrLess + " vivid.";
  }
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.technicality = poemDrafted.technicality + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem got slightly " + moreOrLess + " technically assured.";
  }
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.profundity = poemDrafted.profundity + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem got slightly " + moreOrLess + " profound.";
  }
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.originality = poemDrafted.originality + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem got slightly " + moreOrLess + " original.";
  }
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.emotion = poemDrafted.emotion + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem got slightly " + moreOrLess + " emotionally affecting.";
  }
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.ambition = poemDrafted.ambition + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem got slightly " + moreOrLess + " ambitious.";
  }
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.memorability = poemDrafted.memorability + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem got slightly " + moreOrLess + " memorable.";
  }
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.musicality = poemDrafted.musicality + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem got slightly " + moreOrLess + " expressive in terms of its music.";
  }
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.morality = poemDrafted.morality + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem now displays " + moreOrLess + " ethical wisdom.";
  }
  if (Math.random() < 0.2) {
    var editEffect = Math.floor(Math.random() * 20) + Math.floor(Math.random() * 20) - 10;
    poemDrafted.originality = poemDrafted.originality + editEffect;
    var moreOrLess = editEffect < 0 ? "less" : "more";
    editList = editList + "<br>The poem as a mysterious whole became " + moreOrLess + " affecting.";
  }

  // 10% chance of changing form
  if (Math.random() < 0.1) {
    poemDrafted.type = poemTypes[Math.floor(Math.random() * poemTypes.length)];
    editList = editList + "<br>You redrafted the poem into a " + poemDrafted.type;
  }

  editList == "" ? editList = "<br>You removed and then reinserted some commas. A classic day's editing." : null;
  poemDrafted.updateQualityScore();
  poemDrafted.draftCount++;

  //just adds to logger
  poemDetails(poemDrafted);

  // improve writing-related skills
  poeticInstinct = poeticInstinct + Math.floor(Math.random() * 2);
  poeticInstinct > 99 ? poeticInstinct = 99 : null;

  phrasemaking = phrasemaking + Math.floor(Math.random() * 2);
  phrasemaking > 99 ? phrasemaking = 99 : null;

  selfAwareness = selfAwareness + Math.floor(Math.random() * 2);
  selfAwareness > 99 ? selfAwareness = 99 : null;

  ear = ear + Math.floor(Math.random() * 2);
  ear > 99 ? ear = 99 : null;

  dayResult("you redrafted " + poemDrafted.name + ". As a result:" + editList + "<br>As far as you can tell the poem is currently " + getPoemQuality(poemDrafted));

  addDay();

}

// DEFINE POEM and POET OBJECTS *****************

function Poem(ideas) {

  this.name = "The " + adjectives[Math.floor(Math.random() * adjectives.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)];
  this.draftCount = 0;
  this.status = "Unpublished"; // published, unpublished, or pending
  this.type = poemTypes[Math.floor(Math.random() * poemTypes.length)];

  this.imagery = calculatePoemCharacteristic([observation, phrasemaking, wellReadness, poeticInstinct, imagination, boldness, ideas]);
  this.technicality = calculatePoemCharacteristic([wellReadness, poeticInstinct, phrasemaking, selfAwareness, ear]);
  this.profundity = calculatePoemCharacteristic([ideas, wellReadness, knowledge, poeticInstinct, phrasemaking, imagination, selfAwareness, ear, observation]);
  this.originality = calculatePoemCharacteristic([knowledge, boldness, wellReadness, poeticInstinct, phrasemaking, imagination, selfAwareness, ear, mood, observation, ideas]);
  this.emotion = calculatePoemCharacteristic([selfAwareness, poeticInstinct, phrasemaking, imagination, boldness, ear, mood, observation, ideas]);
  this.ambition = calculatePoemCharacteristic([boldness, imagination, wellReadness, knowledge, poeticInstinct, selfAwareness, mood, ideas]);
  this.memorability = calculatePoemCharacteristic([phrasemaking, imagination, wellReadness, poeticInstinct, boldness, ear, mood, observation, ideas]);
  this.musicality = calculatePoemCharacteristic([ear, poeticInstinct, wellReadness, phrasemaking, boldness]);
  this.morality = calculatePoemCharacteristic([ethics, selfAwareness, knowledge, imagination]);
  this.jeNeSaisQuoi = Math.floor(Math.random() * 40) - 20;

  this.qualityScore = Math.floor((this.imagery + this.technicality + this.profundity + this.originality + this.emotion + this.ambition + this.memorability + this.musicality + this.morality + this.jeNeSaisQuoi) / 10);

  this.updateQualityScore = function () {
    this.qualityScore = Math.floor((this.imagery + this.technicality + this.profundity + this.originality + this.emotion + this.ambition + this.memorability + this.musicality + this.morality + this.jeNeSaisQuoi) / 10);
  };

}

function Poet() {
  this.firstName = random(firstNames);
  this.lastName = random(lastNames);
  this.talent = random(["rubbish", "mediocre", "good", "brilliant", "visionary"]);
  this.demeanor = random(["mean", "indifferent", "friendly", "charming", "enigmatic"]);
  this.humour = random(["unfunny", "amusing", "hilarious", "witty", "sarcastic"]);
}

// EXTRA FUNCTIONS ***************************

function generateStats() {

  var initialValues = [Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), Math.floor(Math.random() * 40)];

  var factor = 300 / (initialValues.reduce((partialSum, a) => partialSum + a, 0));

  var finalValues = initialValues.map(x => Math.floor(x * factor));

  wellReadness = finalValues[0];
  knowledge = finalValues[1];
  poeticInstinct = finalValues[2];
  phrasemaking = finalValues[3];
  imagination = finalValues[4];
  selfAwareness = finalValues[5];
  boldness = finalValues[6];
  ear = finalValues[7];
  observation = finalValues[8];
  ethics = finalValues[9];
  mood = finalValues[10];

}

function setReputation(amount) {
  reputation = reputation + amount;

  var standings = ["Unknown", "Obscure", "Niche", "Emerging", "Cult Favourite", "Established", "Well-known", "Highly Respected", "Famous", "World-renowned"];
  var index = Math.floor(reputation / 10);
  if (index >= standings.length) {
    index = standings.length - 1;
  }
  var standing = standings[index];

  document.getElementById('reputation').innerHTML = standing;

}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function calculatePoemCharacteristic(arrayIn) {

  var result = (arrayIn[0] + arrayIn[1]) * 6;

  for (i = 2; i < arrayIn.length; i++) {
    result = result + arrayIn[i];
  }

  // make the random amount weighted towards the middle?
  return Math.floor(result / (arrayIn.length + 10)) + (Math.floor(Math.random() * 40) - 20);

}

function dayResult(narrative) {

  updateConsole("On day " + dayCount + " " + narrative);

}

function updateConsole(message) {

  var line1 = document.getElementById('line1').textContent;
  var line2 = document.getElementById('line2').textContent;
  var line3 = document.getElementById('line3').textContent;

  document.getElementById('line4').innerHTML = line3;
  document.getElementById('line3').innerHTML = line2;
  document.getElementById('line2').innerHTML = line1;
  document.getElementById('line1').innerHTML = message;

}

function addPoemToLists(poemIn) {

  var allDropdowns = [document.getElementById("poemtosubmit"), document.getElementById("poemtodraft")];

  for (i = 0; i < allDropdowns.length; i++) {
    var option = document.createElement('option');
    option.text = poemIn.name;
    allDropdowns[i].add(option);

  }

}

function removePoemFromLists(poemIn) {

  var allDropdowns = [document.getElementById("poemtosubmit"), document.getElementById("poemtodraft")];

  for (i = 0; i < allDropdowns.length; i++) {

    while (allDropdowns[i].length != 0) { allDropdowns[i].remove(0); }

    var defaultOption = document.createElement('option');
    defaultOption.text = "Choose Poem";
    allDropdowns[i].add(defaultOption);

    for (var j = 0; j < poemList.length; j++) {

      if (poemList[j].status == "Unpublished") {
        var toAdd = document.createElement('option');
        toAdd.text = poemList[j].name;
        allDropdowns[i].add(toAdd);
      }
    }

  }
}

function addDay() {
  dayCount++;
  document.getElementById("daycount").innerHTML = dayCount;

  // Process pending submissions
  for (var i = pendingSubmissions.length - 1; i >= 0; i--) {
    var submission = pendingSubmissions[i];
    if (dayCount >= submission.responseDay) {
      // Time to respond
      processSubmissionResponse(submission);
      // Remove from pendingSubmissions
      pendingSubmissions.splice(i, 1);
    }
  }

  // Random event
  if (Math.random() < 0.1) { // 10% chance each day
    triggerRandomEvent();
  }

  var unpublishedPoemsList = "";
  var publishedPoemsList = "";

  // add all unpublished poems to lists of poems
  for (i = 0; i < poemList.length; i++) {
    if (poemList[i].status == "Unpublished") {

      // add to unpublished poems list
      unpublishedPoemsList = unpublishedPoemsList + "<br>" + poemList[i].name + " (" + getPoemQuality(poemList[i]) + ")";

    } else if (poemList[i].status == "Pending") {

      // Do nothing, poem is pending

    } else {

      // add to published poems list
      publishedPoemsList = publishedPoemsList + "<br>" + poemList[i].name + " (" + poemList[i].status + ")";

    }

    document.getElementById('unpublishedpoems').innerHTML = unpublishedPoemsList;
    document.getElementById('publishedpoems').innerHTML = publishedPoemsList;

    // add new social groups to socialise dropdown
    var socialList = document.getElementById("socialiselist");
    if (reputation > 10 && socialList.options.length < 2) {
      var newSocialSet = document.createElement('option');
      newSocialSet.text = "Aspiring poets";
      socialList.add(newSocialSet);
      updateConsole("You met a group of aspiring poets, who welcomed you into their group!");
    }
    if (reputation > 40 && socialList.options.length < 3) {
      var newSocialSet = document.createElement('option');
      newSocialSet.text = "Published poets";
      socialList.add(newSocialSet);
      updateConsole("You met a group of published poets, who welcomed you into their group!");
    }
    if (reputation > 70 && socialList.options.length < 4) {
      var newSocialSet = document.createElement('option');
      newSocialSet.text = "Famous poets";
      socialList.add(newSocialSet);
      updateConsole("You met a group of famous poets, who welcomed you into their circle!");
    }

    // End game if at preset game length
    if (dayCount == gameLength + 1) {
      alert("Congratulations! You amassed " + reputation + " reputation in 100 days. See if you can do better next time.");
      location.reload();
    }

  }

  // Update known poets list
  var knownPoetsList = "";
  for (var i = 0; i < knownPoets.length; i++) {
    knownPoetsList += "<br>" + knownPoets[i].firstName + " " + knownPoets[i].lastName;
  }
  document.getElementById('knownpoets').innerHTML = knownPoetsList;

  // put stats into Dev Tools display
  document.getElementById('wellreadness').innerHTML = wellReadness;
  document.getElementById('knowledge2').innerHTML = knowledge;
  document.getElementById('poeticinstinct').innerHTML = poeticInstinct;
  document.getElementById('phrasemaking').innerHTML = phrasemaking;
  document.getElementById('imagination').innerHTML = imagination;
  document.getElementById('selfawareness').innerHTML = selfAwareness;
  document.getElementById('boldness').innerHTML = boldness;
  document.getElementById('ear').innerHTML = ear;
  document.getElementById('mood2').innerHTML = mood;
  document.getElementById('observation').innerHTML = observation;
  document.getElementById('ethics').innerHTML = ethics;

}

//FUNCTIONAL **********************

function startupTasks() {

  // populate magazine dropdown
  for (var i = 0; i < magList.length; i++) {
    var option = document.createElement('option');
    option.text = magList[i].name;
    document.getElementById("selectmagazine").add(option);
  }

  updateConsole("After the general election returned a huge majority for the socialist party, certain members of the proletariat were selected to receive a generous salary to become full-time artists. As a winner, the timing couldn't be better for you. You feel low, burned-out, and uninspired. But how well will you take to poetry? You have " + gameLength + " days to develop your reputation as far as possible!");

  generateStats();

}

function logger(toLog) {
  document.getElementById('logger').innerHTML = toLog;
}

function poemDetails(poemIn) {

  var output = "";

  for (const property in poemIn) {
    output = output + "<br>" + (`${property}: ${poemIn[property]}`);
  }

  logger(output);

}

function evaluatePoem() {

  var poemInput = document.getElementById('poemlist');
  var poemToEval = poemList.filter(obj => {
    return obj.name == poemInput.value;
  })[0];

  poemDetails(poemToEval);
}

function getPoemQuality(poemIn) {

  if (poemIn.qualityScore < 10) { return "awful"; }
  if (poemIn.qualityScore >= 10 && poemIn.qualityScore < 30) { return "bad"; }
  if (poemIn.qualityScore >= 30 && poemIn.qualityScore < 55) { return "mediocre"; }
  if (poemIn.qualityScore >= 55 && poemIn.qualityScore < 65) { return "good"; }
  if (poemIn.qualityScore >= 65 && poemIn.qualityScore < 80) { return "great"; }
  if (poemIn.qualityScore >= 80 && poemIn.qualityScore < 95) { return "incredible"; }
  if (poemIn.qualityScore >= 95) { return "era-defining"; }
}

function toggleCheatMode() {

  var x = document.getElementById("cheatMode");
  if (x.style.display === "none") {
    x.style.display = "block";
    ideasCount = ideasCount + 10000;
  } else {
    x.style.display = "none";
  }

}

function introspect() {

  var verdict = "After thinking about it seriously, you conclude that you are " +
    ["essentially illiterate", "poorly read", "familiar with the classics", "well read", "well read like a fox"][Math.floor(wellReadness / 20)] + ", " +
    ["pig-ignorant", "naive", "knowing of a thing or two", "well-informed", "supremely knowledgeable"][Math.floor(knowledge / 20)] + ", " +
    ["entirely lacking in poetic instinct", "not endowed with poetic instinct", "possessed of some poetic instinct", "sharp with poetic instinct", "an instinctual master of poetry"][Math.floor(poeticInstinct / 20)] + ", " +
    ["useless with words", "poor with words", "a competent phrasemaker", "a good phrasemaker", "a brilliant phrasemaker"][Math.floor(phrasemaking / 20)] + ", " +
    ["as imaginative as a brick", "stolid as a rock", "not entirely without imagination", "imaginative", "visionary"][Math.floor(imagination / 20)] + ", " +
    ["completely out of touch with yourself", "blithely lacking in self-awareness", "roughly familiar with your internal world", "keenly self-aware", "profoundly self-aware"][Math.floor(selfAwareness / 20)] + ", " +
    ["a vacuum of boldness", "intellectually timid", "willing to consider pushing certain boundaries, a bit", "intellectually fearless", "an iconoclast"][Math.floor(boldness / 20)] + ", " +
    ["tin-eared", "with little sense for the music of language", "not without a sense for the music of language", "attuned to the music of words", "possessed of a wonderful lyrical way with words"][Math.floor(ear / 20)] + ", " +
    ["utterly self-absorbed (and not in a good way)", "largely uninterested in the world", "fairly observant", "very observant", "hawk-eyed for the detail of things"][Math.floor(observation / 20)] + " and " +
    ["a despicable human being", "a bad human being", "an okay human being", "a good person", "morally beyond reproach"][Math.floor(ethics / 20)];

  updateConsole(verdict);

  selfAwareness = selfAwareness + 1 + Math.floor(Math.random() * 3);
  selfAwareness > 99 ? selfAwareness = 99 : null;

  addDay();

}

function triggerRandomEvent() {
  var eventsList = [
    function () {
      // You receive an unexpected inheritance
      updateConsole("An unexpected inheritance boosts your finances, allowing you more time to focus on poetry.");
      // Increase some skills or resources
      boldness += 5;
      boldness = Math.min(boldness, 99);
    },
    function () {
      // You suffer a creative block
      updateConsole("You suffer from a creative block, making it harder to come up with ideas.");
      ideasCount = Math.max(ideasCount - 5, 0);
      document.getElementById('ideasCount').innerHTML = ideasCount;
    },
    function () {
      // A famous poet mentions you
      updateConsole("A famous poet mentions you in an interview, increasing your reputation.");
      setReputation(5);
    },
    function () {
      // You fall ill
      updateConsole("You fall ill and can't work effectively.");
      // Decrease some skills
      var decrease = Math.floor(Math.random() * 5);
      poeticInstinct = Math.max(poeticInstinct - decrease, 0);
      phrasemaking = Math.max(phrasemaking - decrease, 0);
    },
    function () {
      // You attend a workshop
      updateConsole("You attend a poetry workshop that enhances your skills.");
      // Increase skills
      poeticInstinct += 5;
      poeticInstinct = Math.min(poeticInstinct, 99);
      phrasemaking += 5;
      phrasemaking = Math.min(phrasemaking, 99);
    }
  ];

  var eventIndex = Math.floor(Math.random() * eventsList.length);
  eventsList[eventIndex]();
}

// MAKE COLLAPSIBLES WORK
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
