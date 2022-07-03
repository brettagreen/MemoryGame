const gameContainer = document.getElementById("game");
let cards = [];
let gameActive = false;
let totalGuesses = 0;
let matches = 0;
let highScore = parseInt(localStorage.getItem('highscore'));
let lineHeight = null;

//default values
let numberOfCards = 10;
let typeOfCards = 'colors';

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "black",
  "yellow",
  "silver",
  "pink",
  "teal",
  "lightskyblue",
  "midnightblue",
  "brown",
  "darkolivegreen",
  "indianred"
];

const WORDS = [
  "beauty",
  "tired",
  "frugal",
  "upset",
  "courage",
  "gigantic",
  "furious",
  "sleepy",
  "obnoxious",
  "zebra",
  "hammer",
  "airport",
  "bicycle",
  "butter",
  "picnic"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  if (typeOfCards === 'colors') {
      array = COLORS;
  } else if (typeofCards = 'words') {
      array = WORDS;
  }

  fullArray=[];
  arrayLength = numberOfCards/2;
  for(let i = 0; i < arrayLength; i++){
    fullArray.push(array[i]);
    fullArray.push(array[i]);
  }

  array=fullArray;
  fullArray = null;

  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of cards
// it creates a new div and gives it a class with the value of the array item
// it also adds an event listener for a click for each card
function createDivsForCards(cardArray) {
  for (let item of cardArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(item);
    if (typeOfCards === 'words') {
      newDiv.style.textAlign = 'center';
      newDiv.style.verticalAlign = 'middle';
    }

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// when the DOM loads
const startButton = document.createElement("button");
startButton.innerText = 'start game';
startButton.id = 'start-button';
startButton.style.marginLeft = '10px';
const resetButton = document.createElement("button");
resetButton.innerText = 'reset board';
resetButton.style.float = 'left';
resetButton.style.clear = 'left';
resetButton.style.visibility = 'hidden';
resetButton.style.marginLeft = '10px';
const numbersBox = document.getElementById('tiles');
const cardsBox = document.getElementById('cardtype');
const runningScore = document.createElement("div");
runningScore.style.clear = 'left';
runningScore.style.float = 'left';
runningScore.style.marginLeft = '10px';
runningScore.style.fontSize = 'large';
runningScore.style.fontWeight = 'bold';
runningScore.innerText = `Total guesses = ${totalGuesses}`;

const body = document.querySelector('body');
body.append(startButton);
body.append(resetButton);
body.append(runningScore);

//default arrangement
createDivsForCards(shuffle(typeOfCards));

function compareCards() {
    const pair1 = cards[0];
    const pair2 = cards[1];
    totalGuesses++;
    runningScore.innerText = `Total guesses = ${totalGuesses}`;

    if (typeOfCards === 'colors' && (pair1.style.backgroundColor === pair2.style.backgroundColor) ||
        typeOfCards === 'words' && (pair1.firstChild.innerText === pair2.firstChild.innerText)) {
          console.log("it's a match!");
          matches++;
          cards.length = 0;
          if (matches === numberOfCards/2) {
            if (totalGuesses < parseInt(localStorage.getItem('highscore')) || localStorage.getItem('highscore') == null) {
              localStorage.setItem('highscore', totalGuesses);
            }
            resetButton.style.visibility = 'visible';
            resetButton.style.float = 'left';
          }
    } else {
      setTimeout(function() {
          if (typeOfCards === 'colors') {
            pair1.style.backgroundColor = "";
            pair2.style.backgroundColor = "";
          } else if (typeOfCards === 'words') {
            pair1.innerHTML = '';
            pair2.innerHTML = '';
          } else {
            alert("how'd you get here?");
          }        
          pair1.classList.toggle('noclick');
          pair2.classList.toggle('noclick');
          cards.length = 0;
      }, 1000);
    }
}

numbersBox.addEventListener('change', function(e) {
    numberOfCards = numbersBox.value;
    if (numberOfCards != 10) {
      let adjustBoxSize = document.querySelectorAll('#game div');
      console.log(adjustBoxSize);
      if (numberOfCards === 20) {
        for (let box of adjustBoxSize) {
          box.style.height = '150px';
          lineHeight = '98px';
        }
      } else if (numberOfCards === 30) {
        for (let box of adjustBoxSize) {
          box.style.height = '120px';
          lineHeight = '78px';
        }
      } else {
        lineHeight = '130px';
      }

    }

    let oldCards = document.querySelectorAll('#game div');
    console.log(oldCards);
    for (let card of oldCards) {
        card.remove();
    }
    createDivsForCards(shuffle(typeOfCards));
});

cardsBox.addEventListener('change', function(e) {
    typeOfCards = cardsBox.value;
    let oldCards = document.querySelectorAll('#game div');
    for (let card of oldCards) {
        card.remove();
    }
    createDivsForCards(shuffle(typeOfCards));
});

gameContainer.addEventListener("click", function(e) {
    const box = e.target;
    console.log(box);
    if (gameActive) {
      if (typeOfCards === 'colors') {
        if (box.tagName === "DIV" && cards.length <= 1 && box.id != 'game') {
          box.style.backgroundColor = box.className;
          box.classList.toggle('noclick');
          if (cards.length === 0) {
            cards.push(box);
          } else {
            cards.push(box);
            compareCards();
          }
        }
      } else if (typeOfCards === 'words') {
        if (box.tagName === "DIV" && cards.length <= 1 && box.id != 'game') {
          box.innerHTML = '<p>' + box.className + '</p>';
          box.firstChild.style.lineHeight = lineHeight;
          box.classList.toggle('noclick')
      
          if (cards.length === 0) {
            cards.push(box);
          } else {
            cards.push(box);
            compareCards();
          }
        }
      } 
    }
});

startButton.addEventListener("click", function(e) {
    gameActive = true;
    startButton.style.visibility = 'hidden';

    numberOfCards = numbersBox.value;
    typeOfCards = cardsBox.value;

    numbersBox.previousElementSibling.style.visibility = 'hidden';
    cardsBox.previousElementSibling.style.visibility = 'hidden';
    numbersBox.style.visibility = 'hidden';
    cardsBox.style.visibility = 'hidden';
});

resetButton.addEventListener("click", function(e) {
    const allCards = document.querySelectorAll("#game div");
    for (let card of allCards) {
      card.remove();
    }

    createDivsForCards(shuffle(typeOfCards));
    gameActive = false;
    totalGuesses = 0;
    matches = 0;

    startButton.style.visibility = 'visible';
    numbersBox.previousElementSibling.style.visibility = 'visible';
    cardsBox.previousElementSibling.style.visibility = 'visible';
    numbersBox.style.visibility = 'visible';
    cardsBox.style.visibility = 'visible';

    resetButton.style.visibility = 'hidden';
    runningScore.innerText = `Total guesses = ${totalGuesses}`;
});