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
    console.log("ViewModel loaded");
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

    // SIDEBAR ROUTES FEATURES
    // ko.array for holding routes
    this.items = ko.observableArray(routeData);
    //
    this.points = ko.observableArray([]);
    // ko.ob for taking in the input from the user
    this.itemToAdd = ko.observable("");
    // when input submitted, addItem function runs to add it to items
    this.addItem = function() {
        if (self.itemToAdd() !== "") {
            var routeItem = {
                name: self.itemToAdd(),
                routePoints: []
            };
            self.items.push(routeItem); // Adds the item. Writing to the "items" observableArray causes any associated UI to update.


            _.each(routeItem.routePoints, function(obj){
                self.points.push(obj);
            });
            self.itemToAdd(""); // Clears the text box, because it's bound to the "itemToAdd" observable

        }
    };
    // click event:
    // deletes the selected route item from the sidebar
    this.thisItemDelete = function(){
        var that = this;
        self.items.remove(function(item){
            return item.name == that.name;
        });
    };

    this.searched= ko.observableArray();
    // Attach event trigger on the zoom-to-area button


	// enterKeyPress event
	this.enterKeyPress = function() {
		self.searched.removeAll();
		this.zoomToArea(largeInfowindow);
    };

	// This function takes the input value in the find nearby area text input
	// locates it, and then zooms into that area. This is so that the user can
	// show all listings, then decide to focus on one area of the map.
	this.zoomToArea = function(infowindow) {
		// reset all the markers
	    hideListings();

	    var getPlacesDetails = function(result) {
	      var service = new google.maps.places.PlacesService(map);
	      service.getDetails({
	        placeId: result.place_id
	      }, function(place, status) {
	        if (status === google.maps.places.PlacesServiceStatus.OK) {

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
	          if (place.opening_hours) {
	            innerHTML += '<br><br><strong>Hours:</strong><br>' +
	                place.opening_hours.weekday_text[0] + '<br>' +
	                place.opening_hours.weekday_text[1] + '<br>' +
	                place.opening_hours.weekday_text[2] + '<br>' +
	                place.opening_hours.weekday_text[3] + '<br>' +
	                place.opening_hours.weekday_text[4] + '<br>' +
	                place.opening_hours.weekday_text[5] + '<br>' +
	                place.opening_hours.weekday_text[6];
	          }
	          if (place.photos) {
	            innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
	                {maxHeight: 100, maxWidth: 200}) + '">';
	          }
	          innerHTML += '</div>';

			  //also, check whether the result is same. Korean bug issues
			  if(formerHTML !== innerHTML) {
				  self.searched.push(innerHTML);
			  }
			  var formerHTML = innerHTML;

	        }
	      });
	    };
		var geocoder = new google.maps.Geocoder();
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

	                // Make the found places blank
	                results.forEach(function(result) {
	                    var location = result.geometry.location;
	                    var title = result.address_components[0].short_name;
	                    markMarkers(location, title, infowindow, 0);
	                    // push the result in
	                    getPlacesDetails(result);
	                });
	                // markMarkers(results[0].geometry.location, results[0].address_components[0].short_name, infowindow, 0);
	                map.setZoom(15);
	            } else {
	                window.alert('We could not find that location - try entering a more' +
	                    ' specific place.');
	            }
	        });
	    }
	    console.log(1);
	};


	// This function will loop through the listings and hide them all.
	this.hideListings = function(){
	    for (var i = 0; i < markers.length; i++) {
	      markers[i].setMap(null);
	    }
	};

};

function initMap() {
    console.log('initMap called');
    var self = this;

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
    $('.route').on('click',function(){
        var routeText = ($(this).text());
        var selected = _.find(init_routes, function(obj){
            return obj.name == routeText;
        });
        drawRouteLine(selected);
    });

    console.log('initMap ended');
}

// put map as an Global variable
var map;
// share it global
var largeInfowindow;

var loadMap = function() {
    initMap();
    ko.applyBindings(new ViewModel(init_routes, init_places, found_places, searched_places));
};
