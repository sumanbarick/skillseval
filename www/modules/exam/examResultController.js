(function(){
    angular.module("skillseval").controller("examResultController", examResultController);
    
    examResultController.$inject = ["$location", "$rootScope", "examService", 'modalService', 'secretService'];

    function examResultController ($location, $rootScope, examService, modalService, secretService) {
        var vm = this;
        vm.currentExam = examService.getCurrentExam();
        vm.wrongQAs = undefined;
        vm.certificateLink = undefined;

        vm.generateCertificateLink = generateCertificateLink;
        vm.showCertificate = showCertificate;

        init();

        function init () {
            if (vm.currentExam && vm.currentExam.result) {
                vm.wrongQAs = vm.currentExam.result.incorrectQs;
            }
            else {
                //redirect to library index page
            }

            modalService.hideLoader();
        }


        function generateCertificateLink () {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var d = new Date();
            var certCode = vm.nameOfUser + '|' 
                        + vm.currentExam.examName + '|' 
                        + d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear() + '|'
                        + vm.currentExam.result.totalQ + '|'
                        + vm.currentExam.result.skipped + '|'
                        + vm.currentExam.result.correct + '|'
                        + vm.currentExam.result.totalTime + '|'
                        + vm.currentExam.result.timeTaken;

            vm.certificateLink = secretService.encrypt(certCode);
        }

        function showCertificate () {
            $rootScope.tempCertCode = vm.certificateLink;
            $location.path('/exam/certificate');
        }
    }
})();