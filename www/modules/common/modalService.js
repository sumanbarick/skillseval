(function(){
    angular.module("skillseval").factory("modalService", modalService);
    
    modalService.$inject = ['$timeout'];

    function modalService ($timeout) {
        var loaderVisible = false;
        var minLoaderVisTime = 2000;
        var loaderStartTime = 0;

        return {
            showLoader: showLoader,
            hideLoader: hideLoader,
            isLoaderVisible: isLoaderVisible
        }

        function showLoader () {
            loaderVisible = true;
            loaderStartTime = (new Date()).getTime();
        }

        function hideLoader () {
            var diff = (new Date()).getTime() - loaderStartTime;
            if(diff > minLoaderVisTime) {
                loaderVisible = false;
                loaderStartTime = 0;
            }
            else {                
                $timeout(hideLoader, (minLoaderVisTime - diff));
            }            
        }

        function isLoaderVisible () {
            return loaderVisible;
        }
    }
})();