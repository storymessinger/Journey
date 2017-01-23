// INITIATE
// This function loads after the google API is all loaded
// made it like this because i wanted to use the map components
// in the knockoutjs ViewModel

var loadMap = function() {
    initMap();
    ko.applyBindings(new ViewModel(init_routes, init_places));
};


// this is a factory function we can use to create binding handlers for specific // keycodes.
// from http://todomvc.com (knockoutjs example)
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

var Route_list = function(data) {
	this.name = ko.observable(data.name);
	this.route_info = ko.observable(data.route_info);
	this.selected = ko.observable(data.selected);
};



////// VIEWMODEL
var ViewModel = function(startRouteData, startPositionData) {
    //important trick!! self!!
    var self = this;

	// get the largeInfowindow in to the ViewModel scope
	this.largeInfowindow = largeInfowindow;
    // initiateInfowindow
    this.initiateInfowindow = function(){
        self.largeInfowindow();
    };

    this.sidebarFold = function(data, event) {
        var $sidebar = $('sidebar');
        $sidebar.toggleClass('unfolded');
    };

    this.searchbarFold= function(data, event) {
        var $wiki = $('.wikiResult');
        var $searchbar = $('.search-bar');
        $wiki.toggleClass('search-unfolded');
        $searchbar.toggleClass('search-unfolded');
    };

	////////

	// when you search for a place, it is remembered here
    this.searched= ko.observableArray();

	// This stores the recent results of search. (up to 5)
	this.found = ko.observableArray([]);

    startPositionData.forEach(function(place){
        self.found.push(place);
    });
	// enterKeyPress event
	this.enterKeyPress = function(data, event) {
		// initiate getSearch
		self.getSearch(largeInfowindow);

		// refresh the search input after pressing enter
		var target = event.target;
		$(target).val('');
    };

    this.easyFilter = function(data, event){
		var $target = $(event.target);
        var easyFilterPlace = self.found().filter(function(place){
            if (place.types.includes($target.val())) {
                return true;
            }
        });
        if(easyFilterPlace.length === 0){
            alert('no filter results among the recent Place list');
        } else {
            self.hideMarkers();
            markers = [];
            self.found(easyFilterPlace);
            boundMarkers(easyFilterPlace, false);
        }
    };


	// This function takes the input value in the find nearby area text input
	// locates it, and then zooms into that area.
	// It also fires <getGeocodeDetails> function or <getAddressDetails>
	// based on the search input
	this.getSearch = function(infowindow, place_id, isButton, place_name) {

		// reset all the markers
	    self.hideMarkers();
		// reset search-results
		self.searched.removeAll();


		var geocoder = new google.maps.Geocoder();
	    var address = document.getElementById('searchInput').value;




	    // Make sure the address and place_id isn't both blank.
        // #1
	    if (!address && !place_id){
	        window.alert("You must enter an area, or address.");
        // #2
        } else if (isButton === true) {
            var searchButton= self.found().filter(function(item){
                return item.place_id === place_id;
            });
            if (searchButton){
                self.hideMarkers();
                boundMarkers(searchButton, true);
                self.loadPlaceInfo(place_name);

            } else {
                alert('error in recent-search system');
            }
        // #3
        } else if ($('#searchFilter').val() === "recent") {
            var searchRecent = self.found().filter(function(place){
                if (place.name.toLowerCase() === address.toLowerCase()){
                    return true;
                }
                if (place.name.toLowerCase().split(' ').includes(address.toLowerCase())){
                    return true;
                }
                if (place.formatted_address.toLowerCase().split(/[,\s]+/).includes(address.toLowerCase())){
                    return true;
                }
                if (place.types.includes(address.toLowerCase())) {
                    return true;
                }
            });
            if (searchRecent[0] === undefined){
                alert('no search results found among recent findings');
            } else {
                self.hideMarkers();
                markers = [];
                self.found(searchRecent);
                boundMarkers(searchRecent, false);
            }
        }
        // #4
        // Always search in Places library when select option is Nearby Search
        else if($('#searchFilter').val() === "nearby"){
			self.getAddressDetails(address);
            map.setZoom(15);
        }
        // #5
        else {
	        // Geocode the address/area entered to get the center. Then, center the map
	        // on it and zoom in
            var input;
            if (place_id) {
    		// #1 : this applys when you search by enterKEY
                input = {
                    placeId: place_id,
    	            componentRestrictions: {}
                    };
            } else {
    		// #2 : this applys when you "click" the found places
                input = {
    	            address: address,
    	            componentRestrictions: {}
                };
            }

	        geocoder.geocode(input, function(results, status) {
	            if (status == google.maps.GeocoderStatus.OK) {
                    // Search with geocode library
                    if(results[0].partial_match !== true){
    	                // Center the map to the FIRST result
    	                map.setCenter(results[0].geometry.location);
    	                // For every result found, markers are place on top

    	                // Make the found places blank
    	                results.forEach(function(result) {
    	                    // push the result in
    	                    self.getGeocodeDetails(result);
    	                });
    	                map.setZoom(15);
    	            }
                    // fallback
                    else {
    					self.getAddressDetails(address);
    	                map.setZoom(15);
                    }
                } else {
                    alert('error in Google Map Search: ' + status);
                }
	        });
	    }
	};

    this.resultGeocodeHTML = ko.observable();
	// this function gets fired when result was made by Geocode
	this.getGeocodeDetails = function(result) {


		if(result.place_id){
		    var service = new google.maps.places.PlacesService(map);
		    service.getDetails({
		        placeId: result.place_id,
		    }, function(place, status) {

                var isDuplicate = self.found().find(function(item){
                    return item.name === place.name;
                });

		        if (status === google.maps.places.PlacesServiceStatus.OK) {
					markMarkers(place.geometry.location, place.name, largeInfowindow, Boolean(isDuplicate));
					makeHTML(place);
	                self.searched.push({
						// resultHTML : resultHTML,
						resultHTML : self.resultGeocodeHTML(),
						location : place.geometry.location
					});
                    self.loadPlaceInfo(place.name);
		        }
                if(isDuplicate === undefined){
        			// to remember
        			self.found.unshift(place);
        			// remove extras
        			if (self.found().length > 10) {
        				var sliced = self.found().slice(0,9);
        				self.found.removeAll();
        				for (i=0; i<sliced.length; i++){
        					self.found.push(sliced[i]);
        				}
        			}
                }
		    });
		} else {
            window.alert('We could not find that location - try entering a more' +
            ' specific place.');
        }

		function makeHTML(place) {
            var innerHTML = '<div class="search-desc">';
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
            self.resultGeocodeHTML(innerHTML);
		}
	};

    this.resultAddressHTML = ko.observable();
	// this function gets fired when result was '''NOT''' made by Geocode
    this.getAddressDetails = function(address) {

        var bounds = map.getBounds();
        var placesService = new google.maps.places.PlacesService(map);
        placesService.textSearch({
            query: address,
            bounds: bounds
        }, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var isDuplicate = self.found().find(function(item){
                    return item.name === results[0].name;
                });
				var count =0;
				for(i=0; i<results.length; i++){
                    var place =results[i];

                    // only for the first result
                    if (i === 0){
                        self.loadPlaceInfo(place.name);
                    }

					if(count<3) {
						markMarkers(place.geometry.location, place.name, largeInfowindow, Boolean(isDuplicate));
						makeHTML_place(place);
    	                self.searched.push({
    						// resultHTML : resultHTML,
    						resultHTML : self.resultAddressHTML(),
    						location : place.geometry.location
    					});
						//to prevent getting too much information
						count++;
					}
				}

                if(isDuplicate === undefined){
    				//Remember it in the founds-sidebar
    				self.found.unshift(results[0]);
    				if (self.found().length > 10) {
    					var sliced = self.found().slice(0,9);
    					self.found.removeAll();
    					for (i=0; i<sliced.length; i++){
    						self.found.push(sliced[i]);
    					}
    				}
                }
            } else {
                window.alert('We could not find that location - try entering a more' +
                ' specific place.');
			}
        });

		function makeHTML_place(place) {

            var innerHTML = '<div class="search-desc">';
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
            self.resultAddressHTML(innerHTML);
		}
    };

	// function to select between name and address components of differect search results
	// by this result, found places can have appropriate names
	this.getFound = function(entry) {
		// if it has name, return short_name
		if (entry.name) {
			return entry.name;
		// as a fall back, return addres components
		} else {
			return entry.address_components[0].short_name;
		}
	};



    ////// ROUTES FEATURES


    // ko.array for holding routes
    this.routes = ko.observableArray(startRouteData);

    // ko.observable for taking in the input from the user
    this.routeToAdd = ko.observable("");
    // when input submitted, addRoute function runs to add it to routes
    this.addRoute = function() {
        if (self.routeToAdd() !== "") {
            var newRoute = {
				selected: false,
                name: self.routeToAdd(),
                route_info: {
					waypoints:[]
				}
            };
			// Adds the item.
			// Writing to the "routes" observableArray causes any associated UI to update.
            self.routes.push(newRoute);
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

	// this holds what route is currently selected
	this.currentRouteIndex = ko.observable();

	// function that adds searched places to the current selected route
	this.addingPlaceToRoutes = function(location) {
		// Users must have selected a route in order to
		// add a place 'to' a route
		if (self.currentRouteIndex() === undefined) {
			alert('please select a route');
		} else {
			var pulled = self.routes().slice(self.currentRouteIndex(),self.currentRouteIndex()+1)[0];

			if (pulled.route_info.origin === undefined){
				pulled.route_info.origin = location;
				self.routes.replace(self.routes()[self.currentRouteIndex()], pulled);

			} else if (pulled.route_info.destination === undefined && pulled.route_info.origin !== location) {
				pulled.route_info.destination = location;
				self.routes.replace(self.routes()[self.currentRouteIndex()], pulled);

			} else if (pulled.route_info.destination !== location && pulled.route_info.origin !== location){
				var obj = {
					location : location,
					stopover : true
				};
				pulled.route_info.waypoints.push(obj);
				self.routes.replace(self.routes()[self.currentRouteIndex()], pulled);
			}

			// refresh displayRoute
			if (self.currentRouteIndex() === undefined){
				var bool_routeSelect= false;
			}
			self.displayRoute(bool_routeSelect);
		}
	};

    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
	// connecting the directionsDisplay with the map
	this.directionsDisplay.setMap(map);

	// this function displays the selected route via using
	// googles directions service
	this.displayRoute = function(bool_routeSelect, event) {

		if (event !== undefined) {
			// reset
			$('.item-holder').removeClass('pressed');

			// give 'pressed' class to the selected
			var target = event.target;
			var $target = $(target).parent();
			$($target).addClass('pressed');
			$(target).addClass('pressed');
		}

		// this is implement of making the selected route
		// to have 'selected = true' and others to 'selected = false'
		// by this, I can know what route is currently being edited
		if(this.name !== undefined){
			self.currentRouteIndex(self.routes.indexOf(this));
			for(i=0; i<self.routes().length; i++){
				if (i != self.currentRouteIndex()){
					self.routes()[i].selected = false;
				} else {
					self.routes()[i].selected = true;
				}
			}
		}

		var route_info = self.routes()[self.currentRouteIndex()].route_info;
		route_info.travelMode = google.maps.TravelMode.WALKING;

		// give route_info to draw
		// if it has origin and destination
		if(route_info.origin && route_info.destination){
			self.calculateAndDisplayRoute(route_info);
		}
	};

	// Function to draw route based on route information
	this.calculateAndDisplayRoute = function(routeObj){
		// reset all the markers
	    self.hideMarkers();
        // routeObj.origin
	    self.directionsService.route(routeObj, function(response, status) {
	        if (status === google.maps.DirectionsStatus.OK) {
	            self.directionsDisplay.setDirections(response);
	        } else {
	            window.alert('Directions request failed due to ' + status);
	        }
	    });
	};

	////// Others

	// This function will loop through the listings and hide them all.
	this.hideMarkers = function() {
	    for (var i = 0; i < markers.length; i++) {
	        markers[i].setMap(null);
	    }
	    for (var i = 0; i < list_view_marker.length; i++) {
	        list_view_marker[i].setMap(null);
	    }
	};
    // This function will loop through the markers array and display them all.
    this.showListings = function() {


        var show_bounding = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            show_bounding.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    this.wikiResult = ko.observable();
    // this function is for mediawiki AJAX request
    this.loadPlaceInfo = function(search, cb) {

     $.ajax({
         asnyc: true,
         dataType: "jsonp",
         type: "GET",
         url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + search + "&format=json",
         success: function(wikiResult, status) {
                var wikiHTML;
                var resultNum;

                // if there is no results from wiki, send out this message
                if(wikiResult[1].length === 0) {
                    wikiHTML = '<ul><li>' + 'no results from wiki' + '</li></ul>';

                } else {
                    wikiHTML = '<ul>';
                    // restrict the number of result to 0 to 3
                    if(wikiResult[1].length > 2){
                        resultNum = 2;
                    } else {
                        resultNum = wikiResult[1].length;
                    }

                    //
                    for (i=0; i<resultNum; i++){
                        wikiHTML += '<li class="placeName">'+ i +'. '+ wikiResult[1][i] + '</li>';
                        wikiHTML += '<li class="placeDesc">' + wikiResult[2][i] + '</li>';
                    }
                    wikiHTML += '</ul>';
                }

                self.wikiResult(wikiHTML);

             if (cb) {
                 cb();
             }
         },
         error: function(result, status, err) {
             alert("error with connection from mediawiki: " + status);
             //run only the callback without attempting to parse result due to error
             if (cb) {
                 cb();
             }
         }
     });
    };
};

// share 'map' as a Global variable
var map;
// share 'largeInfowindow; as Global variable
var largeInfowindow;

/////// INITMAP
function initMap() {
    var self = this;
	// uglified the styles of the map to save space
    var mapStyles=[{featureType:"water",elementType:"all",stylers:[{hue:"#7fc8ed"},{saturation:55},{lightness:-6},{visibility:"on"}]},{featureType:"water",elementType:"labels",stylers:[{hue:"#7fc8ed"},{saturation:55},{lightness:-6},{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{hue:"#83cead"},{saturation:1},{lightness:-15},{visibility:"on"}]},{featureType:"landscape",elementType:"geometry",stylers:[{hue:"#f3f4f4"},{saturation:-84},{lightness:59},{visibility:"on"}]},{featureType:"landscape",elementType:"labels",stylers:[{hue:"#ffffff"},{saturation:-100},{lightness:100},{visibility:"off"}]},{featureType:"road",elementType:"geometry",stylers:[{hue:"#ffffff"},{saturation:-100},{lightness:100},{visibility:"on"}]},{featureType:"road",elementType:"labels",stylers:[{hue:"#bbbbbb"},{saturation:-100},{lightness:26},{visibility:"on"}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{hue:"#ffcc00"},{saturation:100},{lightness:-35},{visibility:"simplified"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{hue:"#ffcc00"},{saturation:100},{lightness:-22},{visibility:"on"}]},{featureType:"poi.school",elementType:"all",stylers:[{hue:"#d7e4e4"},{saturation:-60},{lightness:23},{visibility:"on"}]}];
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        styles: mapStyles,
    });
    // making an instance of a infowindow
    largeInfowindow = new google.maps.InfoWindow();

    boundMarkers(init_places);

}


////// GLOBAL varaibles and functions
function boundMarkers(findLocation, isDuplicate){
    // This makes bounding easier
    var bounds = new google.maps.LatLngBounds();
    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete = new google.maps.places.Autocomplete(document.getElementById('searchInput'));
    //Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo('bounds', map);

    // The following group uses the location array to create an array of markers
    // """on initialize""".
    findLocation.forEach(function(place){
        // Get the position from the location array.
        var position = place.geometry.location;
        var title = place.name;
        //Extend the boundaries of the map
        bounds.extend(place.geometry.location);
        //** Create a marker per location, and put into markers array.
        markMarkers(position, title, largeInfowindow, isDuplicate);
    });
    // findLocation.forEach(function(item){
    //     bounds.extend(item.geometry.location);
    // });
    // make map fit into the boundaries
    map.fitBounds(bounds);

}

// marking the Markers with added functionalty of Event-trigger
function markMarkers(location, title, Infowindow, isDuplicate) {


    var thisInfowindow = Infowindow;

    var marker = new google.maps.Marker({
        map: map,
        position: location,
        title: title,
        animation: google.maps.Animation.DROP
    });

    if (isDuplicate !== true){
        markers.push(marker);
    } else {
        list_view_marker.push(marker);
    }
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
        var self=this;
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

// disable 'enter key' for adding-routes button
// $('.adding-route').on('keyup keypress', function(e) {
//   var keyCode = e.keyCode || e.which;
//   if (keyCode === 13) {
//     e.preventDefault();
//     return false;
//   }
// });
