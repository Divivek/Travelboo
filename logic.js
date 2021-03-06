
var logEmail = "";  // Go
var clickedPic = "";

$(document).ready(function() {
  console.log("JS ready!");
  //Hide the other pages
  $("#travel-Book").hide();
  //$("#chiragsPage").hide();
  var pagenumber = 0;

//***********************************************FIREBASE CONFIG***********************************************************
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDLxSfYR3vHIz2dUq1W2OGEbWYo8nAXrgA",
    authDomain: "travelprojecttwo.firebaseapp.com",
    databaseURL: "https://travelprojecttwo.firebaseio.com",
    projectId: "travelprojecttwo",
    storageBucket: "travelprojecttwo.appspot.com",
    messagingSenderId: "743588198275"
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
     logEmail = $("#userGmailInput").val().trim();
//pass password and email to signin function
    firebase.auth().signInWithEmailAndPassword(logEmail, logPassword).catch(function(error){
        console.log("login error");
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage + errorCode);
    });
console.log("logged in? " + loggedIn);
// console.log(uEmail);
});//end of new user function
//******************************************SIGN OUT FUNCTION*********************************************************
//NEED TO CREATE A SIGNOUT PAGE ----create signout button on the other pages calling this function
$(".signOutButton").on("click", function(){
	firebase.auth().signOut().then(function() {
  	// Sign-out successful.
  	console.log("logged out");
    $("#playArea").empty();
  	 loggedIn = false;
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
loadUserData();  // Now call Firebase database to load images for logged in user
 $("#LogOnPage").hide();
 $("#travel-Book").show();  
 $("#trip-details").hide();        
}
else{
	console.log("no one is signed in");
loggedIn = false;
   $("#travel-Book").hide();
   $("#LogOnPage").show();
   $("#trip-details").hide();
}
console.log("logged in Boolean? " + loggedIn);
});

// *********************************************CODE FOR NEXT PAGES HERE*******************************************
// ************************************************V**V**V**V**V**V**V********************************************

//////////////////////////////////////DIVYAS JAVASCRIPT//////////////////////////////////////////////////////////
var defaultStorage = firebase.storage();   // var to access firebase storage API
var storageRef = defaultStorage.ref();    // create a ref to the storage to perform API function
var place = "";
var localImageUrl = "";
var commentdata = "";
var debug = true;

function logwrite(message){
  if (debug) { console.log(message); }
}

// adding a listener to the file upload button to start uploading files selected
fileUploadButton.addEventListener('change', handleFileSelect, false); // Execute handleFileSelect functoin when button is clicked 
// blow function handle uploading the files to the firebase storage
function handleFileSelect(e) {
    var file = e.target.files[0];   //  extract the file handle
    var metadata = {  contentType: 'image/jpeg'}; // Create the file metadata
    var uploadTask = storageRef.child('images/' + file.name  ).put(file, metadata);   // Upload file and metadata to the object 'image'
 // Listen for state changes, errors, and completion of the upload.
    
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        logwrite('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            logwrite('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            logwrite('Upload is running');
            break;
        } // End of Switch 
     
    }, function(error) {
        // A full list of error codes is available at  https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            logwrite('Upload error: ' +  error.code); // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            logwrite('Upload error: ' +  error.code); // User canceled the upload
            break;
            // ... and more error can be added here  
          case 'storage/unknown':
            logwrite('Upload error: ' +  error.code); // Unknown error occurred, inspect error.serverResponse
            break;
        }
    }, function() {
      // Upload completed successfully, now we can get the download URL
      localImageUrl = uploadTask.snapshot.downloadURL;
      database.ref().push({  // save newly generated Image URL and logged in user Email in the same record 
        userId : logEmail,
        imageUrl: localImageUrl,
      });   // End of Push  
     }); // End on uploadtast.on  
 }; // end of handleFileSelect

$(document).on("click", ".userCommentsButton", function(event) {
      logwrite("new comments added");
      event.preventDefault(); // Prevent extra clicks 
      var newComments = this.parentNode.childNodes[1].childNodes[1].value; //button.div.form.textarea.value
      ldbKey = $(this).attr("dbKey");   // Extraxct the DB record key 
      logwrite(newComments);
      logwrite(ldbKey);
      database.ref(ldbKey).update({
      comment: newComments,
      });
});


function loadUserData() {
    database.ref().on("child_added", function(childSnapshot, prevChildKey){
        var localUser = childSnapshot.val().userId;
        if (localUser == logEmail ) {
            var dbRefKey = childSnapshot.key;
            // use above key as property of button so that we can get to it at time of update
            var column = $('<div class="col-sm-3 col-md-">');
            localImageUrl = childSnapshot.val().imageUrl;

            var photoImage = $("<img >");
            photoImage.addClass("pictures");
            photoImage.attr("src", localImageUrl);
            commentData = childSnapshot.val().comment;
            var submitButton = $("<button>");
            submitButton.addClass("userCommentsButton");
            submitButton.attr("dbKey", dbRefKey);
            var commentForm = $('<form class="form-group"><label for="comment"></label><textarea class="form-control" rows="5" id="comment">' + commentData + '</textarea> </form>')
            $("#commentBox").append(commentData);
            column.append(photoImage);
            column.append(commentForm);
            column.append(submitButton);
            $("#playArea").append(column);
            $(".userCommentsButton").text("+ comment");
            photoImage.click(pictureClick);
        } // END IF of USER ID 
     }, function(errorObject){
       logwrite(errorObject.code);
     });
    };

function pictureClick(){
   logwrite("hidden");
   logwrite("next page shown");
   $("#travel-Book").hide();
   $("#trip-details").show();
 //  logwrite("clickPic");
   clickedPic = $(this).attr("src");
 //  logwrite(clickedPic);
   drawMap();
 }

   $("#back").on("click",function(){
   $("#travel-Book").show();
   $("#trip-details").hide();
});

});

////////////////////////////////////////////END OF DIVYAS JAVASCRIPT/////////////////////////////////


////////////////////////////////////////////CHIRAGS JAVASCRIPT/////////////////////////////////////////
var googleAPIKey="AIzaSyDNoZFYABiy-Dagp1LvMG9KbsOH0yleoXI";

var demoPic="https://firebasestorage.googleapis.com/v0/b/travelprojecttwo.appspot.com/o/images%2Fus-quarter-front.jpg?alt=media&token=0b44d41c-4cd1-41ef-bcfc-5b4bea0e9f39";

var locations = []; 
var locationCoordinates = [];
var tempLocs = [];
var map;

function initMap() {
//initalize map to Rutgers Coding Bootcamp

    var location = {
      lat: 40.535434,
      lng: -74.5234757
    }

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: location,
     mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // var marker = new google.maps.Marker({
    //   position: location,
    //   map: map
    // });

   // drawMap(); 
  }

function updateMap(lat, long, zoom) {

      var location = {
      lat: lat,
      lng: long
    }

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: zoom,
      center: location
    });
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });

}

$("#submit").click(function(){
  event.preventDefault();
  
  var location = $("#location").val().trim();
    $("#location").val("");

  var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
   + location + "&key=" + googleAPIKey;

  // console.log("location", location, "queryURL", queryURL);

   $.ajax({url: queryURL, method: "GET"})
    .done(function(response){

        //console.log(response);
        locations.push(location)
        tempLocs.push({
          name: location,
          latitude: response.results[0].geometry.location.lat,
          longitude: response.results[0].geometry.location.lng
        });
       // updateMap( response.results[0].geometry.location.lat, response.results[0].geometry.location.lng , 7);
      drawMap();
    })

});


function drawMap(){
  // for(var i=0; i<tempLocs.length; i++) {
  //   // getLongitudeAndLatitude(locations[i]);

    
  //   console.log(tempLocs[i]);
  // }
  getLocations();
 // console.log("clickedPic", clickedPic);

   var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < tempLocs.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(tempLocs[i].latitude, tempLocs[i].longitude),
        map: map,
        zoom: 5
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }

}

function getLongitudeAndLatitude(place){

  var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
   + place + "&key=" + googleAPIKey;

  // console.log("location", location, "queryURL", queryURL);

   $.ajax({url: queryURL, method: "GET"})
    .done(function(response){

        //console.log(response);
        var loc = {location: place, latitude: response.results[0].geometry.location.lat, longitude: response.results[0].geometry.location.lng};
        locationCoordinates.push(loc);
        $("#locations").append("<p>"+loc.location +", " + loc.latitude +", " + loc.longitude +"</p>");
        // return loc;

    })

}

function backClick(){
   // logwrite("hidden");
   // logwrite("next page shown");
   $("#travel-Book").show();
   $("#trip-details").hide();
 }
   $("#back").on("click",function(){
   $("#travel-Book").hide();
   $("#trip-details").show();
       locations = [];
     locationCoordinates = [];
      tempLocs = [];
});

$("#back-details").click(backClick) ;

function getLocations(){

  if(demoPic == clickedPic) {
 //   console.log("demoPic choosen");
    // locations = ["New York City, NY"]; 
    // locationCoordinates = [];
    // tempLocs = [
    // { 
    //   location: "New York City, NY", 
    //   latitude: "40.7127837", 
    //   longitude: "-74.0059413"
    // }
    // ];
console.log("tempLocs");
        locations = ["New York City, NY", "Washington, DC", "Boston, MA"]; 
      locationCoordinates = [];
      tempLocs = [
      { 
        location: "New York City, NY", 
        latitude: "40.7127837", 
        longitude: "-74.0059413"
      },
      { 
        location: "Washington, DC", 
        latitude: "38.9071923", 
        longitude: "-77.0368707"
      },
      { 
        location: "Boston, MA", 
        latitude: "42.3600825", 
        longitude: "-71.0588801"
      },
];

  }
else{
    //to be added

}
}