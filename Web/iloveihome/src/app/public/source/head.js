function _ihome_func_wrap_comment(func, classname, formid) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function () {
        var popover = jq("#" + formid).find(classname).data("bs.popover");
        if (popover) {
            if (popover.tip().hasClass("in")) {
                popover.toggle();
            }
        }
        func.apply(null, args);
    };
}


function searchSubmit() {
    jq("#head_search").submit()
}

function check_calendar() {
    console.log('check');
    var url = 'do.php?ac=ajax&op=checkcalendarstart&rand=' + Math.random();
    jq.getJSON(url, function (data) {
        if (data.data_staus > 0) {
            var msg = '';
            for (var i = 0; i < data.date.length; i++) {
                msg += data.date[i];
            }
            if (msg.length > 0) {
                alert(msg);
            }
        }
    });
}

function reflash_member() {
    var checkurl = 'cp.php?ac=pm&op=checknewpm&rand=' + Math.random();
    jq.getJSON(checkurl, function (data) {
    });
    var url = 'do.php?ac=ajax&op=reflashmember&rand=' + Math.random();
    jq.getJSON(url, function (data) {
        if (data.newpm > 0)
            document.getElementById('pmbadge').setAttribute("style", "display:block");
        if (data.newnote > 0)
            document.getElementById('notebadge').setAttribute("style", "display:block");
    });
}

jq(function () {
    jq("#at_friends").hover(function () {
        jq(this).children("img").attr("src", "image/icons/at-icon2.png");
    });
    jq("#at_friends").mouseleave(function () {
        jq(this).children("img").attr("src", "image/icons/at-icon.png");
    });
    jq("#face_smell").hover(function () {
        jq(this).children("a").children("img").attr("src", "image/icons/statues_face_pressed.png");
    });
    jq("#face_pictor").hover(function () {
        jq(this).children("img").attr("src", "image/icons/statues_image_pressed.png");
    });
    jq("#face_smell").mouseleave(function () {
        jq(this).children("a").children("img").attr("src", "image/icons/statues_face_normal.png");
    });
    jq("#face_smell").click(function () {
        if (jq(this).hasClass("face_click")) {
            jq(this).removeClass("face_click");
        } else {
            jq(this).addClass("face_click");
        }
    });
    jq("#face_pictor").mouseleave(function () {
        jq(this).children("img").attr("src", "image/icons/statues_image_normal.png");
    });
    jq("#face_saybag").click(function () {
        jq(this).children("a").children("div").children("img").attr("src", "image/statues_su_normal.png");
        if (jq(this).hasClass("face_click")) {
            jq(this).removeClass("face_click");
        } else {
            jq(this).addClass("face_click");
        }
    });


    // setInterval("check_calendar()", 60000);
    // setInterval("reflash_member()", 3000);

});