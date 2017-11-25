(function(){
    angular.module("skillseval", ['ngRoute'])

    .run(["$rootScope", "examService", function ($rootScope, examService) {

        // $rootScope.$on('$routeChangeStart',function (event, next, current){
        //     if(next.originalPath.indexOf('route1')!==-1){
        //         console.log("routeChangeStart detected");
        //         event.preventDefault();
        //     }
        // });

        if(angular._9.hostType === 'app') {
            $rootScope.isMobileApp = true;
        }

        $rootScope.$on("$locationChangeStart", function(event, nextUrl, currentUrl) {
            //if(nextUrl.indexOf('route1')!==-1){
                //console.log('locationChangeStart detected');
                //console.log(currentUrl);
                //event.preventDefault();
            //}

            //User should not be able to use back button in exam page
            if (currentUrl.indexOf("/examenv") > -1 && examService.getCurrentExam().running) {
                event.preventDefault();
                console.log("Can't use browser navigation from Exam Environment...");
            }
        });

        //var prevPageY = 0;
        $(document).on('scroll', function(e){

            //console.log(e);

            //going up
            if ($(window).scrollTop() < 70) {
                $('body').removeClass('scrollingDown');
            }

            //coming down
            else {
                $('body').addClass('scrollingDown');          
            }

            //prevPageY = e.originalEvent.pageY;
        });
    }]);
})();