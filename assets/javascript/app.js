/***********************************************
 * @author Jennifer Grace
 * UNHBootCamp
 * JavaScript file for Multiplayer Rock Paper Scissors
 ***********************************************/

// div variables
var gameArea = $("#game-area");
var playerOneWinDiv = $("#player-one-wins");
var playerTwoWinDiv = $("#player-two-wins");
var tiesDiv = $("#ties");
var chatWindowDiv = $("#chat-window")
var playerOne;
var playerTwo;
var playerOneDiv;
var playerTwoDiv;
var oneRock;
var onePaper;
var oneScissors;
var twoRock;
var twoPaper;
var twoScissors;
var oneGuess;
var twoGuess;
var chatHeader;
var chatAreaDiv;
var textAreaDiv; 
var chatButton;


// variables
var playerOneWins;
var playerTwoWins;
var ties;
var playerOneGuess;
var playerTwoGuess;
var playerOneName;
var playerTwoName;
var playerOneGuessed = false;
var playerTwoGuessed = false;
var roundWinner;


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCR9ZumekMa6rkV37-t99iAfa4UbSpUook",
    authDomain: "unhbootcamptest-75d00.firebaseapp.com",
    databaseURL: "https://unhbootcamptest-75d00.firebaseio.com",
    projectId: "unhbootcamptest-75d00",
    storageBucket: "unhbootcamptest-75d00.appspot.com",
    messagingSenderId: "221694385288"
};

firebase.initializeApp(config);

// Create a variable to reference the database

var database = firebase.database();

// clear out guesses each time
database.ref().update({
    playerOneGuess: null,
    playerTwoGuess: null
});

database.ref().on("value", function (snapshot) {

    if (snapshot.child("playerOneWins").exists()){
        playerOneWins = snapshot.val().playerOneWins;
    }
    else {
        playerOneWins = 0;
    }

    if (snapshot.child("playerTwoWins").exists()){
        playerTwoWins = snapshot.val().playerOneWins;
    }
    else {
        playerTwoWins = 0;
    }

    if (snapshot.child("ties").exists()){
        ties = snapshot.val().ties;
    }
    else {
        ties = 0;
    }

    if (snapshot.child("playerOneName").exists() && snapshot.child("playerTwoName").exists()) {
        playerOneName = snapshot.val().playerOneName;
        playerTwoName = snapshot.val().playerTwoName;

        startGame();
    }
    else {
        // submitting user names and starting game
        $("#submit-name").on("click", function (e) {
            e.preventDefault();

            playerOneName = $("#player-one-name").val();
            playerTwoName = $("#player-two-name").val();

            // set usernames into database
            database.ref().set({
                playerOneName,
                playerTwoName
            });

            startGame();
        });
    }
});

// setup player names and buttons
function startGame() {
    gameArea.empty();

    playerOneWinDiv.text(playerOneName + " Wins: " + playerOneWins);
    playerTwoWinDiv.text(playerTwoName + " Wins: " + playerTwoWins);
    tiesDiv.text("Ties: " + ties);

    playerOneDiv = $("<div>", { class: "col-sm-12" });
    playerOne = $("<h1>", { text: playerOneName });
    oneRock = $("<button>", { class: "btn btn-lg btn-primary player-one-btn", id: "rock", text: "ROCK" });
    onePaper = $("<button>", { class: "btn btn-lg btn-primary player-one-btn", id: "paper", text: "PAPER" });
    oneScissors = $("<button>", { class: "btn btn-lg btn-primary player-one-btn", id: "scissors", text: "SCISSORS" });
    oneGuess = $("<h1>", { class: "player-one-guess" });

    playerOneDiv.append(playerOne)
    playerOneDiv.append(oneRock)
    playerOneDiv.append(onePaper)
    playerOneDiv.append(oneScissors)
    playerOneDiv.append(oneGuess);

    playerTwoDiv = $("<div>", { class: "col-sm-12" });
    playerTwo = $("<h1>", { text: playerTwoName });
    twoRock = $("<button>", { class: "btn btn-lg btn-primary player-two-btn", id: "rock", text: "ROCK" });
    twoPaper = $("<button>", { class: "btn btn-lg btn-primary player-two-btn", id: "paper", text: "PAPER" });
    twoScissors = $("<button>", { class: "btn btn-lg btn-primary player-two-btn", id: "scissors", text: "SCISSORS" });
    twoGuess = $("<h1>", { class: "player-one-guess" });

    playerTwoDiv.append(playerTwo)
    playerTwoDiv.append(twoRock)
    playerTwoDiv.append(twoPaper)
    playerTwoDiv.append(twoScissors)
    playerTwoDiv.append(twoGuess);

    gameArea.append(playerOneDiv)
    gameArea.append(playerTwoDiv);

    chatHeader = $("<h1>", { text: "Chat Window" });
    chatAreaDiv = $("<div>", { id: "chat-area" });
    textAreaDiv = $("<textarea>")
    .addClass("form-control")
    .attr("id", "user-text");
    chatButton = $("<button>", { class: "btn btn-lg btn-primary", id: "submit", text: "Submit" });

    chatWindowDiv.append(chatHeader);
    chatWindowDiv.append(chatAreaDiv);
    chatWindowDiv.append(textAreaDiv);
    chatWindowDiv.append(chatButton);
}

// this will grab the player one choice
$(document).on("click", ".player-one-btn", function () {
    if (!playerOneGuessed) {
        // determine guess
        playerOneGuess = this.id;
        playerOneGuessed = true;

        if (playerTwoGuessed) {
            checkGuesses(playerOneGuess, playerTwoGuess);
        }
    }
});

// this will grab the player two choice
$(document).on("click", ".player-two-btn", function () {
    if (!playerTwoGuessed) {
        // determine guess
        playerTwoGuess = this.id;
        playerTwoGuessed = true;

        if (playerOneGuessed) {
            checkGuesses(playerOneGuess, playerTwoGuess);
        }
    }
});

$(document).on("click", "#submit", function () {
    var chat = $("#user-text").val();
    var newChat = $("<div>", { text: chat });
    $("#chat-area").append(newChat);
    $("#user-text").val("");
});

function checkGuesses(playerOneGuess, playerTwoGuess) {

    if ((playerOneGuess === "rock" && playerTwoGuess === "scissors") ||
        (playerOneGuess === "scissors" && playerTwoGuess === "paper") ||
        (playerOneGuess === "paper" && playerTwoGuess === "rock")) {
        playerOneWins++;
        roundWinner = playerOneName;
    } else if (playerOneGuess === playerTwoGuess) {
        ties++;
        roundWinner = "Neither of you "
    } else {
        playerTwoWins++;
        roundWinner = playerTwoName;
    }
    database.ref().update({
        playerOneGuess: null,
        playerTwoGuess: null,
        playerOneWins,
        playerTwoWins,
        ties
    });

    playerOneGuessed = false;
    playerTwoGuessed = false;

    $("#player-one-guess").text(playerOneName + " guessed " + playerOneGuess);
    $("#player-two-guess").text(playerTwoName + " guessed " + playerTwoGuess);
    $("#round-winner").text(roundWinner + " won!")

}

