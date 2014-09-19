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
            
            var $window = $(window),
                $el = $('.mission-section .fund-hours'),
                timeoutId,
                played = false;

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
                    var end = 1276468,
                        diff = 1000,
                        start = end - diff,
                        duration = 2500, // in milliseconds
                        interval = 90, // in milliseconds
                        steps = Math.round((end - start) / (duration/interval)),
                        counter = start,
                        display = "",
                        intervalId;

                    played = true;
                    intervalId = setInterval(function(){
                                if(counter < end){
                                    counter += steps;
                                    counter = Math.min(counter, end);
                                    display = (counter).toLocaleString();
                                    $el.text(display);
                                }else{
                                    clearInterval(intervalId);
                                }
                        }, interval);
                    
                }

                // find whether the element is in view
                function checkInView(){
                    var viewPortTop = $window.scrollTop(),
                        viewPortBottom = viewPortTop + $window.height(),
                        elTop = $el.offset().top,
                        elBottom = elTop + $el.height();
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