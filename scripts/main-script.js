/* Project: Hangman js file by Katrina Jamir */ 

//retrieve elements
const $wordSlotOutput = $('#word-container');
let wordSlot = ""; 
let wordSlotArray = []; 

//other variables:
let word = "leo";
let wordArray = []; 
let hint = "a very big dog";
let letter = "";
let guesses = 0; 
const guessLimit = 6;
let correctGuess = false; 
const game = "";

//generating random words and hints (definitions) using Wordnik API
const apiKey = '1iq9ncc7hnq0r1io7gzrevu7wkfr7si0c2uwh9tetrtelhn2d';
const fetchWordURL = `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=${apiKey}`;
//const fetchHintURL = `https://api.wordnik.com/v4/word.json/${currWord}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`;


//objects
/*
class Game{
    constructor(){
        this.isActive = false;
    }
    checkForWin(){
        //if word if guessed in allotted time, the player wins 
        //else they lose 
    }
    reset(){
        //reset word -- call functions
        //reset all disabled stuff
    }
}
*/
//start a new game 

$('#play-btn').click(function(){
    $('#start-pop-up').css('display', 'none');

    //start a new game
    //fetchWord(fetchWordURL);
    //put word into an array 
    wordArray = splitArray(word); 

    for(let i = 0; i < wordArray.length; i++){
        console.log(`split array: ${wordArray[i]}`);
    }

    //make lines on HTML output word 
    for(let i = 0; i < wordArray.length; i++){
        wordSlotArray.push(`___ `); 
    
    }

    $wordSlotOutput.html(wordSlotArray);

    //display hint
    $('#hint-output').html(`Hint: ${hint}`);

    //display output 
    updateGuessOutput(guesses);



});

//alpha letters 
$('.letter').click(function(){
    //retrieve values from buttons 
    console.log(`this is value: ${$(this).val()}`);
    letter = $(this).val(); 


    //check if we got a correct letter 
    for(let i = 0; i < wordArray.length; i++){
        //correct
        if(letter == wordArray[i]){
            wordSlotArray[i] = `${letter}    `; 
            $wordSlotOutput.html(wordSlotArray);
            correctGuess = true; 
        }
    }

    if(!correctGuess){
        guesses++
        updateGuessOutput(guesses); 
    }

    //check if we won 
    checkForWin(); 

});

//functions 

//return a random word 
function fetchWord(url){
    fetch(url)
        .then(function(res){
            console.log(`word res: ${res}`);
            if(res.ok){
                //do something
                return res.json(); 
            }
        })
        .then(function(data){
            console.log(`word data: ${data.word}`);
            word = data.word; 
            fetchHint(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=${apiKey}`);
        })
        .catch(function(err){
            console.log(`error on fetchWord: ${err}`);
        });
}

//given a word (refer to function above), return a definition of that word
function fetchHint(url){
    fetch(url)
        .then(function(res){
            console.log(`hint res: ${res}`);
            if(res.ok){
                return res.json();
            }
        })
        .then(function(data){
            console.log(`hint data: ${data[2].text}`);
            hint = data[2].text; 
        })
        .catch(function(err){
            console.log(`error fetchHint: ${err}`)
        });
}

function splitArray(str){
    const array = str.split("");
    return array; 
}

function updateGuessOutput(num){
    $('#guess-output').html(`Incorrect guesses: ${num}/6`);
}


function checkForWin(){
    //if number of gueeses has been passed you lose
    if(guesses >= 6){
        //lose -- display losing popup
        console.log("you lose");
        //$('#lose-pop-up').css('display', 'block');
       // $('#lose-pop-up').css('opacity', 1);

    }

}