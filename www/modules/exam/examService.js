(function(){
    angular.module("skillseval").factory("examService", examService);
    
    examService.$inject = ["$q", "ajaxService", "urlService", "secretService"];

    function examService ($q, ajaxService, urlService, secretService) {

        var currentExam = {
            running: false,
            subType: undefined,
            libName: undefined,
            topic: undefined,
            examID: undefined,
            examName: undefined,
            totalTime: undefined,
            noOfQuestions: undefined,
            timeLapse: undefined,
            result: undefined
        };

        var optionIndices = 'ABCDEFGHIJKLMNOP';

        return {
            getCurrentExam: getCurrentExam,
            setCurrentExam: setCurrentExam,
            getQuestions: getQuestions,
            startExam: startExam,
            abortExam: abortExam,
            getResult: getResult,
            getOptionIndices: getOptionIndices,
            getExamNameFromExamCode: getExamNameFromExamCode
        }

        function getCurrentExam () {
            return currentExam;
        }

        function startExam () {
            currentExam.running = true;
        }

        function setCurrentExam (cf) {
            for (var i in cf) {
                currentExam[i] = cf[i];
            }
        }

        function abortExam () {
            currentExam.running = false;
        }

        function getOptionIndices () {
            return optionIndices;
        }

        function getQuestions () {
            var deferred = $q.defer();

            ajaxService.doGet(urlService.getMightyUrl(currentExam.libName, currentExam.topic))
            .then(function(res){
                var qstns;
                if (currentExam.type === "QE") {
                    qstns = selectRandomQs(res.data, currentExam.noOfQuestions);
                }
                else {
                    qstns = res.data;
                }

                deferred.resolve(qstns);
            },

            function(err){
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function selectRandomQs(allQ, noOfQ) {
            var allPossibleIndex = [];
            var resultQ = [];

            var tempIndex;
            while (resultQ.length < noOfQ && allQ.length > 0) {
                tempIndex = Math.floor(Math.random() * allQ.length);
                resultQ.push(allQ[tempIndex]);
                allQ.splice(tempIndex, 1);
            }

            return resultQ;
        }

        function getResult (qs) {
            var correct = 0, 
            //incorrect = 0, 
            notAnswered = 0, 
            totalQ = 0, 
            incorrectQs = [];

            for(var i in qs) {
                ++totalQ;

                if (qs[i].chosenAns === 'Z') {
                    ++notAnswered;
                }
                else {
                    if(qs[i].chosenAns === (qs[i].ans || secretService.getAnswer(qs[i].key))) {
                        ++correct;
                    }
                    else {
                        //++incorrect;
                        qs[i].incorrectAns = qs[i].options[optionIndices.indexOf(qs[i].chosenAns)];
                        qs[i].correctAns = qs[i].options[optionIndices.indexOf(qs[i].ans || secretService.getAnswer(qs[i].key))];
                        incorrectQs.push(qs[i]);
                    }
                }
            }

            currentExam.result = {
                correct: correct,
                //incorrect: incorrect,
                skipped: notAnswered,
                totalQ: totalQ,
                incorrectQs: incorrectQs
            };

            return currentExam.result;
        }

        /*
        * This function will receive an ExamNameCode
        * will lookup that examCode in appropriate lookup file
        * and will return the full name of the exam
        */
        function getExamNameFromExamCode (ExamNameCode) {
            var deferred = $q.defer();
            ajaxService.doGet(urlService.getExamCodeConfigUrl(ExamNameCode))
            .then(function(res){
                deferred.resolve(res.data);
            }, 
            function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }


    }
})();