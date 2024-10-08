document.getElementById('rhyme-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const inputWord = document.getElementById('input-word').value;

    // Fetch rhymes from Datamuse API
    let response = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(inputWord)}&md=p`);
    let rhymes = await response.json();

    // Filter out uncommon/strange phrases
    rhymes = filterCommonWordsAndPhrases(rhymes);

    // If no rhymes found, try to find closest matches by spelling similarity
    if (rhymes.length === 0) {
        response = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(inputWord)}*&md=p`);
        let similarWords = await response.json();

        similarWords = filterCommonWordsAndPhrases(similarWords);

        if (similarWords.length > 0) {
            const bestGuesses = getRandomWordMix(categorizeByLength(similarWords), inputWord, 5);
            displayResults(bestGuesses, "No rhymes found. Did you mean:");
        } else {
            document.getElementById('results').innerHTML = `
                <p><strong>No rhymes or close matches found.</strong></p>
            `;
        }
    } else {
        // Categorize words by length and apply Levenshtein threshold for short words
        const categorizedWords = categorizeByLengthWithThreshold(rhymes, inputWord, 3);

        // Get a mix of short, medium, and long words with randomness
        const bestWords = getRandomWordMix(categorizedWords, inputWord, 5);

        // Always include one word with the maximum Levenshtein distance
        const maxDistanceWord = getMaxDistanceWord(rhymes, inputWord);

        // Ensure the list includes no more than one obscure word
        const finalWords = enforceObscureLimit(bestWords, maxDistanceWord);

        // Display the results
        displayResults(finalWords, "Words that rhyme with different lengths:");
    }
});

// Helper function to filter out uncommon or nonsensical phrases
function filterCommonWordsAndPhrases(words) {
    return words.filter(wordObj => {
        const word = wordObj.word;
        const tags = wordObj.tags || [];

        // Ignore phrases with multiple short words that are less than 3 characters each
        if (word.split(' ').some(w => w.length < 3) && word.split(' ').length > 1) {
            return false;
        }

        // Ignore words that are solely prepositions, determiners, etc.
        const unwantedPOS = ['det', 'in', 'pron', 'part']; // Determiner, preposition, pronoun, particle
        const hasUnwantedPOS = tags.some(tag => unwantedPOS.includes(tag));

        return !hasUnwantedPOS;
    });
}

// Categorize words by length and ensure Levenshtein threshold for short words
function categorizeByLengthWithThreshold(words, inputWord, minLevenshteinDistance) {
    const shortWords = [];
    const mediumWords = [];
    const longWords = [];

    words.forEach(wordObj => {
        const word = wordObj.word;
        const wordLength = word.length;
        const distance = levenshteinDistance(inputWord, word);

        if (wordLength <= 4) {
            // Only include short words if they meet the Levenshtein distance threshold
            if (distance >= minLevenshteinDistance) {
                shortWords.push(word);
            }
        } else if (wordLength <= 8) {
            mediumWords.push(word);
        } else {
            longWords.push(word);
        }
    });

    return { shortWords, mediumWords, longWords };
}

// Function to randomly pick words with one from each length and randomness
function getRandomWordMix(categorizedWords, inputWord, numberOfWords) {
    const { shortWords, mediumWords, longWords } = categorizedWords;

    // Array to store selected words
    const selectedWords = [];

    // Function to randomly select a word from an array
    const pickRandom = (words) => words.length > 0 ? words[Math.floor(Math.random() * words.length)] : null;

    // Ensure we get one short, one medium, and one long word (if they exist)
    const shortWord = pickRandom(shortWords);
    const mediumWord = pickRandom(mediumWords);
    const longWord = pickRandom(longWords);

    // Add them to the selection array
    if (shortWord) selectedWords.push(shortWord);
    if (mediumWord) selectedWords.push(mediumWord);
    if (longWord) selectedWords.push(longWord);

    // Fill the rest of the list with random words from any category
    while (selectedWords.length < numberOfWords) {
        const randomCategory = [shortWords, mediumWords, longWords][Math.floor(Math.random() * 3)];
        const randomWord = pickRandom(randomCategory);

        // Only add if the word is unique and not null
        if (randomWord && !selectedWords.includes(randomWord)) {
            selectedWords.push(randomWord);
        }
    }

    // Return just the words in the final order
    return selectedWords;
}

// Function to always include the word with maximum Levenshtein distance
function getMaxDistanceWord(words, inputWord) {
    let maxDistance = -1;
    let maxWord = null;

    words.forEach(wordObj => {
        const distance = levenshteinDistance(inputWord, wordObj.word);
        if (distance > maxDistance) {
            maxDistance = distance;
            maxWord = wordObj.word;
        }
    });

    return maxWord;
}

// Function to limit obscure words to 1 per list and ensure max distance word is included
function enforceObscureLimit(words, maxDistanceWord) {
    const obscureWords = ["naoma", "bouma", "troma", "luoma"]; // Add known obscure words here
    const filteredWords = words.filter(word => !obscureWords.includes(word));

    // Allow up to 1 obscure word
    if (filteredWords.length < words.length) {
        filteredWords.push(words.find(word => obscureWords.includes(word)));
    }

    // Ensure the word with the maximum Levenshtein distance is included
    if (!filteredWords.includes(maxDistanceWord)) {
        filteredWords[Math.floor(Math.random() * filteredWords.length)] = maxDistanceWord;
    }

    return filteredWords;
}

// Function to display the results in a numbered list
function displayResults(words, message) {
    const resultList = words.map((word, index) => `${index + 1}. ${word}`).join('<br>');
    document.getElementById('results').innerHTML = `
        <p><strong>${message}</strong><br>${resultList}</p>
    `;
}

// Levenshtein distance function remains the same
function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}
