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


(function() {
    'use strict';


    // represents simple place item
    var Place_list = function(data) {
        this.title = ko.observable(data.title);
        this.location = ko.observable(data.location);
    };

    var ViewModel = function(place_list) {
        //important trick!! self!!
        var self = this;

        // getting the places into the map list
        this.place_list = ko.observableArray([]);
        _.each(init_places, function(place) {
            self.place_list.push(new place_list(place));
        });

        // bind the event to the sidebar_btn
        this.sidebarFold = function(data, event) {
            var $sidebar = $('sidebar');
            $sidebar.toggleClass('unfolded');
            //-- if youre to target the custom element, you have to sue event.target
            $(event.target).toggleClass('move_right');
        };
    };

    // Start binding with KnockoutJS
    // bind a new instance of our viewModel to the page
    var viewModel = new ViewModel(Place_list || []);
    ko.applyBindings(viewModel);

}());

var map;
// Create a new blank array for all the listing markers.
var markers = [];

// var initMap = function() {
function initMap() {
    var styles = [{
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "hue": "#7fc8ed"
        }, {
            "saturation": 55
        }, {
            "lightness": -6
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [{
            "hue": "#7fc8ed"
        }, {
            "saturation": 55
        }, {
            "lightness": -6
        }, {
            "visibility": "off"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "hue": "#83cead"
        }, {
            "saturation": 1
        }, {
            "lightness": -15
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "hue": "#f3f4f4"
        }, {
            "saturation": -84
        }, {
            "lightness": 59
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [{
            "hue": "#ffffff"
        }, {
            "saturation": -100
        }, {
            "lightness": 100
        }, {
            "visibility": "off"
        }]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "hue": "#ffffff"
        }, {
            "saturation": -100
        }, {
            "lightness": 100
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
            "hue": "#bbbbbb"
        }, {
            "saturation": -100
        }, {
            "lightness": 26
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "hue": "#ffcc00"
        }, {
            "saturation": 100
        }, {
            "lightness": -35
        }, {
            "visibility": "simplified"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "hue": "#ffcc00"
        }, {
            "saturation": 100
        }, {
            "lightness": -22
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [{
            "hue": "#d7e4e4"
        }, {
            "saturation": -60
        }, {
            "lightness": 23
        }, {
            "visibility": "on"
        }]
    }];

    var self = this;

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 34.674187,
            lng: 135.505509
        },
        zoom: 15,
        styles: styles,
        mapTypeControl: false

    });

    var largeInfowindow = new google.maps.InfoWindow();

    // This makes bounding easier
    var bounds = new google.maps.LatLngBounds();

    var defaultIcon = makeMarkerIcon('#F1C40F');
    var highlightedIcon = makeMarkerIcon('#F39C12');

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

        // not working
        // //Two event listeners - one for mouseover, one for mouseout,
        // //to change the colors back and forth.
        // marker.addListener('mouseover', function() {
        //     this.setIcon(highlightedIcon);
        // });
        // marker.addListener('mouseout', function() {
        //     this.setIcon(defaultIcon);
        // });
        //Extend the boundaries of the map
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {
    console.log('aaaaaaaaaaaaaaaaaaaa');
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        var getStreetView =function(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                console.log('2aaaaaaaaaaaaaaaaaaaa');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);

            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        };
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}
