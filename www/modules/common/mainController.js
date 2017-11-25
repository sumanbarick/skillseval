(function(){
    angular.module("skillseval").controller("mainController", mainController);
    
    mainController.$inject = ['$window', 'modalService']

    function mainController ($window, modalService) {
        var mvm = this;
        mvm.gotoPrevPage = gotoPrevPage;
        mvm.isLoaderVisible = modalService.isLoaderVisible;

        init();

        function init () {
            
        }

        function gotoPrevPage () {
            $window.history.back();
        }

        
    }
})();