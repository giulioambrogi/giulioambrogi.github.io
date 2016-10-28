claims.services = {};

claims.services = new (function() {
    'use strict';

    function getData(ajaxParams) {
        $.ajax(ajaxParams)
            .done(function(data) {
                if (ajaxParams.callback) {
                    ajaxParams.callback(data);
                }
            })
            .fail(function(jqXHR, textStatus) {
                console.log("Request failed: ", textStatus);
                // Maybe hide a spinner logo here for end of ajax req
                 claims.loader.hide();
            });
    }

    return {
        getData: getData
    };

})();
