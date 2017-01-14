// Create a new blank array for all the listing markers.
var markers = [];

var searched_places = ['a','b'];

var found_places = [];

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
    },
    {
        selected : false,
        name : 'route 3',
    	route_info: {
            origin: "Seoul",
            destination: "Busan",
            waypoints: [
    			{
    				location: "Daejeon",
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
