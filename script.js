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
            // Find the closest matches by Levenshtein distance
            const distances = similarWords.map(word => ({
                word: word.word,
                distance: levenshteinDistance(inputWord, word.word)
            }));

            // Sort by distance and pick the closest matches
            distances.sort((a, b) => a.distance - b.distance);
            const bestGuesses = distances.slice(0, 3).map(item => item.word);

            // Display the "best guess" words
            document.getElementById('results').innerHTML = `
                <p><strong>No rhymes found. Did you mean:</strong> ${bestGuesses.join(', ')}</p>
            `;
        } else {
            document.getElementById('results').innerHTML = `
                <p><strong>No rhymes or close matches found.</strong></p>
            `;
        }
    } else {
        // Calculate Levenshtein distances for rhymes
        const distances = rhymes.map(rhyme => ({
            word: rhyme.word,
            distance: levenshteinDistance(inputWord, rhyme.word)
        }));

        // Sort by distance and get the top 3 results with greatest difference
        distances.sort((a, b) => b.distance - a.distance);
        const topThree = distances.slice(0, 3).map(item => item.word);

        // Display the results
        document.getElementById('results').innerHTML = `
            <p><strong>Phrases that rhyme with greatest difference:</strong> ${topThree.join(', ')}</p>
        `;
    }
});

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
