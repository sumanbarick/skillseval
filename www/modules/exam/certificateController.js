(function(){
    angular.module("skillseval").controller("certController", certController);
    
    certController.$inject = ["secretService", "examService", "$location", 'modalService', "$rootScope"];

    function certController (secretService, examService, $location, modalService, $rootScope) {
        var vm = this;
        vm.certCode = undefined;

        var certCodeArguments = [
            "nameOfUser",
            "examName",
            "examDate",
            "totalQ",
            "skipped",
            "correct",
            "totalTime",
            "timeTaken"
        ];
        
        init();

        function init () {
            modalService.showLoader();
            decodeCertificate();            
        }

        function decodeCertificate () {
            if (!$rootScope.tempCertCode) {
                $location.path("/exam/viewcertificate");
                modalService.hideLoader();
                return;
            }

            vm.certCode = $rootScope.tempCertCode;
            $rootScope.tempCertCode = null; //Once used up, empty the $rootScope.tempCertCode
            var args = secretService.decipher(vm.certCode).split('|');

            for ( var i = 0; i < certCodeArguments.length; i++ ) {                
                vm[certCodeArguments[i]] = args[i];
            }

            examService.getExamNameFromExamCode(vm.examName)
            .then(function(ExCodes){
                vm.examName = ExCodes[vm.examName];

                //set proper height to the decorative side columns
                $('.decorative-col').height($('body').height());

                //Finally hide the modal
                modalService.hideLoader();
            }, 
            function(err){
                console.log(err);
            });
        }
    }
})();