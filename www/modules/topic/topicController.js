(function(){
    angular.module("skillseval").controller("topicController", topicController);
    
    topicController.$inject = ['$rootScope', 'topicService', 'urlService', '$routeParams', '$location', 'examService', 'modalService']

    function topicController ($rootScope, topicService, urlService, $routeParams, $location, examService, modalService) {
        var vm = this;
        vm.topics = undefined;
        vm.quickExams = undefined;
        vm.customNoOfQstn = undefined;
        vm.customTime = undefined;
        vm.startExam = startExam;
        vm.startCustomExam = startCustomExam;

        init();

        function init () {
            modalService.showLoader();
            getTopics();            
        }

        function getTopics () {
            $routeParams.libName = decodeURIComponent($routeParams.libName).toLowerCase();
            $routeParams.topic = decodeURIComponent($routeParams.topic).toLowerCase();
            topicService.getTopics($routeParams.libName, $routeParams.topic)
            .then(loadTopic, commonErrorHandler);
        }

        /*
        * Clear / reset required variables
        * and send back to Library Index page
        */
        function resetToLibraryIndexPage () {
            console.log("Sending back to Library Index Page...");
            $location.path("/library/index");
        }
        

        //load the library in vm
        function loadTopic (res) {
            //console.log(res.data);
            var topics = res.data;
            vm.libName = ($routeParams.topic || $routeParams.libName).toUpperCase();

            vm.topics = topics;

            //console.log(vm.topics);

            initQuickExams();

            //populate attributes from group attribues
            // like, subjectType from groupSubjectType etc
            // for(var i=0; i < library.list.length; i++) {
            //     library.list[i].subjectType = library.list[i].subjectType || library.groupSubjectType;

            //     if(library.list[i].subjectType === 'topic') {
            //         library.list[i].libName = library.list[i].libName || library.groupLibName;
            //     }
            // }
            
            // vm.library = library;
            modalService.hideLoader();
        }

        function startExam (exam) {
            var examConfig = {
                type: "QE",
                subType: exam.subType,
                totalTime: exam.totalTime,
                noOfQuestions: exam.noOfQuestions,
                libName: $routeParams.libName,
                topic: $routeParams.topic,
                examName: exam.examCode || (exam.subType + "-" + $routeParams.topic)   //qx for quickExam
            };

            examService.setCurrentExam(examConfig);
            $location.path("/examenv");
        }

        //A common error handler for now
        function commonErrorHandler (err) {
            console.log(err);           
            resetToLibraryIndexPage();
        }

        function initQuickExams () {
            vm.quickExams = topicService.getQuickExams(vm.topics.examCodeExt);
        }

        function startCustomExam () {
            alert("Custom exam is coming soon. Please choose another one for now...");
            
            //Check if customNoOfQstn and customTime models are populated and then
            //start custom exam
        }
    }
})();