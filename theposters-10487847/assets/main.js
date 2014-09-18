(function(){

    var thePosters;
    window.thePosters = thePosters = {};
    
    thePosters = {

        init: function(){
            thePosters.missionScrollInit();            
        },

        missionScrollInit: function(){
            if($('.mission-section').length < 0){
                // mission section not found
                return;
            }
            
            var $window = $(window);
            var $el = $('.mission-section .fund-hours');
            var timeoutId;
            var played = false;

            $window.scroll(function(e){
                // throttle the on scroll handlers
                if(timeoutId){
                    window.clearTimeout(timeoutId)
                }
                timeoutId = window.setTimeout(function(){
                        var inView = checkInView();
                        if(inView && !played){
                            playCounter();
                        }
                    }, 60);

                function playCounter(){
                    played = true;
                    var end = 1276468;
                    var duration = 1000; // in milliseconds
                    var interval = 100; // in milliseconds
                    var variance = 30; // in percent
                    var start = end * (variance/100);
                    var steps = (end - start) / (duration/interval);
                    var counter = start;
                    var display = "";
                    var intervalId = setInterval(function(){
                                if(counter < end){
                                    counter += steps;
                                    counter = Math.round(counter);
                                    display = (counter).toLocaleString();
                                    $el.text(display);
                                }else{
                                    clearInterval(intervalId);
                                }
                        }, interval);
                    
                }

                // find whether the element is in view
                function checkInView(){
                    var viewPortTop = $window.scrollTop();
                    var viewPortBottom = viewPortTop + $window.height();
                    var elTop = $el.offset().top;
                    var elBottom = elTop + $el.height();
                    return ((elBottom <= viewPortBottom) && (elTop >= viewPortTop));
                }
                
            });

        }

    };



    // on dom load
    $(function(){
        thePosters.init();
    });

})();