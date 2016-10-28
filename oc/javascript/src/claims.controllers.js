claims.controllers = {};

claims.controllers.datepicker = new (function() {
    'use strict';
    this.init = function($ele) {
        var args = {
            'dateFormat': 'dd/mm/yy',
            onClose: function() {
                // add validation for field here
                claims.controllers.form.validateInstance($ele);
            }
        };
        var daterange = $ele.attr("data-daterange");
        if (daterange == 'past') {
            args.maxDate = '+0M +0D';
        }
        $ele.datepicker(args);
    };
});

claims.controllers.menu = new (function() {
    'use strict';
    var $eleDomain;
    this.init = function($ele) {
        $eleDomain = $ele;
        setUpNavHover();
        setUpMenuDropdown();
    };
    function setUpNavHover(){
        var $navLinks = $("> ul > li",$eleDomain);
        $navLinks.hover(function(){
            $navLinks.not(this).addClass("setdown");
        },function(){
            $navLinks.removeClass("setdown");
        });
    }
    function setUpMenuDropdown(){
        var $dropdown = $(".dropdown",$eleDomain);
        $dropdown.on("click",function(e){
            var closeDD = $(e.target).parents("div.content").length;
            if(!closeDD){
                $(this).toggleClass("show");
                ariaControl($(this),"show");
                $(this).find(".icon").toggleClass("icon-user-primary icon-user-secondary");
            }

        });

        $dropdown.hover(function(){
            if(!isMobile()){
                $(this).addClass("show");
                ariaControl($(this),"show");
                $(this).find(".icon").toggleClass("icon-user-primary icon-user-secondary");
            }
        },function(){
            if(!isMobile()){
                $(this).removeClass("show");
                ariaControl($(this),"show");
                $(this).find(".icon").toggleClass("icon-user-primary icon-user-secondary");
            }

        });

    }
    function ariaControl($ele,lookup){
        //set aria conrols, should mopve this to public area of js
        if($ele.hasClass(lookup)){
            $ele.find("[aria-expanded]").attr("aria-expanded","true");
            $ele.find("[aria-hidden]").attr("aria-hidden","false");
        } else {
            $ele.find("[aria-expanded]").attr("aria-expanded","false");
            $ele.find("[aria-hidden]").attr("aria-hidden","true");
        }
    }
    function isMobile(){
        //should be in base
        return $( window ).width() < 768;
    }
});

claims.controllers.cancelclaim = new (function() {
    'use strict';
    var $eleDomain, $overlay;
    this.init = function($ele) {
        $eleDomain = $ele;
        $overlay = $("#cancelclaimoverlay");
        $ele.click(function(e){
            claims.loader.show();
            var args = {
                overlay : $overlay, //cust arg
                success : stepIntoCancel, //cust arg
                close: function(){
                    //reset view
                    $overlay.find(".first-step").removeClass("visuallyhidden");
                    $overlay.find(".next-step").addClass("visuallyhidden");
                }
            }
            claims.loader.hide();
            claims.controllers.modal.show(args);
            return false;
        });
    };
    function stepIntoCancel() {
        //switch to next part
        $overlay.find(".first-step").addClass("visuallyhidden");
        $overlay.find(".next-step").removeClass("visuallyhidden");
        //add confrim events
        $overlay.find(".call-cancel").unbind("click").click(function(){
            //call services
            alert("Make call to cancel api - TODO");
            return false;
        });
        //centralise new content
        claims.controllers.modal.centralise($overlay);
        //set up events confirm cancel

    }
});

claims.controllers.modal = new (function() {
    this.show = function(args) {
        //default dialog args, overwritable from args
        var defaults = {
            width: "auto",
            modal: true,
            open: function(event,ui) {
                if(args.overlay.eventsBound){
                    return;
                }
                //set up closes
                args.overlay.find(".close-overlay").click(function(e){
                    args.overlay.dialog("close");
                    return false;
                });
                //add success
                if(args.success){
                    args.overlay.find(".success").click(function(){
                        args.success();
                        return false;
                    });
                }
                //resize events
                $( window ).resize(function() {
                    console.log("reassess modal: ",args.overlay);
                    claims.controllers.modal.centralise(args.overlay);
                });
                //mark as bound
                args.overlay.eventsBound = true;
            }
        }
        var finalargs = $.extend({}, defaults, args);
        finalargs.overlay.dialog(finalargs);
    };
    this.centralise = function(overlay){
        var win = $(window);
        var newtop = (win.height() - overlay.parent().outerHeight())/2+win.scrollTop();
        var newleft = (win.width() - overlay.parent().outerWidth())/2;
        if(overlay.parent().outerHeight() > win.height()){
            newtop = win.scrollTop()+5;
        }
        overlay.parent().css({
            top: newtop,
            left: newleft
        });
    };
    this.close = function (overlay) {
        overlay.dialog("close");
    }
});

claims.controllers.inputrelated = new (function() {
    'use strict';
    this.init = function($ele) {
       var relid = $ele.attr("data-relid");
       var collection = $ele.attr("name");
       if(!relid){
            return;
       }
       //check if selected
       if($ele.is(':checked')){
            //set as enabled
            $("#"+relid).removeAttr("disabled");
       }
       $("[name='"+collection+"']").change(function(){
            var hasRelId = $(this).attr("data-relid");
            //var state = $("#"+relid).attr("disabled");
            (hasRelId) ? $("#"+relid).removeAttr("disabled") : $("#"+relid).attr("disabled", "disabled");
            return false;
       });
    };
});

claims.controllers.toggle = new (function() {
    'use strict';
    var $ele;
    this.init = function ($ele) {
        var target = $ele.attr("data-target");
        var togmandatory = $ele.attr("data-togmandatory");
        var $target = $("#" + target);
        $ele.on("click", function(evt) {
            var togtext = $ele.attr("data-togtext");
            if ($target.hasClass("hidden")) {
                $target
                    .removeClass("hidden")
                    .attr("aria-expanded", "true");
                $ele.addClass("active");
                if(togmandatory){
                    changeMandatories(togmandatory, true);
                }
            }
            else {
                $target
                    .addClass('hidden')
                    .attr("aria-expanded", "false");
                $ele.removeClass("active");
                if(togmandatory){
                    changeMandatories(togmandatory,false);
                }
            }
            if(togtext){
                //switch text too
                $ele.attr("data-togtext",$ele.html());
                $ele.html(togtext);
            }

            if( $ele.prev("input[type=checkbox]") != null){
                /* prevent default was preventing checkbox toggling*/
                var cb = $ele.prev("input[type=checkbox]").click();
            }
            evt.preventDefault();
        });
        function changeMandatories(togmandatory, active){
            if(active){
                $target.find("[data-validate^='"+togmandatory+"']").each(function(e){
                    console.log("eles to change: ",$(this));
                    var extractpairs = $(this).attr("data-validate").split("|");
                    var validateType = extractpairs[1];
                    //store original
                    $(this).attr("data-validstored", $(this).attr("data-validate"));
                    //set validation value
                    $(this).attr("data-validate",validateType);
                });
            } else {
                $target.find("[data-validstored]").each(function(e){
                    console.log("now reset");
                    var orginalStored = $(this).attr("data-validstored");
                    //reset validation value
                    $(this).attr("data-validate",orginalStored);
                    //removeStored
                    $(this).removeAttr("data-validstored");
                });
            }
        }
    };
})();

claims.loader = new (function(){
    var $loaderDiv;
    this.init = function () {
        $loaderDiv = $(".ajaxLoader");
    }
    this.show = function () {
        $loaderDiv.show();
    }
    this.hide = function () {
        $loaderDiv.hide();
    }
});

claims.controllers.form = new (function(){
    var $form;
    this.init = function ($ele) {
        $form = $ele;
        setUpEvents();
    }
    this.validateInstance = function($ele){
        var rules = $ele.attr("data-validate");
        if(!rules){
            return;
        }
        if(!validateRules(rules,$ele)){
            //show error
            showError($ele);
        } else {
            removeError($ele);
        }
    }
    function setUpEvents(){
        $form.submit(function(){
            if(!validateForm()){
                return false;
            }

            //custom submit action (usually ajax)
            var customsubmit = $("[data-submit-event]");
            if(customsubmit.length) {
                var customsubmitevent = customsubmit.attr("data-submit-event");
                claims.controllers[customsubmitevent].init($form);
                return false;
            }
        });
        //add blur events
        $form.find("[data-validate]").blur(function(e){
            var rules = $(this).attr("data-validate"),
            $ele = $(this),
            widgetType = $(this).attr("data-widget");
            if(widgetType != 'datepicker'){
                claims.controllers.form.validateInstance($ele);
            } else {
                //datepicker fires own blur validator
            }
        });
        //blur event in form of change for radio
        $form.find("[data-validate] input").change(function(e){
            removeError($(this).parents("[data-validate]"));
        });
    }
    function validateForm(){
        //remove all old error messages
        $form.find(".errorMess").addClass("hidden");
        $form.find(".error").removeClass("error");

        var passed = true;
        $form.find("[data-validate]").each(function(e){
            var rules = $(this).attr("data-validate");
            if(!validateRules(rules,$(this))){
                //show error
                showError($(this));
                //mark as failed
                passed = false;
            } else {
                removeError($(this));
            }
        });
        if (!passed){
            var firstErrorNode = $form.find("div.error").eq(0);
            var isOutOfScreen = firstErrorNode.offset().top < document.body.scrollHeight;
            // Scroll to the first error if it is out of screen.
            if (isOutOfScreen) {
                var offsetMove = 20;
                $('html,body').animate({scrollTop:firstErrorNode.offset().top - offsetMove },800);
            }
        }
        return passed;
    }
    function validateRules(rules,$ele){
        //loop defined rules
        var aRules = rules.split(","), passed = true;
        for (var i = 0; i < aRules.length; i++) {
            if(rulesmatrix[aRules[i]]){
                var checkRule = rulesmatrix[aRules[i]]($ele);
                if(!checkRule){
                    passed = false;
                }
            }
        }
        return passed;
    }
    function showError($ele){
        if($ele.siblings(".errorMes").length){
            $ele.siblings(".errorMes").removeClass("hidden");
        }
        $ele.parents(".form-line").addClass("error");
        //mark aria
        $ele.attr("aria-invalid","true");
    }
    function removeError($ele){
        if($ele.siblings(".errorMes").length){
            $ele.siblings(".errorMes").addClass("hidden");
        }
        $ele.parents(".form-line").removeClass("error");
        //mark aria
        $ele.attr("aria-invalid","false");
    }

    //rules matrix
    var rulesmatrix = {
        'radiogroup' : function($ele) {
            return $ele.find("input[type='radio']").is(":checked");
        },
        'empty' : function($ele) {
           return $ele.val() ? $ele.val().length : false;
        },
        'email' : function($ele) {
            var regex = rulesmatrix.emailRule;
            var emailadd = $ele.val();
            return emailadd.length <= 50 && regex.test(emailadd);
        },
        'postcode' : function($ele) {
            var regex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} ?[0-9][A-Z]{2}$/i;
            var postcodeValue = $ele.val();
            return regex.test(postcodeValue);
        },
        'postcode-en' : function($ele) {
            var regex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} ?[0-9][A-Z]{2}$/i;
            var postcodeValue = $ele.val();
            return regex.test(postcodeValue);
        },
        'postcode-de' : function($ele) {
            var regex = /^\d{5}$/;
            var postcodeValue = $ele.val();
            return regex.test(postcodeValue);
        },
        //reg ex
        'emailRule' : /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'name' : /^[a-z\u00C0-\u017F ,.'-]+$/i,
        'name-de' : /^[a-zA-Z\u00C0-\u1E9E ,.'-]+$/i,
        'password' : /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,50}$/,
        'phone' : /^\d[\d, ]{1,19}$/,
        'refNo' : /^[ a-zA-Z0-9]{5,11}$/,
        'accountNum' : /^\d{8}$/,
        'sortCode' : /^\d{2}$/,
        'isNumberDecimal' : /^\d+(\.\d{1,2})?$/,
        'alphanumeric' : /^[a-z0-9]+$/i,
        'iban' : /^\d{4}$/,
        'ibanCountry' : /^[a-zA-Z]{2}\d{2}$/,
        'ibanEnd' : /^\d{2}$/
    }

});

claims.controllers.questions = new (function(){
    var $form;
    this.init = function ($form) {
        claims.loader.show();
        var postData = $form.serializeArray();
        ajaxParams = {
            url : 'responsedummy.html',
            data : postData,
            type: 'GET',//Chnage to post in commerce
            callback : questionPostCallback
        };
        claims.services.getData(ajaxParams);
    }
    function questionPostCallback(response){
        var $targetController = $("#question-controller");
        $targetController.html(response);
        claims.base.parseWidgets($targetController);
        //hide loading screen
        claims.loader.hide();
    }
});

claims.controllers.importPolicy = new (function () {
    'use strict';
    this.init = function($ele) {
        var postCode = $('#postCode').val();
        var policyError = $("#referenceNumber").attr("data-error");
        var importUrl = "/ImportPolice";
        var ajaxParams = {};
        $ele.on("click", function (evt) {
             evt.preventDefault();
             var errorMsg = $('#importPolicy .errorMsg');
             errorMsg.addClass('hidden');
             claims.loader.show();
             var policyNo =  $('#referenceNumber').val();
             var postData = $("#importPolicy form").serializeArray();
            if ( !policyNo ) {
                claims.loader.hide();
                errorMsg
                    .html(policyError)
                    .removeClass('hidden');
            }
            else {
                ajaxParams = {
                    url : importUrl,
                    data : postData,
                    callback : policyResponse,
                    type : 'POST'
                };
                claims.services.getData(ajaxParams);
            }
        });
    }

    function policyResponse (response) {
        var errorMsg = $('#importPolicy .errorMsg');
        claims.loader.hide();
        if (response.success) {
            location.reload();
        }
        else {
            errorMsg
                .html(response.errMessage)
                .removeClass('hidden');
        }
    }

})();

claims.controllers.updateaddress = new (function() {
    'use strict';
    var $eleDomain, $overlay;
    this.init = function($ele) {
        $eleDomain = $ele;

        $overlay = $("#updateAddressOverlay");
        $ele.click(function(e){
            claims.loader.show();
            var args = {
                success : confirmed,
                overlay : $overlay //cust arg
            }
            claims.loader.hide();
            claims.controllers.modal.show(args);
            return false;
        });
    };
    function confirmed ($ele) {
        $overlay.dialog("close");
        $("#update-address").removeClass("hidden");
    }
});

