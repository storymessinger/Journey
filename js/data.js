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
    address_components: [
        {
            long_name: "London",
            short_name: "London"
        }
    ],
    formatted_address: "Westminster, London SW1A 0AA, UK",
    place_id : "ChIJ2dGMjMMEdkgRqVqkuXQkj7c",
    name: "Big Ben",
    geometry : {
        location: {
            lat: 51.500889,
            lng: -0.124636
        }
    },
    types: ["premise","point_of_interest","establishment"]
}, {
    address_components: [
        {
            long_name: "Westminster",
            short_name: "Westminster"
        }
    ],
    formatted_address: "Westminster, London, UK",
    place_id : "ChIJVbSVrt0EdkgRQH_FO4ZkHc0",
    name: "Westminster",
    geometry : {
        location: {
            lat: 51.499531,
            lng: -0.123856
        }
    },
    types: ["neighborhood","political"]
}, {
    address_components: [
        {
            long_name:"Kensington Gore",
            short_name: "Kensington Gore"
        }
    ],
    formatted_address: "Kensington Gore, Kensington, London SW7 2EU, UK",
    place_id : "ChIJM8PHBFsFdkgRFJMllTutvtg",
    name: "Royal College of Art",
    geometry : {
        location: {
            lat: 51.501135,
            lng: -0.177372
        }
    },
    types: ["university","point_of_interest","establishment"]
}, {
    address_components: [
        {
            long_name:"London",
            short_name: "London"
        }
    ],
    formatted_address: "Lambeth, London SE1 7PB, UK",
    place_id : "ChIJc2nSALkEdkgRkuoJJBfzkUI",
    name: 'London Eye',
    geometry : {
        location: {
            lat: 51.503334,
            lng: -0.118959
        }
    },
    types: ["point_of_interest","establishment"]
}, {
    address_components: [
        {
            long_name:"Upper Ground",
            short_name: "Upper Ground"
        }
    ],
    formatted_address: "Upper Ground, South Bank, London SE1 9PX, UK",
    place_id : "ChIJdYvbqaMEdkgRDdOt_IfsYRc",
    name: "National Theatre",
    geometry : {
        location: {
            lat: 51.507004,
            lng: -0.114034
        }
    },
    types: ["point_of_interest","establishment"]
}];
