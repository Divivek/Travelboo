 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBzcr2NePpGxMz5u-GD3GxjXpYNXSRC3AQ",
    authDomain: "travelboogaloo-6c4ed.firebaseapp.com",
    databaseURL: "https://travelboogaloo-6c4ed.firebaseio.com",
    projectId: "travelboogaloo-6c4ed",
    storageBucket: "travelboogaloo-6c4ed.appspot.com",
    messagingSenderId: "847082716244"
  };
  // intialize firebase
  var defaultApp = firebase.initializeApp(config);
  
  console.log(defaultApp.name);  // "[DEFAULT]"
  //  create the database variable
  var database = defaultApp.database();
  // var to access firebase storage API
  var defaultStorage = defaultApp.storage();
  // create a ref tto the storage to perform API function
  var storageRef = defaultStorage.ref();
 //---- var imagesRef = storageRef.child('images');
  //----------------------------------------//
  var place = "";
  var localImageUrl = "";
  var nameData="";
  var commentdata = "";
  
   // var downloadURL = "";
  var comment = $("#comment");
  var photos=$("#addPicBox");

//=================================================================================//
// adding a listener to the file upload button to start uploading files selected
fileUploadButton.addEventListener('change', handleFileSelect, false);
  // blow function handle uploading the files to the firebase storage
  function handleFileSelect(e) {
  //  extract the file handle
  var file = e.target.files[0];
  // Create the file metadata
  var metadata = {  contentType: 'image/jpeg'};

  // Upload file and metadata to the object 'image'
  var uploadTask = storageRef.child('images/' + file.name ).put(file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {

    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log('Upload error: ' +  error.code);
        break;

      case 'storage/canceled':
        console.log('Upload error: ' +  error.code);
        // User canceled the upload
        break;

     // ...

      case 'storage/unknown':
        console.log('Upload error: ' +  error.code);
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, function() {
    // Upload completed successfully, now we can get the download URL
     localImageUrl = uploadTask.snapshot.downloadURL;

      // $(document).on("click", "#addData", function(event) {
      //   event.preventDefault();
      //  comment = $('#textArea').val().trim();
      //   console.log(comment);
      // });


      database.ref().push({

        imageUrl: localImageUrl,
          // comment : {}
          comment:comment.val()

      }); 
  });
}

$(document).on("click", "#addData", function(event) {
      event.preventDefault();
      comment = $('#comment').val().trim();
      console.log(comment);
});


         // comment:comment

     
//=================================================================================//


// $("#fileUploadButton").on("click",function() {
//   	event.preventDefault();
//      // photos = $(<img >").val();
// 	 comment = $("#comment").val().trim();
// 	 database.ref().push({
// 	   comment : comment,
// 	    imageUrl:localImageUrl
// 	 }); 	
// });

database.ref().on("child_added", function(childSnapshot, prevChildKey){
	 console.log(childSnapshot.val());

   // var column = $("<div class='col-sm-3 col-md-3'");
    var column = $('<div class="col-sm-3 col-md-">');
    localImageUrl = childSnapshot.val().imageUrl;
    var photoImage = $("<img width='200px'>");
    photoImage.addClass("pictures");
    photoImage.attr("src", localImageUrl);
 
    commentData = childSnapshot.val().comment;
    var commentForm = $('<form class="form-group"><label for="comment">Comment:</label><textarea class="form-control" rows="5" id="comment">' + commentData + '</textarea><input type="submit" id="addData" value="Submit">Submit Comment</form>')
    commentForm.append(commentData);
    column.append(photoImage);
    column.append(commentForm);

    $("#playArea").append(column);
      	 
    }, function(errorObject){
    console.log(errorObject.code);
});	
