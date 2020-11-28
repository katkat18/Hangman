/* Project: Hangman js file by Katrina Jamir */ 

//retrieve elements

//other variables:
let word = "";
let hint = "";
let letter = "";
const guessLimit = 6;
const game = "";

//generating random words and hints (definitions) using Wordnik API
const apiKey = '1iq9ncc7hnq0r1io7gzrevu7wkfr7si0c2uwh9tetrtelhn2d';
const fetchWordURL = `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=${apiKey}`;
const fetchHintURL = `https://api.wordnik.com/v4/word.json/${currWord}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`;


//objects
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

//start a new game 

$('#play-btn').click(function(){
    $('#start-pop-up').css('display', 'none');

    //start a new game
    fetchWord(fetchWordURL);

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
            fetchHint(`https://api.wordnik.com/v4/word.json/${currWord}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`);
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
            console.log(`hint data: ${data[0].text}`);
            hint = data[0].text; 
        })
        .catch(function(err){
            console.log(`error fetchHint: ${err}`)
        });
}
