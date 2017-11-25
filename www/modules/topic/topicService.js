(function(){
	angular.module("skillseval").factory("topicService", topicService);
	
	topicService.$inject = ['ajaxService', 'urlService'];

	function topicService (ajaxService, urlService) {
		return {
			getTopics: getTopics,
			getQuickExams: getQuickExams
		}

		function getTopics (libName, topicName) {
			return ajaxService.doGet(urlService.getTopicUrl(libName, topicName));
		}

		function getQuickExams (examCodeExt) {
			return [
                {
                    "subType": "Micro",
                    "examCode": examCodeExt + "-0",
                    "noOfQuestions": 10,
                    "totalTime": "15 min"
                },
                {
                    "subType": "Mini",
                    "examCode": examCodeExt + "-1",
                    "noOfQuestions": 30,
                    "totalTime": "45 min"
                },
                {
                    "subType": "Standard",
                    "examCode": examCodeExt + "-2",
                    "noOfQuestions": 60,
                    "totalTime": "1 hr 30 min"
                },
                {
                    "subType": "Macro",
                    "examCode": examCodeExt + "-3",
                    "noOfQuestions": 80,
                    "totalTime": "2 hr"
                },
                {
                    "subType": "Major",
                    "examCode": examCodeExt + "-4",
                    "noOfQuestions": 100,
                    "totalTime": "2 hr 30 min"
                }
            ];
		}
	}
})();