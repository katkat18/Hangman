/* Project: Hangman js file by Katrina Jamir */ 

//retrieve elements
const $wordSlotOutput = $('#word-container');
const $winOutput = $('#win-output');
const $loseOutput = $('#lose-output'); 
//let wordSlot = ""; 
let wordSlotArray = []; 

//other variables:
let word = "";
let wordArray = []; 
let guessedLetters = []; 
let hint = "";
let letter = "";
let guesses = 0; 
const guessLimit = 6;
let correctGuess = false; 

const $pikachuImg = $('#hangman-image');
let currentImageNumber = 1; 

let pikachuFrameHandler; 
let currentAnimationImage = 0; 
const maxImageNumber = 3; 
let counter = 0; 
let limit = 9;

let animationComplete = false; 


/*
//generating random words and hints (definitions) using Wordnik API
const apiKey = '1iq9ncc7hnq0r1io7gzrevu7wkfr7si0c2uwh9tetrtelhn2d';
const fetchWordURL = `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=${apiKey}`;
const fetchHintURL = `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`;
*/

//local JSON file
const fetchFile = "json/words.json";

/*
Upon loading:
    - hide win and lose pop up
*/

$('#win-pop-up').hide();
$('#lose-pop-up').hide();

//objects

class Game{
    constructor(){
        this.isActive = true;
    }

    checkForWin(){
        let correctLetters = 0; 
        //check if they surpassed that allotted attempts 
        if(guesses >= 6){
            //lose -- display losing popup
            console.log("you lose");
            //$('#lose-pop-up').css('opacity', 1);
            $('#lose-output').html(`The word was: <span style="color: red;"> ${word}</span>`);
            $('#lose-pop-up').show();

           // $('#lose-pop-up').animate({opacity: 1}, 1000); 
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
            $('#win-output').html(`The word was: <span style="color: red;"> ${word}</span>`);
            $('#win-pop-up').show();
            //$('#win-pop-up').animate({opacity: 1}, 1000); 
            console.log("you win!");
            $('.letter').attr('disabled', 'disabled');
            $('#alphabet-container').css('opacity', 0.5);
        }
        //return true or false 

    }
    //testing purposes
    newGame(){
        //enable all buttons
        fetchWordHint(fetchFile).then(function(){
            wordArray = word.split("");
            //set up letter slots
            //make lines on HTML output word 
            for(let i = 0; i < wordArray.length; i++){
                wordSlotArray.push(`<p>_</p>`);    
            }
            $wordSlotOutput.html(wordSlotArray);
            //set up all variables needed for word and hint
            //display hint 
            $('#hint-output').html(`Hint: ${hint}`); 
            //display guess output 
            updateGuessOutput(guesses);
            resetImage(); 
        })
        .catch(function(err){
            console.log(`failed to set word and hint due to: ${err}`);
        });
 
    
        pikachuFrameHandler = requestAnimationFrame(sleepAnimation);
        animateJiggly(); 

    }
}
//start a new game 
const game = new Game(); 
//console.log(randomNumber(6)); 

$('#play-btn').click(function(){
    $('#start-pop-up').hide();
    //start a new game
    console.log("starting a new game");
    
    game.newGame(); 

});

$('.reset-btn').click(function(){
    $(this).parent().hide(); 
    guesses = 0; 
    wordArray = []; 
    wordSlotArray = [];
    guessedLetters = []; 
    game.newGame(); 
})

//alpha letters 
$('.letter').click(function(){
    //retrieve values from buttons 
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
        updateGuessOutput(guesses); 
        updateImage(); 
    }
    correctGuess = false; 

    //check if we won
    game.checkForWin();  

    //disable letter button recently clicked 
    $(this).attr('disabled', 'disabled');

});

/*
function fetchWordHint(file){
    fetch(file)
        .then(function(res){
            console.log(`response: ${res.status}`);
            if(res.ok){
                return res.json();
            }
        })
        .then(function(data){
            console.log(`data recieved: ${data}`);

            console.log(`word fetched: ${data[0].word}`);
            console.log(`hint fetched: ${data[0].hint}`);
            word = data[0].word;
            hint = data[0].hint;
        })
        .catch(function(err){
            console.log(`fetch error: ${err}`);
        });
}
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
                    });

    const arrayLength = data.length;
    console.log(`array index: ${arrayLength}`); 

    const index = Math.floor(Math.random()*arrayLength);

    console.log(`word fetched: ${data[index].word}`);
    console.log(`hint fetched: ${data[index].hint}`);
    word = data[index].word;
    hint = data[index].hint;

}
//works but not consistently 
/*
async function fetchWordHint(){
    word = await fetch(fetchWordURL)
                    .then(function(res){
                        console.log(`word res: ${res}`);
                        if(res.ok){
                            //do something
                            return res.json(); 
                         }
                    })
                    .then(function(data){
                        console.log(`word data: ${data.word}`);
                        return data.word; 
    
                    })
                    .catch(function(err){
                        console.log(`error on fetchWord: ${err}`);
                    });
    console.log(`new word: ${word}`);
    hint = await fetch(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=3&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`)
                    .then(function(res){
                        console.log(`hint res: ${res}`);
                        if(res.ok){
                            return res.json();
                        }
                    })
                    .then(function(data){
                        console.log(`hint data: ${data[2].text}`);
                        return data[2].text; 
                    })
                    .catch(function(err){
                        console.log(`error fetchHint: ${err}`)
                    });
    console.log(`new hint: ${hint}`); 
}

*/
//functions 
/*
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
            fetchHint(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=3&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`);
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
*/

function updateGuessOutput(num){
    $('#guess-output').html(`Incorrect guesses: ${num}/6`);
}

/*
function checkForWin(){
    let correctLetters = 0; 
    //if number of gueeses has been passed you lose
    if(guesses >= 6){
        //lose -- display losing popup
        console.log("you lose");
        //$('#lose-pop-up').css('display', 'block');
        $('#lose-pop-up').css('opacity', 1);
    }
 
    //check to see if word has been guessed 
    for(let i = 0; i < wordArray.length; i++){
        if(guessedLetters.includes(wordArray[i])){
            correctLetters++;
        }
    }
    if(correctLetters == wordArray.length){
        console.log("you win!");
    }
}
*/
/*
function randomNumber(max){
    return Math.floor(Math.random()*max);
}
*/

function updateImage(){
    currentImageNumber++ 
    $pikachuImg.attr({
        'src': `images/pika-hangman/pikachu-${currentImageNumber}.PNG`,
        'alt': `pikachu-${currentImageNumber}`

    });
}

function resetImage(){
    currentImageNumber = 1; 
    $pikachuImg.attr({
        'src': `images/pika-hangman/pikachu-${currentImageNumber}.PNG`,
        'alt': `pikachu-${currentImageNumber}`

    });

}

function sleepAnimation(){
    counter++;   
    if(counter > limit){
        currentAnimationImage = 0; 
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
                'alt': `pikachu-sleep-${currentAnimationImage}`
        
            });
            currentAnimationImage = 0; 
        }
        setTimeout(function(){
            currentAnimationImage++;
            pikachuFrameHandler = requestAnimationFrame(sleepAnimation);

        }, 150);
    }
}

function animateJiggly(){
    $("#angry-puff").animate({left: "-=12px"}, 1000);
    $("#angry-puff").animate({left: "+=12px"}, 500);
    for(let i = 0; i <= 10; i++){
        $("#angry-puff").animate({left: "-=8px"}, 5);
        $("#angry-puff").animate({left: "+=16px"}, 10);
        $("#angry-puff").animate({left: "-=8px"}, 5);
    }
}