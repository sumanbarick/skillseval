(function(){
    angular.module("skillseval").factory("secretService", secretService);
    
    secretService.$inject = [];

    function secretService () {
        angular.CryptoJS = CryptoJS;
        CryptoJS = undefined;
        delete window.CryptoJS;
        delete window.crypto;
        var key = undefined;

        return {
            encrypt: encrypt,
            decipher: decipher,
            getAnswer: getAnswer
        }

        function _getKey () {
            //return "_S6h1K!N8c$7FkM-W#92yTix$@X9sZ";
            if(key !== undefined) {
                return key;
            }

            var keys = angular._9.uniKey.split("-");
            key = "";
            for(var i in keys) {
                key += String.fromCharCode(parseInt(keys[i]) % 256);
            }

            return key;
        }

        function decipher (encoded) {
            return angular.CryptoJS.AES.decrypt(encoded, _getKey()).toString(angular.CryptoJS.enc.Utf8);
        }

        function encrypt (s) {
            return angular.CryptoJS.AES.encrypt(s, _getKey());
        }

        function getAnswer (key) {
            var splitted = key.split('-');
            var firstNString = splitted[0] + splitted[1];
            var secondNString = splitted[2] + splitted[3];
            var alphaString = splitted[4] + splitted[5] + splitted[6] + splitted[7];

            //Create ultimateIndex where we can hide ans amongst alphanum
            var ultimateIndex = parseInt(secondNString[firstNString[3]]) + parseInt(secondNString[firstNString[6]]) + parseInt(secondNString[firstNString[9]]);

            //the index should not go beyond (alphaString.length-1)
            ultimateIndex = ultimateIndex % (alphaString.length-1);

            var ans = alphaString[ultimateIndex];

            return ans;
        }
        
    }
})();