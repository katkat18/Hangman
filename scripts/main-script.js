/* Project: Hangman js file by Katrina Jamir */ 

//retrieve elements
const $wordSlotOutput = $('#word-container');
const $pikachuImg = $('#hangman-image');

//other variables:
//variables to handle a word and it's hint 
let word = "";
let wordArray = []; 
let wordSlotArray = []; 
let guessedLetters = []; 
let hint = "";
let letter = "";
let guesses = 0; 
const guessLimit = 6;
let prevIndex = -1; 

//handling of images and their animations
let currentImageNumber = 1; 
let pikachuFrameHandler; 
let currentAnimationImage = 1; 
const maxImageNumber = 3; 
let counter = 0; 
let limit = 10;

//local JSON file
const fetchFile = "json/words.json";

/*Game object
has methods:
    - checkForWin()
        - checks if the player has won 
        - win condition:
            - if the word was guessed withing the guess limit
            - if all the letters in the word has been guessed
        - displays appropriate pop ups based on game result 

    - newGame()
        - starts a new game
        - retrieves a new word and hint 
        - resets all game data and page content 
*/ 
class Game{
    checkForWin(){
        let correctLetters = 0; 

        //check if they surpassed that allotted attempts 
        if(guesses >= guessLimit){
            //lose -- display lose popup
            console.log("you lose");
            $('#lose-output').html(`The word was: <span style="color: red;"> ${word}</span>`);
            $('#lose-pop-up').show();

            //disable all buttons 
            $('.letter').attr('disabled', 'disabled');
            $('#alphabet-container').css('opacity', 0.5);
        }

        //check if correct word has been guessed 
        for(let i = 0; i < wordArray.length; i++){
            if(guessedLetters.includes(wordArray[i])){
                correctLetters++;
            }
        }

        if(correctLetters == wordArray.length){
            //win -- display win popup
            console.log("you win!");
            $('#win-output').html(`The word was: <span style="color: red;"> ${word}</span>`);
            $('#win-pop-up').show();

            //disable all buttons 
            $('.letter').attr('disabled', 'disabled');
            $('#alphabet-container').css('opacity', 0.5);
        }
    }

    newGame(){
        //reset variables
        guesses = 0; 
        wordArray = []; 
        wordSlotArray = [];
        guessedLetters = []; 

        //fetch new word and hint
        fetchWordHint(fetchFile).then(function(){
            //put fetched word into an array 
            wordArray = word.split("");

            //set up letter slots
            for(let i = 0; i < wordArray.length; i++){
                wordSlotArray.push(`<p>_</p>`);    
            }

            $wordSlotOutput.html(wordSlotArray);

            //display hint 
            $('#hint-output').html(`Hint: ${hint}`); 

            //display guess output and reset image to original state 
            updateIncorrectOutput(guesses);
            resetImage(); 
        })
        .catch(function(err){
            console.log(`failed to set word and hint due to: ${err}`);
            $('#error-output').html(`error: ${err}`);
            $('#error-pop-up').show(); 
        });

        //animate Pikachu and Jiggypuff 
        pikachuFrameHandler = requestAnimationFrame(sleepAnimation);
        animateJiggly(); 
    }
}

//initial setup of the game
$('#win-pop-up').hide();
$('#lose-pop-up').hide();
$('#error-pop-up').hide(); 

//start a new game 
const game = new Game(); 

//event listeners

//button for first time play - start a new game
$('#play-btn').click(function(){
    $('#start-pop-up').hide();
    //start a new game
    console.log("starting a new game!");
    game.newGame(); 

});

/*button for playing again
    - resets all values
    - starts a new game 
*/
$('.reset-btn').click(function(){
    $(this).parent().hide(); 
    game.newGame(); 
})

/*button for letters
each time a button is clicked:
    - check if the letter matches any letters from the word
    - if it matches, display it on the screen
    - else add to the guesses count and update the hangman image
*/ 
$('.letter').click(function(){
    //retrieve values from buttons 
    let correctGuess = false; 
    console.log(`this is value: ${$(this).val()}`);
    letter = $(this).val(); 

    //add to guessed letters
    guessedLetters.push(letter); 

    //check if we got a correct letter 
    for(let i = 0; i < wordArray.length; i++){
        //correct
        if(letter == wordArray[i]){
            wordSlotArray[i] = `<p>${letter}</p>`; 
            $wordSlotOutput.html(wordSlotArray);
            correctGuess = true; 
        }
    }

    //wrong
    if(!correctGuess){
        guesses++
        updateIncorrectOutput(guesses); 
        updateImage(); 
    }
    correctGuess = false; 

    //check if we won
    game.checkForWin();  

    //disable letter button recently clicked 
    $(this).attr('disabled', 'disabled');

});

//functions

/* 
function to fetch a word and it's hint
input: a path to the JSON file (string)

Math.random function credit to:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

async function structure
https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp

*/
async function fetchWordHint(file){
    data = await fetch(file)
                    .then(function(res){
                        console.log(`response: ${res.status}`);
                        if(res.ok){
                            return res.json();
                        }
                    })
                    .catch(function(err){
                         console.log(`fetch error: ${err}`);
                         $('#error-output').html(`fetch error: ${err}`);
                         $('#error-pop-up').show(); 
                    });

    const arrayLength = data.length;
    console.log(`total array content: ${arrayLength}`); 


    const currIndex = Math.floor(Math.random()*arrayLength);
    console.log(`currIndex: ${currIndex}`);
    console.log(`prevIndex: ${prevIndex}`);

    while(currIndex == prevIndex){
       currIndex =  Math.floor(Math.random()*arrayLength);
    }

    console.log(`word fetched: ${data[currIndex].word}`);
    console.log(`hint fetched: ${data[currIndex].hint}`);
    prevIndex = currIndex;
    word = data[currIndex].word;
    hint = data[currIndex].hint;

}

/*
function that renders the number of incorrect guesses
input: number of guesses so far
*/ 
function updateIncorrectOutput(num){
    $('#guess-output').html(`Incorrect guesses: ${num}/6`);
}

/*
function that cycles through the hangman images
*/ 
function updateImage(){
    currentImageNumber++ 
    $pikachuImg.attr({
        'src': `images/pika-hangman/pikachu-${currentImageNumber}.PNG`,
        'alt': `pikachu-${currentImageNumber}`

    });
}

/*
function that resets the hangman image back to it's initial state
*/ 
function resetImage(){
    currentImageNumber = 1; 
    $pikachuImg.attr({
        'src': `images/pika-hangman/pikachu-${currentImageNumber}.PNG`,
        'alt': `pikachu-${currentImageNumber}`

    });

}

/*
function that animates pikachu sleeping 
*/ 
function sleepAnimation(){
    counter++;   
    if(counter > limit){
        currentAnimationImage = 1; 
        counter = 0; 
        $('.letter').removeAttr('disabled');
        $('#alphabet-container').css('opacity', 1);
        cancelAnimationFrame(pikachuFrameHandler);
    }else{
        if(currentAnimationImage <= maxImageNumber){
            $pikachuImg.attr({
                'src': `images/pika-hangman/pikachu-sleep-${currentAnimationImage}.PNG`,
                'alt': `pikachu-sleep-${currentAnimationImage}`
        
            });
           
        }else{
            $pikachuImg.attr({
                'src': `images/pika-hangman/pikachu-1.PNG`,
                'alt': `pikachu-1`
        
            });
            currentAnimationImage = 1; 
        }
        setTimeout(function(){
            //console.log(currentAnimationImage);
            currentAnimationImage++;
            pikachuFrameHandler = requestAnimationFrame(sleepAnimation);

        }, 150);
    }
}

/*
function that animates Jigglypuff's anger
*/ 
function animateJiggly(){
    $("#angry-puff").animate({left: "-=12px"}, 1000);
    $("#angry-puff").animate({left: "+=12px"}, 500);
    for(let i = 0; i <= 10; i++){
        $("#angry-puff").animate({left: "-=8px"}, 5);
        $("#angry-puff").animate({left: "+=16px"}, 10);
        $("#angry-puff").animate({left: "-=8px"}, 5);
    }
}