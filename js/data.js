// Create a new blank array for all the listing markers.
var markers = [];

var init_routes = [
    {
        selected : false,
        name : 'route 1',
    	route_info: {
            origin: "New York, NY",
            destination: "Boston, MA",
            waypoints: [
    			{
    				location: {
                        lat: 40.723781,
                        lng: -74.146238
                    },
    				stopover: true
    			},
    			{
    				location: {
                        lat: 41.723781,
                        lng: -70.146238
                    },
    				stopover: true
    			}
    		],
            optimizeWaypoints: true
            // travelMode: google.maps.TravelMode.DRIVING
        }
    },
    {
        selected : false,
        name : 'route 2',
    	route_info: {
            origin: "Tokyo",
            destination: "Osaka",
            waypoints: [
    			{
    				location: "Kyoto",
    				stopover: true
    			}
    		],
            optimizeWaypoints: true
            // travelMode: google.maps.TravelMode.DRIVING
        }
    }
];

var init_places = [
    {
    name: 'Big Ben',
    geometry : {
        location: {
            lat: 51.500650,
            lng: -0.122075
        }
    }

}, {
    name: 'Westminster',
    geometry : {
        location: {
            lat: 51.499531,
            lng: -0.123856
        }
    }
}, {
    name: 'RCA',
    geometry : {
        location: {
            lat: 51.501135,
            lng: -0.177372
        }
    }
}, {
    name: 'London Eye',
    geometry : {
        location: {
            lat: 51.503334,
            lng: -0.118959
        }
    }
}, {
    name: 'National Theater',
    geometry : {
        location: {
            lat: 51.507004,
            lng: -0.114034
        }
    }
}];
