var jq1 = jQuery.noConflict();
        var loadOurs = function () {
            var ajaxvar = new XMLHttpRequest();
            ajaxvar.onreadystatechange = function () {
                jq1("#feed_div").html('<img class="feed_loading" src="image/loading154.gif"></img>');
                jq1(".alert").css({"display": "none"});
                if (ajaxvar.readyState == 4 && ajaxvar.status == 200) {
                    jq1(".alert").css({"display": "block"});
                    jq1("#feed_div").html(ajaxvar.responseText);
                    jq1("#blue_solid").animate({left: "0px"}, 400);
                }
            }
            ajaxvar.onload = function () {
                if (hajime && sessionStorage.clicked == 0) {
                    window.scrollTo(0, sessionStorage.scrollY);
                    hajime = 0;
                    if (!window.onscroll) {
                        window.onscroll = function (event) {
                            sessionStorage.scrollY = window.scrollY;
                        };
                    }
                    ;
                }
                ;
            }
            if (jq1("#public").hasClass("active")) {
                jq1("#public").removeClass("active");
            }
            if (jq1("#work").hasClass("active")) {
                jq1("#work").removeClass("active");
            }
            if (!jq1("#ours").hasClass("active")) {
                jq1("#ours").addClass("active");
            }
        };
        var loadPublic = function () {
            var ajaxvar = new XMLHttpRequest();
            ajaxvar.onreadystatechange = function () {
                jq1("#feed_div").html('<img class="feed_loading" src="image/loading154.gif"></img>');
                jq1(".alert").css({"display": "none"});
                if (ajaxvar.readyState == 4 && ajaxvar.status == 200) {
                    jq1(".alert").css({"display": "block"});
                    jq1("#feed_div").html(ajaxvar.responseText);
                    jq1("#blue_solid").animate({left: "102px"}, 400);
                }
            }
            ajaxvar.onload = function () {
                if (hajime && sessionStorage.clicked == 0) {
                    window.scrollTo(0, sessionStorage.scrollY);
                    hajime = 0;
                    if (!window.onscroll) {
                        window.onscroll = function (event) {
                            sessionStorage.scrollY = window.scrollY;
                        };
                    }
                    ;
                }
                ;
            }
            ajaxvar.open("POST", "space.php?do=home&view=all&start=0&show=1", true);
            ajaxvar.send();
            if (jq1("#work").hasClass("active")) {
                jq1("#work").removeClass("active");
            }
            if (jq1("#ours").hasClass("active")) {
                jq1("#ours").removeClass("active");
            }
            if (!jq1("#public").hasClass("active")) {
                jq1("#public").addClass("active");

            }
        };
        var loadWork = function () {
            var ajaxvar = new XMLHttpRequest();
            ajaxvar.onreadystatechange = function () {
                jq1("#feed_div").html('<img class="feed_loading" src="image/loading154.gif"></img>');
                jq1(".alert").css({"display": "none"});
                if (ajaxvar.readyState == 4 && ajaxvar.status == 200) {
                    jq1(".alert").css({"display": "block"});
                    jq1("#feed_div").html(ajaxvar.responseText);
                    jq1("#blue_solid").animate({left: "204px"}, 400);
                }
            }
            ajaxvar.onload = function () {
                if (hajime && sessionStorage.clicked == 0) {
                    window.scrollTo(0, sessionStorage.scrollY);
                    hajime = 0;
                    if (!window.onscroll) {
                        window.onscroll = function (event) {
                            sessionStorage.scrollY = window.scrollY;
                        };
                    }
                    ;
                }
                ;
            }
            ajaxvar.open("POST", "space.php?do=home&view=work&start=0&show=1", true);
            ajaxvar.send();
            if (jq1("#public").hasClass("active")) {
                jq1("#public").removeClass("active");
            }
            if (jq1("#ours").hasClass("active")) {
                jq1("#ours").removeClass("active");
            }
            if (!jq1("#work").hasClass("active")) {
                jq1("#work").addClass("active");
            }
        };
        var loadSample = function () {
            jq1(function () {
                jq1("#mood-switch .complain a").click();
                jq1("#message").val('@ihome测试(0000) 请点击输入框上方的“提诉求”切换到发诉求的状态。输入@后选择需要诉求的部门，然后输入您诉求的内容。点击下方的诉求按钮即可发送诉求。当有部门回复时，在右上角的消息中心里查看。');
            });
        };
        var flag_clicked = 0;
        var hajime = 1;
        jq1(document).ready(function () {
            if (!sessionStorage.clicked) {
                sessionStorage.clicked = 0;
                window.onscroll = function (event) {
                    sessionStorage.scrollY = window.scrollY;
                };
            } else {
                jq1('.feed_more_btn a').click();
            }
            ;

            jq1("#ours").click(function () {
                loadOurs();
                view = "ours";
                flag_clicked = 0;
                sessionStorage.clicked = 0;
            });
            jq1("#public").click(function () {
                loadPublic();
                view = "all";
                flag_clicked = 0;
                sessionStorage.clicked = 0;
            });
            jq1("#work").click(function () {
                loadWork();
                view = "work";
                flag_clicked = 0;
                sessionStorage.clicked = 0;
            });
        });
        var hashTab = (!window.location.hash) ? "#tab1" : window.location.hash;
        window.location.hash = hashTab;
        var view;
        switch (hashTab) {
            case "#tab1":
                loadOurs();
                view = "ours";
                break;
            case "#tab2":
                loadPublic();
                view = "all";
                break;
            case "#tab3":
                loadWork();
                view = "work";
                break;
            case "#tab5":
                loadSample();
                break;
        }

    