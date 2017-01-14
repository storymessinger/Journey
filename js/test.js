//  data.js
//      init_routes
//      init_places

//  app_fns.js
//      markMarkers(location, title, Infowindow, order)
//      populateInfoWindow(marker, infowindow)
//      zoomToArea(infowindow)
//      drawRouteLine(data)
//      showListings()
//      hideListings();

// A factory function we can use to create binding handlers for specific // keycodes.
var ENTER_KEY = 13;
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
ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY); // a custom binding to handle the enter key

var Found_list = function(data){
    this.placeDetail = ko.observable(data.placeDetail);
};

var Place_list = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};

var ViewModel = function(routeData, placeData, foundData, searchedData) {
    //important trick!! self!!
    var self = this;

    //
    this.searchedData_list = ko.observableArray([]);
    _.each(searchedData, function(place){
        self.searchedData_list.push(new Found_list(place));
    });
    //

    // getting the places into the map list
    this.sitePoints = ko.observableArray([]);
    _.each(placeData, function(place) {
        self.sitePoints.push(new Place_list(place));
    });

    // bind the event to the sidebar_btn
    this.sidebarFold = function(data, event) {
        var $sidebar = $('sidebar');
        $sidebar.toggleClass('unfolded');
        //-- if youre to target the custom element, you have to sue event.target
        $(event.target).toggleClass('move_right');
    };

	/////////////////////////////////////////////////
	// // Hide makers
	// this.hideMarkers = function(markers) {
	// 	for (var i = 0; i < markers.length; i++) {
	// 		markers[i].setMap(null);
	// 	}
	// }

	///////////////////////////////////////////////////////////

    this.searched= ko.observableArray();
	this.found = ko.observableArray();

	// enterKeyPress event
	this.enterKeyPress = function(searchFor, event) {
		var target = event.target;

		self.searched.removeAll();
		self.zoomToArea(largeInfowindow, searchFor);
    };

	// This function takes the input value in the find nearby area text input
	// locates it, and then zooms into that area. This is so that the user can
	// show all listings, then decide to focus on one area of the map.
	this.zoomToArea = function(infowindow, search) {

		// reset all the markers
	    self.hideListings();

		var geocoder = new google.maps.Geocoder();
	    var address = document.getElementById('zoom-to-area-text').value;

		// this applys when you click found places on the left
		if (typeof search === 'string') {
			address = search;
		}
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

	                // Make the found places blank
	                results.forEach(function(result) {
	                    var location = result.geometry.location;
	                    var title = result.address_components[0].short_name;
	                    markMarkers(location, title, infowindow, 0);
	                    // push the result in
	                    self.getPlacesDetails(result);
						// to remember
						self.found.unshift(result);
						// remove extras
						if (self.found().length > 5) {
							var sliced = self.found().slice(0,4);
							self.found.removeAll();
							for (i=0; i<sliced.length; i++){
								self.found.push(sliced[i]);
							}
							// var sliced = self.found().shift();
						}
	                });
	                map.setZoom(15);
	            } else {
					self.textSearchPlaces(address);
	            }
	        });
	    }
	};

    this.textSearchPlaces = function(address) {
		var makeHTML_place = function(place){
            var innerHTML = '<div>';
            if (place.name) {
                innerHTML += '<strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
                innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
                innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl({
                    maxHeight: 100,
                    maxWidth: 200
                }) + '">';
            }
            innerHTML += '</div>';
			return innerHTML;
		};

        var bounds = map.getBounds();
        // hideMarkers(markers);
        var placesService = new google.maps.places.PlacesService(map);
        placesService.textSearch({
            query: address,
            bounds: bounds
        }, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
				// self.getPlacesDetails(results);
				var count =0;
				for(i=0; i<results.length; i++){
					if(count<3) {
						markMarkers(results[i].geometry.location, results[i].name, largeInfowindow, 0);
						var resultHTML_place = makeHTML_place(results[i]);
			            //also, check whether the result is same. Korean bug issues
			            if (formerHTML !== resultHTML_place) {
			                self.searched.push(resultHTML_place);
			            }
			            var formerHTML = resultHTML_place;

						//to prevent re-calling
						count++;
					}
				}
				//to remember
				self.found.unshift(results[0]);

				if (self.found().length > 4) {
					var sliced = self.found().slice(0,4);
					self.found.removeAll();
					for (i=0; i<sliced.length; i++){
						self.found.push(sliced[i]);
					}
					// var sliced = self.found().shift();
				}

            } else {
                window.alert('We could not find that location - try entering a more' +
                ' specific place.');
			}
        });
    };
	this.getPlacesDetails = function(result) {
		var makeHTML = function(place){
            var innerHTML = '<div>';
            if (place.name) {
                innerHTML += '<strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
                innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
                innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl({
                    maxHeight: 100,
                    maxWidth: 200
                }) + '">';
            }
            innerHTML += '</div>';
			return innerHTML;
		};

		if(result.place_id){
		    var service = new google.maps.places.PlacesService(map);
		    service.getDetails({
		        placeId: result.place_id
		    }, function(place, status) {
		        if (status === google.maps.places.PlacesServiceStatus.OK) {
					var resultHTML = makeHTML(place);
	                self.searched.push(resultHTML);
		        }
		    });
		}
	};

	// This function will loop through the listings and hide them all.
	this.hideListings = function() {
	    for (var i = 0; i < markers.length; i++) {
	        markers[i].setMap(null);
	    }
	};
	// to select between name and address components of differect search results
	this.getFound = function(entry) {
		if (entry.address_components) {
			return entry.address_components[0].short_name;
		} else {
			return entry.name;
		}
	};
	this.getClass = function(entry) {
        return entry.type === 'file' ? 'icon-file' : 'icon-filder';
    };

	///////////////////////////////////////////////////////////
    // SIDEBAR ROUTES FEATURES


	//test
	this.ro_name = ko.observableArray(routeData.name);
	this.ro_route_info = ko.observableArray(routeData.route_info);
	this.ro = ko.pureComputed({
		push: function(value){
			self.ro_name.push(value.name);
			self.ro_route_info.push(value.route_info);
		},
		remove: function(value){
			var that = this;
			self.ro_name.remove(function(value){
				return value.name == that.name;
			});
			self.ro_route_info.remove(function(value){
				return value.route_info == that.route_info;
			});
		},
		add: function(place){

		}
	});


	//test end`


    // ko.array for holding routes
	// routeData is used for initialize
    this.routes = ko.observableArray(routeData);
    // ko.ob for taking in the input from the user
    this.routeToAdd = ko.observable("");
    // when input submitted, addRoute function runs to add it to routes
    this.addRoute = function() {
        if (self.routeToAdd() !== "") {
            var routeItem = {
                name: self.routeToAdd(),
                route_info: []
            };
			// Adds the item.
			// Writing to the "routes" observableArray causes any associated UI to update.
            self.routes.push(routeItem);
            self.routeToAdd("");
        }
    };
    // click event:
    // deletes the selected route item from the sidebar
    this.thisRouteDelete = function(){
        var that = this;
        self.routes.remove(function(route){
            return route.name == that.name;
        });
    };
/////////////////////////////////////////

	this.addingPlaceToRoutes = function() {
		// self.routes..should put it here...what?
		// should know which route is selected at the point of event
		// should know which DOM element has class '.pressed'
		// and then find out what self.route is linked with it.
		// one of waypoints..

		// information to put in is simple.
		// maybe formatted address -> should check

		console.log(this);

	};

/////////////////////////////////////////

    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
	// connecting the directionsDisplay with the map
	this.directionsDisplay.setMap(map);

	this.routeToggle = function(data, event) {
		// toggle class .pressed for visualization
		$('.route').removeClass('pressed');
		target = event.target;
		$(target).addClass('pressed');

		// toggle <selected>

		self.calculateAndDisplayRoute(this);
	};

	this.calculateAndDisplayRoute = function(){
	    // var waypts = [];
	    // var checkboxArray = document.getElementById('waypoints');
	    // for (var i = 0; i < checkboxArray.length; i++) {
	    //     if (checkboxArray.options[i].selected) {
	    //         waypts.push({
	    //             location: checkboxArray[i].value,
	    //             stopover: true
	    //         });
	    //     }
	    // }
	    self.directionsService.route(
			{
		        origin: "New York, NY",
		        destination: "Boston, MA",
		        waypoints: [
					{
						location: "Providence, RI",
						stopover: true
					}
				],
		        optimizeWaypoints: true,
		        travelMode: google.maps.TravelMode.DRIVING
		    },
		function(response, status) {
	        if (status === google.maps.DirectionsStatus.OK) {
				console.log(response);
	            self.directionsDisplay.setDirections(response);
	        } else {
	            window.alert('Directions request failed due to ' + status);
	        }
	    });
	}
};

function initMap() {
    var self = this;

	// uglified the styles of the map to save space
    var mapStyles=[{featureType:"water",elementType:"all",stylers:[{hue:"#7fc8ed"},{saturation:55},{lightness:-6},{visibility:"on"}]},{featureType:"water",elementType:"labels",stylers:[{hue:"#7fc8ed"},{saturation:55},{lightness:-6},{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{hue:"#83cead"},{saturation:1},{lightness:-15},{visibility:"on"}]},{featureType:"landscape",elementType:"geometry",stylers:[{hue:"#f3f4f4"},{saturation:-84},{lightness:59},{visibility:"on"}]},{featureType:"landscape",elementType:"labels",stylers:[{hue:"#ffffff"},{saturation:-100},{lightness:100},{visibility:"off"}]},{featureType:"road",elementType:"geometry",stylers:[{hue:"#ffffff"},{saturation:-100},{lightness:100},{visibility:"on"}]},{featureType:"road",elementType:"labels",stylers:[{hue:"#bbbbbb"},{saturation:-100},{lightness:26},{visibility:"on"}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{hue:"#ffcc00"},{saturation:100},{lightness:-35},{visibility:"simplified"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{hue:"#ffcc00"},{saturation:100},{lightness:-22},{visibility:"on"}]},{featureType:"poi.school",elementType:"all",stylers:[{hue:"#d7e4e4"},{saturation:-60},{lightness:23},{visibility:"on"}]}];
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 34.674187,
            lng: 135.505509
        },
        zoom: 15,
        styles: mapStyles,
        mapTypeControl: false

    });
    // making an instance of a infowindow
    largeInfowindow = new google.maps.InfoWindow();

    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete = new google.maps.places.Autocomplete(document.getElementById('zoom-to-area-text'));
    // This makes bounding easier
    var bounds = new google.maps.LatLngBounds();
    //Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo('bounds', map);

    // The following group uses the location array to create an array of markers
    // """on initialize""".
    init_places.forEach(function(place){
        // Get the position from the location array.
        var position = place.location;
        var title = place.title;
        //** Create a marker per location, and put into markers array.
        markMarkers(position, title, largeInfowindow);
    });
    //Extend the boundaries of the map
    markers.forEach(function(item){
        bounds.extend(item.position);
    });

    // make map fit into the boundaries
    map.fitBounds(bounds);


}

// put map as an Global variable
var map;
// share it global
var largeInfowindow;

var loadMap = function() {
    initMap();
    ko.applyBindings(new ViewModel(init_routes, init_places, found_places, searched_places));
};
