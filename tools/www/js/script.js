(function(){

    makePanelsCollapsible();

    //User clicks on Encrypt Unikey
    $(document).on('click', '#encrypt-unikey', function () {
        $('#out-encUnikey').val(encryptUnikey($('#unikey-src').val()));
    });

    //User clicks on Decrypt Unikey
    $(document).on('click', '#decrypt-unikey', function () {
        $('#out-decUnikey').val(decryptUnikey($('#encrypted-unikey').val()));
    });


    //User clicks on Encrypt Text
    $(document).on('click', '#encrypt-string', function () {
        $('#encoded-src-text').val(encryptText($('#src-text').val()));
    });


    //User clicks on Decrypt Text
    $(document).on('click', '#decrypt-string', function () {
        $('#decrypted-src-text').val(decryptText($('#encoded-text').val()));
    });


    //user clicks on decrypt QA
    $(document).on('click', '#decrypt-qa', function () {
        $('#out-decrypted-qa').html(decryptQA($('#in-encrypted-qa').val())).closest('.panel').removeClass('hide');
    });


    /*
    * Input String => Original UniKey
    * Output String => Ecrypted Unikey
    */
    function encryptUnikey (srcKey) {
        var res = [];
        for (var i in srcKey) {
            res.push(Math.ceil(Math.random() * 99999 + 999) * 256 + srcKey[i].charCodeAt());
        }
        return res.join("-");
    }


    /*
    * Input String => Ecrypted unikey
    * Output String => Decypted / Original unikey
    */
    function decryptUnikey (encKey) {
        var keys = encKey.split('-');
        var res = [];
        for (var i in keys) {
            res.push(String.fromCharCode(parseInt(keys[i]) % 256));
        }
        return res.join("");
    }


    function makePanelsCollapsible () {
        var carets = '<i class="fa fa-caret-up collapse-key up"></i><i class="fa fa-caret-down collapse-key down"></i>';
        $('.panel-heading').addClass('collapse-header closed').append(carets);
        $('.panel-body').addClass('collapse-body').hide();

        $('.collapse-header').on('click', function () {
            if ($(this).hasClass('closed')) {
                $(this).removeClass('closed').addClass('opened');
                $(this).next('.collapse-body').slideDown();
            }
            else {
                $(this).removeClass('opened').addClass('closed');
                $(this).next('.collapse-body').slideUp();
            }
        })
    }


    function decryptAnswer (key) {
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

    function decryptQA (encJSONString) {
        var encodedQAs = JSON.parse(encJSONString).enc;        
        var qas = JSON.parse(decryptText(encodedQAs));
        var abcd = "ABCDEFGHIJKLMNOP";
        var htm = '';

        $.each(qas, function(i, qa){
            htm += "Q-" + (i+1) + ". <pre>" + qa.q + "</pre>";

            $.each(qa.options, function(j, op){
                htm += abcd[j] + ". <pre>" + op + "</pre>";
            });

            htm += "Ans. " + decryptAnswer(qa.key) + "<br><br><br>";
        });

        return htm;
    }

    function encryptText (s) {
        var key = "_S6h1K!N8c$7FkM-W#92yTix$@X9sZ";
        return CryptoJS.AES.encrypt(s, key);
    }

    function decryptText (s) {
        var key = "_S6h1K!N8c$7FkM-W#92yTix$@X9sZ";
        return CryptoJS.AES.decrypt(s, key).toString(CryptoJS.enc.Utf8);
    }
})();