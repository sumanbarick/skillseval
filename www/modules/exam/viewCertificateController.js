(function(){
    angular.module("skillseval").controller("viewCertController", viewCertController);
    
    viewCertController.$inject = ["secretService", "examService", "$location", 'modalService', "$rootScope"];

    function viewCertController (secretService, examService, $location, modalService, $rootScope) {
        var vm = this;
        vm.showCertificate = showCertificate;
        
        init();

        function init () {
            $rootScope.tempCertCode = '';
            // modalService.showLoader();
            // decodeCertificate();
            // modalService.hideLoader();
        }

        function showCertificate () {
            if(!!$rootScope.tempCertCode.trim()) {
                $location.path("/exam/certificate");
            }
        }
    }
})();