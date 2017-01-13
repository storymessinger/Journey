#Journey
*From Udacity Frontend Nanodegree Project*

## About

## How to use

## Code snippets

## Breakthroughs during development

#### Basic structure problem
==Problem : Cannnot get Google API and knockoutJS working together==
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


#### 1
==Problem : 2==
