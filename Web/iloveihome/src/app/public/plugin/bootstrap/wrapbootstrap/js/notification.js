var jq1=noConflict(true);
jq1(function(){
						jq1(".notification-dropdown").each(function (index, el) {
							var el=jq(el);
							var dialog=el.find(".pop-dialog");
							var trigger=el.find(".trigger");
							dialog.click(function (e) {
								e.stopPropagation()
								});
							dialog.find(".close-icon").click(function (e) {
								e.preventDefault();
								dialog.removeClass("is-visible");
								trigger.removeClass("active");
								jq1(".notification-dropdown .pop-dialog").css({"display":"none"});	
								
								});
							jq1("body").click(function () {
								dialog.removeClass("is-visible");
								trigger.removeClass("active");
								jq1(".notification-dropdown .pop-dialog").css({"display":"none"});	
								});

							trigger.click(function (e) {
								e.preventDefault();
								e.stopPropagation();
								// hide all other pop-dialogs
								jq1(".notification-dropdown .pop-dialog").removeClass("is-visible");
								jq1(".notification-dropdown .trigger").removeClass("active")
								jq1(".notification-dropdown .pop-dialog").css({"display":"block"});	
							
								dialog.toggleClass("is-visible");
								if (dialog.hasClass("is-visible")) {
								jq1(this).addClass("active");
								} else {
								jq1(this).removeClass("active");
								}
								});
						});
				});
