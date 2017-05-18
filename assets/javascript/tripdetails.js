
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

var locations = ["New York City, NY", "Washington, DC", "Boston, MA"]; 
var locationCoordinates = [];
var tempLocs = [
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

    var marker = new google.maps.Marker({
      position: location,
      map: map
    });

    drawMap(); 
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


	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
	 + location + "&key=" + googleAPIKey;

	// console.log("location", location, "queryURL", queryURL);

	 $.ajax({url: queryURL, method: "GET"})
	  .done(function(response){

	  		//console.log(response);

	  		updateMap( response.results[0].geometry.location.lat, response.results[0].geometry.location.lng , 7);

	  })

});


function drawMap(){
  // for(var i=0; i<tempLocs.length; i++) {
  //   // getLongitudeAndLatitude(locations[i]);

    
  //   console.log(tempLocs[i]);
  // }

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




