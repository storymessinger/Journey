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
describe('sidebar',function(){
    var $sidebar = $('.sidebar');
    var $route = $('.route');

    /* TODO: should have array of
    markers to remember */
    it('should have array of markers', function(){

    });
    /* TODO: should be making a line-route
    out of markers when clicked */
    it('should be making a line-route out of markers when clicked', function(){

    });

    /* TODO: should have one add-route btn
    which makes duplicate of 'blank route'
    */

    /* TODO: should be editable */
});
