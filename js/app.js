/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const cards = document.querySelectorAll('.card');
const moves = document.querySelector('.moves');
const restartBtn = document.querySelector('.restart');
moves.textContent = 0;

restartBtn.addEventListener('click', restart);

for(let card of cards) {
    card.addEventListener('click', show);
}
let openCards = [];
let matchedCards = [];
function show(e) {
    //  Prevent opening more than two cards
    if (openCards.length >= 2 || e.target.classList.contains('open', 'show') || e.target.classList.contains('match') || e.target.classList.contains('fa')) {
        return;
    }

    // Push open cards to array
    e.target.classList.add('open', 'show');
    openCards.push(e.target);
    console.log(openCards, openCards.length);

    // Close open cards after sometime
    if (openCards.length === 2) {
        moves.textContent ++;
        match();
        console.log(openCards.length, matchedCards.length);
    }
}

function match() {
    if (openCards[0].firstElementChild.classList.value === openCards[1].firstElementChild.classList.value) {
        openCards.map(function(card) {
            card.className = 'card match';
            matchedCards.push(card);
        });
        setTimeout(finalScore, 500);
        openCards = [];
        // console.log(matchedCards, matchedCards.length);
    } else {
        // Hide cards if they do not match
        setTimeout(function() {
            for(let opencard of openCards) {
                opencard.classList.remove('open', 'show');
            }
            openCards = [];
            // console.log(openCards, openCards.length);
        }, 1500);
    }
}

function finalScore() {
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.close');
    const score = document.querySelector('#total-moves');

    closeModal.addEventListener('click', close);

    if (matchedCards.length === 16) {
        modal.style.display = 'block';
        score.textContent = moves.textContent;
    }

    function close() {
        modal.style.display = 'none';
    }
}

function restart() {
    if (openCards.length === 0 && matchedCards.length === 0) {
        return;
    }

    matchedCards.map(function(card) {
        card.classList.remove('match');
    });

    openCards.map(function(card) {
        card.classList.remove('open', 'show');
    });

    moves.textContent = 0;
    openCards = [];
    matchedCards = [];
}