document.getElementById('rhyme-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const inputWord = document.getElementById('input-word').value;

    // Fetch rhymes from Datamuse API
    const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(inputWord)}`);
    const rhymes = await response.json();

    // Calculate Levenshtein distances
    const distances = rhymes.map(rhyme => ({
        word: rhyme.word,
        distance: levenshteinDistance(inputWord, rhyme.word)
    }));

    // Sort by distance and get the two with greatest distance
    distances.sort((a, b) => b.distance - a.distance);
    const topTwo = distances.slice(0, 2).map(item => item.word);

    // Display the results
    document.getElementById('results').innerHTML = `
        <p><strong>Words that rhyme with greatest difference:</strong> ${topTwo.join(', ')}</p>
    `;
});

// Levenshtein distance function
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
