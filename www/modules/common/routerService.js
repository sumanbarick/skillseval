(function(){
    angular.module("skillseval").factory("routerService", routerService);
    
    routerService.$inject = [];

    function routerService () {
        var prevRoute = undefined;

        return {
            setPrevRoute: setPrevRoute,
            getPrevRoute: getPrevRoute
        }

        function setPrevRoute (r) {
            prevRoute = r;
        }

        function getPrevRoute () {
            return prevRoute;
        }
    }
})();