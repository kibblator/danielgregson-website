document.addEventListener('DOMContentLoaded', () => {
    const emailAddress = document.getElementById('emailAddress')

    const chosenWord = "dpgregson@hotmail.com";
    let displayedWord = chosenWord.split('').map(char => /[a-z]/.test(char) ? '_' : char);
    let wrongLetters = [];
    const maxWrongAttempts = 4;

    const wordDisplay = document.getElementById('wordDisplay');
    const message = document.getElementById('message');
    const wrongLettersDisplay = document.getElementById('wrongLetters');
    const hangmanDisplay = document.getElementById('hangman');
    const keys = document.querySelectorAll('.key');

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
            keys.forEach(key => key.removeEventListener('click', handleKeyClick));
        }
    }

    function checkWin() {
        if (!displayedWord.includes('_')) {
            message.textContent = 'Congratulations! You won!';
            document.removeEventListener('keydown', handleKeydown);
            keys.forEach(key => key.removeEventListener('click', handleKeyClick));
            setTimeout(() => {
                wipeUpAndDisappear();
            }, 1500)
        }
    }

    function handleKeydown(event) {
        const letter = event.key.toLowerCase();
        processGuess(letter);
    }

    function handleKeyClick(event) {
        const letter = event.target.textContent;
        processGuess(letter);
    }

    function processGuess(letter) {
        message.textContent = '';
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

    function wipeUpAndDisappear() {
        const gameContainer = document.getElementById('game-container');
        const totalDuration = 2500;
        const interval = 50;
        const stepCount = totalDuration / interval;
        let currentStep = 0; 

        gameContainer.style.transition = 'transform 2.5s ease-in-out, opacity 2.5s ease-in-out';
        gameContainer.style.transform = 'translateY(-100%)';
        gameContainer.style.opacity = '0';
        
        function step() {
            currentStep++;
            const progress = currentStep / stepCount;
            const height = (1 - progress) * gameContainer.scrollHeight + 'px'
            gameContainer.style.height = height;
            if (currentStep < stepCount) {
                requestAnimationFrame(step);
            } else {
                gameContainer.style.height = '0';
                gameContainer.style.visibility = 'hidden';
                emailAddress.textContent += chosenWord;
            }
        }
    
        requestAnimationFrame(step);
    }

    document.addEventListener('keydown', handleKeydown);
    keys.forEach(key => key.addEventListener('click', handleKeyClick));

    updateWordDisplay();
    updateWrongLettersDisplay();
    updateHangmanDisplay();
});