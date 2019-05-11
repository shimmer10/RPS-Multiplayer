/***********************************************
 * @author Jennifer Grace
 * UNHBootCamp
 * JavaScript file for Multiplayer Rock Paper Scissors
 ***********************************************/

// $(document).ready(function () {

// div variables
var gameArea = $("#game-area");
var playerOneWinDiv = $("#player-one-wins");
var playerTwoWinDiv = $("#player-two-wins");
var tiesDiv = $("#ties");
var playerOne;
var playerTwo;
var playerOneButton;
var playerTwoButton;
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
var playerOneWins = 0;
var playerTwoWins = 0;
var ties = 0;
var playerOneGuessed = false;
var playerTwoGuessed = false;
var playerOneGuess;
var playerTwoGuess;
var playerOneName;
var playerTwoName;
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

var database = firebase.database();

createButtons();
buildChatWindow();

$(document).on("click", "#player-one", function () {
    gameArea.empty();

    playerOneForm = $("<form>");
    playerOneFormDiv = $("<div>", { class: "form-group" });
    playerOneLabel = $("<label>", { text: "Player One Name: " });
    playerOneInput = $("<input>", { type: "text", class: "form-control", id: "player-one-name", placeholder: "Player One Name" });
    playerOneSubmit = $("<button>", { class: "btn btn-lg btn-primary player-one-btn", id: "player-one-submit", text: "Submit" });

    playerOneLabel.appendTo(playerOneFormDiv);
    playerOneInput.appendTo(playerOneFormDiv);
    playerOneFormDiv.appendTo(playerOneForm);
    playerOneSubmit.appendTo(playerOneForm);
    playerOneForm.appendTo(gameArea);

});

$(document).on("click", "#player-two", function () {
    gameArea.empty();

    playerTwoForm = $("<form>");
    playerTwoFormDiv = $("<div>", { class: "form-group" });
    playerTwoLabel = $("<label>", { text: "Player Two Name: " });
    playerTwoInput = $("<input>", { type: "text", class: "form-control", id: "player-two-name", placeholder: "Player Two Name" });
    playerTwoSubmit = $("<button>", { class: "btn btn-lg btn-primary player-two-btn", id: "player-two-submit", text: "Submit" });

    playerTwoLabel.appendTo(playerTwoFormDiv);
    playerTwoInput.appendTo(playerTwoFormDiv);
    playerTwoFormDiv.appendTo(playerTwoForm);
    playerTwoSubmit.appendTo(playerTwoForm);
    playerTwoForm.appendTo(gameArea);

});

$(document).on("click", "#player-one-submit", function (e) {
    e.preventDefault();

    playerOneguessed = true;

    playerOneName = $("#player-one-name").val();

    // set usernames into database
    database.ref().update({
        playerOneName
    });

    database.ref().on("value", function (snapshot) {
        if (snapshot.child("playerTwoName").exists()) {
            buildPlayerScreen("one", playerOneName);
        }
        else {
            gameArea.empty();
            var playerOneWaitDiv = $("<div>", { text: "Waiting for Player Two" })
            gameArea.append(playerOneWaitDiv);
        }
    });
});

$(document).on("click", "#player-two-submit", function (e) {
    e.preventDefault();
    playerTwoName = $("#player-two-name").val();
    // set usernames into database
    database.ref().update({
        playerTwoName,
    });

    database.ref().on("value", function (snapshot) {
        if (snapshot.child("playerOneName").exists()) {
            buildPlayerScreen("two", playerTwoName);
        }
        else {
            gameArea.empty();
            var playerTwoWaitDiv = $("<div>", { text: "Waiting for Player One" })
            gameArea.append(playerTwoWaitDiv);
        }
    });
});

// this will grab the player one choice
$(document).on("click", ".player-one-choice", function (e) {
    e.preventDefault();
    if (playerOneGuessed != true) {
        playerOneGuess = this.id;
        console.log("player one guess: " + playerOneGuess)
        playerOneGuessed = true;
        database.ref().update({
            playerOneGuess
        });
    }

    database.ref().on("value", function (snapshot) {
        if (snapshot.child("playerTwoGuess").exists()) {
            playerTwoGuess = snapshot.val().playerTwoGuess
            checkGuesses(playerOneGuess, playerTwoGuess);
        }
    });
});

// this will grab the player two choice
$(document).on("click", ".player-two-choice", function (e) {
    e.preventDefault();
    if (playerTwoGuessed != true) {
        playerTwoGuess = this.id;
        console.log("player two guess: " + playerTwoGuess)
        playerTwoGuessed = true;
        database.ref().update({
            playerTwoGuess
        });
    }
    database.ref().on("value", function (snapshot) {
        if (snapshot.child("playerOneGuess").exists()) {
            playerOneGuess = snapshot.val().playerOneGuess
            checkGuesses(playerOneGuess, playerTwoGuess);
        }
    });
});

$(document).on("click", "#reset-button", function (e) {
    e.preventDefault();

    database.ref().update({
        playerOneGuess: null,
        playerTwoGuess: null,
        playerOneWins: null,
        playerTwoWins: null,
        ties: null
    });

    createButtons();
});

function createButtons() {
    // clear out guesses each time
    database.ref().update({
        playerOneGuess: null,
        playerTwoGuess: null
    });

    playerOneButton = $("<button>", { class: "btn btn-lg btn-primary", id: "player-one", text: "Player One" });
    playerTwoButton = $("<button>", { class: "btn btn-lg btn-primary", id: "player-two", text: "Player Two" });

    playerOneButton.appendTo(gameArea);
    playerTwoButton.appendTo(gameArea);
};

function buildPlayerScreen(playerNumber, playerName) {
    $("#game-area").empty();

    if (playerNumber == "one") {

        playerOneDiv = $("<div>", { class: "col-sm-12" });
        playerOne = $("<h1>", { text: playerName });
        oneRock = $("<button>", { class: "btn btn-lg btn-primary player-one-choice", id: "rock", text: "ROCK" });
        onePaper = $("<button>", { class: "btn btn-lg btn-primary player-one-choice", id: "paper", text: "PAPER" });
        oneScissors = $("<button>", { class: "btn btn-lg btn-primary player-one-choice", id: "scissors", text: "SCISSORS" });
        oneGuess = $("<h1>", { class: "player-one-guess" });

        playerOneDiv.append(playerOne)
        playerOneDiv.append(oneRock)
        playerOneDiv.append(onePaper)
        playerOneDiv.append(oneScissors)
        playerOneDiv.append(oneGuess);

        gameArea.append(playerOneDiv)
    }
    else {
        playerTwoDiv = $("<div>", { class: "col-sm-12" });
        playerTwo = $("<h1>", { text: playerName });
        twoRock = $("<button>", { class: "btn btn-lg btn-primary player-two-choice", id: "rock", text: "ROCK" });
        twoPaper = $("<button>", { class: "btn btn-lg btn-primary player-two-choice", id: "paper", text: "PAPER" });
        twoScissors = $("<button>", { class: "btn btn-lg btn-primary player-two-choice", id: "scissors", text: "SCISSORS" });
        twoGuess = $("<h1>", { class: "player-one-guess" });

        playerTwoDiv.append(playerTwo)
        playerTwoDiv.append(twoRock)
        playerTwoDiv.append(twoPaper)
        playerTwoDiv.append(twoScissors)
        playerTwoDiv.append(twoGuess);

        gameArea.append(playerTwoDiv);
    }
}

function buildStats(playerOneName, playerTwoName) {
    database.ref().on("value", function (snapshot) {
        playerOneWins = snapshot.val().playerOneWins;
        playerTwoWins = snapshot.val().playerTwoWins;
        ties = snapshot.val().ties;
    });

    playerOneWinDiv.text(playerOneName + " Wins: " + playerOneWins);
    playerTwoWinDiv.text(playerTwoName + " Wins: " + playerTwoWins);

    tiesDiv.text("Ties: " + ties);
}

function buildChatWindow() {
    var chatWindowDiv = $("#chat-window")

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

$(document).on("click", "#submit", function () {
    var chat = $("#user-text").val();
    var newChat = $("<div>", { text: chat });
    $("#chat-area").append(newChat);
    $("#user-text").val("");
});


function checkGuesses(playerOneGuess, playerTwoGuess) {
    database.ref().on("value", function (snapshot) {
        playerOneName = snapshot.val().playerOneName;
        playerTwoName = snapshot.val().playerTwoName;
    });

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

    checkIfPlayerWon(playerOneName, playerTwoName)
}

function checkIfPlayerWon(playerOneName, playerTwoName) {
    database.ref().on("value", function (snapshot) {
        playerOneWins = snapshot.val().playerOneWins;
        playerTwoWins = snapshot.val().playerTwoWins;
    });
    buildStats(playerOneName, playerTwoName);

    if (playerOneWins == 5 || playerTwoWins == 5) {
        gameArea.empty;
        if (playerOneWins == 5) {
            var winnerIsOne = $("<h1>", { text: playerOneName + " won!" })
            gameArea.append(winnerIsOne);
        }
        else {
            var winnerIsTwo = $("<h1>", { text: playerTwoName + " won!" })
            gameArea.append(winnerIsTwo);
        }

        var resetButton = $("<button>", { class: "btn btn-lg btn-secondary", id: "reset-button", text: "Play Again" })
        gameArea.append(resetButton);

    }
}