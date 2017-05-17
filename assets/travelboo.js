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
      // create a ref to the storage to perform API function
      var storageRef = defaultStorage.ref();
      var place = "";
      var localImageUrl = "";
      var nameData="";
      var commentdata = "";
      var comment = $("#comment" );
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
      var uploadTask = storageRef.child('images/' + file.name  ).put(file, metadata);
      // Listen for state changes, errors, and completion of the upload.
    
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
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
      console.log(comment);
      database.ref().push({
      imageUrl: localImageUrl,

      }); 
     });
}

$(document).on("click", ".addData", function(event) {
  console.log("comment click working");
      event.preventDefault();
      comment = $("#comment").val();
      var newComments = this.parentNode.childNodes[1].childNodes[1].value;
      ldbKey = $(this).attr("dbKey");
      console.log(comment);
      console.log(ldbKey);
      database.ref(ldbKey).update({
      comment: newComments,
      });
});

database.ref().on("child_added", function(childSnapshot, prevChildKey){
    var dbRefKey = childSnapshot.key;
    // use above key as property of button so that we can get to it at time of update
    var column = $('<div class="col-sm-3 col-md-">');
    localImageUrl = childSnapshot.val().imageUrl;
    var photoImage = $("<img >");
    photoImage.addClass("pictures");
    photoImage.attr("src", localImageUrl);
    commentData = childSnapshot.val().comment;
    var submitButton = $("<button>");
    submitButton.addClass("addData");
    submitButton.attr("dbKey", dbRefKey);
    var commentForm = $('<form class="form-group"><label for="comment"></label><textarea class="form-control" rows="5" id="comment">' + commentData + '</textarea> </form>')
    $("#commentBox").append(commentData);
    column.append(photoImage);
    column.append(commentForm);
    column.append(submitButton);
    $("#playArea").append(column);
    $(".addData").text("+ comment");
 }, function(errorObject){
   console.log(errorObject.code);
}); 
