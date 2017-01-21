// Create a new blank array for all the listing markers.
var markers = [];
var list_view_marker = [];

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
            long_name: "9",
            short_name: "9"
        }
    ],
    formatted_address: "9 Marshall St, Soho, London W1F 7ER, UK",
    place_id : "ChIJrdWi49QEdkgRHfSGuZRCJUM",
    name: "Masala Zone Soho",
    geometry : {
        location: {
            lat: 51.514102,
            lng: -0.137900
        }
    },
    types: ["bar","restaurant", "food"]
},  {
    address_components: [
        {
            long_name: "73",
            short_name: "73"
        }
    ],
    formatted_address: "73 Strand, London WC2R 0DE, UK",
    place_id : "ChIJmxZH4csEdkgR3Og1qwKoO0I",
    name: "Zizzi",
    geometry : {
        location: {
            lat: 51.514530,
            lng: -0.122665
        }
    },
    types: ["meal_takeaway", "restaurant", "food"]
},  {
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
            long_name: "Trafalgar Square",
            short_name: "Trafalgar Square"
        }
    ],
    formatted_address: "Trafalgar Square, London WC2N 5DR, UK",
    place_id : "ChIJhy-eTs4EdkgRjvVoQxhTSYg",
    name: "Charing Cross Underground Station",
    geometry : {
        location: {
            lat: 51.508679,
            lng: -0.127428
        }
    },
    types: ["subway_station","transit_station","point_of_interest","establishment"]
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
