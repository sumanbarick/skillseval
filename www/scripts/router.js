(function(){
	angular.module("skillseval")
	.config(["$routeProvider", function ($routeProvider) {

		$routeProvider

		.when("/home", {
			templateUrl: "modules/home/homeTemplate.html",
			controller: "homeController",
			controllerAs: "vm"
		})


		.when("/library/:libName", {
			templateUrl: "modules/library/libraryTemplate.html",
			controller: "libraryController",
			controllerAs: "vm"
		})
		.when("/library/:libName/:topic", {
			templateUrl: "modules/topic/topicTemplate.html",
			controller: "topicController",
			controllerAs: "vm"
		})
		.when("/examenv", {
			templateUrl: "modules/exam/examTemplate.html",
			controller: "examController",
			controllerAs: "vm"
		})
		.when("/examresult", {
			templateUrl: "modules/exam/examResultTemplate.html",
			controller: "examResultController",
			controllerAs: "vm"
		})

		.when("/exam/certificate", {
			templateUrl: "modules/exam/certificateTemplate.html",
			controller: "certController",
			controllerAs: "vm"
		})

		.when("/exam/viewcertificate", {
			templateUrl: "modules/exam/viewCertificateTemplate.html",
			controller: "viewCertController",
			controllerAs: "vm"
		})

		.when("/", {
			redirectTo: "/home"
		})
		.otherwise({
			redirectTo: "/"
		});

	}]);
})();