var init_routes = {
    london_route01 : [
        {
            title: 'Big Ben',
            location: {
                lat: 51.500650,
                lng: -0.122075
            }

        }, {
            title: 'Westminster',
            location: {
                lat: 51.499531,
                lng: -0.123856
            }

        }, {
            title: 'RCA',
            location: {
                lat: 51.501135,
                lng: -0.177372
            }
        }, {
            title: 'US Embassy, London',
            location: {
                lat: 51.51251,
                lng: -0.1528990
            }
        }
    ],
};


var init_places = [{
    title: 'Big Ben',
    location: {
        lat: 51.500650,
        lng: -0.122075
    }

}, {
    title: 'Westminster',
    location: {
        lat: 51.499531,
        lng: -0.123856
    }

}, {
    title: 'RCA',
    location: {
        lat: 51.501135,
        lng: -0.177372
    }
}];


(function() {
    'use strict';

	var ENTER_KEY = 13;

	// A factory function we can use to create binding handlers for specific
	// keycodes.
	function keyhandlerBindingFactory(keyCode) {
		return {
			init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
				var wrappedHandler, newValueAccessor;

				// wrap the handler with a check for the enter key
				wrappedHandler = function (data, event) {
					if (event.keyCode === keyCode) {
						valueAccessor().call(this, data, event);
					}
				};

				// create a valueAccessor with the options that we would want to pass to the event binding
				newValueAccessor = function () {
					return {
						keyup: wrappedHandler
					};
				};

				// call the real event binding's init function
				ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
			}
		};
	}

	// a custom binding to handle the enter key
	ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);

    // represents simple place item
    var Place_list = function(data) {
        // this.title = ko.observable(data.title);
        // this.location = ko.observable(data.location);
        this.title = data.title;
        this.location = data.location;
    };

    var ViewModel = function() {
        //important trick!! self!!
        var self = this;

        // getting the places into the map list
        this.sitePoints = ko.observableArray([]);
        _.each(init_places, function(place) {
            self.sitePoints.push(new Place_list(place));
        });

        // bind the event to the sidebar_btn
        this.sidebarFold = function(data, event) {
            var $sidebar = $('sidebar');
            $sidebar.toggleClass('unfolded');
            //-- if youre to target the custom element, you have to sue event.target
            $(event.target).toggleClass('move_right');
        };

        // data-bind with zoom-to-area-text
        this.zoom_area = function() {
            // console.log(event.target.value);

            // this zooms to area
            zoomToArea();

        };
    };

    // Start binding with KnockoutJS
    // bind a new instance of our viewModel to the page
    var viewModel = new ViewModel();
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
    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('zoom-to-area-text'));
    //Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo('bounds', map);

    var largeInfowindow = new google.maps.InfoWindow();

    // This makes bounding easier
    var bounds = new google.maps.LatLngBounds();


    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < init_places.length; i++) {
        // Get the position from the location array.
        var position = init_places[i].location;
        var title = init_places[i].title;
        //** Create a marker per location, and put into markers array.
        markMarkers(position, title, i, largeInfowindow);

        //Extend the boundaries of the map
        bounds.extend(markers[i].position);
    }

    // event trigger on the zoom-to-area button
    document.getElementById('zoom-to-area').addEventListener('click', function() {
        //** Zoom to the searched area
        zoomToArea();
    });



    // make map fit into the boundaries
    map.fitBounds(bounds);
}
// initMap ends here


// marking the Markers with added functionalty of Event-trigger
function markMarkers(location, title, order, Infowindow) {
    var thisInfowindow = Infowindow;
    var markerImage = {
    //    url: 'public/img/marker.png',
       // This marker is 20 pixels wide by 32 pixels high.
       size: new google.maps.Size(26, 34),
       // The origin for this image is (0, 0).
       origin: new google.maps.Point(0, 0),
       // The anchor for this image is the base of the flagpole at (0, 32).
       anchor: new google.maps.Point(0, 32)
     };
    var marker = new google.maps.Marker({
        map: map,
        position: location,
        title: title,
        animation: google.maps.Animation.DROP,
        id: order,
        icon: markerImage
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
        var self = this;
        populateInfoWindow(self, thisInfowindow);
    });
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
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

// This function takes the input value in the find nearby area text input
// locates it, and then zooms into that area. This is so that the user can
// show all listings, then decide to focus on one area of the map.
function zoomToArea() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    var address = document.getElementById('zoom-to-area-text').value;
    // Make sure the address isn't blank.
    if (!address){
        window.alert('You must enter an area, or address.');
    } else {
        // Geocode the address/area entered to get the center. Then, center the map
        // on it and zoom in
        geocoder.geocode({
            address: address,
            componentRestrictions: {
                // locality: 'Japan'
            }
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                // Center the map to the FIRST result
                map.setCenter(results[0].geometry.location);
                // For every result found, markers are place on top
                results.forEach(function(result) {
                    console.log(result);
                    var location = result.geometry.location;
                    var title = result.address_components[0].short_name;
                    markMarkers(location, title);
                });
                // console.log(results[0]);
                map.setZoom(15);
            } else {
                window.alert('We could not find that location - try entering a more' +
                    ' specific place.');
            }
        });
    }
}

// $.ajax({
//     url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAXWT_uPQIuxP-10SQ5qYjVslLA-WmOmG4&libraries=geometry,places&v=3&callback=initMap',
//     dataType: 'script',
//     cache: true, // otherwise will get fresh copy every page load
// });
