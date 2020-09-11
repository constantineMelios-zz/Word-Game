const infoDisplay = document.querySelector('.info')
const scoreDisplay = document.querySelector('.score')
const timeDisplay = document.querySelector('.time')
const container = document.querySelector('.container')
const mainDisplay = document.querySelector('.main')
const wordDisplay = document.querySelector('.word')
const stringDisplay = document.querySelector('.string')
const description = document.querySelector('.description')
const playButton = document.querySelector('.play-btn')
const gameButtons = document.querySelector('.game-btns')
const trueButton = document.querySelector('.true-btn')
const falseButton = document.querySelector('.false-btn')
let answer;
let score = 0;
let time = 40;
//Grouping Components by state
const stopTimeComponents = [description, playButton]
const playTimeComponents = [infoDisplay, mainDisplay, gameButtons]
let timer;


//Start game
playButton.addEventListener('click', initializeGame)

function initializeGame() {
    stopTimeComponents.map(component => component.classList.add('hidden'))
    playTimeComponents.map(component => component.classList.remove('hidden'))
    container.classList.remove('win')
    container.classList.remove('lose')
    populateData()
}

//Play game
trueButton.addEventListener('click', checkAnswer)
falseButton.addEventListener('click', checkAnswer)

function checkAnswer(event) {
    clearTimeout(timer)
    if (event.target.value === 'true' && answer || event.target.value === 'false' && !answer) {
        //Correct answer
        if(score === 10) {
            gameOver('win')
        } else {
            score++
            time--
            scoreDisplay.textContent = score
            timeDisplay.textContent = time
            populateData()   
        }
    } else {
        gameOver('lose')
    }
}

//Game overs
function gameOver(state) {
    stopTimeComponents.map(component => component.classList.remove('hidden'))
    playTimeComponents.map(component => component.classList.add('hidden'))
    score = 0
    time = 40
    scoreDisplay.textContent = score
    timeDisplay.textContent = time
    wordDisplay.textContent =''
    stringDisplay.textContent=''
    if(state === 'win') {
        description.textContent = 'You Won!'
        container.classList.add('win')
    } else {
        description.textContent = 'You Lose!'
        container.classList.add('lose')
    }
    playButton.textContent ='Play Again'
}

//Fetching a random word
const getWord = () => {
    return new Promise((resolve, reject) => {
        const wordPromise = fetch('https://random-word-api.herokuapp.com/word?number=1')
        resolve(wordPromise)
        reject(new Error('Error: word does not found!'))
    })
}

//Fetching a random string length = 15
const getString = () => {
    return new Promise((resolve, reject) => {
        const stringPromise = fetch('https://helloacm.com/api/random/?n=15')
        resolve(stringPromise)
        reject(new Error('Error: string does not found'))
    })
}

//Populate string & word
const populateData = async function() {
    try {
        let results = await Promise.all([getWord(), getString()])
        let jsonWord = await results[0].json()
        let givenString = await results[1].json()
        let givenWord = await jsonWord[0] 
        const word = givenWord.toUpperCase()
        const string = shuffle(givenString.toUpperCase(), word.toUpperCase(), (Math.random()>0.5)? 1 : 0)
        wordDisplay.textContent = word
        stringDisplay.textContent = string
        //hiding string
        timer = setTimeout(() => {
            stringDisplay.textContent = '????????????????????'
        }, time*100)
        answer = convertString(string, word)
        console.log(answer)
    } catch(error) {
        console.error(error)
    }
}

//Shuffle for the string creation
function shuffle(string, word, boolean) {
    let array = [];
    if (boolean) {
        //not so random tp create true @ convertString()
        word = Array.from(word)
        string = Array.from(string)
        for (let i = 0; i < word.length; i++) {
            if((Math.random()>0.5)? 1 : 0){
                array.push(word[i])
            } else {
                array.push(string[i])
                i--
            }
        }
    } else {
        //tottaly random
        array = Array.from(string + word)
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    }
    
    return array.join('')
}

//Checks if the winning condition is true
function convertString(characterSelection, word) {
    for (let letter of word) {
        if (characterSelection.includes(letter)) {
            characterSelection = characterSelection.slice(characterSelection.indexOf(letter), characterSelection.length);
        } else {
            return false;
        }
    }
    return true;
}

