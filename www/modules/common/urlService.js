(function(){
	angular.module("skillseval").factory("urlService", urlService);
	
	urlService.$inject = ["$window"];

	function urlService ($window) {
		var hostType = angular._9.hostType;
		var appRoot = angular._9.appRoot;
		var webRoot = angular._9.webRoot;
		var dataRoot = angular._9.dataRoot;

		var partialLibUrl = {
			"libName": "library",
			"partUrl": "library"
		};	//defualt to library index

		return {
			getDataRootUrl: getDataRootUrl,
			getLibraryUrl: getLibraryUrl,
			getTopicUrl: getTopicUrl,
			getMightyUrl: getMightyUrl,
			getExamCodeConfigUrl: getExamCodeConfigUrl
		};

		function getRoot () {
			var root;
			//if app, get appRoot
			if (hostType === "app") {
				root = appRoot;
			}
			//else get webRoot
			else {
				root = webRoot || $window.location.href.substr(0, $window.location.href.indexOf('#'));
			}

			return root;
		}

		function getDataRootUrl () {
			return getRoot() + "/" + dataRoot;
		}

		function getPathToLibrary (libName) {
			var pathToLib = angular._9.xlib[libName] || "library";
			
			//If does not start with raw, then must be encoded
			if (pathToLib.substr(0,4) !== "raw:") {
				pathToLib = secretService.decipher(pathToLib);
			}

			//if still starts with "raw:" then remove it 
			if (pathToLib.substr(0,4) === "raw:") {
				pathToLib = pathToLib.substr(4);
			}
			return pathToLib;
		}

		function getLibraryUrl (libName) {
			var ext = (angular._9.dataRoot === 'devData') ? 'index.json' : 'index.enc.json';
			return getDataRootUrl() + "/" + getPathToLibrary(libName) + "/" + ext;
		}

		function getTopicUrl(libName, topicName) {
			var ext = (angular._9.dataRoot === 'devData') ? 'index.json' : 'index.enc.json';
			return getDataRootUrl() + "/" + getPathToLibrary(libName) + "/" + topicName + "/" + ext;
		}

		function getMightyUrl (libName, topicName) {
			var ext = (angular._9.dataRoot === 'devData') ? '.mighty.qa.json' : '.mighty.qa.enc.json';
			return getDataRootUrl() + "/" + getPathToLibrary(libName) + "/" + topicName + "/" + topicName + ext;
		}

		function getExamCodeConfigUrl(examCode) {
			return getRoot() + "/configs/examCode-" + examCode.split('-')[0] + ".json";
		}
	}
})();