//define the variables for modals
const modalLogin = $("#modal-login");
const modalSignUp = $("#modal-signup");
const modalResetPwd = $("#modal-reset-pwd");
const modalInfo = $("#modal-info");
  
//when click the submit button of the sign up form, perform this fucntion
$("#signup-form").on("submit",function(event){
    event.preventDefault();

    //get user input information
    var email = $("#signup-email").val();
    var password =  $("#signup-password").val();

    //sign up the user
    auth.createUserWithEmailAndPassword(email,password).then( function(cred){        
    //when suceeds, close the sign up modal and empty the input    
        M.Modal.getInstance(modalSignUp).close();
        $("#signup-email").val("");
        $("#signup-password").val("");
    })
    //catach the errors and display it.
    .catch(function(error){
        var errorCode=error.code;
        var errorMsg=error.message;

        $(".signup-msg").text(errorMsg).css("color","red");
       
    })
})    

//when click logout , log out the user
$("#logout").on("click",function(event){
    event.preventDefault();
    
    auth.signOut().then(() => {
        console.log("user logged out");    
    })   
    .catch(function(error){        
        var errorMsg=error.message;
        console.log("User signed out error",errorMsg);
        
    })

})    

//When click the signup link, close the login modal
$("#signup").on("click",function(event){
   
    M.Modal.getInstance(modalLogin).close();
})

//when click the login link, close the sign up modal
$("#login").on("click",function(event){
    
    M.Modal.getInstance(modalSignUp).close();
})

//when click the submit button of the login form, do the sign in function
$("#login-form").on("submit",function(event){
    event.preventDefault();

    //get user input information
    var email = $("#login-email").val();
    var password =  $("#login-password").val();

    //sign up the user
    auth.signInWithEmailAndPassword(email,password).then( function(cred){
       //when login  succeeds, close the login modal and empty input        
        M.Modal.getInstance(modalLogin).close();
        $("#login-email").val("");
        $("#login-password").val("");
    })
    //catch the error and display it
    .catch(function(error){        
        var errorMsg=error.message;
        $(".login-msg").text(errorMsg).css("color","red");
        
    })
}) 

//when user's state changed, switch the login/logout/signup link and search area
auth.onAuthStateChanged(user =>{
   //when user is logged in, don't show login/signup links. Show the search area
    if(user){
        userFlg=true;
     
        $(".searchBox").show();
        $(".logged-out").hide();
        $(".logged-in").show();
        $(".results-area").show();
    }else{
        //when user isn't logged in, don't show the search area and only shows the login/sign up links
        userFlg=false;
       
        $(".searchBox").hide();
        $(".results-area").hide();
        $(".logged-in").hide();
        $(".logged-out").show();
        
    }
})

//when user click forgot password link, close the login modal. and the reset password modal will be fired by the modal-trigger 
$("#forgotPwd").on("click",function(){

    M.Modal.getInstance(modalLogin).close();
    $("#reset-email").val("");
})

//when the submit button of the reset password modal is clicked, perform send reset password link to email provided
$("#modal-reset-pwd").on("submit",function(event){

    event.preventDefault();
    $(".reset-pwd-msg").text("");
    //get user input email
    var email = $("#reset-email").val();    

    //send reset link to email input
    firebase.auth().sendPasswordResetEmail(email)
    .then( function(){        
        //when resend email succeeds, close reset password modal and open information modal
        M.Modal.getInstance(modalResetPwd).close();
        M.Modal.getInstance(modalInfo).open();
        $(".display-info").text("Password reset email sent. Please check your mailbox!")
        $("#reset-email").val("");
        
    })
    //catch the error
    .catch(function(error){       
       
        var errorMsg=error.message;
        $(".reset-pwd-msg").text(errorMsg).css("color","red");
        
    })

 })

