'use strict';

const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const answer = document.querySelector('.btn-answer');

const current0El = document.querySelector('#current--0');
const current1El = document.querySelector('#current--1');

let player0Name;
let player1Name;

let activePlayer;
let playing = true;
let score = 0;
let currentscore = 0;
let input = ``;
let pictures =document.querySelector('.pictures');

let wordBankSorted;
let wordBankSortedPictures = [];
let wordBankSortedWords = [];
let wordBankWordsLength = 0;


function init() {
    wordBankSortedPictures = [];
    wordBankSortedWords = [];
    pictures.style.backgroundImage = "";
    document.querySelector('.btn-input').disabled = false;
    document.querySelector('.btn-input').focus();
    document.querySelector(`.results`).textContent = 'Счёт: _ _ _ _ _';
    if(wordBankSortedPictures.length === 0) {   
        wordBankSorted = wordBank.sort(() => Math.random() - 0.5).slice(0,6);
        for(let i = 0; i < wordBankSorted.length; i++) {
            wordBankSortedPictures.push(wordBankSorted[i][2]); 
            wordBankSortedWords.push(wordBankSorted[i][0].replace(/[́]/g, '').toLowerCase()); 
        }
        // wordBankSortedWords.push(wordBankSorted[i][0].replace(/[́]/g, '').toLowerCase()); 

        pictures.innerHTML = wordBankSortedPictures.join('');
    }    
    document.querySelector('.btn-input').focus();
    document.querySelector('.btn-input').value = ``;
    currentscore = 0;
    document.querySelectorAll('.current-score').forEach(function(item) {
        item.innerHTML = 0;
    })
    document.querySelector('.btn-input').focus();
    activePlayer = 0;   
    score = 0;
}
init();

answer.addEventListener('click', writeWord);
document.querySelector('.btn-input').addEventListener('keydown', function(event) {
    if(event.key == "Enter") {
        writeWord();
    }
})

function writeWord() {
    if (wordBankSortedPictures.length === 0) return;
    input = document.getElementById('word').value.toLowerCase().trim();
        
    let wordBankWordsLength = 0;
    console.log(wordBankSorted)
    wordBankSorted.forEach(function(item, i) {
        wordBankWordsLength += item[0].replace(/[́]/g, '').toLowerCase().length;
        })
       
    for(let i = 0; i < wordBankSortedPictures.length; i++) {
        if(input === wordBankSortedWords[i]) {
            score += Number(wordBankSortedWords[i].replace(/[́]/g, '').toLowerCase().length) + 1;
            document.querySelector(`.results`).textContent = `Счёт = ${score} из ${wordBankWordsLength}`;
            // зменшувати базу слів та виводити на екран
            wordBankSortedPictures.splice(i, 1)
            wordBankSortedWords.splice(i, 1)
            pictures.innerHTML = wordBankSortedPictures.join('');
            // очистити ввід слів
            // document.querySelector('.btn-input').focus();
            document.querySelector('.btn-input').value = ``;
            if(wordBankSortedPictures.length === 0) {
                gameOver();
        }  
    }  
}
score -= 1;
document.querySelector(`.results`).textContent = `Счёт: ${score} из ${wordBankWordsLength}`;
document.querySelector('.btn-input').focus();
document.querySelector('.btn-input').value = ``;
}

function btnGameOver(){
    wordBankWordsLength = 0;
    wordBankSorted.forEach(function(item, i) {
        wordBankWordsLength += item[0].replace(/[́]/g, '').toLowerCase().length;
    })
    document.querySelector('.results').innerHTML = '';
    if (score === 0) return;
    console.log(wordBankWordsLength, score);
    if(score < 0) score = 0;
    pictures.innerHTML = `Игра окончена! Твой счёт ${score} из ${wordBankWordsLength}. Это ${Math.round(((score) / wordBankWordsLength * 100))}%! <br> 👍💪🎉🎸🍨🥥🍩🦄🎂🐞☕🥙🥑🦚🍉🥝🥨🍇🥞🍒🍦🍓🍣`;
    pictures.style.backgroundImage = "url('../alphabet_images/celebrate/celebration.png')";
    pictures.style.height = "300px";
    document.querySelector('.btn-input').disabled = true;
    score = 0;
    return;
}

function gameOver() {
    wordBankWordsLength = 0;
    wordBankSorted.forEach(function(item, i) {
        wordBankWordsLength += item[0].replace(/[́]/g, '').toLowerCase().length;
    })
    document.querySelector('.results').innerHTML = '';
    console.log(document.querySelector('.results').innerHTML)
    if (score <= 0) return;
    console.log(wordBankWordsLength, score);
    pictures.innerHTML = `Игра окончена! Твой счёт ${score - 1} из ${wordBankWordsLength}. Это ${Math.round(((score - 1) / wordBankWordsLength * 100))}%! <br> 👍💪🎉🎸🍨🥥🍩🦄🎂🐞☕🥙🥑🦚🍉🥝🥨🍇🥞🍒🍦🍓🍣`;
    pictures.style.backgroundImage = "url('../alphabet_images/celebrate/celebration.png')";
    pictures.style.height = "300px";
    document.querySelector('.btn-input').disabled = true;
    // score = 0;
    return;
}

const again = document.querySelector('.btn--new');
again.addEventListener('click', init);


const finishGame = document.querySelector('.btn-game-finish').addEventListener('click', btnGameOver);

const keyboard = document.querySelector('.keyboard-image');

const btnKeyboard = document.querySelector('.btn-keyboard').addEventListener('click', function() {
    keyboard.classList.remove('hidden');
})

keyboard.addEventListener('click', hideKeyboard);
document.addEventListener('keydown', hideKeyboard);


function hideKeyboard() {
    keyboard.classList.add('hidden');
    document.querySelector('.btn-input').focus();    
}