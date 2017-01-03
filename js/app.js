var init_places = [{
    title: 'Houzenji',
    location: {
        lat: 34.667895,
        lng: 135.502611
    }
}, {
    title: 'Ichiran',
    location: {
        lat: 34.6685234,
        lng: 135.503199
    }
}, {
    title: 'Menyateru',
    location: {
        lat: 34.675900,
        lng: 135.504579
    }
}];

var mapModel = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};

// var appModel = function(data) {
//     this.title = ko.observable(data.title);
//     this.location = ko.observable(data.location);
// };

var viewModel = function() {
    //important trick!! self!!
    var self = this;

    // the map list
    this.maplist = ko.observableArray([]);
    // getting the places into the map list
    _.each(init_places, function(place) {
        self.maplist.push(new mapModel(place));
    });

};


var map;
// Create a new blank array for all the listing markers.
var markers = [];

var initMap = function() {

    var self = this;

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {

        center: {
            lat: 34.674187,
            lng: 135.505509
        },
        zoom: 15
    });

    var largeInfowindow = new google.maps.InfoWindow();

    // This makes bounding easier
    var bounds = new google.maps.LatLngBounds();
    console.log(bounds);

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < init_places.length; i++) {
        // Get the position from the location array.
        var position = init_places[i].location;
        var title = init_places[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }

    // Extend the boundaries of the map
    map.fitBounds(bounds);

    // This marks the end of Google Map
};

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker(null);
        });
    }
}

// Start binding with KnockoutJS
ko.applyBindings(new viewModel());
