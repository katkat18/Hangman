/* Project: Hangman js file by Katrina Jamir */ 

//retrieve elements
const $wordSlotOutput = $('#word-container');
//let wordSlot = ""; 
let wordSlotArray = []; 

//other variables:
let word = "katrina";
let wordArray = []; 
let guessedLetters = []; 
let hint = "A girl that is simmering";
let letter = "";
let guesses = 0; 
const guessLimit = 6;
let correctGuess = false; 

const $pikachuImg = $('#hangman-image');
let currentImageNumber = 1; 

//generating random words and hints (definitions) using Wordnik API
const apiKey = '1iq9ncc7hnq0r1io7gzrevu7wkfr7si0c2uwh9tetrtelhn2d';
const fetchWordURL = `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=${apiKey}`;
const fetchHintURL = `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`;

//hide win/lose pop-ups
/*
$('#win-pop-up').hide();
$('#lose-pop-up').hide();
*/
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
            $('#lose-pop-up').show(); 
            //disable all buttons 
            $('.letter').attr('disabled', 'disabled');
    
        }
        //check if correct word has been guessed 
        for(let i = 0; i < wordArray.length; i++){
            if(guessedLetters.includes(wordArray[i])){
                correctLetters++;
            }
        }
    
        if(correctLetters == wordArray.length){
            $('#win-pop-up').show(); 
            console.log("you win!");
            $('.letter').attr('disabled', 'disabled');
        }
        //return true or false 

    }
    //testing purposes
    newGame(){
        //console.log(guesses);
        $('.letter').removeAttr('disabled');
        //set up game lines 
        wordArray = word.split("");
    
        //set up letter slots
        
        for(let i = 0; i < wordArray.length; i++){
        console.log("splitting array ");
        console.log(`split array: ${wordArray[i]}`);
        }
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

    }

    //this works but not consistently 
    /*
    newGame(){
        //fetch new word and hint -- store it 
        //fetchWord(fetchWordURL);
        //enable all buttons
        
        
        fetchWordHint().then(function(){
            //console.log(guesses);
            $('.letter').removeAttr('disabled');
            //set up game lines 
            wordArray = word.split("");
        
            //set up letter slots
            
            for(let i = 0; i < wordArray.length; i++){
            console.log("splitting array ");
            console.log(`split array: ${wordArray[i]}`);
            }
            //make lines on HTML output word 
            for(let i = 0; i < wordArray.length; i++){
                wordSlotArray.push(`___ `);    
            }
            $wordSlotOutput.html(wordSlotArray);
            //set up all variables needed for word and hint
            //display hint 
            $('#hint-output').html(`Hint: ${hint}`); 
            //display guess output 
            updateGuessOutput(guesses);
            resetImage(); 
            }).catch(function(e){
            console.log(`error in newGame(): ${e}`);
            });
        
    }
    */
}
//start a new game 
const game = new Game(); 

$('#play-btn').click(function(){
    $('#start-pop-up').hide();

    //start a new game
    console.log("starting a new game");
    //fetchWordHint(); 
    game.newGame(); 
    //fetchWord(fetchWordURL);
    //put word into an array 

    /*
    wordArray = word.split(""); 
    for(let i = 0; i < wordArray.length; i++){
        console.log("splitting array ");
        console.log(`split array: ${wordArray[i]}`);
    }
    //make lines on HTML output word 
    for(let i = 0; i < wordArray.length; i++){
        wordSlotArray.push(`___ `);
        //$wordSlotOutput.append(`___ `);
    
    }
    $wordSlotOutput.html(wordSlotArray);
    //display hint
    $('#hint-output').html(`Hint: ${hint}`);
    //display output 
    updateGuessOutput(guesses);
*/

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
    //checkForWin(); 

    //disable letter button recently clicked 
    $(this).attr('disabled', 'disabled');

});
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