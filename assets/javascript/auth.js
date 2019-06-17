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
const modalLogin = $("#modal-login");
const modalSignUp = $("#modal-signup");
const modalResetPwd = $("#modal-reset-pwd");
const modalInfo = $("#modal-info");
//for email link 
// var actionCodeSettings = {
//     url: 'https://www.example.com/?email=user@example.com',
//     // iOS: {
//     //   bundleId: 'com.example.ios'
//     // },
//     // android: {
//     //   packageName: 'com.example.android',
//     //   installApp: true,
//     //   minimumVersion: '12'
//     // },
//     handleCodeInApp: true
//   };
  

$("#signup-form").on("submit",function(event){
    event.preventDefault();

    //get user input information
    var email = $("#signup-email").val();
    var password =  $("#signup-password").val();

    //sign up the user
    auth.createUserWithEmailAndPassword(email,password).then( function(cred){        
        
        M.Modal.getInstance(modalSignUp).close();
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

$("#signup").on("click",function(event){
    // event.preventDefault();
    M.Modal.getInstance(modalLogin).close();
})

$("#login").on("click",function(event){
    // event.preventDefault();
    M.Modal.getInstance(modalSignUp).close();
})


$("#login-form").on("submit",function(event){
    event.preventDefault();

    //get user input information
    var email = $("#login-email").val();
    var password =  $("#login-password").val();

    //sign up the user
    auth.signInWithEmailAndPassword(email,password).then( function(cred){
        
        // modalLogin = $("#modal-login");
        M.Modal.getInstance(modalLogin).close();
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

$("#forgotPwd").on("click",function(){

    M.Modal.getInstance(modalLogin).close();
    $("#reset-email").val("");
})

$("#modal-reset-pwd").on("submit",function(event){

    event.preventDefault();
    $(".reset-pwd-msg").text("");
    //get user input email
    var email = $("#reset-email").val();    

    firebase.auth().sendPasswordResetEmail(email)
    .then( function(){
        
        console.log("before close modal reset");
        M.Modal.getInstance(modalResetPwd).close();
        M.Modal.getInstance(modalInfo).open();
        $(".display-info").text("Password reset email sent. Please check your mailbox!")
        $("#reset-email").val("");
        
    })
    .catch(function(error){
        console.log("error code resend email",error.code);
        console.log("error msg",error.message);
        // var errorCode=error.code;
        var errorMsg=error.message;
        $(".reset-pwd-msg").text(errorMsg).css("color","red");
        
    })

 })

