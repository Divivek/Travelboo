
var googleAPIKey="AIzaSyDNoZFYABiy-Dagp1LvMG9KbsOH0yleoXI";

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDNoZFYABiy-Dagp1LvMG9KbsOH0yleoXI",
    authDomain: "travel-boogaloo-dev.firebaseapp.com",
    databaseURL: "https://travel-boogaloo-dev.firebaseio.com",
    projectId: "travel-boogaloo-dev",
    storageBucket: "travel-boogaloo-dev.appspot.com",
    messagingSenderId: "756738451586"
  };
  // firebase.initializeApp(config);

function initMap() {
//initalize map to Rutgers Coding Bootcamp

    var location = {
    	lat: 40.535434,
    	lng: -74.5234757
    }

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: location
    });
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
  }

function updateMap(lat, long, zoom) {

	    var location = {
    	lat: lat,
    	lng: long
    }

    var map = new google.maps.Map(document.getElementById('map'), {
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
	
	var city = $("#city").val().trim();
	var state = $("#state").val().trim();

	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
	 + city + ",+" + state + "&key=" + googleAPIKey;

	 console.log("city", city, "state", state, "queryURL", queryURL);
	 $.ajax({url: queryURL, method: "GET"})
	  .done(function(response){

	  		console.log(response);

	  		updateMap( response.results[0].geometry.location.lat, response.results[0].geometry.location.lng , 10);

	  })

});

