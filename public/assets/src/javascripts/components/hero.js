
var $ = require('jquery');
var typed = require('../vendor/typed');
var typed_speed = 30;
module.exports = (function(){
  function init() {
    $(document).ready(function(){

      $(".header-content h3").typed({
        strings: ["Hi there,"],
        typeSpeed: typed_speed,
        callback: function(){
          $(".header-content h3").next(".typed-cursor").hide();
             $(".header-content p").typed({
              strings: ["I am Giulio, web developer based in London."],
              typeSpeed: typed_speed,
              callback: function(){
                $('.header-content .btn.btn-welcome').toggleClass('opacity-hidden');
              }
            });

        }
      });

    });

  }


  return {
    init: init
  };

})();

/*strings: ["Hi there", "I am Giulio"],*/