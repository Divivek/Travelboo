 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBzcr2NePpGxMz5u-GD3GxjXpYNXSRC3AQ",
    authDomain: "travelboogaloo-6c4ed.firebaseapp.com",
    databaseURL: "https://travelboogaloo-6c4ed.firebaseio.com",
    projectId: "travelboogaloo-6c4ed",
    storageBucket: "travelboogaloo-6c4ed.appspot.com",
    messagingSenderId: "847082716244"
  };
  firebase.initializeApp(config);


  var database = firebase.database();
  var place = "";
  var imageUrl = "";
  var nameData="";
  var commentdata = "";
  var comment = $("#comment");
  var photos=$("#addPicBox");


$("#addButton").on("click",function(event){
	var albumDiv = $('<div class=thumbnail>');
	var comment = $('<div class=form-control>');
	imageUrl = "assets/images/1.jpg...";
	console.log(imageUrl);

    var photoImage = $("<img>");
    //add class to image
    photoImage.addClass("thumbnail");
    photoImage.addClass("form-control");
    photoImage.attr("src", imageUrl);
    $("#addPicBox").append(photoImage);
});

$("#addButton").on("click",function() {
  	 event.preventDefault();
     // photos = $(<img >").val();
	 comment = $("#comment").val().trim();
	 database.ref().push({
	   comment : comment
	   // imageUrl:imageUrl
	 }); 	
});

database.ref().on("child_added", function(childSnapshot, prevChildKey){
	 console.log(childSnapshot.val());
	 nameData = childSnapshot.val().name;
	 commentData = childSnapshot.val().comment;

     $("#comment").append(commentData)
	 
 }, function(errorObject){
   console.log(errorObject.code);
});	
