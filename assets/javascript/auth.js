// //  App's Firebase configuration
//     var firebaseConfig = {
//        apiKey: "AIzaSyB3CyftB9QKqJ8XPtk7uc0jkXfqM_JegXI",
//        authDomain: "love-your-car.firebaseapp.com",
//        databaseURL: "https://love-your-car.firebaseio.com",
//        projectId: "love-your-car",
//        storageBucket: "",
//        messagingSenderId: "891854078602",
//        appId: "1:891854078602:web:58b10fab3abb5f11"
//      };
//      // Initialize Firebase
//     firebase.initializeApp(firebaseConfig);
// const database=firebase.database();
// const auth=firebase.auth();
// const db=firebase.firestore();


$("#signup-form").on("submit",function(event){
    event.preventDefault();

    //get user input information
    var email = $("#signup-email").val();
    var password =  $("#signup-password").val();

    //sign up the user
    auth.createUserWithEmailAndPassword(email,password).then( function(cred){
        console.log("cred",cred);
        const modal = $("#modal-signup");
        M.Modal.getInstance(modal).close();
        $("#signup-email").val("");
        $("#signup-password").val("");
    })
    .catch(function(error){
        var errorCode=error.code;
        var errorMsg=error.message;

        $(".signup-msg").text(errorMsg).css("color","red");
        console.log(errorCode+ "Error Message:"+errorMsg);
    })
})    

$("#logout").on("click",function(event){
    event.preventDefault();
    
    auth.signOut().then(() => {
        console.log("user logged out");
    })   

})    


$("#login-form").on("submit",function(event){
    event.preventDefault();

    //get user input information
    var email = $("#login-email").val();
    var password =  $("#login-password").val();

    //sign up the user
    auth.signInWithEmailAndPassword(email,password).then( function(cred){
        console.log("cred",cred);
        const modal = $("#modal-login");
        M.Modal.getInstance(modal).close();
        $("#login-email").val("");
        $("#login-password").val("");
    })
    .catch(function(error){
        var errorCode=error.code;
        var errorMsg=error.message;
        $(".login-msg").text(errorMsg).css("color","red");
        console.log(errorCode+ " Error Message:"+errorMsg);
    })
}) 


auth.onAuthStateChanged(user =>{
    console.log("user,", user);

    if(user){
        userFlg=true;
        console.log("user logged in");
        $(".searchBox").show();
        $(".logged-out").hide();
        $(".logged-in").show();

    }else{
        userFlg=false;
        console.log("user logged out on state change");
        $(".searchBox").hide();
        $(".logged-in").hide();
        $(".logged-out").show();
        
    }
})