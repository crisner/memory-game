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

let cards = document.querySelectorAll('.card');
const moves = document.querySelector('.moves');
const restartBtn = document.querySelector('.restart');
let movesCounter = 0;
moves.textContent = movesCounter + ' Moves';

// TODO: Reset game
restartBtn.addEventListener('click', restart);

// TODO: Reveal cards
for(let card of cards) {
    card.addEventListener('click', show);
}
let openCards = [];
let matchedCards = [];

function show(e) {
    //  Prevent opening more than two cards
    if (openCards.length >= 2 || e.target.classList.contains('open', 'show') || e.target.classList.contains('match') || e.target.classList.contains('icon')) {
        return;
    }

    // Push open cards to array
    e.target.classList.add('open', 'show');
    e.target.firstElementChild.classList.add('display-icon');
    openCards.push(e.target);

    // Close open cards after sometime
    if (openCards.length === 2) {
        movesCounter++;
        moves.textContent = movesCounter === 1 ? 1 + ' Move' : movesCounter + ' Moves';
        starScore('.stars', 'inline-block');
        match();
    }
}

function match() {
    if (openCards[0].firstElementChild.getAttribute('title') === openCards[1].firstElementChild.getAttribute('title')) {
        openCards.map(function(card) {
            card.className = 'card match';
            matchedCards.push(card);
        });
        setTimeout(finalScore, 500);
        openCards = [];
    } else {
        // Hide cards if they do not match
        setTimeout(function() {
            for(let opencard of openCards) {
                opencard.style.animation = 'shake 0.5s';
                setTimeout(function() {
                    opencard.style.animation = 'reverseflip 0.4s';
                    opencard.firstElementChild.style.animation = 'hideicon 0.4s';
                }, 500);
            }
            setTimeout(function() {
                for(let opencard of openCards) {
                    opencard.classList.remove('open', 'show');
                    opencard.firstElementChild.classList.remove('display-icon');
                    opencard.style.animation = '';
                    opencard.firstElementChild.style.animation = '';
                    opencard.removeAttribute('style');
                    opencard.firstElementChild.removeAttribute('style');
                }
                openCards = [];
            }, 800);
        }, 900);
    }
}

function finalScore() {
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.close');
    const score = document.querySelector('#total-moves');
    const container = document.querySelector('.container');
    const backdrop = document.querySelector('.backdrop');
    const containerHeight = container.offsetHeight;

    closeModal.addEventListener('click', close);

    if (matchedCards.length === 16) {
        modal.style.display = 'block';
        backdrop.style.display = 'block';
        score.textContent = moves.textContent;
        backdrop.classList.add('backdrop-show');
        backdrop.style.height = containerHeight + 'px';
        starScore('.modal-stars', 'none', '#f5ce67');
    }

    function close() {
        modal.style.display = 'none';
        backdrop.style.display = 'none';
    }
}

function restart() {
    // Shuffle cards
    const deck = document.querySelector('.deck');
    const cardsArr = [];
    cards.forEach(function(card) {
        cardsArr.push(card);
    });
    deck.innerHTML = '';
    cards = shuffle(cardsArr);
    for(let card of cards) {
        deck.appendChild(card);
    }

    // Display closed cards
    if (openCards.length === 0 && matchedCards.length === 0) {
        return;
    }

    matchedCards.map(function(card) {
        card.classList.remove('match');
        card.firstElementChild.classList.remove('display-icon');
    });

    openCards.map(function(card) {
        card.classList.remove('open', 'show');
        card.firstElementChild.classList.remove('display-icon');
    });

    if (movesCounter !== 0) {
        movesCounter = 0;
        moves.textContent = movesCounter + ' Moves';
        openCards = [];
        matchedCards = [];
        starScore('.stars');
    }
}

// Function to display the number of stars received according to player's moves
function starScore(name, display, color) {
    const stars = document.querySelector(name).children;
    if (movesCounter > 12 && movesCounter < 20) {
        stars[2].style.color = 'black';
        stars[2].style.display = display;
    } else if (movesCounter >= 20) {
        stars[1].style.color = 'black';
        stars[1].style.display = display;
        stars[2].style.display = display;
    } else if (movesCounter <= 12) {
        stars[1].style.display = 'inline-block';
        stars[2].style.display = 'inline-block';
        stars[2].style.color = color || 'orange';
        stars[1].style.color = color || 'orange';
    }
}