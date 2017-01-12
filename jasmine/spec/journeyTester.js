describe('Google Map API',function(){
    beforeEach(function(done){
        initMap(function(){
            console.log(initMap);
            done();
        });
    });
    // it('is loading nicely', function(done){
    //     expect(map).not.toBe(undefined);
    //     done();
    // });
});

/* TODO: sidebar routes */
describe('sidebar routes',function(){
    var $sidebar = $('.sidebar');

    /* TODO: should have array of
    markers to remember
    DONE
    */
    it('should have array of markers', function(){

    });
    /* TODO: should be making a line-route
    out of markers when clicked
    DONE
    */

    it('should be making a line-route out of markers when clicked', function(){

    });

    /* TODO: should have one add-route btn
    which makes duplicate of 'blank route'
    DONE
    */

    /*TODO: when clicked, it should change color(selected)
    */

    /* TODO: when selected, its varaibles should be changeable
    (user?)
    */

    /* future TODO: routes can be updated / edited
    */

});

describe('search bar', function(){

    /* TODO: should get the information of the place searched (max 5) */

    /* TODO: shold show the first candidate information of the place
    more specifically /*

    /* TODO: should have a < remember > button to add it to init_places
    * should check whether the sidebar udpateds
    */

    /* TODO: should have a < add > button to add it to init_places
    * should check whether the sidebar udpateds
    */

    /* TODO: should show several markers */

});

describe('bug fix',function(){

    /* TODO: search results marker should show the infowindow
    DONE
    */

});
