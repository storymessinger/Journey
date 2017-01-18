#Journey
*From Udacity Frontend Nanodegree Project*

## About
This project is an web service project  to make an website which will keep your journey routes.
This could be used ...
1. When you are planning for your trip to somewhere
2. When you want to remember the route you have been
3. or just find a place of your interest

## How to use

#### Search address/places
You are able to search many places via Google Map API service with the search bar provided.
You can also search places by using keywords such as 'pizza'  with the search bar.
If it is not a recognized address, search will give users recommendations. (via Google Map Places library)

#### Editing routes
Your 'Route' can be made by using the sidebar provided by clicking one of the routes and than, adding the places you have searched. By adding the places, it will automatically updated the route.

#### Convenient UI
Your recent searches are remembered on your sidebar. By clicking one of them, it will go back to your history of your findings.

## Future TODOs
1. This service should  linked to a certain database. By this way, people will finally able to 'Save' their routes.
2. the UI could be thought more carefully, based on the usuabillity. Should test out with users.
3. After (1), routes editing functionality could be upgraded. There could be deleting some places in the route, as well as option for optimizing the route vis Google Map distance library. Also it could provide some information about the route.
~~4. Search result could be linked to related websites or wikis.

## (supplementary) Breakthroughs during development

#### 1. Basic structure problem
==Problem : Cannnot get Google API and knockoutJS working together==
==Solved: By loading the ViewModel of the knockoutJS **after** google API has loaded.==
```
var data = [ ];
var map;

var ViewModel = function(){};

function initMap() {
	map = new google.maps.map(document.getElementbyId('map'), {
    ...
    });
    ...
};

// this is the callback function
var loadMap = function(){
	initMap();
    ko.applyBindings(new ViewModel(init_routes));
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

##### 4, How to link it to a database?
![image](http://storymessinger.github.io/Journey/Image002.png)















# license
The content of this repository is licensed under a Creative Commons Attribution License