// Create a new blank array for all the listing markers.
var markers = [];

//
var found_places = [
    {
        placeDetail: "<div>Dummy data</div>"
    }
];

//
var init_routes = [
    {
        name: 'london_route01',
        routePoints: [
            {
                // title: 'Big Ben',
                location: {
                    lat: 51.500650,
                    lng: -0.122075
                }
            }, {
                // title: 'Westminster',
                location: {
                    lat: 51.499531,
                    lng: -0.123856
                }
            }, {
                // title: 'RCA',
                location: {
                    lat: 51.501135,
                    lng: -0.177372
                }
            }, {
                // title: 'US Embassy, London',
                location: {
                    lat: 51.51251,
                    lng: -0.1528990
                }
            }
        ]
    },
    {
        name: 'route02',
        routePoints: [
            {
                location: {
                    lat: 53.500650,
                    lng: -0.122075
                }
            }, {
                location: {
                    lat: 53.499531,
                    lng: -0.123856
                }
            }, {
                location: {
                    lat: 54.501135,
                    lng: -0.177372
                }
            }, {
                location: {
                    lat: 54.51251,
                    lng: -0.1528990
                }
            }
        ]
    },
];

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
