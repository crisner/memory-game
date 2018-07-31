/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector('.deck');
const ul = document.createDocumentFragment();
const cardsList = [];

for(let i = 1; i <= 16; i++) {
    const li = document.createElement('li');
    let svg = '';
    li.className = 'card';
    if (i > 8) {
        let j = i - 8;
        svg = '<svg role="img" class="icon" title="0' + j + '"><use xlink:href="./img/sprites.svg#icon-' + j + '"></use></svg>';
        li.innerHTML = svg;
    } else {
        svg = '<svg role="img" class="icon" title="0' + i + '"><use xlink:href="./img/sprites.svg#icon-' + i + '"></use></svg>';
        li.innerHTML = svg;
    }
    cardsList.push(li);
}

const shuffledCards = shuffle(cardsList);
for(let card of shuffledCards) {
    ul.appendChild(card);
}

deck.appendChild(ul);

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
const min = document.querySelector('.min');
const sec = document.querySelector('.sec');
let openCards = [];
let matchedCards = [];
let movesCounter = 0;
moves.textContent = movesCounter + ' Moves';

// TODO: Reset game
restartBtn.addEventListener('click', function() {
    restart(deck, ul);
});

let playerTime = 0;
let timerOn = false;
// TODO: Start running timer
deck.addEventListener('click', function(e) {
    let minuteCounter = 0;
    let secondCounter = 0;

    // TODO: Stop timer
    if (matchedCards.length === 16) {
        timerOn = false;
        clearInterval(playerTime);
        return;
    }

    // Do nothing if timer is running
    if (timerOn) {
        return;
    }

    // TODO: Start timer
    if (e.target.classList.contains('card')) {
        timerOn = true;
        min.textContent = '00';
        sec.textContent = '00';
        minuteCounter = 0;
        secondCounter = 0;
        playerTime = setInterval(timer, 1000);
    }

    function timer() {
        if (secondCounter === 59) {
            secondCounter = 0;
            minuteCounter++;
            min.textContent = minuteCounter < 10 ? '0' + minuteCounter : minuteCounter;
        }
        secondCounter++;
        sec.textContent = secondCounter < 10 ? '0' + secondCounter : secondCounter;
    }
});


// TODO: Reveal cards
for(let card of cards) {
    card.addEventListener('click', show);
}

function shuffle(arr) {     // Function to shuffle cards
    let shuffled = [];
    let currentLength = arr.length;
    while(currentLength !== 0) {
      let randomNumber = Math.floor(Math.random() * currentLength);
      shuffled.push(arr[randomNumber]);
      currentLength -= 1;
      arr[randomNumber] = arr[currentLength];
    }
    return shuffled;
}

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
    const playAgain = document.querySelector('.play-again');
    const minFinal = document.querySelector('.min');
    const secFinal = document.querySelector('.sec');
    const score = document.querySelector('#total-time');
    const container = document.querySelector('.container');
    const backdrop = document.querySelector('.backdrop');
    const containerHeight = container.offsetHeight;

    playAgain.addEventListener('click', function() {
        restart(deck, ul);
        close();
    });

    closeModal.addEventListener('click', close);

    // TODO: Display modal
    if (matchedCards.length === 16) {
        modal.style.display = 'block';
        backdrop.style.display = 'block';
        score.textContent = minFinal.textContent + 'm ' + secFinal.textContent + 's';
        backdrop.classList.add('backdrop-show');
        backdrop.style.height = containerHeight + 'px';
        starScore('.modal-stars', 'none', '#f5ce67');
    }

    function close() {
        modal.style.display = 'none';
        backdrop.style.display = 'none';
    }
}

function restart(parentTag, fragment) {
    // Shuffle cards
    const cardsArr = [];
    cards.forEach(function(card) {
        cardsArr.push(card);
    });
    parentTag.innerHTML = '';
    cards = shuffle(cardsArr);
    for(let card of cards) {
        fragment.appendChild(card);
    }
    parentTag.appendChild(fragment);

    // Display closed cards
    if (openCards.length === 0 && matchedCards.length === 0 && movesCounter === 0) {
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

    movesCounter = 0;
    moves.textContent = movesCounter + ' Moves';
    min.textContent = '00';
    sec.textContent = '00';
    openCards = [];
    matchedCards = [];
    starScore('.stars');
    timerOn = false;
    clearInterval(playerTime);
}

// Function to display the number of stars received according to player's moves
function starScore(name, display, color) {
    const stars = document.querySelector(name).children;
    const comment = document.querySelector('.comment');
    if (movesCounter > 12 && movesCounter < 20) {
        stars[2].style.color = 'black';
        stars[2].style.display = display;
        comment.textContent = 'Good!!';
    } else if (movesCounter >= 20) {
        stars[1].style.color = 'black';
        stars[1].style.display = display;
        stars[2].style.display = display;
        comment.textContent = 'You can do it better!';
    } else if (movesCounter <= 12) {
        stars[1].style.display = 'inline-block';
        stars[2].style.display = 'inline-block';
        stars[2].style.color = color || 'orange';
        stars[1].style.color = color || 'orange';
        comment.textContent = 'Perfect!!!';
    }
}