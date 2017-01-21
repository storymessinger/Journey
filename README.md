#Journey
*From Udacity Frontend Nanodegree Project*

## About
This project is an web service project  to make an website which will keep your journey routes.
This could be used ...
1. When you are planning for your trip to somewhere
2. When you want to remember the route you have been
3. or just find a place of your interest

## How to use the application

#### "(sidebar) Place List-view
1. What you have searched(recent search) is remembered on the left side, top of the sidebar. (up to 10 search results)
	- You can click the recent search results, and it will automatically find it again
	- (bug fix) it now does not add additonal markers 

#### "(sidebar) Easy List Filter" : Filter
1. You can filter the place lists by using this easy-Filter. This is an 'shortcut' feature for the "Filter Recent Search" feature below.
2. Now, three easy-filter is available; University, restaurant and subway station)
![easy Filter](https://github.com/storymessinger/Journey/blob/master/README_img/EasyFilter_img_01.PNG)

#### "World Search" : Search address/places around the world
1. You are able to search many places via Google Map API service with the search bar provided.(via Google Map Geocode Library)
![worldSearch](https://github.com/storymessinger/Journey/blob/master/README_img/worldSearch_img_01.PNG)
2. This search has a fallback. When the result is not sure (partial search = true), it falls back on **Nearby Search**, and uses Google Map Places Libary.

#### "Nearby Place Search" : Search places nearby
1. You can search nearby places by using this option of the search. For example, searching for pizza places nearby.
![nearbySearch](https://github.com/storymessinger/Journey/blob/master/README_img/nearbySearch_img_01.PNG)

#### "Filter Recent Searches" : Filter the searched results 
1. You can filter the recent search results by using **Filter Recent Search**
2. It filters among the 10 recent search results and show them.
![filterSearch](https://github.com/storymessinger/Journey/blob/master/README_img/filterSearch_img_01.PNG)

#### 'Routes' : Editing routes
1. You can select a route and add waypoints in the route by following steps
	- First, search a place of your taste
	- Second, press 'Add to route' button.
2. You can also make your own custom route.
	- The first place you add to your custom route will be the start point (origin)
    - The second place you add will be the end point (destination)
    - The rest will add to your mid-waypoints

#### "Wiki results" : finding information about the place in the wiki
1. With every search, you can see the information about the place through mediaWiki API.
2. The information is shown on the right, bottom side.
![wiki info](https://github.com/storymessinger/Journey/blob/master/README_img/wikiInfo_img_01.PNG)


## Criteria (udacity)
- [x] Includes a text input field or dropdown menu that filters the map markers and list items to locations matching the text input or selection. Filter function runs error-free.
- [x] Code is properly separated based upon Knockout best practices (follow an MVVM pattern, avoid updating the DOM manually with jQuery or JS, use observables rather than forcing refreshes manually, etc). Knockout should not be used to handle the Google Map API.
- [x] Application utilizes the Google Maps API and at least one non-Google third-party API.
- [x] Functionality providing additional data about a location is provided and sourced from a 3rd party API. Information can be provided either in the marker’s infoWindow, or in an HTML element in the DOM (a sidebar, the list view, etc.)
- [x] A README file is included detailing all steps required to successfully run the application.

## Supplementary

#### 1. Basic structure problem
==Problem : Cannnot get Google API and knockoutJS working together==
==Solved: By loading the ViewModel of the knockoutJS **after** google API has loaded.==
```
var data = [ ];
var map;

var ViewModel = function(){

};

function initMap() {
	map = new google.maps.map(document.getElementbyId('map'), {
    ...
    });
    ...
};

// this is the callback function
var loadMap = function(){
	initMap();
    ko.applyBindings(new ViewModel());
}
```

I had a had time figuring out how to manage the structure and the data-binding when dealing with knockout and Google Maps API. One of the [Udacity discussions](https://discussions.udacity.com/t/fighting-a-knockout-vs-google-maps-brick-wall/164367/4) gave me a great help how to solve the problem.
By this way, you can be sure that Google Maps can be loaded **before** you apply bindings to the map(or any data related).
Had to rebuild all of my structure from the bottom. Hard learnt lession. "Think before you make"

___


#### 2.Getting the searched result out
==Problem : I was having difficulty of getting the searched result from the Google Map API to be stored at observable array== 
```
function zoomToArea(infowindow) {
	...
    ...
    return SearchedResult;
}
```
==Solved : changed the following two things == 
```
this.zoomToArea = function(infowindow) {
		// reset
        ...
});
```
1. I moved the **event listner** from within the initMap() function to the ViewModel, becuase of its lexcial scope.
2. I changed the position of the **zoomToArea function to be inside the ViewModel**. This was really big step. Before this, I tried returning the value and all sort of things. It all failed due to the complexity of the callback. (and of closurses and functional scope)

___


##### 3. (knockoutJS) How to make the properties of an observable array, observable?

==Problem: Difficulty in making an observable array which could catch the changes in its properties==

1. In the following example, I could not observe the change in the properties of, for example 'Big Ben' or 'Westminster'.

```
var startRouteData = [
	{
    title: 'Big Ben',
    location: {
        lat: 51.500650,
        lng: -0.122075 }
	}, {
    title: 'Westminster',
    location: {
        lat: 51.499531,
        lng: -0.123856 }
	}
]
```
```
var ViewModel = function(startRouteData) {
	this.startPosition = ko.observableArray([]);
    _.each(startPositionData, function(place) {
        self.startPosition.push(new Place_list(place));
    });
...
...
}
...
var Place_list = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};
```
==Solved: ==


___
 License
