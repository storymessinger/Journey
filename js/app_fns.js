// marking the Markers with added functionalty of Event-trigger
function markMarkers(location, title, Infowindow, order) {
    var thisInfowindow = Infowindow;

    var marker = new google.maps.Marker({
        map: map,
        position: location,
        title: title,
        animation: google.maps.Animation.DROP
        // id: order
    });
    // Push the marker to our array of markers.
    markers.push(marker);
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

// This function takes the input value in the find nearby area text input
// locates it, and then zooms into that area. This is so that the user can
// show all listings, then decide to focus on one area of the map.
function zoomToArea(infowindow) {

    // found_places=[];

    var getPlacesDetails = function(result) {
      var service = new google.maps.places.PlacesService(map);
      service.getDetails({
        placeId: result.place_id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Set the marker property on this infowindow so it isn't created again.

        //   infowindow.marker = marker;

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

        //   infowindow.setContent(innerHTML);
        //   infowindow.open(map, marker);
        //   // Make sure the marker property is cleared if the infowindow is closed.
        //   infowindow.addListener('closeclick', function() {
        //     infowindow.marker = null;
        //   });
            // console.log({placeDetail: innerHTML});
            // this.found.push({placeDetail: innerHTML});
            // found_places.push({placeDetail: innerHTML});
            // console.log(found_places);
        }
      });
    };

    // hide former markers
    hideListings();
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
}

// draw a route based on the array given
// also adds routePoints to the array item when
// selecting a place
function drawRouteLine(data) {
    var directionsService = new google.maps.DirectionsService;
    // Get the destination address from the user entered value.
    var destinationAddress =
        // get the last object of the array
        data.routePoints.slice(-1)[0].location;
    // var mode =
    var waypointsArr = data.routePoints.slice(1,-1);
    _.each(waypointsArr, function(place){
        place.stopover = false;
    });
    directionsService.route({
        origin:data.routePoints[0].location,
        destination: destinationAddress,
        waypoints:waypointsArr,
        provideRouteAlternatives: false,
        travelMode: google.maps.TravelMode.WALKING
        // travelMode: google.maps.TravelMode[WALKING],
        // unitSystem: UnitSystem.IMPERIAL
    }, function(response, status){
        if (status === google.maps.DirectionsStatus.OK){
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                draggable: true,
                polylineOptions: {
                    strokeColor: 'green'
                }
            });
        } else {
            window.alert('request failed due to ' + status);
        }
    });
}

function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
}
