claims = {};

claims.base = new (function() {
    'use strict';

    this.init = function() {
        runWidgets();
        claims.loader.init();
    };

    this.parseWidgets = function($domain) {
        runWidgets($domain); //didnt use base init as that could grow
    };
    function runWidgets($domain) {

        var $widgetSelector = $("[data-widget]");       
        if($domain){
             $widgetSelector = $domain.find("[data-widget]");             
        }
       

        //widget value needs to equal a module name
        $widgetSelector.each(function() {
            var widgetType = $(this).attr("data-widget"),
            registered = $(this).attr("data-reg");
            if (typeof claims.controllers[widgetType] != 'undefined' && registered != 'true') {
                //widget has associated module so run
                claims.controllers[widgetType].init($(this));
                //register widget
                $(this).attr("data-reg","true");
            }
        });
    }

})();
$(document).ready(function() {
    claims.base.init();
});
