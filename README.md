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


#### Getting the searched result out
==Problem : I was having difficulty of getting the searched result from the Google Map API to be stored at observable array== 
```
function zoomToArea(infowindow) {
	...
    ...
    return SearchedResult;
}
```
```
this.zoomToArea = function(infowindow) {
		// reset
        ...
});
```
Solved it by changing two things
1. I moved the event listner from the initMap function to the ViewModel, becuase of its lexcial scope.
2. I changed the position of the function from outside of the ViewModel to the inside, as a method. This was really big step. Before this, I tried returning the value and all sort of things. It all failed due to the complexity of the callback. (and of closurses and functional scope)
3. additionally I found out that I was calling the function twice when I enterKey-ed the search bar. Fixed this.


###
