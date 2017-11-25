(function(){
	angular.module("skillseval").factory("ajaxService", ajaxService);
	
	ajaxService.$inject = ['$http', '$q', "secretService"];

	function ajaxService ($http, $q, secretService) {
		
		return {
			doGet: doGet
		}

		function doGet (url) {
			var deferred = $q.defer();

			$http.get(url).then(function(res){
				if(typeof(res.data.enc) !== "undefined") {
					res.data = JSON.parse(secretService.decipher(res.data.enc));
				}
				deferred.resolve(res);
			},
			function(err){
				deferred.reject(err);
			});

			return deferred.promise;
		}
	}
})();