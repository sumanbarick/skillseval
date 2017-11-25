(function(){
    angular.module("skillseval").controller("examController", examController);
    
    examController.$inject = ["examService", "$location", 'modalService'];

    function examController (examService, $location, modalService) {
        var vm = this;
        vm.abortExam = examService.abortExam;
        vm.submitExam = submitExam;
        vm.questions = undefined;
        vm.optionIndices = examService.getOptionIndices();
        
        init();

        function init () {
            modalService.showLoader();
            //examService.startExam();
            examService.getQuestions().then(loadQuestions, errorOccurred);
        }

        function loadQuestions (questions) {
            vm.questions = questions;
            //console.log(vm.questions);
            modalService.hideLoader();
        }
            
        function errorOccurred (err) {
            console.log(err);
            alert("Some error occurred... See logs");
        }

        function submitExam () {
            modalService.showLoader();
            //console.log(vm.questions);
            var result = examService.getResult(vm.questions);
            //console.log(result);

            //alert(JSON.stringify(result));

            $location.path('/examresult');
        }
    }
})();