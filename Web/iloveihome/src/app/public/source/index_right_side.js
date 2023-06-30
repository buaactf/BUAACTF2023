var max_height = jq1("#reply_bag").height();
                    var height = max_height;

                    function scroll_totop() {
                        jq1("#scroll_top").css({"top": height + "px"});
                        if (jq1("#scroll_top").css("top") == "-" + 3 * max_height + "px") {
                            jq1("#scroll_top").css({"top": max_height});
                            height = max_height;
                        }
                        height--;
                    }

                    jq1(function () {
                        scroll_totop();
                        var speed;
                        speed = setInterval(scroll_totop, 40);
                        jq1("#scroll_top").hover(function () {
                            clearInterval(speed);
                        });
                        jq1("#scroll_top").mouseleave(function () {
                            scroll_totop();
                            speed = setInterval(scroll_totop, 40);
                        });
                    });