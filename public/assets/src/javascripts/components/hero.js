
var $ = require('jquery');
var typed = require('../vendor/typed');
var typed_speed = 20;
module.exports = (function(){
  function init() {
    $(document).ready(function(){

      $(".header-content p.hi").typed({
        strings: ["Hi there,"],
        typeSpeed: typed_speed,
        callback: function(){
          $(".header-content p.hi").next(".typed-cursor").hide();
             $(".header-content p.iam").typed({
              strings: ["I am Giulio, software engineer based in London."],
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