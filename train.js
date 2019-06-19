// select all inputs make var 
var firebaseConfig = {
    apiKey: "AIzaSyBKoOHAha30iJ6EuzVfIMSMkKr-TiuWBc0",
    authDomain: "traing-2147c.firebaseapp.com",
    databaseURL: "https://traing-2147c.firebaseio.com",
    projectId: "traing-2147c",
    storageBucket: "",
    messagingSenderId: "346591542335",
    appId: "1:346591542335:web:df3e04a774001387"
  };

// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://traing-2147c.firebaseio.com"
// });


firebase.intializeApp(config);

var database = firebase.database();
var trainName = $("#trainName");
var destination = $("#destination");
var firstTime = $("#firstTime");
var frequency =  $("#frequency");
var frequency = 0;
var nextArrival = 0;
var minutesAway = 0;
var currentTime = moment().format("LT");

$("#submit").on("click", function(){
    event.preventDefault();

    trainName = $("#train-input").val().trim();
    destination = $("#dest-input").val().trim();
    firstTime = moment($("#ft-input").val().trim(),
    "hh:mm").format("LT");
    frequency = parseInt($("#frequency-input").val().trim());

    if ((!trainName) || (!destination) || (!firstTrainTime) || (!frequency)) {
        alert(`All submission fields must be populated.`);
    } else {
        alert("Thanks for your submission!");    
        database.ref("/trains").push({
            trainName : trainName,
            destination : destination,
            firstTrainTime : firstTrainTime,
            frequency : frequency
        });

    $("#train-input").val("");
    $("#dest-input").val("");
    $("#ft-input").val("");
    $("#frequency-input").val("");
    }

});

database.ref("/train").on("child-added", function(snapshot){
    var sv = snapshot.val();

    var firstTime = parseFloat(moment().diff(moment(sv.firsyTrainTime, "LT"), "minutes"));
    console.log("minut diffrential: " = timeDiff);

    if (timeDiff < 0) {
        nextArrival = sv.firstTrainTime;
        minutesAway = Math.abs(timeDiff);
    } else if (timeDiff > 0) {
        minutesAway = sv.frequency - (timeDiff % sv.frequency);
        nextArrival = moment().add(minutesAway, "minutes").format("LT");
    };

    var newRow = $("<tr>").append(
        $("<td>").text(sv.trainName),
        $("<td>").text(sv.destination),
        $("<td>").text(sv.frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway)
    );

    $("#train-table-body").append(newRow);


});



