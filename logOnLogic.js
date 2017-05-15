
$(document).ready(function() {
  console.log("JS ready!");
//***********************************************FIREBASE CONFIG***********************************************************
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDQeAXWZpnytGGVtlyNngDlMoAf-PRiCKk",
    authDomain: "userlogs-a1164.firebaseapp.com",
    databaseURL: "https://userlogs-a1164.firebaseio.com",
    projectId: "userlogs-a1164",
    storageBucket: "userlogs-a1164.appspot.com",
    messagingSenderId: "621543108481",
}
firebase.initializeApp(config);
	var database = firebase.database();
//****************************************CREATE NEW USER FUNCTIONALITY****************************************************
	var loggedIn = false;
//on click function for submit new user button
$("#newUserSubmit").on("click", function(){
//logs the user's inputed email in the gmail variable
	var email = $("#newUserGmailInput").val().trim();
//checks to make sure the user has entered an email that ends with @gmail.com   
	var log = email.endsWith("@gmail.com");
	var password = $("#newUserPasswordInput").val().trim();
//if true, adds the gmail to the database and the created password
if (log == true) {
    if (password.length >= 7){
    	console.log("new user created!");
 		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  		console.log("create user error");
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + errorMessage);
        console.log(email);
            database.ref().push({
            username:email,
            });
        });
    }//end of password length if funciton
    //MODAL CALLS
    	else{
    		$("#errorModal").modal("toggle");
    	}

}//end of gmail check if function
	//MODAL CALLS
    else{
    	$("#errorModal").modal("toggle");
    }  
    	//empty the divs 
$("#newUserPasswordInput").empty();
$("#newUserGmailInput").empty();
        
});//end of new user function

//****************************************RETURNING USER LOGIN FUNCTIONALITY*****************************************
//on click function
$("#userSubmit").on("click", function(){
    event.preventDefault();
    console.log("clicks working for login"); 
    //store password and email
     var logPassword = $("#userPasswordInput").val().trim();
     var logEmail = $("#userGmailInput").val().trim();
//pass password and email to signin function
    firebase.auth().signInWithEmailAndPassword(logEmail, logPassword).catch(function(error){
        console.log("login error");
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage + errorCode);
    });
console.log("logged in? " + loggedIn);
console.log(uEmail);
});//end of new user function
//******************************************SIGN OUT FUNCTION*********************************************************
//NEED TO CREATE A SIGNOUT PAGE ----create signout button on the other pages calling this function
$("#signOutButton").on("click", function(){
	firebase.auth().signOut().then(function() {
  	// Sign-out successful.
  	console.log("logged out");

  	var loggedIn = false;
	}).catch(function(error) {
  	// An error happened.
	});
});	

//***********************************EVENT LISTENER TO SEE IF USER IS LOGGED IN*************************************
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	//event listener, initiallized in next function - ignore this
  	console.log(uEmail + " auth state changed");
  } else {
  }

//GETS THE CURRENT USER FROM FIREBASE AND REPORTS LOGGED IN STATUS
var user = firebase.auth().currentUser;
if (user != null) {
  var uEmail = user.email;
  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
console.log(user.email); 
loggedIn = true;                  
}
else{
	console.log("no one is signed in");
loggedIn = false;
}
console.log("logged in Boolean? " + loggedIn);
});

// *********************************************CODE FOR NEXT PAGES HERE*******************************************
// ************************************************V**V**V**V**V**V**V********************************************


//USE THE loggedIn BOOLEAN VARRIABLE TO CHANGE HTML TO HOME PAGE
//the variable user is set to the current user object - use that for logging aditional information - pictures etc. 
//syntax is firebase.auth().currentUser.**whatever**
//the current user is also saved in the user variable, user.**whatever** will also suffice

// if (loggedIn == true) {
// 	$("#page-top").html(**all other html here**)
// }
//http://stackoverflow.com/questions/17148357/including-external-html-file-to-another-html-file

});