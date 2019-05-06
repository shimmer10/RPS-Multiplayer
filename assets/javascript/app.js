/***********************************************
 * @author Jennifer Grace
 * UNHBootCamp
 * JavaScript file for Multiplayer Rock Paper Scissors
 ***********************************************/


// variables
var playerOneWins = 0;
var playerTwoWins = 0;
var ties = 0;
var playerOneGuess;
var playerTwoGuess;


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

database.ref().update({
    playerOneGuess: "",
    playerTwoGuess: ""
});

$("#player-one-wins").text("Player One Wins: " + playerOneWins);
$("#player-two-wins").text("Player Two Wins: " + playerTwoWins);
$("#ties").text("Ties: " + ties);

// this will grab the player one choice
$(".player-one-btn").on("click", function () {

    // determine guess
    playerOneGuess = this.id;

    database.ref().update({
        playerOneGuess
    });
    checkGuesses();
});

// this will grab the player two choice
$(".player-two-btn").on("click", function () {

    // determine guess
    playerTwoGuess = this.id;

    database.ref().update({
        playerTwoGuess
    });
    checkGuesses();
});

$("#submit").on("click", function () {
    var chat = $("#user-text").val();
    var newChat = $("<div>", { text: chat });
    $("#chat-area").append(newChat);
    $("#user-text").val("");
});

function checkGuesses() {
    database.ref().on("value", function (snapshot) {
        console.log(JSON.stringify(snapshot))

        if (snapshot.child("playerOneGuess").exists() && snapshot.child("playerTwoGuess").exists()) {
            console.log("in here");
            playerOneGuess = snapshot.val().playerOneGuess;
            playerTwoGuess = snapshot.val().playerTwoGuess;
    
            if ((playerOneGuess === "rock" && playerTwoGuess === "scissors") ||
                (playerOneGuess === "scissors" && playerTwoGuess === "paper") ||
                (playerOneGuess === "paper" && playerTwoGuess === "rock")) {
                playerOneWins++;
                console.log("player one won")
            } else if (playerOneGuess === playerTwoGuess) {
                ties++;
            } else {
                playerTwoWins++;
            }
            database.ref().update({
                playerOneGuess: "",
                playerTwoGuess: ""
            });
        }
    
        $("#player-one-guess").text(playerOneGuess);
        $("#player-two-guess").text(playerTwoGuess);
    
    
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}
