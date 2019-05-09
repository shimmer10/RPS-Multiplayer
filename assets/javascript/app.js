/***********************************************
 * @author Jennifer Grace
 * UNHBootCamp
 * JavaScript file for Multiplayer Rock Paper Scissors
 ***********************************************/

$(document).ready(function () {

    // div variables
    var gameArea = $("#game-area");
    var playerOneWinDiv = $("#player-one-wins");
    var playerTwoWinDiv = $("#player-two-wins");
    var tiesDiv = $("#ties");
    var chatWindowDiv = $("#chat-window")
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

    var database = firebase.database();

    startGame();

    $("#player-one").on("click", function () {
        gameArea.empty();

        var playerOneForm = $("<form>");
        var playerOneFormDiv = $("<div>", { class: "form-group" });
        var playerOneLabel = $("<label>", { text: "Player One Name: " });
        var playerOneInput = $("<input>", { type: "text", class: "form-control", id: "player-one-name", placeholder: "Player One Name" });
        var playerOneSubmit = $("<button>", { class: "btn btn-lg btn-primary player-one-btn", id: "player-one-submit", text: "Submit" });

        playerOneLabel.appendTo(playerOneFormDiv);
        playerOneInput.appendTo(playerOneFormDiv);
        playerOneFormDiv.appendTo(playerOneForm);
        playerOneSubmit.appendTo(playerOneForm);
        playerOneForm.appendTo(gameArea);

    });

    $("#player-two").on("click", function () {
        gameArea.empty();

        var playerTwoForm = $("<form>");
        var playerTwoFormDiv = $("<div>", { class: "form-group" });
        var playerTwoLabel = $("<label>", { text: "Player Two Name: " });
        var playerTwoInput = $("<input>", { type: "text", class: "form-control", id: "player-two-name", placeholder: "Player Two Name" });
        var playerTwoSubmit = $("<button>", { class: "btn btn-lg btn-primary player-two-btn", id: "player-two-submit", text: "Submit" });

        playerTwoLabel.appendTo(playerTwoFormDiv);
        playerTwoInput.appendTo(playerTwoFormDiv);
        playerTwoFormDiv.appendTo(playerTwoForm);
        playerTwoSubmit.appendTo(playerTwoForm);
        playerTwoForm.appendTo(gameArea);

    });

    $(document).on("click", "#player-one-submit", function (e) {
        e.preventDefault();

        playerOneName = $("#player-one-name").val();

        // set usernames into database
        database.ref().set({
            playerOneName,
        });
        buildPlayerScreen("one", playerOneName);
    });

    $(document).on("click", "#player-two-submit", function (e) {
        e.preventDefault();
        playerTwoName = $("#player-two-name").val();
        // set usernames into database
        database.ref().set({
            playerTwoName,
        });

        buildPlayerScreen("two", playerTwoName);
    });

    // this will grab the player one choice
    $(document).on("click", ".player-one-choice", function () {
        playerOneGuess = this.id;
        database.ref().on("value", function (snapshot) {
            if (!snapshot.child("playerOneGuess").exists()) {
                // determine guess
                console.log("Player one guess: " + playerOneGuess)
                database.ref().update({
                    playerOneGuess
                });
                if (snapshot.child("playerTwoGuess").exists()) {
                    checkGuesses(playerOneGuess, playerTwoGuess);
                }
            }
        });
    });

    // this will grab the player two choice
    $(document).on("click", ".player-two-choice", function () {
        playerTwoGuess = this.id;
        database.ref().on("value", function (snapshot) {
            if (!snapshot.child("playerTwoGuess").exists()) {
                // determine guess
                console.log("Player two guess: " + playerTwoGuess)
                database.ref().update({
                    playerTwoGuess
                });
                if (snapshot.child("playerOneGuess").exists()) {
                    checkGuesses(playerOneGuess, playerTwoGuess);
                }
            }
        });
    });

    function startGame() {
        // clear out guesses each time
        database.ref().update({
            // playerOneGuess: null,
            playerTwoGuess: null
        });

        playerOneButton = $("<button>", { class: "btn btn-lg btn-primary", id: "player-one", text: "Player One" });
        playerTwoButton = $("<button>", { class: "btn btn-lg btn-primary", id: "player-two", text: "Player Two" });

        playerOneButton.appendTo(gameArea);
        playerTwoButton.appendTo(gameArea);
    };

    function buildPlayerScreen(playerNumber, playerName) {
        gameArea.empty();

        buildStats(playerName);

        if (playerNumber == "one") {

            playerOneDiv = $("<div>", { class: "col-sm-12" });
            playerOne = $("<h1>", { text: playerOneName });
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
            playerTwo = $("<h1>", { text: playerTwoName });
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

        buildChatWindow();

    }

    function buildStats(playerName) {
        database.ref().on("value", function (snapshot) {

            if (snapshot.child("playerOneName").exists()){
                console.log("in here");
                playerOneWinDiv.text(playerName + " Wins: " + playerTwoWins);
            }
            else {
                playerOneWinDiv.text("Waiting on Player One");
            }
            if (snapshot.child("playerTwoName").exists()){
                playerTwoWinDiv.text(playerName + " Wins: " + playerTwoWins);
            }
            else {
                playerTwoWinDiv.text("Waiting on Player Two");
            }
            tiesDiv.text("Ties: " + ties);
        });
    }

    function buildChatWindow() {
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
});

// // Create a variable to reference the database

// database.ref().on("value", function (snapshot) {

//     if (snapshot.child("playerOneWins").exists()) {
//         playerOneWins = snapshot.val().playerOneWins;
//     }
//     else {
//         playerOneWins = 0;
//     }

//     if (snapshot.child("playerTwoWins").exists()) {
//         playerTwoWins = snapshot.val().playerOneWins;
//     }
//     else {
//         playerTwoWins = 0;
//     }

//     if (snapshot.child("ties").exists()) {
//         ties = snapshot.val().ties;
//     }
//     else {
//         ties = 0;
//     }

//     if (snapshot.child("playerOneName").exists() && snapshot.child("playerTwoName").exists()) {
//         playerOneName = snapshot.val().playerOneName;
//         playerTwoName = snapshot.val().playerTwoName;

//         console.log("in if");
//         startGame();
//     }
//     else {
//         console.log("in else");
//         // submitting user names and starting game
//         $("#submit-name").on("click", function (e) {


//             startGame();
//         });
//     }
// });




// $(document).on("click", "#submit", function () {
//     var chat = $("#user-text").val();
//     var newChat = $("<div>", { text: chat });
//     $("#chat-area").append(newChat);
//     $("#user-text").val("");
// });
