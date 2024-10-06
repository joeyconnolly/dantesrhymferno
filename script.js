document.getElementById('rhyme-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const inputWord = document.getElementById('input-word').value;

    // Fetch rhymes from Datamuse API
    let response = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(inputWord)}`);
    let rhymes = await response.json();

    // If no rhymes found, try to find closest matches by spelling similarity
    if (rhymes.length === 0) {
        response = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(inputWord)}*`);
        const similarWords = await response.json();

        if (similarWords.length > 0) {
            const bestGuesses = getTopWords(inputWord, similarWords, 5);
            displayResults(bestGuesses, "No rhymes found. Did you mean:");
        } else {
            document.getElementById('results').innerHTML = `
                <p><strong>No rhymes or close matches found.</strong></p>
            `;
        }
    } else {
        // Categorize words by length
        const categorizedWords = categorizeByLength(rhymes);

        // Get a mix of short, medium, and long words with randomness
        const bestWords = getRandomWordMix(categorizedWords, inputWord, 5);

        // Display the results
        displayResults(bestWords, "Words that rhyme with different lengths:");
    }
});

// Helper function to categorize words by length
function categorizeByLength(words) {
    const shortWords = [];
    const mediumWords = [];
    const longWords = [];

    words.forEach(wordObj => {
        const wordLength = wordObj.word.length;
        if (wordLength <= 4) {
            shortWords.push(wordObj.word);
        } else if (wordLength <= 8) {
            mediumWords.push(wordObj.word);
        } else {
            longWords.push(wordObj.word);
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

    // Ensure we get one short, one medium, and one long word
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

    // Sort the words by Levenshtein distance to add randomness in the order
    const distances = selectedWords.map(word => ({
        word: word,
        distance: levenshteinDistance(inputWord, word)
    }));
    distances.sort((a, b) => b.distance - a.distance);

    // Return just the words in the final order
    return distances.map(item => item.word);
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
