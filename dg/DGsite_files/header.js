
//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2013, 2014 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------
require([
		"dojo/_base/event",
		"dojo/_base/lang",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/has",
		"dojo/on",
		"dojo/query",
		"dojo/_base/sniff",
		"dojo/domReady!",
		"dojo/NodeList-dom",
		"dojo/NodeList-traverse",
		"dojo/NodeList-manipulate"
	], function(event, lang, domClass, domStyle, has, on, query) {
	var active = {};
	var ajaxRefresh = "";
	var departmentMenuId = "departmentMenu_";
	activate = function(target) {
		var parent = target.getAttribute("data-parent");
		if (parent && active[parent]) {
			deactivate(active[parent]);
		}
		if (parent) {
			activate(document.getElementById(parent));
		}
		domClass.add(target, "active");
		query("a[data-activate='" + target.id + "']").addClass("selected");
		query("a[data-toggle='" + target.id + "']").addClass("selected");
		active[parent] = target;
	};
	deactivate = function(target) {
		if (active[target.id]) {
			deactivate(active[target.id]);
		}
		domClass.remove(target, "active");
		query("a[data-activate='" + target.id + "']").removeClass("selected");
		query("a[data-toggle='" + target.id + "']").removeClass("selected");
		var parent = target.getAttribute("data-parent");
		delete active[parent];
	};
	toggle = function(target) {
//		console.log("activate toggle",target);
		if (domClass.contains(target, "active")) {
			deactivate(target);
		} else {
//			console.log("fire toggle call", target);
			activate(target);
		}
	};
	setUpEventActions = function(){
		on(document, "a[data-activate]:click", function(e) {
			var target = this.getAttribute("data-activate");
			activate(document.getElementById(target));
			event.stop(e);
		});
		on(document, "a[data-deactivate]:click", function(e) {
			var target = this.getAttribute("data-deactivate");
			deactivate(document.getElementById(target));
			event.stop(e);
		});
		on(document, "a[data-toggle]:click", function(e) {
			var target = this.getAttribute("data-toggle");
			// console.log("activate toggle");
			toggle(document.getElementById(target));
			if (target === "searchBar") {
				document.forms['CatalogSearchForm'].elements['searchTerm'].focus();
			}
			event.stop(e);
		});
		on(document, "input[name='searchTerm']:focusin", function(e) {
			var btn = query(".submitButton")[0];
			domClass.remove(btn, "unactive");
			domClass.add(btn, "active");
			event.stop(e);
		});
		on(document, "input[name='searchTerm']:focusout", function(e) {
			var btn = query(".submitButton")[0];
			if (!this.value.length) {
				domClass.add(btn, "unactive");
				domClass.remove(btn, "active");
			}
			event.stop(e);
		});
		on(document, "a[data-toggle]:keydown", function(e) {
			if (e.keyCode == 27) {
				var target = this.getAttribute("data-toggle");
				deactivate(document.getElementById(target));
				event.stop(e);
			} else if (e.keyCode == 40) {
				var target = this.getAttribute("data-toggle");
				var targetElem = document.getElementById(target);
				activate(targetElem);
				query('[class*="menuLink"]', targetElem)[0].focus();
				event.stop(e);
			}
		});
		/*
		if (has("ie") < 10) {
			query("input[placeholder]").forEach(function(input) {
				var placeholder = input.getAttribute("placeholder");
				if (placeholder) {
					var label = document.createElement("label");
					label.className = "placeholder";
					label.innerHTML = placeholder;
					input.parentNode.insertBefore(label, input);
					var updatePlaceholder = function() {
						// console.log('updatePlaceholder!'); 
						label.style.display = (input.value ? "none" : "block");
					};
					window.setTimeout(updatePlaceholder, 200);
					on(input, "blur, focus, keyup", updatePlaceholder);
					on(label, "click", function(e) {
						input.focus();
					});
				}
			});
		}
		*/

		if (query("#searchBox .submitButton")[0]) {
			domClass.add(query("#searchBox .submitButton")[0], "unactive");
		}
		
		
		if(domgen.global.loginDevice == 'mobile'){
			console.log("here")
		}
	};
	setUpEventActions();

	switchLogo = function() {
		var logoRef = dojo.query('#mainNavigationContent .logoContainer div')[0];
		var clonedlogoRef = dojo.clone(logoRef);
		if (clonedlogoRef != null ) {
			dojo.attr(clonedlogoRef, "id", "mobileHome");
			dojo.query(dojo.byId("mainNavButton")).after(clonedlogoRef);
		}
	};
	if(typeof(isSky) == "undefined"){
		switchLogo();
	}
	if (dojo.byId("mainNavigationContent")) {
		dojo.removeClass(dojo.byId("mainNavigationContent"), "active");
	}
	on(window, 'resize', function() { 
		if ($(window).width() > 960) {
			
			
			dojo.removeClass(dojo.byId("mainNavigationContent"), "active");
			};
		}
	);
	
	window.setTimeout(function() {
			var searchForm = document.getElementById("SimpleSearchForm_SearchTerm");
			if (searchForm) {
				on(searchForm, "click", function(e) {
					var allSelectedDataToggles = query('.selected:not(a[data-toggle="searchBar"])', document.getElementById("header"));
					allSelectedDataToggles.forEach(function(selectedDataToggle, i) {
						deactivate(document.getElementById(selectedDataToggle.getAttribute("data-toggle")));
					});
				});
			}
			var searchFilterMenu = document.getElementById("searchFilterMenu");
			if (searchFilterMenu) {
				var searchFilterMenuItems = query('[class*="menuLink"]', searchFilterMenu);
				searchFilterMenuItems.forEach(function(searchFilterMenuItem, i) {
					on(searchFilterMenuItem, "keydown", function(e) {
						if (e.keyCode == 27) {
							deactivate(searchFilterMenu);
							event.stop(e);
						} else if (e.keyCode == 9 || (e.keyCode == 9 && e.shiftKey)) {
							deactivate(searchFilterMenu);
						} else if (e.keyCode == 38) {
							searchFilterMenuItems[i == 0 ? searchFilterMenuItems.length - 1 : i - 1].focus();
							event.stop(e);
						} else if (e.keyCode == 40) {
							searchFilterMenuItems[(i + 1) % searchFilterMenuItems.length].focus();
							event.stop(e);
						}
					});
				});
			}
		}, 100);

	var header = document.getElementById("header");
	var direction = domStyle.getComputedStyle(header).direction;

	query("#searchFilterMenu > ul > li > a").on("click", function(e) {
		document.getElementById("searchFilterButton").innerHTML = this.innerHTML;
		document.getElementById("categoryId").value = this.getAttribute("data-value");
		deactivate(document.getElementById("searchFilterMenu"));
	});
	query("#searchBox > .submitButton").on("click", function(e) {
		var searchTerm = document.getElementById("SimpleSearchForm_SearchTerm");
		searchTerm.value = lang.trim(searchTerm.value);
		var unquote = lang.trim(searchTerm.value.replace(/'|"/g, ""));
		if (searchTerm.value && unquote != "") {
			document.getElementById("searchBox").submit();
		}
	});
	var searchBox = document.getElementById("searchBox");
	if (searchBox) {
		on(searchBox, "submit", function(e) {
			var searchTerm = document.getElementById("SimpleSearchForm_SearchTerm");
			var origTerm = searchTerm.value;
			var unquote = lang.trim(searchTerm.value.replace(/'|"/g, ""));
			searchTerm.value = unquote;
		
			if (!searchTerm.value) {
				event.stop(e);
				return false;
			}
			searchTerm.value= lang.trim(origTerm);
		});
	}	

	setAjaxRefresh = function(refresh){
		this.ajaxRefresh = refresh;
	}

	/**
	 * Placeholder check
	 * This function checks whether the place-holder element is present and valid for the browser
	 * If not, add this
	 * 
	**/
	placeholderCheck = function(){
		// console.log('Placeholder check!'); 
		
		var input = document.createElement('input'); 
		
		// console.log('input: ', input); 
		
		// if not (and input has no value), add placeholder text to input
		if ('placeholder' in input == false) {
			// Placeholder IS NOT supported 
			var textInputs = $('input[type=text], input[type=email], input[type=password]'); 
			var form = $($(textInputs)[0]).parentsUntil('form').parent(); 
	
			$(textInputs).each(function() {
				// temporarily change password inputs to text
				if ($(this).attr('type') == 'password') {
					$(this)
						.attr('type', 'text')
						.attr('data-type', 'password'); 
				}
	
				if ($(this).attr('placeholder') && $(this).val() == '') { 
					$(this).val($(this).attr('placeholder')); 
				}
			}); 
	
			$(textInputs)
				.focus(function() {
					if ($(this).val() == $(this).attr('placeholder')) {
						if ($(this).attr('data-type') ==  'password') {
							$(this).attr('type', 'password');
						}
	
						$(this).val(''); 
					}
				}) 
				.blur(function() {
					if ($(this).val() == '') {
						if ($(this).attr('data-type') ==  'password') {
							$(this).attr('type', 'text');
						}
	
						$(this).val($(this).attr('placeholder')); 
					}
				}); 
			
			/* remove placeholders when the form is submitted so these values are not submitted
			$(form).on('submit', function() {
				console.log('submit!'); 
				
				$(textInputs).each(function(textInput) {
					if ($(this).attr('placeholder')) {
						if ($(this).val == $(this).attr('placeholder')) {
							$(this).val = ''; 
						} 
					}
				}); 
			});
			*/
		}
	}

	placeholderCheck();
});