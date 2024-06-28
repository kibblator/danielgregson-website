document.addEventListener('DOMContentLoaded', () => {
    const chosenWord = "dpgregson@hotmail.com";
    let displayedWord = chosenWord.split('').map(char => /[a-z]/.test(char) ? '_' : char);
    let wrongLetters = [];
    const maxWrongAttempts = 4;

    const wordDisplay = document.getElementById('wordDisplay');
    const message = document.getElementById('message');
    const wrongLettersDisplay = document.getElementById('wrongLetters');
    const hangmanDisplay = document.getElementById('hangman');

    function updateWordDisplay() {
        wordDisplay.textContent = displayedWord.join(' ');
    }

    function updateWrongLettersDisplay() {
        wrongLettersDisplay.textContent = wrongLetters.join(', ');
    }

    function updateHangmanDisplay() {
        hangmanDisplay.textContent = `Wrong attempts: ${wrongLetters.length} / ${maxWrongAttempts}`;
    }

    function checkGameOver() {
        if (wrongLetters.length >= maxWrongAttempts) {
            message.textContent = 'Game Over! The word was: ' + chosenWord;
            document.removeEventListener('keydown', handleKeydown);
        }
    }

    function checkWin() {
        if (!displayedWord.includes('_')) {
            message.textContent = 'Congratulations! You won!';
            document.removeEventListener('keydown', handleKeydown);
        }
    }

    function handleKeydown(event) {
        message.textContent = '';
        const letter = event.key.toLowerCase();
        if (!/[a-z]/.test(letter) || letter.length > 1) {
            message.textContent = 'Please enter a valid letter.';
            return;
        }
        if (displayedWord.includes(letter) || wrongLetters.includes(letter)) {
            message.textContent = 'You have already guessed that letter.';
            return;
        }
        if (chosenWord.includes(letter)) {
            for (let i = 0; i < chosenWord.length; i++) {
                if (chosenWord[i] === letter) {
                    displayedWord[i] = letter;
                }
            }
        } else {
            wrongLetters.push(letter);
        }
        updateWordDisplay();
        updateWrongLettersDisplay();
        updateHangmanDisplay();
        checkWin();
        checkGameOver();
    }

    document.addEventListener('keydown', handleKeydown);

    updateWordDisplay();
    updateWrongLettersDisplay();
    updateHangmanDisplay();
});